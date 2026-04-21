import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a listing title'],
      trim: true,
    },
    make: {
      type: String,
      required: [true, 'Please add the car make'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Please add the car model'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Please add the year'],
      min: 1950,
    },
    price: {
      type: Number,
      required: [true, 'Please add the price'],
      min: 0,
    },
    mileage: {
      type: Number,
      required: [true, 'Please add the mileage'],
      min: 0,
    },
    fuelType: {
      type: String,
      required: [true, 'Please add the fuel type'],
      trim: true,
    },
    transmission: {
      type: String,
      required: [true, 'Please add the transmission'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please add the location'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'sold', 'draft'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
