const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

const {
    transferMoney,
    getTransactionHistory,
    getTransactionById
} = require('../controllers/transactionController');


router.post(
    "/transfer",
    protect,
    transferMoney
);

router.get(
    "/",
    protect,
    getTransactionHistory
);

router.get(
    "/:id",
    protect,
    getTransactionById
);


module.exports = router;