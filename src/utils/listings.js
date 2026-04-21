function formatPrice(value = 0) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatMileage(value = 0) {
  return `${new Intl.NumberFormat('en-US').format(Number(value) || 0)} mi`;
}

function getListingTitle(listing) {
  if (listing?.title) {
    return listing.title;
  }

  return [listing?.year, listing?.make, listing?.model].filter(Boolean).join(' ');
}

export { formatMileage, formatPrice, getListingTitle };
