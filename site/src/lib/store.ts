import postgres from "postgres";
import { promises as fs } from "fs";
import path from "path";

const TABLE = "as_records";

const pgEnabled = () => !!(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING);

const localRoot = () => path.join(process.cwd(), ".data");

const g = globalThis as { __mbiSql?: postgres.Sql };
function db(): postgres.Sql {
  if (!g.__mbiSql) {
    const url = process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING!;
    g.__mbiSql = postgres(url, { ssl: "require", prepare: false, max: 1, idle_timeout: 20 });
  }
  return g.__mbiSql;
}

function assertSafePath(p: string) {
  if (!/^[a-z0-9/_.-]+$/i.test(p) || p.includes("..")) {
    throw new Error(`Unsafe store path: ${p}`);
  }
}

function likePrefix(prefix: string): string {
  return prefix.replace(/([\\%_])/g, "\\$1") + "%";
}

function clean<T>(data: T): T {
  return JSON.parse(JSON.stringify(data).replace(/\\u00[01][0-9a-fA-F]/g, "")) as T;
}

export async function saveJSON(relPath: string, data: unknown): Promise<void> {
  assertSafePath(relPath);
  if (pgEnabled()) {
    const sql = db();
    await sql`
      insert into ${sql(TABLE)} (path, data)
      values (${relPath}, ${sql.json(clean(data) as never)})
      on conflict (path) do update set data = excluded.data
    `;
    return;
  }
  const file = path.join(localRoot(), `${relPath}.json`);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data), "utf8");
}

export async function claimJSON(relPath: string, data: unknown): Promise<boolean> {
  assertSafePath(relPath);
  if (pgEnabled()) {
    const sql = db();
    const rows = await sql`
      insert into ${sql(TABLE)} (path, data)
      values (${relPath}, ${sql.json(clean(data) as never)})
      on conflict (path) do nothing
      returning path
    `;
    return rows.length > 0;
  }
  const file = path.join(localRoot(), `${relPath}.json`);
  await fs.mkdir(path.dirname(file), { recursive: true });
  try {
    await fs.writeFile(file, JSON.stringify(data), { encoding: "utf8", flag: "wx" });
    return true;
  } catch {
    return false;
  }
}

export async function readJSON<T>(relPath: string): Promise<T | null> {
  assertSafePath(relPath);
  if (pgEnabled()) {
    const sql = db();
    const rows = await sql<{ data: T }[]>`
      select data from ${sql(TABLE)} where path = ${relPath} limit 1
    `;
    return rows.length ? (rows[0].data as T) : null;
  }
  try {
    const file = path.join(localRoot(), `${relPath}.json`);
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return null;
  }
}

export type ListedRecord<T> = { path: string; data: T };

export async function listJSON<T>(prefix: string): Promise<ListedRecord<T>[]> {
  assertSafePath(prefix);
  if (pgEnabled()) {
    const sql = db();
    const rows = await sql<{ path: string; data: T }[]>`
      select path, data from ${sql(TABLE)}
      where path like ${likePrefix(prefix)}
      order by created_at desc
    `;
    return rows.map((r) => ({ path: r.path, data: r.data as T }));
  }
  const root = path.join(localRoot(), prefix);
  const out: ListedRecord<T>[] = [];
  async function walk(dir: string) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) await walk(full);
      else if (e.name.endsWith(".json")) {
        try {
          const data = JSON.parse(await fs.readFile(full, "utf8")) as T;
          const rel = path
            .relative(localRoot(), full)
            .replace(/\\/g, "/")
            .replace(/\.json$/, "");
          out.push({ path: rel, data });
        } catch {
        }
      }
    }
  }
  await walk(root);
  return out;
}

export async function deleteRecord(relPath: string): Promise<void> {
  assertSafePath(relPath);
  if (pgEnabled()) {
    const sql = db();
    await sql`delete from ${sql(TABLE)} where path = ${relPath}`;
    return;
  }
  try {
    await fs.unlink(path.join(localRoot(), `${relPath}.json`));
  } catch {
  }
}
