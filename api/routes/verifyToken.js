const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Company = require('../models/companyModel');
const Employer = require('../models/employerModel');
const jwt = require('jsonwebtoken');
const secretKey = '5Gf6R7Cz$T6aV3PwYbB9qZrGw*HnMxJ1sK3vL8s$VdKfNjQsThWmZp3s6v9yB';

router.post('/', async (req, res) => {
    const { token } = req.body;

    if (!token) return res.status(401).json({ message: 'Token not provided' });
  
    try 
    {
        let role;

        const decoded = jwt.verify(token, secretKey);

        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTimestamp) return false;

        if (await User.findOne({ where: {id: decoded.id, email: decoded.email } }))          role = 'user';
        else if (await Company.findOne({ where: {id: decoded.id, email: decoded.email } }))  role = 'company';
        else if (await Employer.findOne({ where: {id: decoded.id, email: decoded.email } })) role = 'employer';
        else return res.status(401).json({ message: 'User not found' });

        switch (role)
        {
            case 'user':
                const user = await User.findByPk(decoded.id, {
                    attributes: { exclude: ['password'] },
                });
                const userRole = user.isAdmin ? 'admin' : 'candidate';

                return res.status(200).json({ message: 'Token verified', id: user.id, email: user.email, role: userRole });
            
            case 'company':
                const company = await Company.findByPk(decoded.id, {
                    attributes: { exclude: ['password'] },
                });
                return res.status(200).json({ message: 'Token verified', id: company.id, email: company.email, role });
            
            case 'employer':
                const employer = await Employer.findByPk(decoded.id, {
                    attributes: { exclude: ['password'] },
                });
                return res.status(200).json({ message: 'Token verified', id: employer.id, email: employer.email, role });
            
            default:
                throw new Error();
        }
    } 
    catch (error) 
    {
        console.error(error);
        return res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = router;