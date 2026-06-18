import Booking from "../models/Booking.js";
import { Types } from "mongoose";

const sendSuccessResponse = (response, statusCode, message, data = null) => {
    const jsonRes = {
        success: true,
        message
    };
    if (data) jsonRes.data = data;
    return response.status(statusCode).json(jsonRes);
};

const sendErrorResponse = (response, statusCode, message) => {
    return response.status(statusCode).json({
        success: false,
        message
    });
};

const validateObjectId = (id) => Types.ObjectId.isValid(id);

export const getMyBooking = async (req, res) => {
    try {
        const userId = req.user.id;
        
        if (!validateObjectId(userId)) {
            return sendErrorResponse(res, 400, 'Invalid user ID format');
        }

        const userBookings = await Booking.find({ user: userId })
            .populate('event')
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .lean();

        return sendSuccessResponse(res, 200, 'User bookings retrieved successfully', {
            bookings: userBookings,
            count: userBookings.length
        });

    } catch (error) {
        console.error("Get user bookings error:", error);
        return sendErrorResponse(res, 500, 'Failed to retrieve user bookings');
    }
};

export const getAllBookings = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
        // Fixed: removed invalid sort syntax

        const [bookings, totalCount] = await Promise.all([
            Booking.find()
                .populate('event')
                .populate('user', 'name email')
                .sort(sort)
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .lean(),
            Booking.countDocuments()
        ]);

        return sendSuccessResponse(res, 200, 'Bookings retrieved successfully', {
            bookings,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalEvents: totalCount,
                hasNextPage: page < Math.ceil(totalCount / limit),
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error("Get all bookings error:", error);
        return sendErrorResponse(res, 500, 'Failed to retrieve bookings');
    }
};

export const createBooking = async (req, res) => {
    try {

        const { eventId } = req.params;

        if (!validateObjectId(eventId)) {
            return sendErrorResponse(res, 400, 'Invalid event ID format');
        }

        // Fixed: Using findOne instead of find, and checking length
        const existingBooking = await Booking.findOne({
            event: eventId,
            user: req.user.id
        });

        // Fixed: Check if booking exists (not just truthy array)
        if (existingBooking) {
            return sendErrorResponse(res, 409, 'You have already booked this event');
        }

        const bookingData = {
            event: eventId,
            user: req.user.id,
            bookingDate: new Date()
        };

        const newBooking = new Booking(bookingData);
        await newBooking.save();
        
        // Fixed: Populate after save
        await newBooking.populate([
            { path: 'event' },
            { path: 'user', select: 'name email' }
        ]);

        return sendSuccessResponse(res, 201, 'Booking created successfully', { 
            booking: newBooking 
        });

    } catch (error) {
        console.error("Create booking error:", error);
        return sendErrorResponse(res, 500, 'Failed to create booking');
    }
};