/**
 * T-RAYO Fast Pagination Helper
 * Clamps page size to prevent denial-of-service through overly large queries
 */

const getPaginationParams = (query, defaultLimit = 12, maxLimit = 50) => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit || defaultLimit.toString(), 10)));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const formatPaginationMeta = (totalCount, page, limit) => {
  const totalPages = Math.ceil(totalCount / limit);
  return {
    currentPage: page,
    pageSize: limit,
    totalRecords: totalCount,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

module.exports = {
  getPaginationParams,
  formatPaginationMeta
};
