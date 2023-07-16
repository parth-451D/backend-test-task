import { Request, Response } from 'express';
import Cinema, { CinemaDocument, Seat } from '../models/Cinema';

export const createCinema = async (req: Request, res: Response) => {

    function fillArrayWithObject( n: number): object[] {
        const arr: object[] = [];
        for (let i = 0; i < n; i++) {
            const seat: Seat = {
                number: i,
                isPurchased: false,
              };
              arr.push(seat);
        }
        return arr;
      }

      const cinemaDetails = {
        cinemaname : req.body.cinemaName,
        seatCount: req.body.seatCount,
        seats : fillArrayWithObject(req.body.seatCount)
      }

  try {
    const cinema = await Cinema.create(cinemaDetails);
    res.json({ cinemaId: cinema._id });
  } catch (error) {
    console.error('Error creating cinema:', error);
    res.status(500).json({ error: 'Failed to create cinema' });
  }
};

export const purchaseSeat = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cinemaId = id;

  try {
    const cinema = await Cinema.findById(cinemaId);
    if (!cinema) {
      return res.status(404).json({ error: 'Cinema not found' });
    }

    const { seatNumber } = req.body;
    const seatIndex = cinema.seats.findIndex(
      (seat: Seat) => seat.number === seatNumber
    );
    if (seatIndex === -1) {
      return res.status(404).json({ error: 'Seat not found' });
    }

    const seat = cinema.seats[seatIndex];
    if (seat.isPurchased) {
      return res.status(400).json({ error: 'Seat already purchased' });
    }

    seat.isPurchased = true;
    await cinema.save();

    res.json({ seat });
  } catch (error) {
    console.error('Error purchasing seat:', error);
    res.status(500).json({ error: 'Failed to purchase seat' });
  }
};

export const purchaseConsecutiveSeats = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cinemaId = id;

  try {
    const cinema = await Cinema.findById(cinemaId);
    if (!cinema) {
      return res.status(404).json({ error: 'Cinema not found' });
    }

    const seats: Seat[] = [];
    let consecutiveSeatsCount = 0;

    for (let i = 0; i < cinema.seats.length; i++) {
      const currentSeat = cinema.seats[i];
      if (currentSeat.isPurchased) {
        consecutiveSeatsCount = 0;
        seats.length = 0; // Clear the seats array
      } else {
        consecutiveSeatsCount++;
        seats.push(currentSeat);
        if (consecutiveSeatsCount === 2) {
          break;
        }
      }
    }

    if (consecutiveSeatsCount < 2) {
      return res.status(400).json({ error: 'No consecutive seats available' });
    }

    seats.forEach((seat) => {
      seat.isPurchased = true;
    });

    await cinema.save();

    res.json({ seats });
  } catch (error) {
    console.error('Error purchasing consecutive seats:', error);
    res.status(500).json({ error: 'Failed to purchase consecutive seats' });
  }
};
