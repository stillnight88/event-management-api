import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: [true, "Event is required"],
        validate: {
            validator: (v) => mongoose.Types.ObjectId.isValid(v),
            message: "Invalid user ID"
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User is required"],
        validate: {
            validator: (v) => mongoose.Types.ObjectId.isValid(v),
            message: "Invalid user ID"
        }
    },
    bookingDate: {
        type: Date,
        required: true,
    }
}, { timestamps: true });

BookingSchema.index({ createdAt: -1 });
const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;