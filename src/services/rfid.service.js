const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { validateId } = require('../utils/validators');

const createRfidCard = async (uid, userId) => {
    if (!uid || typeof uid !== 'string' || uid.trim().length === 0) {
        throw new Error('RFID card is required and must be a non-empty string');
    }

    const validatedUserId = validateId(userId, 'User ID');

    const user = await prisma.users.findUnique({
        where: { id: validatedUserId }
    });

    if (!user) {
        throw new Error('User not found');
    }

    const existingCard = await prisma.rfid_cards.findUnique({
        where: { uid: uid.trim() }
    });

    if (existingCard) {
        throw new Error('RFID card already registered');
    }

    return await prisma.rfid_cards.create({
        data: {
            uid: uid.trim(),
            user_id: userId
        }
    });
};

const getRfidCardByUid = async (uid) => {
    if (!uid || typeof uid !== 'string' || uid.trim().length === 0) {
        throw new Error('RFID card is required and must be a non-empty string');
    }

    return await prisma.rfid_cards.findUnique({
        where: { uid: uid.trim() },
        include: {
            users: true
        }
    });
};

const getRfidCardsByUserId = async (userId) => {
    if (!userId || typeof userId !== 'number' || userId < 1) {
        throw new Error('Invalid User ID');
    }

    return await prisma.rfid_cards.findMany({
        where: { user_id: userId }
    });
};

const deleteRfidCard = async (id) => {
    const validatedId = validateId(id, 'RFID Card ID');

    const card = await prisma.rfid_cards.findUnique({
        where: { id: validatedId }
    });

    if (!card) {
        throw new Error('RFID card not found');
    }

    return await prisma.rfid_cards.delete({
        where: { id: id }
    });
};

module.exports = {
    createRfidCard,
    getRfidCardByUid,
    getRfidCardsByUserId,
    deleteRfidCard
};
