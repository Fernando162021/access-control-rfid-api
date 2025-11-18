const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDBConnection() {
    try {
        await prisma.$connect();
        console.log('Database connection successful');
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

module.exports = { testDBConnection };