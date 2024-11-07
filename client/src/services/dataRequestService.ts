/**
 * Represents a generic API response.
 *
 * @template T - The type of the items in the transaction list.
 *
 * @property {string} [name] - The name associated with the response.
 * @property {string} [accountNumber] - The account number associated with the response.
 * @property {T[]} [transactionList] - A list of transactions of type T.
 * @property {string} [balance] - The balance associated with the response.
 * @property {string} [message] - A message associated with the response.
 */
interface ApiResponse<T> {
  name?: string;
  accountNumber?: string;
  transactionList?: T[];
  balance?: string;
  message?: string;
}

/**
 * Fetches the username of the currently authenticated user.
 *
 * @returns {Promise<string | undefined>} A promise that resolves to the username if successful, or undefined if an error occurs.
 * @throws Will throw an error if no token is found in local storage or if the fetch request fails.
 */
export async function getUserName(): Promise<string | undefined> {
    try {
      const token = localStorage.getItem('token');
      if (!(token != null && token.length > 0)) {
        throw new Error('No token found');
      }
      
      const response = await fetch('https://localhost:3000/api/user/getUserName', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const result = await response.json() as ApiResponse<never>;
        return result.name;
      } else {
        const error = await response.json() as ApiResponse<never>;
        throw new Error(error.message ?? 'Failed to fetch username');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching username:', errorMessage);
      return undefined;
    }
}
  
/**
 * Fetches the user's account number from the server.
 *
 * @returns {Promise<string | undefined>} A promise that resolves to the account number as a string, or undefined if an error occurs.
 *
 * @throws {Error} Throws an error if no token is found in local storage or if the fetch request fails.
 *
 * The function performs the following steps:
 * 1. Retrieves the token from local storage.
 * 2. If the token is not found or is empty, throws an error.
 * 3. Sends a GET request to the server to fetch the account number, including the token in the Authorization header.
 * 4. If the response is successful, parses and returns the account number from the response.
 * 5. If the response is not successful, parses and throws an error with the message from the response.
 * 6. Catches any errors that occur during the process, logs the error message, and returns undefined.
 */
export async function getUserAccountNum(): Promise<string | undefined> {
    try {
      const token = localStorage.getItem('token');
      if (!(token != null && token.length > 0)) {
        throw new Error('No token found');
      }
      
      const response = await fetch('https://localhost:3000/api/user/getaccountNum', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const result = await response.json() as ApiResponse<never>;
        return result.accountNumber;
      } else {
        const error = await response.json() as ApiResponse<never>;
        throw new Error(error.message ?? 'Failed to fetch account number');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching account number:', errorMessage);
      return undefined;
    }
}

/**
 * Represents a financial transaction.
 * 
 * @interface Transaction
 * 
 * @property {string} _id - Unique identifier for the transaction.
 * @property {string} senderAccountNumber - Account number of the sender.
 * @property {string} senderLookupHash - Lookup hash for the sender.
 * @property {string} recipientName - Name of the recipient.
 * @property {string} recipientBank - Bank of the recipient.
 * @property {string} recipientAccountNumber - Account number of the recipient.
 * @property {string} recipientLookupHash - Lookup hash for the recipient.
 * @property {Object} transferAmount - Object containing the transfer amount.
 * @property {string} transferAmount.$numberDecimal - Decimal representation of the transfer amount.
 * @property {string} currency - Currency of the transaction.
 * @property {string} swiftCode - SWIFT code for the transaction.
 * @property {string} [transactionDescription] - Optional description of the transaction.
 * @property {string} transactionDate - Date of the transaction.
 * @property {'pending' | 'approved' | 'denied' | 'completed'} approvalStatus - Approval status of the transaction.
 */
interface Transaction {
  _id: string;
  senderAccountNumber: string;
  senderLookupHash: string;
  recipientName: string;
  recipientBank: string;
  recipientAccountNumber: string;
  recipientLookupHash: string;
  transferAmount: {
    $numberDecimal: string;
  };
  currency: string;
  swiftCode: string;
  transactionDescription?: string;
  transactionDate: string;
  approvalStatus: 'pending' | 'approved' | 'denied' | 'completed';
}

/**
 * Fetches the list of payments from the server.
 *
 * This function retrieves the payments by making an HTTP GET request to the
 * specified endpoint. It requires a valid token to be present in the local storage.
 * If the token is not found or is invalid, an error is thrown. If the request is
 * successful, the list of transactions is returned. In case of an error, it logs
 * the error message and returns undefined.
 *
 * @returns {Promise<Transaction[] | undefined>} A promise that resolves to the list of transactions or undefined if an error occurs.
 * @throws {Error} If no token is found or if the request fails.
 */
export async function getPayments(): Promise<Transaction[] | undefined> {
    try {
      const token = localStorage.getItem('token');
      if (!(token != null && token.length > 0)) {
        throw new Error('No token found');
      }
  
      const response = await fetch('https://localhost:3000/api/transaction/getPayments', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const result = await response.json() as ApiResponse<Transaction>;
        return result.transactionList;
      } else {
        const error = await response.json() as ApiResponse<never>;
        throw new Error(error.message ?? 'Failed to fetch payments');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching payments:', errorMessage);
      return undefined;
    }
}
  
/**
 * Fetches the user's balance from the server.
 *
 * @returns {Promise<string | undefined>} A promise that resolves to the user's balance as a string, or undefined if an error occurs.
 *
 * @throws {Error} Throws an error if no token is found in localStorage or if the fetch request fails.
 */
export async function getBalance(): Promise<string | undefined> {
    try {
      const token = localStorage.getItem('token');
      if (!(token != null && token.length > 0)) {
        throw new Error('No token found');
      }
  
      const response = await fetch('https://localhost:3000/api/user/getBalance', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const result = await response.json() as ApiResponse<never>;
        return result.balance;
      } else {
        const error = await response.json() as ApiResponse<never>;
        throw new Error(error.message ?? 'Failed to fetch balance');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching balance:', errorMessage);
      return undefined;
    }
}
