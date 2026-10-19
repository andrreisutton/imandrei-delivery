export function blobEnabled(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}
