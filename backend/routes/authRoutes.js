const express = require('express');
const passport = require('passport');
const generateToken = require('../utils/generateToken');
const router = express.Router();

// @desc    Auth with Google
// @route   GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        // Successful authentication, redirect to client with token
        const token = generateToken(req.user._id);
        res.redirect(`${process.env.CLIENT_URL}/login-success?token=${token}`);
    }
);

module.exports = router;
