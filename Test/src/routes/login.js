const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/loginController');

const loginController = new LoginController();

router.post('/', (req, res) => {
    loginController.loginUser(req, res);
});

module.exports = router;