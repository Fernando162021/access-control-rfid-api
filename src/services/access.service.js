const { getRfidCardByUid } = require('./rfid.service');
const { createAccessLog } = require('./access-log.service');

/**
 * Handles access by RFID card: validates card, logs access, returns user info if valid.
 * @param {string} card - RFID card string
 * @returns {object} - { user: { id, name, email } }
 * @throws {Error} - If access is denied
 */
const accessByRfidService = async (card) => {
    const rfidCard = await getRfidCardByUid(card);

    if (!rfidCard || !rfidCard.users) {
        // Log failed attempt (no user_id available)
        await createAccessLog(null, false, rfidCard ? rfidCard.id : null);
        // TODO: Send email notification about failed access
        // await sendFailedAccessEmail(null, 'rfid', card);
        throw new Error('Access denied: Invalid RFID card');
    }

    await createAccessLog(rfidCard.users.id, true, rfidCard.id);

    return {
        user: {
            id: rfidCard.users.id,
            name: rfidCard.users.name,
            email: rfidCard.users.email
        }
    };
};

module.exports = {
    accessByRfidService
};
