import express from 'express';
import {
  createCinema,
  purchaseSeat,
  purchaseConsecutiveSeats,
} from '../controller/cinemaController';

const router = express.Router();

router.post('/', createCinema);
router.post('/:id/purchase', purchaseSeat);
router.post('/:id/purchase/consecutive', purchaseConsecutiveSeats);

export default router;
