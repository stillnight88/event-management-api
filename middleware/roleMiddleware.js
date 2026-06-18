import Event from '../models/Event.js';
import { Types } from 'mongoose';


const sendErrorResponse = (response, statusCode, message) => {
    return response.status(statusCode).json({
        success: false,
        message
    });
};

const validateObjectId = (id) => Types.ObjectId.isValid(id);

export const roleMiddleware = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!validateObjectId(id)) {
            return sendErrorResponse(res, 400, 'Invalid event ID format');
        };

        const event = await Event.findById(id).select('createdBy').lean();
        if (!event) {
            return sendErrorResponse(res, 404, 'Event not found')
        };

        if (!event.createdBy) {
            return sendErrorResponse(res, 403, 'Access denied. Event has no owner');
        };

        if (!event.createdBy.equals(req.user.id)) {
            return sendErrorResponse(res, 403, 'Access denied. You can only modify your own events');
        }

        req.event = event;
        next();
    } catch (error) {
        console.log("role error: ", error);
        return sendErrorResponse(res, 500, 'Server error')
    };
};


export const isAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return sendErrorResponse(res, 401, 'Authentication required');
        };

        if (!req.user.role) {
            return sendErrorResponse(res, 403, 'User role not defined');
        };

        if (req.user.role.toLowerCase() !== 'admin') {
            return sendErrorResponse(res, 403, 'Access denied. Admin privileges required');
        };

        next();
    } catch (error) {
        console.error("Admin middleware error:", error.message);
        return sendErrorResponse(res, 500, 'Authorization check failed');
    };
};
