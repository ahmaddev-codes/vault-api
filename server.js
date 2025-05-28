const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const agentRoutes = require('./routes/agentRoutes');
const intelRoutes = require('./routes/intelRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

// configure envonment variables
dotenv.config();
// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('✅ Vault API is currently running 🚀'));

app.use('/api/v1/agents', agentRoutes);
app.use('/api/v1/intel', intelRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app