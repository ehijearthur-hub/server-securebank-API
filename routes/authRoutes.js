const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    logoutUser,
    getProfile,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');

const protect = require('../middleware/authMiddleware');


router.post(
    "/register",
    registerUser
);

router.post(
    "/login",
    loginUser
);

router.post(
    "/forgot-password",
    forgotPassword
);

router.post(
    "/reset-password/:token",
    resetPassword
);

router.post(
    "/logout",
    logoutUser
);

router.get(
    "/profile",
    protect,
    getProfile
)

module.exports = router;