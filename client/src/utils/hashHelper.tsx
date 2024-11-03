import crypto from 'crypto';

export const createLookupHash = (accountNumber: string): string => {
    const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY;
    
    if (ENCRYPTION_KEY == null) {
        throw new Error('REACT_APP_ENCRYPTION_KEY environment variable is not set');
    }

    if(ENCRYPTION_KEY.length === 0) {
        throw new Error('REACT_APP_ENCRYPTION_KEY environment variable is empty');
    }

    // Ensure accountNumber is a string and trim any whitespace
    const normalizedAccountNumber = String(accountNumber).trim();
    
    return crypto
        .createHash('sha256')
        .update(normalizedAccountNumber + ENCRYPTION_KEY)
        .digest('hex');
};