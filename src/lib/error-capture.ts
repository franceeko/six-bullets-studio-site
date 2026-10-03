export function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return "Unknown error";
}

export function logServerError(scope: string, error: unknown): void {
  console.error(`[Six Bullets] ${scope}: ${getErrorMessage(error)}`);
}
