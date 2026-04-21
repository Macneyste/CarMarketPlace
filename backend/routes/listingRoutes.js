import express from 'express';
import {
  createListing,
  getListingById,
  getListings,
} from '../controllers/listingController.js';

const router = express.Router();

router.get('/', getListings);
router.get('/:listingId', getListingById);
router.post('/', createListing);

export default router;
