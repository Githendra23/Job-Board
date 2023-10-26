const express = require('express');
const JobApplication = require('../models/jobApplicationModel');
const User = require('../models/userModel');
const Advertisement = require('../models/advertisementModel');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'uploads');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
  try 
  {
    const jobApplication = await JobApplication.findAll();
    return res.status(200).json(jobApplication);
  } 
  catch (error)
  {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try 
  {
    const jobApplication = await JobApplication.findByPk(parseInt(id));

    if (jobApplication) return res.status(200).json(jobApplication);
    else return res.status(404).json({ message: 'JobApplication not found' });

  } 
  catch (error) 
  {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/files', async (req, res) => {
  const { user_id, advertisement_id } = req.body;

  try 
  {
    const missingFields = [];
  
    if (!advertisement_id) missingFields.push('advertisement_id');
    if (!user_id) missingFields.push('user_id');
  
    if (missingFields.length > 0) res.status(400).json({ message: `Please provide data to create a job application. Missing fields: ${missingFields.join(', ')}.` });

    const wrongFields = [];

    if (typeof user_id !== 'number') wrongFields.push('user_id');
    if (typeof advertisement_id !== 'number') wrongFields.push('advertisement_id');

    if (wrongFields.length > 0) return res.status(401).json({ message: `Invalid data types for the following fields: ${wrongFields.join(', ')}` });

    const jobApplication = await JobApplication.findOne({ 
      where: { 
        user_id: user_id, advertisement_id: advertisement_id 
      }, 
    });

    if (jobApplication)
    {
      const cvPath = jobApplication.cv;
      const coverLetterPath = jobApplication.cover_letter;

      if (cvPath && coverLetterPath) 
      {
        const cvFileName = path.basename(cvPath);
        const coverLetterFileName = path.basename(coverLetterPath);

        // Set appropriate response headers
        res.setHeader('Content-disposition', `attachment; filename=${cvFileName}`);
        res.setHeader('Content-type', 'application/pdf'); // Change content type accordingly

        // Send the cv file as a download
        res.download(cvPath, cvFileName, (err) => {
          if (err) 
          {
            console.error('\x1b[31m' + 'Error sending cv file: ' + err + + ' \x1b[0m');
            return res.status(500).json({ message: 'Internal Server Error' });
          }
        });

        res.setHeader('Content-disposition', `attachment; filename=${coverLetterFileName}`);
        res.setHeader('Content-type', 'application/pdf'); // Change content type accordingly

        // Send the cover letter file as a download
        res.download(coverLetterPath, coverLetterFileName, (err) => {
          if (err) {
            console.error('Error sending cover letter file:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
          }
        });
      } 
      else return res.status(404).json({ message: 'Files not found' });
    } 
    else return res.status(404).json({ message: 'Job Application not found' });
  }
  catch (error)
  {
    console.log('\x1b[31m' + error + '\x1b[0m');
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/', upload.fields([{ name: 'cv' }, { name: 'cover_letter' }]), async (req, res) => {
  let { advertisement_id, company_id, employer_id, user_id } = req.body;

  if (!advertisement_id || !company_id || !user_id) 
  {
    const missingFields = [];
  
    if (!advertisement_id) missingFields.push('advertisement_id');
    if (!company_id) missingFields.push('company_id');
    if (!user_id) missingFields.push('user_id');
  
    return res.status(400).json({
      message: `Please provide data to create a job application. Missing fields: ${missingFields.join(', ')}.`,
    });
  }

  const { cv, cover_letter } = req.files;

  if (!cv || !cover_letter) return res.status(400).json({ message: 'Please upload both CV and cover letter as files.' });

  const wrongFields = [];

  try 
  {
    company_id = parseInt(company_id);
    user_id = parseInt(user_id);
    employer_id = parseInt(employer_id);
    advertisement_id = parseInt(advertisement_id);
  }
  catch (error)
  {
    console.log(error);
  }

  if (typeof company_id !== 'number') wrongFields.push('company_id');
  if (typeof employer_id !== 'number') wrongFields.push('employer_id');
  if (typeof user_id !== 'number') wrongFields.push('user_id');
  if (typeof advertisement_id !== 'number') wrongFields.push('advertisement_id');

  if (wrongFields.length > 0) return res.status(401).json({ message: `Invalid data types for the following fields: ${wrongFields.join(', ')}` });

  try
  {
    const user = await User.findByPk(user_id);
    const advertisement = await Advertisement.findOne({
      where: {
        id: advertisement_id,
        company_id: company_id,
        employer_id: employer_id,
      },
    });

    if ([user, advertisement].every(item => item === null))
    {
      let missingResources = [];

      if (!user) missingResources.push('User');
      if (!advertisement) missingResources.push('Advertisement');
  
      return res.status(400).json({ message: `${missingResources.join(', ')} don't exist` });
    }
    
    const existingUserApplication = await JobApplication.findOne({
      where: { user_id: user_id, advertisement_id: advertisement_id }
    });

    if (existingUserApplication) return res.status(400).json({ message: 'A job application with the same user already exists.' });

    const newJobApplication = await JobApplication.create({
      advertisement_id: advertisement_id,
      company_id: company_id,
      employer_id: employer_id,
      user_id: user_id,
      cv: cv,
      cover_letter: cover_letter
    });

    fs.unlink(cv[0].path, (cvError) => {
      if (cvError) {
        console.error('Error deleting CV file:', cvError);
      } else {
        console.log('CV file deleted successfully');
      }
    });

    fs.unlink(cover_letter[0].path, (coverLetterError) => {
      if (coverLetterError) {
        console.error('Error deleting cover letter file:', coverLetterError);
      } else {
        console.log('Cover letter file deleted successfully');
      }
    });

    return res.status(200).json({ message: 'Job application saved successfully', jobApplication: newJobApplication });
  }
  catch (error)
  {
    console.log('\x1b[31m' + error + '\x1b[0m');
    fs.unlink(cv[0].path, (cvError) => {
      if (cvError) {
        console.error('Error deleting CV file:', cvError);
      } else {
        console.log('CV file deleted successfully');
      }
    });

    fs.unlink(cover_letter[0].path, (coverLetterError) => {
      if (coverLetterError) {
        console.error('Error deleting cover letter file:', coverLetterError);
      } else {
        console.log('Cover letter file deleted successfully');
      }
    });
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { advertisement_id, company_id, employer_id, user_id } = req.body;

  if (!req.body) return res.status(400).json({ message: 'Please provide data to update the database.' });

  try
  {
    const jobApplication = await JobApplication.findByPk(id);
    const updateFields = {};

    if (user_id)
    {
      const existingUserApplication = await JobApplication.findOne({
        where: { user_id: user_id }
      });

      if (existingUserApplication) return res.status(400).json({ message: 'A job application with the same user already exists.' });

      updateFields.user_id = user_id;
    }

    if (company_id) updateFields.company_id = company_id; 
    if (advertisement_id) updateFields.advertisement_id = advertisement_id;
    if (employer_id) updateFields.employer_id = employer_id;

    if (jobApplication)
    {
      await JobApplication.update(updateFields, { where: { id } });
      return res.status(200).json(jobApplication);
    }
    else return res.status(404).json({ message: 'JobApplication not found' });
  } 
  catch (error) 
  {
    console.error(error);
    return res.status(400).json({ message: 'Invalid JSON format. Please check the provided keys and values.' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try 
  {
    const jobApplication = await JobApplication.findByPk(id);
    if (jobApplication) 
    {
      await JobApplication.destroy();
      return res.status(200).json({ message: 'JobApplication deleted successfully' });
    } 
    else return res.status(404).json({ message: 'JobApplication not found' });

  } 
  catch (error) 
  {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;