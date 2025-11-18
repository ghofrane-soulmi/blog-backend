const express = require('express');
const router = express.Router();
const { register, login, getUsers, updateRole ,refreshToken } = require('../controllers/userController');
const { auth, authorizeRoles } = require('../middlewares/auth');


router.post('/register', register);
router.post('/login', login);


router.get('/', auth, authorizeRoles('Admin'), getUsers);
router.put('/:id/role', auth, authorizeRoles('Admin'), updateRole);

router.post('/refresh-token', refreshToken);
module.exports = router;
