const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authcontroller');
const ScoringMasterController = require('../controllers/scoringMasterController');
const UserController = require('../controllers/userController');
const authentication = require('../middlewares/authentication');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

router.use(authentication);

router.get('/scoring-masters', ScoringMasterController.findAll);

router.post('/users', UserController.create);
router.get('/users', UserController.findAll);
router.get('/users/:id', UserController.findById);
router.put('/users/:id', UserController.update);
router.delete('/users/:id', UserController.delete);

module.exports = router;
