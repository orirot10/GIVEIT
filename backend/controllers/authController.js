const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signUp = async (req, res) => {
    const {
    firstName,
    lastName,
    phone,
    email,
    country,
    city,
    street,
    password
    } = req.body;

    try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
        firstName,
        lastName,
        phone,
        email,
        country,
        city,
        street,
        password: hashedPassword,
    });

    const token = jwt.sign({ _id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
        token,
        user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        },
    });
    } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
    }
    };

const logIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
        });

        res.status(200).json({
        token,
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            city: user.city,
            street: user.street,
            phone: user.phone
        },
        });
        // res.status(200).json({ message: 'User successfully logged in' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
};

module.exports = { logIn, signUp };