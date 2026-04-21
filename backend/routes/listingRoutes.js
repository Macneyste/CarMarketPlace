import express from 'express';
import {
  createListing,
  getListingById,
  getListings,
  getUserListings,
} from '../controllers/listingController.js';

const router = express.Router();

router.get('/', getListings);
router.get('/user/:userId', getUserListings);
router.get('/:listingId', getListingById);
router.post('/', createListing);

export default router;
