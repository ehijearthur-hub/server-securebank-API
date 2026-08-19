// Welcome Email
exports.welcomeTemplate = (
    firstName,
    accountNumber
) => `
       <h1>Welcome to SecureBank</h1>
            
       <p>Hello ${firstName},</p>
            
       <p>Your account has been created successfully</p>
            
       <p>Account Number: ${accountNumber}</p>
            
       <p>Thank you for banking with SecureBank.</p>
       `;



exports.forgotPasswordTemplate = (
    firstName,
    resetUrl
) => `
       <h2>Password Reset Request</h2>
       
       <p>Hello ${firstname},<p>
       
       <p>We received a request to reset your SecureBank password.</p>
       
       <p>Use the link below to reset your password:</p>
       
       <a href="${resetUrl}">Reset Password</a>
       
       <p>This link will expire in 10 minutes.</p>
       
       <p>If you did not request this, please ignore this email.</p>
       `;



// Deposit Alert Message
exports.depositTemplate = (
    firstName,
    amount,
    balance,
    currency
) => `
       <h2>Deposit Successful</h2>

       <p>Hello ${firstName}, </p>
            
       <p>Your account has been credited with ${currency} ${amount}.</p>
            
       <p>Available Balance: ${currency} ${balance}</p>
       `;



// Withdrawal Alert Message
exports.withdrawalTemplate = (
    firstName,
    amount,
    balance,
    currency
) => `
       <h2>Withdrawal Successful</h2>

       <p>Hello ${firstName}, </p>
            
       <p>Your account has been debited with ${currency} ${amount}.</p>
            
       <p>Available Balance: ${currency} ${balance}</p>
       `;



// Debit Alert Message
exports.debitAlertTemplate = (
    firstName,
    amount,
    receiverAccount,
    balance, 
    reference,
    currency
) => `
       <h2>Transfer Successful</h2>

       <p>Hello ${firstName}, </p>
            
       <p>Your account has been debited ${currency} ${amount}.</p>

       <p><strong>Recipient Account:</strong> ${receiverAccount}</p>

       <p><strong>Reference:</strong> ${reference}</p>
            
       <p>Available Balance: ${currency} ${balance}</p>
       
       <p>Thank you for banking with SecureBank.</p>
       `;



// Credit Alert Message
exports.creditAlertTemplate = (
    firstName,
    amount,
    senderAccount,
    balance, 
    reference,
    currency
) => `
       <h2>Funds Received</h2>

       <p>Hello ${firstName}, </p>
            
       <p>Your account has been credited ${currency} ${amount}.</p>

       <p><strong>Sender Account:</strong> ${senderAccount}</p>

       <p><strong>Reference:</strong> ${reference}</p>
            
       <p>Available Balance: ${currency} ${balance}</p>
       
       <p>Thank you for banking with SecureBank.</p>
       `;


//KYC Approval Message
exports.kycApprovedTemplate = (
    firstName
) => `
       <h2>KYC Verification Approved</h2>

       <p>Hello ${firstName}, </p>
            
       <p>Your identity documents have been verifed successfully.</p>

       <p>You now have full access to SecureBank services.</p>
       `;



// KYC Rejection Message
exports.kycRejectedTemplate = (
    firstName
) => `
       <h2>KYC Verification Rejected</h2>

       <p>Hello ${firstName}, </p>
            
       <p>Unfortunately, your submitted document could not be approved.</p>

       <p>Please upload a valid document and try again.</p>
       `;