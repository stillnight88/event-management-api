import express from "express";
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin} from '../middleware/roleMiddleware.js'
import { getMyBooking, getAllBookings, createBooking } from "../controllers/bookingController.js"

const router = express.Router();

router.get('/my-bookings',protect,getMyBooking);
router.get('/bookings',protect,isAdmin,getAllBookings);
router.post('/bookings/:eventId' , protect , createBooking);

export default router;