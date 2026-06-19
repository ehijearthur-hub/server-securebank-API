const generateTransactionReference = () => {

    return `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
};

module.exports = generateTransactionReference;