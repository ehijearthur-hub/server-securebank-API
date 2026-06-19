const express = require('express');
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
    getAccount,
    getBalance,
    deposit,
    withdraw
} = require("../controllers/accountController");

router.get(
    "/",
    protect,
    getAccount
);

router.post(
    "/balance",
    protect,
    getBalance
);

router.post(
    "/deposit",
    protect,
    deposit
);

router.post(
    "/withdraw",
    protect,
    withdraw
);


module.exports = router;