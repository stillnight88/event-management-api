import express from "express";
import { upload } from '../middleware/uploadMiddleware.js'
import { protect } from '../middleware/authMiddleware.js'
import { isAdmin, roleMiddleware } from '../middleware/roleMiddleware.js'
import {
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent
} from '../controllers/eventController.js'

const router = express.Router();

router.get('/events',getAllEvents);
router.post('/events' ,upload.single('image'), protect ,  isAdmin ,createEvent );
router.put('/events/:id' , upload.single('image') , protect , isAdmin , roleMiddleware , updateEvent)
router.delete('/events/:id' ,  protect , isAdmin , roleMiddleware , deleteEvent)

export default router;
