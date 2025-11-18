const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { validateEmail, validateId } = require('../utils/validators');

const getUserById = async (id) => {
    const validatedId = validateId(id, 'User ID');
    const user = await prisma.users.findUnique({
        where: { id: validatedId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            is_active: true,
            created_at: true,
            rfid_cards: true
        }
    });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

const getUserByEmail = async (email) => {
    const validatedEmail = validateEmail(email);

    return await prisma.users.findUnique({
        where: { email: validatedEmail }
    });
};

const getAllUsers = async () => {
    return await prisma.users.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            is_active: true,
            created_at: true,
            rfid_cards: true
        }
    });
};

const deleteUserById = async (id) => {
    const validatedId = validateId(id, 'User ID');
    const user = await prisma.users.findUnique({
        where: { id: validatedId }
    });
    if (!user) {
        throw new Error('User not found');
    }
    // Soft delete: set is_active to false
    return await prisma.users.update({
        where: { id: validatedId },
        data: { is_active: false }
    });
};

module.exports = {
    getUserById,
    getUserByEmail,
    getAllUsers,
    deleteUserById
};
