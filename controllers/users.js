const userRouter = require('express').Router();
const bcrypt = require('bcrypt');
const { response } = require('express');
const User = require('../models/user');

userRouter.post('/', async (request, response, next) => {
    const body = request.body;


    if (!body.username || !body.password) {
        return response.status(400).json({ error: 'username and password must be provided' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    if (body.username.length < 3) {
        return response.status(400).json({ error: 'username is too short' });
    }

    if (body.password.length < 3) {
        return response.status(400).json({ error: 'password is too short' });
    }

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    });

    const savedUser = await user.save().catch(error => next(error));

    response.json(savedUser);
})

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {url: 1, title: 1, author: 1, likes: 1});
    response.json(users);
});

module.exports = userRouter;