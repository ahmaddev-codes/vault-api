const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const agentRoutes = require('./routes/agentRoutes');
const intelRoutes = require('./routes/intelRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

dotenv.config();
connectDB();

const HOST = "127.0.0.1"
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('The Vault API is running'));

app.use('/api/agents', agentRoutes);
app.use('/api/intel', intelRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} @ http://${HOST}:${PORT}`));
