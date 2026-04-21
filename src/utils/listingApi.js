async function parseJsonResponse(response, fallbackValue) {
  return response.json().catch(() => fallbackValue);
}

async function fetchListingById(listingId) {
  const response = await fetch(`/api/listings/${listingId}`);
  const data = await parseJsonResponse(response, {});

  if (!response.ok) {
    throw new Error(data.message || 'Unable to load this listing');
  }

  return data;
}

export { fetchListingById };
