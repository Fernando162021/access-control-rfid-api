const errorHandler = (err, req, res, next) => {
    console.error('Error:', {
        name: err.name,
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });

    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
    }

    if (err.code) {
        return handlePrismaError(err, res);
    }

    return res.status(500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'development' 
            ? err.message 
            : 'An unexpected error occurred'
    });
};

const handlePrismaError = (err, res) => {
    switch (err.code) {
        case 'P2002':
            return res.status(409).json({
                status: 'error',
                message: 'A record with this value already exists'
            });
        case 'P2025':
            return res.status(404).json({
                status: 'error',
                message: 'Record not found'
            });
        case 'P2003':
            return res.status(400).json({
                status: 'error',
                message: 'Invalid reference to related record'
            });
        default:
            return res.status(500).json({
                status: 'error',
                message: 'Database operation failed'
            });
    }
};

const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = {
    errorHandler,
    asyncHandler
};
