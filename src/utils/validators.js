const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string') {
        throw new Error('Email is required and must be a string');
    }
    if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
    }
    return email.trim().toLowerCase();
};


const validateId = (id, fieldName = 'ID') => {
    const numId = typeof id === 'number' ? id : parseInt(id, 10);
    if (isNaN(numId) || numId <= 0) {
        throw new Error(`${fieldName} must be a positive integer`);
    }
    return numId;
};

module.exports = {
    validateEmail,
    validateId
};
