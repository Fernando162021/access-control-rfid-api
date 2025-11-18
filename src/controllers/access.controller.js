const { getAllAccessLogs, getAccessLogsByUserId } = require('../services/access-log.service');
const { accessByRfidService } = require('../services/access.service');
const { asyncHandler } = require('../utils/errorHandler');

const accessByRfid = asyncHandler(async (req, res) => {
    const { card } = req.body;
    const result = await accessByRfidService(card);
    res.status(200).json({
        status: 'success',
        message: 'Access granted',
        data: result
    });
});

const accessByCamera = asyncHandler(async (req, res) => {
    // TODO: Implement face recognition validation
    // This endpoint is a placeholder for future camera/face recognition implementation
    return res.status(501).json({ 
        status: 'error',
        message: 'Camera access not implemented yet. Face recognition feature is under development'
    });

    /* Uncomment when implementing camera access
    const { userId } = req.body;

    // In a real implementation, you would verify the face recognition here
    // For now, we'll assume the camera/face recognition has already validated the user

    // Log successful access
    await createAccessLog(userId, 'camera', true);

    res.status(200).json({
        status: 'success',
        message: 'Access granted via camera recognition'
    });
    */
});

const getAccessLogs = asyncHandler(async (req, res) => {
    const logs = await getAllAccessLogs();

    res.status(200).json({
        status: 'success',
        data: { logs }
    });
});

const getUserAccessLogs = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const logs = await getAccessLogsByUserId(userId);

    res.status(200).json({
        status: 'success',
        data: { logs }
    });
});

module.exports = {
    accessByRfid,
    accessByCamera,
    getAccessLogs,
    getUserAccessLogs
};
