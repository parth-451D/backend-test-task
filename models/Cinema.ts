import mongoose, { Document } from 'mongoose';

export interface Seat {
  number: number;
  isPurchased: boolean;
}

export interface CinemaDocument extends Document {
  cinemaName: String,
  seatCount: Number,
  seats: Seat[];
}

const cinemaSchema = new mongoose.Schema<CinemaDocument>({
  cinemaName: String,
  seatCount: Number,
  seats: [{ number: Number, isPurchased: Boolean }],
});

const CinemaModel = mongoose.model<CinemaDocument>('Cinema', cinemaSchema);

export default CinemaModel;
