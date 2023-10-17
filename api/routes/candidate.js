const express = require('express');
const Candidate = require('../models/candidateModel');
const router = express.Router();

router.get('/', async (req, res) => {
  try 
  {
    const candidates = await Candidate.findAll({
      attributes: { exclude: ['password'] },
    });

    return res.status(200).json(candidates);
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
    const candidate = await Candidate.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (candidate) 
    {
      return res.status(200).json(candidate);
    } 
    else 
    {
      return res.status(404).json({ message: 'Company not found' });
    }
  } 
  catch (error) 
  {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/verifyToken', async (req, res) => {
  const userToken = req.headers.authorization;
  
  if (!userToken) 
  {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try 
  {
    const decodedToken = Candidate.verifyToken(userToken);

    if (!decodedToken) 
    {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const userId = decodedToken.userId;
    
    const candidate = await Candidate.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });

    if (!candidate) 
    {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    return res.status(200).json({ message: 'Token verified' });
  } 
  catch (error) 
  {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/register', async (req, res) => {
  try 
  {
    const { email, password, ...otherData } = req.body;

    const existingCandidate = await Candidate.findOne({ where: { email } });

    if (existingCandidate) 
    {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const candidate = Candidate.build({ email, ...otherData });
    candidate.password = await candidate.hashPassword(password);

    // Generate a token using the user's ID and email
    const token = candidate.generateToken();

    await candidate.save();

    return res.status(200).json(candidate, token);
  } 
  catch (error) 
  {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;

  if (!req.body) 
  {
    return res.status(400).json({ message: 'Please provide data to update the database.' });
  }

  try
  {
    const candidate = await Candidate.findByPk(id, { attributes: { exclude: ['password'] } });

    if (req.body.hasOwnProperty('password'))
    {
      const { password, ...otherData } = req.body;

      req.body.password = await candidate.hashPassword(password);
    }

    if (req.body.hasOwnProperty('telephone'))
    {
      const { telephone, ...otherData } = req.body;

      const existingContact = await Candidate.findOne({ where: { telephone } });

      if (existingContact)
      {
        return res.status(400).json({ message: 'Phone number already exists' });
      }
    }

    if (req.body.hasOwnProperty('email'))
    {
      const { email, ...otherData } = req.body;

      const existingCandidate = await Candidate.findOne({ where: { email } });

      if (existingCandidate)
      {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    if (candidate)
    {
      await candidate.update(req.body, {
        where: { id },
      });
      return res.status(200).json(candidate);
    }
    else 
    {
      return res.status(404).json({ message: 'Candidate not found' });
    }
  } 
  catch (error) 
  {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try 
  {
    const candidate = await Candidate.findByPk(id);
    if (candidate) 
    {
      await candidate.destroy();
      return res.status(200).json({ message: 'Candidate deleted successfully' });
    } 
    else 
    {
      return res.status(404).json({ message: 'Candidate not found' });
    }
  } 
  catch (error) 
  {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const authorizationHeader = req.headers['authorization'];

  if (!email || !password) 
  {
    return res.status(400).json({ message: 'Please provide both email and password for authentication.' });
  }

  try
  {
    const candidate = await Candidate.findOne({ where: { email } });
    console.log('\x1b[32m'+ authorizationHeader +'\x1b[0m');
    if (authorizationHeader) 
    {
      const [bearer, token] = authorizationHeader.split(' ');

      if (bearer === 'Bearer' && token)
      {
        if (candidate.verifyToken(token))
        {
          return res.status(200).json({ message: 'Authentication successful', token });
        }
        else
        {
          return res.status(401).json({ message: 'Authentication failed. Invalid token' });
        }
      } 
      else 
      {
        res.status(400).json({ error: 'Invalid authorization header format' });
      }
    } 
    else 
    {
      if (candidate)
      {
        const isMatch = await candidate.comparePassword(password);

        if (isMatch) 
        {
          const token = candidate.generateToken();
          return res.status(200).json({ message: 'Authentication successful', token });
        }
      }

      return res.status(401).json({ message: 'Authentication failed. Invalid email or password' });
    }
  } 
  catch (error) 
  {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;