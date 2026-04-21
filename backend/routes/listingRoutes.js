import express from 'express';
import {
  createListing,
  deleteListing,
  getListingById,
  getListings,
  getUserListings,
} from '../controllers/listingController.js';

const router = express.Router();

router.get('/', getListings);
router.get('/user/:userId', getUserListings);
router.get('/:listingId', getListingById);
router.post('/', createListing);
router.delete('/:listingId', deleteListing);

export default router;
