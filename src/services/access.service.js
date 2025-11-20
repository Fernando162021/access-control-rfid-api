const { getRfidCardByUid } = require('./rfid.service');
const { createAccessLog } = require('./access-log.service');
const { sendEmail } = require('./email.service');

/**
 * Handles access by RFID card: validates card, logs access, returns user info if valid.
 * @param {string} card - RFID card string
 * @returns {object} - { user: { id, name, email } }
 * @throws {Error} - If access is denied
 */
const accessByRfidService = async (card) => {
    const rfidCard = await getRfidCardByUid(card);

    if (!rfidCard || !rfidCard.users) {
        await createAccessLog(null, false, rfidCard ? rfidCard.id : null);

        try {
            await sendEmail(
                process.env.EMAIL_ADMIN,
                'RFID Access Denied',
                `<html><body><h2>RFID Access Denied</h2><p>An invalid RFID card was used: <b>${card}</b>.<br>Date: ${new Date().toLocaleString()}</p></body></html>`
            );
        } catch (err) {
            console.error('Failed to send access denied email:', err);
        }

        throw new Error('Access denied: Invalid RFID card');
    }

    await createAccessLog(rfidCard.users.id, true, rfidCard.id);

    try {
        await sendEmail(
            process.env.EMAIL_ADMIN,
            'RFID Access Granted',
            `<html><body><h2>RFID Access Granted</h2>
            <p>User: <b>${rfidCard.users.name}</b> (Email: ${rfidCard.users.email})<br>
            Card UID: <b>${rfidCard.uid}</b><br>
            Date: ${new Date().toLocaleString()}</p></body></html>`
        );
    } catch (err) {
        console.error('Failed to send access granted email:', err);
    }

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
