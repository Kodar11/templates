// middleware/errorHandler.js
// Central error handling middleware
function errorHandler(err, req, res, next) {
    // If the error is an instance of ApiError, we use its properties.
    const statusCode = err.statusCode || 500;  // Default to 500 if no statusCode is set
    const message = err.message || 'Internal server error';
    const errors = err.errors || [];

    // Log the detailed error stack for internal use
    console.error(err.stack); // This will print detailed error info in your server console.

    // Send a generic response to the client
    res.status(statusCode).json({
        success: false,
        message,
        errors,   // Detailed errors for client (e.g., validation details)
        data: null // No data in error responses
    });
}

export { errorHandler };
