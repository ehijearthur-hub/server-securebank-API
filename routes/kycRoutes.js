const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../config/multer');

const {
    uploadKYC,
    getMyKYC,
    getALLKYC
} = require('../controllers/kycController');


router.post(
    "/upload",
    protect,
    upload.single("document"),
    uploadKYC
);


router.get(
    "/my-kyc",
    protect,
    getMyKYC
);


router.get(
    "/all",
    protect,
    adminMiddleware,
    getALLKYC
);


module.exports = router;