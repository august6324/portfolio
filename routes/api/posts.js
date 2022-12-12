const express = require('express')
const router = express.Router()
const {check, validationResult} = require('express-validator/check')
const auth = require('../../middleware/auth')

const Post = require('../../models/Post')
// const Profile = require('../../models/Profile')
const User = require('../../models/User')

// @route   POST api/posts
// @desc    Create a post
// @access  Private

router.post('/', [
    auth,
    [
        check('text', 'Text is required').not().isEmpty(),
    ]
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(req.body)
        return res.status(400).json({ errors: errors.array() })
    }
    
    try {
        const user = await User.findById(req.user.id).select('-passowrd')
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            user: req.user.id
        })

        const post = await newPost.save()

        res.json(post)

    } catch (err) {
        console.error(err)
        return res.status(500).sned('server error')
    }
})

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({date: -1})
        return res.json(posts)
    } catch (err) {
        console.error(err)
        return res.status(500).sned('server error')
    }
})

module.exports = router