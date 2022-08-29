const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const config = require('config')
const { check, validationResult } = require('express-validator');

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error')
    }
})

router.post('/', 
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Email not valid').isEmail(),
        check('password', 'Password not valid').isLength({min: 6})
    ],
    async (req, res) => {
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        
        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({
                    errors: [
                        {msg: 'User already exists'}
                    ]
                });
            }

            user = new User({
                name,
                email,
                password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

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
            res.status(500).send("Server error");
        }
});

module.exports = router;