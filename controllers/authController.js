import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createUserPayload = (user) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
})

export const signUp = async (req, res) => {
    try {
        const { name, phone, email, password, role } = req.body;

        const existingUser = await User.findOne(
            { $or: [{ email }, { phone }] },
            { email: 1, phone: 1 }
        ).lean();

        if (existingUser) {
            const field = existingUser.email === email ? "email" : "phone";
            return sendErrorResponse(res, 409, `User with this ${field} already exists`);
        }

        const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

        const newUser = new User({ name, phone, email, password, profileImage, role });
        await newUser.save();

        return sendSuccessResponse(res, 201, 'User registered successfully');

    } catch (error) {
        console.error("SignUp error:", error);
        return sendErrorResponse(res, 500, 'Internal Server Error');
    };
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password').lean();
        if (!user) {
            return sendErrorResponse(res, 401, 'Invalid credentials')
        };

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendErrorResponse(res, 401, 'Invalid credentials');
        }

        const userPayload = createUserPayload(user);
        const token = generateToken(userPayload);

        return sendSuccessResponse(res, 200, 'Login successful', {
            token,
            user: userPayload
        });

    } catch (error) {
        console.error("Login error:", error);
        return sendErrorResponse(res, 500, "Internal Server Error");
    }
}