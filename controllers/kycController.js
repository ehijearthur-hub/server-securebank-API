const KYC = require('../models/KYC');
const cloudinary = require('../config/cloudinary');


// Endpoint to upload KYC Document
exports.uploadKYC = async (req, res, next) => {
    try {
        const { documentType } = req.body;

        if (!documentType) {
            res.status(400);
            throw new Error("Document type is required");
        };
        
        if (!req.file) {
            res.status(400);
            throw new Error("Please upload a document");
        }
        
        const result = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: "securebank/kyc"
            }
        );

        const kyc = await KYC.create({
            user: req.user._id,
            documentType,
            documentUrl: result.secure_url
        });

        res.status(201).json({ message: "KYC uploaded successfully", kyc });

    } catch (error) {

        next(error);

    }
};

   

// Endpoint to get logged-in user's KYC
exports.getMyKYC = async (req, res, next) => {
    try {
        const kyc = await KYC.findOne({
            user: req.user._id
        });

        if (!kyc) {
            res.status(404);
            throw new Error("KYC record not found");
        }
    } catch (error) {

        next(error);

    }
};



// Endpoint to get all KYC Records
exports.getALLKYC = async (req, res, next) => {
    try {
        const kycRecords = await KYC.find().populate(
            "user",
            "firstName lastName email"
        );

        res.status(200).json(kycRecords);
 
    } catch (error) {

        next(error)

    }
};