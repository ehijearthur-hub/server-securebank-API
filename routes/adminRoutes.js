const express = require('express');
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const adminMiddleware = require('../middleware/adminMiddleware');


const {
    getAllUsers,
    freezeAccount,
    activateAccount,
    getAllTransactions,
    approveKYC,
    rejectKYC
} = require('../controllers/adminController');

router.get(
    "/users",
    protect,
    adminMiddleware,
    getAllUsers
);

router.get(
    "/transactions",
    protect,
    adminMiddleware,
    getAllTransactions
);

router.put(
    "/freeze/:accountNumber",
    protect,
    adminMiddleware,
    freezeAccount
);

router.put(
    "/activate/:accountNumber",
    protect,
    adminMiddleware,
    activateAccount
);

router.put(
    "/approve-kyc/:id",
    protect,
    adminMiddleware,
    approveKYC
);

router.put(
    "/reject-kyc/:id",
    protect,
    adminMiddleware,
    rejectKYC
);


module.exports = router;