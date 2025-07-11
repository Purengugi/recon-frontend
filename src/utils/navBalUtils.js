export const API_BASE_URL = 'http://102.217.125.3:8088/api/navbal';

export const statusOptions = [
  { value: 'Active', color: 'bg-success', label: 'Active' },
  { value: 'Inactive', color: 'bg-secondary', label: 'Inactive' },
  { value: 'Pending', color: 'bg-warning text-dark', label: 'Pending' },
  { value: 'Suspended', color: 'bg-danger', label: 'Suspended' },
  { value: 'Under Review', color: 'bg-info', label: 'Under Review' }
];

export const formatNumber = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const dateStr = date.toLocaleDateString('en-CA');
  const timeStr = date.toLocaleTimeString('en-GB', { hour12: false });
  return `${dateStr} ${timeStr}`;
};

export const formatDateTimeForInput = (date) => {
  // Format date to YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // Format time to HH:mm
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  // Return in format YYYY-MM-DDTHH:mm (required by datetime-local input)
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const navBalService = {
  // ✅ Test connection
  async testConnection() {
    try {
      const response = await fetch('http://102.217.125.3:8088/api/navbal/test');
      return response.ok ? 'API is up' : 'API not reachable';
    } catch (error) {
      console.error('Error testing connection:', error);
      return 'Error connecting to API';
    }
  },

  // ✅ Get all NavBals
  async fetchAll() {
  try {
    console.log('Attempting to fetch data from API...');
    const response = await fetch('http://102.217.125.3:8088/api/navbal/getAllNavBals?page=0&size=10&sortBy=nbId');
    
    console.log('Response status:', response.status);
    console.log('Response OK:', response.ok);
    
    if (response.ok) {
      const result = await response.json();
      console.log('API data received:', result);

      // Access the actual list from result.content
      const data = result.content || [];
      return data.map(item => ({
        ...item,
        status: item.status || 'Active'
      }));
    } else {
      console.error('API returned error status:', response.status);
      const errorText = await response.text();
      console.error('Error response:', errorText);
        // Return the sample data for now so the app doesn't break
        return [
          {
            nbId: 1,
            nbCustId: 10829,
            nbNavBal: 0,
            nbBillBal: 0,
            nbPdId: 101,
            nbClientId: 10822,
            nbDate: "2025-06-23T00:00:00",
            status: 'Active'
          }
        ];
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Return sample data so the app doesn't break
      return [
        {
          nbId: 1,
          nbCustId: 10829,
          nbNavBal: 0,
          nbBillBal: 0,
          nbPdId: 101,
          nbClientId: 10822,
          nbDate: "2025-06-23T00:00:00",
          status: 'Active'
        }
      ];
    }
  },

  // ✅ Get by ID
  async fetchById(id) {
    try {
      console.log(`Fetching record with ID: ${id}`);
      const response = await fetch(`http://102.217.125.3:8088/api/navbal/getNavBalById?id=${id}`);
      
      console.log('Response status:', response.status);
      console.log('Response OK:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('API data received:', data);
        return data;
      } else {
        console.error('API returned error status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch record with ID ${id}`);
      }
    } catch (error) {
      console.error(`Error fetching item by ID ${id}:`, error);
      return null;
    }
  },

  // ✅ Delete by ID
  async delete(id) {
    try {
      console.log(`Deleting record with ID: ${id}`);
      
      const response = await fetch(`http://102.217.125.3:8088/api/navbal/deleteNavBal?id=${id}`, {
        method: 'DELETE'  
      });
      
      console.log('Delete response status:', response.status);
      console.log('Delete response OK:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete error response:', errorText);
      }
      
      return response.ok;
    } catch (error) {
      console.error('Error deleting item:', error);
      return false;
    }
  },

  // ✅ Create new NavBal
  async create(data) {
    try {
      console.log('Creating new record with data:', data);
      const payload = {
        ...data,
        nbCustId: parseInt(data.nbCustId),
        nbNavBal: parseFloat(data.nbNavBal),
        nbBillBal: parseFloat(data.nbBillBal),
        nbPdId: parseInt(data.nbPdId),
        nbClientId: parseInt(data.nbClientId)
      };
      
      console.log('Payload being sent:', payload);
      
      
      const methods = ['POST', 'PUT'];
      
      for (const method of methods) {
        console.log(`Trying ${method} method...`);
        const response = await fetch('http://102.217.125.3:8088/api/navbal/createNavBal', {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
        
        console.log(`${method} response status:`, response.status);
        console.log(`${method} response OK:`, response.ok);
        
        if (response.ok) {
          return true;
        } else if (response.status !== 405) {
          
          const errorText = await response.text();
          console.error(`${method} error response:`, errorText);
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error creating data:', error);
      return false;
    }
  },

  
  async update(id, data) {
    try {
      console.log(`Updating record with ID: ${id}`, data);
      const payload = {
        ...data,
        nbCustId: parseInt(data.nbCustId),
        nbNavBal: parseFloat(data.nbNavBal),
        nbBillBal: parseFloat(data.nbBillBal),
        nbPdId: parseInt(data.nbPdId),
        nbClientId: parseInt(data.nbClientId)
      };
      
      console.log('Update payload being sent:', payload);
      
      
      const methods = ['PUT', 'POST'];
      
      for (const method of methods) {
        console.log(`Trying ${method} method for update...`);
        const response = await fetch(`http://102.217.125.3:8088/api/navbal/updateNavBal?id=${id}`, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
        
        console.log(`${method} update response status:`, response.status);
        console.log(`${method} update response OK:`, response.ok);
        
        if (response.ok) {
          return true;
        } else if (response.status !== 405) {
          
          const errorText = await response.text();
          console.error(`${method} update error response:`, errorText);
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error updating data:', error);
      return false;
    }
  }
};