const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createAccessLog = async (userId, accessGranted, rfid_card_id = null) => {
    if (typeof accessGranted !== 'boolean') {
        throw new Error('accessGranted must be a boolean');
    }

    return await prisma.access_logs.create({
        data: {
            users: userId ? { connect: { id: userId } } : undefined,
            rfid_cards: rfid_card_id ? { connect: { id: rfid_card_id } } : undefined,
            access_granted: accessGranted,
            access_time: new Date()
        }
    });
};

const getAccessLogsByUserId = async (userId) => {
    return await prisma.access_logs.findMany({
        where: { user_id: userId },
        orderBy: { access_time: 'desc' }
    });
};

const getAllAccessLogs = async () => {
    
    return await prisma.access_logs.findMany({
        include: {
            users: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    created_at: true
                }
            }
        },
        orderBy: { access_time: 'desc' }
    });
};

const getFailedAccessAttempts = async (limit = 10) => {
    if (typeof limit !== 'number' || limit < 1 || limit > 1000) {
        throw new Error('Limit must be a number between 1 and 1000');
    }

    return await prisma.access_logs.findMany({
        where: { access_granted: false },
        include: {
            users: true
        },
        orderBy: { access_time: 'desc' },
        take: limit
    });
};

module.exports = {
    createAccessLog,
    getAccessLogsByUserId,
    getAllAccessLogs,
    getFailedAccessAttempts
};
