const express = require('express');
const router = express.Router();
const config = require('config')
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const request = require('request');

router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${}`
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})

module.exports = router;