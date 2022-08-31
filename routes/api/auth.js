const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config')
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

router.post('/', 
    [
        check('email', 'Email not valid').isEmail(),
        check('password', 'Password not valid').exists()
    ],
    async (req, res) => {
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        
        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    errors: [
                        {msg: 'Invalid credentials'}
                    ]
                });
            }
            console.log(user);
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    errors: [
                        {msg: 'Invalid credentials'}
                    ]
                });
            }

            const payload = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
                if (err) {
                    throw err;
                }
                res.json({token});
            });
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
});

module.exports = router;