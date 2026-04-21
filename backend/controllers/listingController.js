import Listing from '../models/listingModel.js';
import User from '../models/userModel.js';

const listingImagePattern = /^data:image\/(png|jpeg|webp);base64,/i;

function normalizeListingImages(images = []) {
  if (!Array.isArray(images) || !images.length) {
    return [];
  }

  if (images.length > 5) {
    throw new Error('You can upload up to 5 listing images');
  }

  return images.map((image) => {
    if (typeof image !== 'string' || !listingImagePattern.test(image.trim())) {
      throw new Error('Listing images must be PNG, JPG, or WEBP files');
    }

    if (image.length > 2_500_000) {
      throw new Error('One of the listing images is too large');
    }

    return image.trim();
  });
}

function buildListingPayload(body = {}) {
  return {
    owner: body.owner,
    title: body.title?.trim(),
    make: body.make?.trim(),
    model: body.model?.trim(),
    year: Number(body.year),
    price: Number(body.price),
    mileage: Number(body.mileage),
    fuelType: body.fuelType?.trim(),
    transmission: body.transmission?.trim(),
    location: body.location?.trim(),
    description: body.description?.trim(),
    images: normalizeListingImages(body.images),
  };
}

function validateNumericListingFields(listing, currentYear) {
  if (listing.year < 1950 || listing.year > currentYear) {
    return `Year must be between 1950 and ${currentYear}`;
  }

  if (listing.price <= 0) {
    return 'Price must be greater than 0';
  }

  if (listing.mileage < 0) {
    return 'Mileage must be 0 or higher';
  }

  return '';
}

async function getListings(_req, res) {
  const listings = await Listing.find()
    .populate('owner', 'name email avatar')
    .sort({ createdAt: -1 });

  return res.status(200).json(listings);
}

async function getUserListings(req, res) {
  const { userId } = req.params;

  if (!userId) {
    res.status(400);
    throw new Error('User ID is required');
  }

  const listings = await Listing.find({ owner: userId })
    .populate('owner', 'name email avatar')
    .sort({ createdAt: -1 });

  return res.status(200).json(listings);
}

async function getListingById(req, res) {
  const { listingId } = req.params;
  const listing = await Listing.findById(listingId).populate(
    'owner',
    'name email avatar',
  );

  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }

  return res.status(200).json(listing);
}

async function createListing(req, res) {
  const listingData = buildListingPayload(req.body);
  const hasInvalidNumber =
    Number.isNaN(listingData.year) ||
    Number.isNaN(listingData.price) ||
    Number.isNaN(listingData.mileage);
  const currentYear = new Date().getFullYear() + 1;

  if (
    !listingData.owner ||
    !listingData.title ||
    !listingData.make ||
    !listingData.model ||
    hasInvalidNumber ||
    !listingData.fuelType ||
    !listingData.transmission ||
    !listingData.location ||
    !listingData.description
  ) {
    res.status(400);
    throw new Error('Please provide all required listing fields');
  }

  const numericValidationMessage = validateNumericListingFields(
    listingData,
    currentYear,
  );

  if (numericValidationMessage) {
    res.status(400);
    throw new Error(numericValidationMessage);
  }

  const owner = await User.findById(listingData.owner);

  if (!owner) {
    res.status(404);
    throw new Error('Listing owner was not found');
  }

  const listing = await Listing.create(listingData);
  const populatedListing = await Listing.findById(listing._id).populate(
    'owner',
    'name email avatar',
  );

  return res.status(201).json(populatedListing);
}

async function deleteListing(req, res) {
  const { listingId } = req.params;
  const { userId } = req.body;

  if (!listingId || !userId) {
    res.status(400);
    throw new Error('Listing ID and user ID are required');
  }

  const listing = await Listing.findById(listingId);

  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }

  if (String(listing.owner) !== userId) {
    res.status(403);
    throw new Error('You can only delete your own listing');
  }

  await Listing.findByIdAndDelete(listingId);

  return res.status(200).json({
    message: 'Listing deleted successfully',
  });
}

async function updateListing(req, res) {
  const { listingId } = req.params;
  const { userId } = req.body;

  if (!listingId || !userId) {
    res.status(400);
    throw new Error('Listing ID and user ID are required');
  }

  const listing = await Listing.findById(listingId);

  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }

  if (String(listing.owner) !== userId) {
    res.status(403);
    throw new Error('You can only update your own listing');
  }

  const currentYear = new Date().getFullYear() + 1;
  const updates = req.body;

  if (updates.title !== undefined) {
    listing.title = updates.title.trim();
  }

  if (updates.make !== undefined) {
    listing.make = updates.make.trim();
  }

  if (updates.model !== undefined) {
    listing.model = updates.model.trim();
  }

  if (updates.year !== undefined) {
    listing.year = Number(updates.year);
  }

  if (updates.price !== undefined) {
    listing.price = Number(updates.price);
  }

  if (updates.mileage !== undefined) {
    listing.mileage = Number(updates.mileage);
  }

  if (updates.fuelType !== undefined) {
    listing.fuelType = updates.fuelType.trim();
  }

  if (updates.transmission !== undefined) {
    listing.transmission = updates.transmission.trim();
  }

  if (updates.location !== undefined) {
    listing.location = updates.location.trim();
  }

  if (updates.description !== undefined) {
    listing.description = updates.description.trim();
  }

  if (updates.images !== undefined) {
    listing.images = normalizeListingImages(updates.images);
  }

  const numericValidationMessage = validateNumericListingFields(listing, currentYear);

  if (
    Number.isNaN(listing.year) ||
    Number.isNaN(listing.price) ||
    Number.isNaN(listing.mileage) ||
    numericValidationMessage
  ) {
    res.status(400);
    throw new Error(numericValidationMessage || 'Listing numeric fields are invalid');
  }

  await listing.save();

  const populatedListing = await Listing.findById(listing._id).populate(
    'owner',
    'name email avatar',
  );

  return res.status(200).json(populatedListing);
}

export {
  getListings,
  getUserListings,
  getListingById,
  createListing,
  deleteListing,
  updateListing,
};
