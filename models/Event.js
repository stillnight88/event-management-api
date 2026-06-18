import mongoose from "mongoose";
import validator from "validator";

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        maxlength: [25, "Title cannot exceed 25 characters"],
        minlength: [2, "Title must be at least 2 characters"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
        maxlength: [2000, "Description cannot exceed 2000 characters"],
        minlength: [2, "Description must be at least 2 characters"]
    },
    date: {
        type: String,
        required: true,
        validate: {
            validator: (v) => validator.isDate(v, { format: 'YYYY-MM-DD', strictMode: true })
        }
    },
    location: {
        type: String,
        required: [true, "Location is required"],
        trim: true,
        maxlength: [25, "Location cannot exceed 25 characters"],
        minlength: [2, "Location must be at least 2 characters"]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Task must be assigned to a admin"],
        validate: {
            validator: (v) => mongoose.Types.ObjectId.isValid(v),
            message: "Invalid user ID"
        }
    },
    image: {
        type: String,
        default: null
    }
}, { timestamps: true })

EventSchema.index({ createdBy: 1, createdAt: -1 });
EventSchema.index({ createdAt: -1 });


const Event = mongoose.model("Event", EventSchema);
export default Event;