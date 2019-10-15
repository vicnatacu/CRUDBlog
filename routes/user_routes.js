const express = require('express');
const router = express.Router();
const {removeUser, changeUser, checkRequiresAdmin} = require('../controllers/user_controller');
const {isAdmin, userAuthenticated} = require('../utils/common_utilities')

router.use(userAuthenticated);

router.put('/id', checkRequiresAdmin, changeUser);

router.delete('/:id', isAdmin, removeUser);

module.exports = router;