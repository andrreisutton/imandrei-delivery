import postgres from "postgres";

const url = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
if (!url) {
  console.error("POSTGRES_URL_NON_POOLING / POSTGRES_URL not set");
  process.exit(1);
}

const sql = postgres(url, { ssl: "require", prepare: false, max: 1 });

await sql`
  create table if not exists as_records (
    path       text primary key,
    data       jsonb not null,
    created_at timestamptz not null default now()
  )
`;

await sql`
  create index if not exists as_records_path_idx
    on as_records (path text_pattern_ops)
`;

await sql`alter table as_records enable row level security`;

const [{ count }] = await sql`select count(*)::int as count from as_records`;
console.log(`as_records ready — ${count} existing record(s)`);

await sql.end();
