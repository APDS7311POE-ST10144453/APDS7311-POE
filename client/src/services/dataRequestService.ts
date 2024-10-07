export async function getUserName() {
    try {
      // Retrieve the token from localStorage (if stored there)
      const token = localStorage.getItem('token');
      
      // Send request to server to fetch the user's name
      const response = await fetch('https://localhost:3000/api/user/getUserName', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Send the JWT token in the Authorization header
          'Content-Type': 'application/json',
        },
      });
  
      // Check if request was successful
      if (response.ok) {
        const result = await response.json();
        console.log("Username:", result.name);
        return result.name; // Return the username
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch username');
      }
    } catch (error: any) {
      console.error('Error fetching username:', error.message);
    }
  }
  
export async function getUserAccountNum() {
    try {
      // Retrieve the token from localStorage (if stored there)
      const token = localStorage.getItem('token');
      
      // Send request to server to fetch the user's name
      const response = await fetch('https://localhost:3000/api/user/getaccountNum', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Send the JWT token in the Authorization header
          'Content-Type': 'application/json',
        },
      });
  
      // Check if request was successful
      if (response.ok) {
        const result = await response.json();
        console.log("accountNumber:", result.accountNumber);
        return result.accountNumber; // Return the username
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch accountNumber');
      }
    } catch (error: any) {
      console.error('Error fetching accountNumber:', error.message);
    }
  }

  export async function getPayments() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
  
      const response = await fetch('https://localhost:3000/api/transaction/getPayments', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const result = await response.json();
        return result.transactionList;  // Returns the list of transactions
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch payments');
      }
    } catch (error: any) {
      console.error('Error fetching payments:', error.message);
    }
  }
  
  export async function getBalance() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
  
      const response = await fetch('https://localhost:3000/api/user/getBalance', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const result = await response.json();
        return result.balance; 
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch data');
      }
    } catch (error: any) {
      console.error('Error fetching data:', error.message);
    }
  }