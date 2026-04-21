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

async function getListings(_req, res) {
  const listings = await Listing.find()
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

export { getListings, getListingById, createListing };
