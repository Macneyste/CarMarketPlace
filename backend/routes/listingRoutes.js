import express from 'express';
import {
  createListing,
  deleteListing,
  getListingById,
  getListings,
  getUserListings,
  updateListing,
} from '../controllers/listingController.js';

const router = express.Router();

router.get('/', getListings);
router.get('/user/:userId', getUserListings);
router.get('/:listingId', getListingById);
router.post('/', createListing);
router.patch('/:listingId', updateListing);
router.delete('/:listingId', deleteListing);

export default router;
