const express = require('express');
const router = express.Router();
const config = require('config')
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const request = require('request');

router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5sort=created:asc&client_id${config.get('githubClientID')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: {'user-agent': 'node.js'}
        }

        request(options, (error, response, body) => {
            if (error) console.error(error);
            if (response.statusCode != 200) {
                return res.status(404).json({msg: 'No GitHub profile found'});
            }
            res.json(JSON.parse(body));
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})

module.exports = router;