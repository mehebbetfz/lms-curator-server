export function parsePaginationParams(
  pagination: any,
  defaultPage: number = 1,
  defaultLimit: number = 30
): { page: number; limit: number } {
  const page = pagination?.page
    ? parseInt(pagination.page as string, 10)
    : defaultPage;
  
  const limit = pagination?.limit
    ? parseInt(pagination.limit as string, 10)
    : defaultLimit;
  
  return {
    page: isNaN(page) || page < 1 ? defaultPage : page,
    limit: isNaN(limit) || limit < 1 ? defaultLimit : Math.min(limit, 100),
  };
}
