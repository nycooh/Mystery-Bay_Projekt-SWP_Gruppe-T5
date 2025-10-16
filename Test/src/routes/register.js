const express = require('express');
const router = express.Router();
const RegisterController = require('../controllers/registerController');

const registerController = new RegisterController();

router.post('/', (req, res) => {
    registerController.registerUser(req, res);
});

module.exports = router;