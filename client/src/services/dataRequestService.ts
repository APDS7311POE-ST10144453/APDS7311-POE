interface ApiResponse<T> {
  name?: string;
  accountNumber?: string;
  transactionList?: T[];
  balance?: string;
  message?: string;
}

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
