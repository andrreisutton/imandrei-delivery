"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  checkPassword,
  clearAdminCookie,
  isAdmin,
  setAdminCookie,
} from "@/lib/admin-auth";
import { deleteRecord } from "@/lib/store";
import { processDueReviewEmails } from "@/lib/orders";
import { removeOtherProductFiles, removeProductFiles } from "@/lib/product-files";
import type { ActionState } from "@/app/actions";

export async function adminLogin(prev: ActionState, formData: FormData): Promise<ActionState> {
  const password = formData.get("password");
  if (typeof password !== "string" || !checkPassword(password)) {
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

// After an upload, the new file is the one buyers get; older ones are removed.
export async function adminKeepProductFile(slug: string, pathname: string): Promise<void> {
  if (!(await isAdmin())) return;
  if (!/^[a-z0-9-]+$/.test(slug) || !pathname.startsWith(`downloads/${slug}/`)) return;
  await removeOtherProductFiles(slug, pathname);
  revalidatePath("/admin");
}

export async function adminRemoveProductFile(formData: FormData): Promise<void> {
  if (!(await isAdmin())) return;
  const slug = formData.get("slug");
  if (typeof slug !== "string" || !/^[a-z0-9-]+$/.test(slug)) return;
  await removeProductFiles(slug);
  revalidatePath("/admin");
}
