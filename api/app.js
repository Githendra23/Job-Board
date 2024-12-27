const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();
const PORT = process.env.PORT;

app.use(express.json());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(cookieParser());

const userRoutes = require('./routes/user');
const companyRoutes = require('./routes/company');
const employerRoutes = require('./routes/employer');
const advertisementRoutes = require('./routes/advertisement');
const jobApplicationRoutes = require('./routes/jobApplication');
const verifyTokenRoutes = require('./routes/verifyToken');

app.use('/user', userRoutes);
app.use('/company', companyRoutes);
app.use('/employer', employerRoutes);
app.use('/advertisement', advertisementRoutes);
app.use('/job_application', jobApplicationRoutes);
app.use('/verifyToken', verifyTokenRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});