const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

const candidateRoutes = require('./routes/candidate');
const companyRoutes = require('./routes/company');
const employerRoutes = require('./routes/employer');
const advertisementRoutes = require('./routes/advertisement');
const jobApplicationRoutes = require('./routes/jobApplication');

app.use('/candidate', candidateRoutes);
app.use('/company', companyRoutes);
app.use('/employer', employerRoutes);
app.use('/advertisement', advertisementRoutes);
app.use('/job_application', jobApplicationRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});