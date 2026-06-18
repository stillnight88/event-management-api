import { Types } from "mongoose";
import Event from "../models/Event.js";

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

export const getAllEvents = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = '-createdAt: -1' } = req.query;

        const [events, totalCount] = await Promise.all([
            Event.find()
                .populate('createdBy', 'name email')
                .sort(sort)
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .lean(),
            Event.countDocuments()
        ]);

        const updatedEvents = events.map(event => ({
            ...event,
            image: `${req.protocol}://${req.get("host")}/uploads/${event.image}`
        }));

        return sendSuccessResponse(res, 200, 'Events retrieved successfully', {
            events,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalEvents: totalCount,
                hasNextPage: page < Math.ceil(totalCount / limit),
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error("Get all users error:", error);
        return sendErrorResponse(res, 500, 'Internal server error');
    }

};

export const createEvent = async (req, res) => {
    try {
        const { title, description, date, location } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;
        const eventData = { title, description, date, location, image, createdBy: req.user?.id };

        const newEvent = new Event(eventData);  // const newEvent = await Event.create(eventData);
        await newEvent.save();
        await newEvent.populate('createdBy', 'name email');

        return sendSuccessResponse(res, 201, 'Task created successfully', { event: newEvent });

    } catch (error) {
        console.error("Create event error:", error);
        return sendErrorResponse(res, 500, 'Internal server error');
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        if (!validateObjectId(id)) {
            return sendErrorResponse(res, 400, 'Invalid task ID format');
        }

        const { title, description, date, location, image } = req.body;
        const updateData = {};

        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (date !== undefined) updateData.date = date;
        if (location !== undefined) updateData.location = location;
        if (req.file && req.file.filename) {
            updateData.image = req.file.filename;
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('createdBy', 'name email');

        if (!updatedEvent) {
            return sendErrorResponse(res, 404, 'Event not found');
        };

        return sendSuccessResponse(res, 201, 'Task updated successfully', { event: updatedEvent })

    } catch (error) {
        console.error("update event error:", error);
        return sendErrorResponse(res, 500, 'Internal server error');
    }
}

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        if (!validateObjectId(id)) {
            return sendErrorResponse(res, 400, 'Invalid task ID format');
        };

        const deletedEvent = await Event.findByIdAndDelete(id)
            .populate('createdBy', 'name email');
        if (!deletedEvent) {
            return sendErrorResponse(res, 404, 'Event not found');
        };

        return sendSuccessResponse(res, 201, 'Event deleted successfully', { event: deletedEvent })
    } catch (error) {
        console.error("delete event error:", error);
        return sendErrorResponse(res, 500, 'Internal server error');
    }
};