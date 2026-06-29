import axios from 'axios';

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export async function fetchPaginatedPage(baseUrl, endpoint, page = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const response = await axios.get(`${baseUrl}${endpoint}`, {
    ...authConfig(),
    params: { page, page_size: pageSize },
  });

  const data = response.data;

  if (Array.isArray(data)) {
    return {
      results: data,
      count: data.length,
      hasMore: false,
    };
  }

  const results = data.results ?? [];
  return {
    results,
    count: data.count ?? results.length,
    hasMore: Boolean(data.next),
  };
}

export async function fetchAllPaginated(baseUrl, endpoint, pageSize = MAX_PAGE_SIZE) {
  let page = 1;
  let allResults = [];
  let hasMore = true;

  while (hasMore) {
    const { results, hasMore: next } = await fetchPaginatedPage(baseUrl, endpoint, page, pageSize);
    allResults = [...allResults, ...results];
    hasMore = next;
    page += 1;
  }

  return {
    results: allResults,
    count: allResults.length,
    hasMore: false,
  };
}
