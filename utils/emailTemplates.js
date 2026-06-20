// Welcome Email
exports.welcomeTemplate = (
    firstName,
    accountNumber
) => `
       <h1>Welcome to SecureBank</h1>
            
       <p>Hello ${user.firstName},</p>
            
       <p>Your account has been created successfully</p>
            
       <p>Account Number: ${account.accountNumber}</p>
            
       <p>Thank you for banking with SecureBank.</p>
       `;



// Deposit Alert Message
exports.depositTemplate = (
    firstName,
    amount,
    balance
) => `
       <h2>Deposit Successful</h2>

       <p>Hello ${firstName}, </p>
            
       <p>Your account has been credited with ${account.currency} ${amount}.</p>
            
       <p>Available Balance: ${account.currency} ${balance}</p>
       `;



// Withdrawal Alert Message
exports.withdrawalTemplate = (
    firstName,
    amount,
    balance
) => `
       <h2>Withdrawal Successful</h2>

       <p>Hello ${firstName}, </p>
            
       <p>Your account has been debited with ${account.currency} ${amount}.</p>
            
       <p>Available Balance: ${account.currency} ${balance}</p>
       `;



// Debit Alert Message
exports.debitAlertTemplate = (
    firstName,
    amount,
    receiverAccount,
    balance, 
    reference
) => `
       <h2>Transfer Successful</h2>

       <p>Hello ${firstName}, </p>
            
       <p>Your account has been debited ${account.currency} ${amount}.</p>

       <p><strong>Recipient Account:</strong> ${receiverAccount}</p>

       <p><strong>Reference:</strong> ${reference}</p>
            
       <p>Available Balance: ${account.currency} ${balance}</p>
       
       <p>Thank you for banking with SecureBank.</p>
       `;



// Credit Alert Message
exports.creditAlertTemplate = (
    firstName,
    amount,
    senderAccount,
    balance, 
    reference
) => `
       <h2>Funds Received</h2>

       <p>Hello ${firstName}, </p>
            
       <p>Your account has been credited ${account.currency} ${amount}.</p>

       <p><strong>Sender Account:</strong> ${senderAccount}</p>

       <p><strong>Reference:</strong> ${reference}</p>
            
       <p>Available Balance: ${account.currency} ${balance}</p>
       
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