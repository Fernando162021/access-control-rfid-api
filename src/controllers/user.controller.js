const { getUserById, getAllUsers, deleteUserById } = require('../services/user.service');
const { asyncHandler } = require('../utils/errorHandler');

const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await getUserById(id);

    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

const getUsers = asyncHandler(async (req, res) => {
    const users = await getAllUsers();

    res.status(200).json({
        status: 'success',
        data: { users }
    });
});
    
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await deleteUserById(id);

    res.status(200).json({
        status: 'success',
        message: 'User deleted successfully'
    });
});

module.exports = {
    getUser,
    getUsers,
    deleteUser
};