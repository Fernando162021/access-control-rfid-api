require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { testDBConnection } = require('./src/db/testDbConnection')
const routes = require('./src/routes');
const { errorHandler } = require('./src/utils/errorHandler');

const app = express();

// HTTP Security
app.use(helmet());

// Rate limit: 100 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit of requests per IP
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/v1', routes);

app.use(errorHandler);

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 3000;

testDBConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
});