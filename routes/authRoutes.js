const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../model/user')
const router = express.Router()
const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ first_name, last_name, email, password });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




authRouter.post(
    '/login',
    async (req, res, next) => {
        passport.authenticate('login', async (err, user, info) => {
            try {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    const error = new Error('Username or password is incorrect');
                    return next(error);
                }

                req.login(user, { session: false },
                    async (error) => {
                        if (error) return next(error);

                        const body = { _id: user._id, email: user.email };
                        //ADD EXPIRATION TIME, ONCE EXCEEDED, REFRESH TOKEN IS REQUIRED, AND USER IS LOGGED OUT
                        // OR THE USER NEEDS TO LOGIN AGAIN
                        const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: '1h' });

                        return res.json({ token });
                    }
                );
            } catch (error) {
                return next(error);
            }
        }
        )(req, res, next);
    }
);

module.exports = authRouter;