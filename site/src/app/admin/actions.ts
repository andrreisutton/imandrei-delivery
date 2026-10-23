"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  checkPassword,
  clearAdminCookie,
  isAdmin,
  setAdminCookie,
  setPassword,
} from "@/lib/admin-auth";
import { deleteRecord } from "@/lib/store";
import { processDueReviewEmails } from "@/lib/orders";
import { removeAll, removeOthers } from "@/lib/product-files";
import type { ActionState } from "@/app/actions";

export async function adminLogin(prev: ActionState, formData: FormData): Promise<ActionState> {
  const password = formData.get("password");
  if (typeof password !== "string" || !(await checkPassword(password))) {
    return { error: "Wrong password." };
  }
  await setAdminCookie();
  redirect("/admin");
}

export async function adminLogout(): Promise<void> {
  await clearAdminCookie();
  redirect("/admin");
}

export async function adminDeleteReview(formData: FormData): Promise<void> {
  if (!(await isAdmin())) return;
  const productSlug = formData.get("productSlug");
  const reviewId = formData.get("reviewId");
  if (typeof productSlug !== "string" || typeof reviewId !== "string") return;
  if (!/^[a-z0-9-]+$/.test(productSlug) || !/^[a-z0-9]+$/.test(reviewId)) return;
  await deleteRecord(`reviews/${productSlug}/${reviewId}`);
  revalidatePath("/admin");
}

export async function adminRunEmailQueue(): Promise<void> {
  if (!(await isAdmin())) return;
  await processDueReviewEmails();
  revalidatePath("/admin");
}

export async function adminExpediteReviewEmails(): Promise<void> {
  if (!(await isAdmin())) return;
  await processDueReviewEmails(true);
  revalidatePath("/admin");
}

type UploadKind = "downloads" | "covers";
const KINDS: UploadKind[] = ["downloads", "covers"];

// After an upload, the new file is the one in use; older ones are removed.
export async function adminKeepUpload(kind: UploadKind, slug: string, pathname: string): Promise<void> {
  if (!(await isAdmin())) return;
  if (!KINDS.includes(kind) || !/^[a-z0-9-]+$/.test(slug)) return;
  if (!pathname.startsWith(`${kind}/${slug}/`)) return;
  await removeOthers(`${kind}/${slug}/`, pathname);
  revalidatePath("/", "layout");
}

export async function adminRemoveUpload(formData: FormData): Promise<void> {
  if (!(await isAdmin())) return;
  const slug = formData.get("slug");
  const kind = formData.get("kind") as UploadKind;
  if (typeof slug !== "string" || !/^[a-z0-9-]+$/.test(slug) || !KINDS.includes(kind)) return;
  await removeAll(`${kind}/${slug}/`);
  revalidatePath("/", "layout");
}

export async function adminChangePassword(prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await isAdmin())) return { error: "Sign in first." };
  const current = formData.get("current");
  const next = formData.get("next");
  const confirm = formData.get("confirm");
  if (typeof current !== "string" || !(await checkPassword(current))) {
    return { error: "Your current password is wrong." };
  }
  if (typeof next !== "string" || next.length < 10) {
    return { error: "Use at least 10 characters." };
  }
  if (next !== confirm) return { error: "The two new passwords don't match." };
  await setPassword(next);
  await setAdminCookie();
  revalidatePath("/admin");
  return { ok: true };
}
