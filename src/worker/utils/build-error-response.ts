export const buildErrorResponse = (status: number, message: string): Response => {
  return Response.json(
    { status, message },
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    },
  );
};
