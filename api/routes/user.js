const express = require('express');
const User = require('../models/userModel');
const router = express.Router();

router.get('/', async (req, res) => {
  try 
  {
    const users = await User.findAll({
      attributes: {
        exclude: ['password']
      },
    });

    return res.status(200).json(users);
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
    const user = await User.findByPk(id, {
      attributes: { 
        exclude: ['password']
    }
    });

    if (user) 
    {
      return res.status(200).json(user);
    } 
    else 
    {
      return res.status(404).json({ message: 'User not found' });
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
    const decodedToken = User.verifyToken(userToken);

    if (!decodedToken) 
    {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const userId = decodedToken.userId;
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) 
    {
      return res.status(404).json({ message: 'User not found' });
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

    delete otherData.isAdmin;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) 
    {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = User.build({ email, isAdmin: false, ...otherData });
    user.password = await user.hashPassword(password);

    // Generate a token using the user's ID and email
    const token = user.generateToken();

    await user.save();

    return res.status(200).json({ user, token, message: 'User registered successfully' });
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
    const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });

    if (user.isAdmin === true)
    {
      return res.status(400).json({ message: 'User not found' });
    }

    if (req.body.hasOwnProperty('password'))
    {
      const { password, ...otherData } = req.body;

      req.body.password = await user.hashPassword(password);
    }

    if (req.body.hasOwnProperty('telephone'))
    {
      const { telephone, ...otherData } = req.body;

      const existingContact = await User.findOne({ where: { telephone } });

      if (existingContact)
      {
        return res.status(400).json({ message: 'Phone number already exists' });
      }
    }

    if (req.body.hasOwnProperty('email'))
    {
      const { email, ...otherData } = req.body;

      const existingUser = await User.findOne({ where: { email } });

      if (existingUser)
      {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    if (user)
    {
      await user.update(req.body, { where: { id } });
      return res.status(200).json(user);
    }
    else 
    {
      return res.status(404).json({ message: 'User not found' });
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
    const user = await User.findByPk(id);
    if (user.isAdmin === true)
    {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user) 
    {
      await user.destroy();
      return res.status(200).json({ message: 'User deleted successfully' });
    } 
    else 
    {
      return res.status(404).json({ message: 'User not found' });
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
    const user = await User.findOne({ where: { email } });
    console.log('\x1b[32m'+ authorizationHeader +'\x1b[0m');
    if (authorizationHeader) 
    {
      const [bearer, token] = authorizationHeader.split(' ');

      if (bearer === 'Bearer' && token)
      {
        if (user.verifyToken(token))
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
      if (user)
      {
        const isMatch = await user.comparePassword(password);

        if (isMatch) 
        {
          const token = user.generateToken();
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