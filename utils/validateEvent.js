export const validateEvent = (req,res,next) =>{
      const {title, description } = req.body;

    if (!title || !description ||!date ||!location) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required: title, description '
        });
    }
    next();
}