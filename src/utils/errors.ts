export const getErrorMessage = (error: unknown, defaultMessage?: string) => {
  if (error instanceof Error) return error.message;
  return defaultMessage ?? String(error);
};
