const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Company = require('../models/companyModel');
const Employer = require('../models/employerModel');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;

router.post('/', async (req, res) => {
    const tokenKey = Object.keys(req.cookies).find(key => key.startsWith('jwt_token'));
    const token = req.cookies[tokenKey];

    if (!token) return res.status(401).json({ message: 'Token not provided' });
  
    try {
        let role;

        const decoded = jwt.verify(token, SECRET_KEY);

        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTimestamp) return false;

        if (await User.findOne({ where: {id: decoded.id, email: decoded.email } }))          role = 'user';
        else if (await Company.findOne({ where: {id: decoded.id, email: decoded.email } }))  role = 'company';
        else if (await Employer.findOne({ where: {id: decoded.id, email: decoded.email } })) role = 'employer';
        else return res.status(401).json({ message: 'User not found' });

        switch (role) {
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
    catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = router;