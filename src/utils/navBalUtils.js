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
      const response = await fetch('http://102.217.125.3:8088/api/navbal/all/getAllNavBals?page=0&size=10&sortBy=nbId');
      if (response.ok) {
        const data = await response.json();
        return data.map(item => ({
          ...item,
          status: item.status || 'Active'
        }));
      }
      throw new Error('Failed to fetch data');
    } catch (error) {
      console.error('Error fetching data:', error);
      return [
        {
          nbCustId: 12345,
          nbNavBal: 100000.50,
          nbBillBal: 50000.25,
          nbPdId: 67890,
          nbClientId: 54321,
          nbDate: "2025-06-23T00:00:00",
          status: 'Active'
        }
      ];
    }
  },

  // ✅ Get by ID
  async fetchById(id) {
    try {
       const response = await fetch('http://102.217.125.3:8088/api/navbal/getNavBalById?id=1');
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to fetch record');
      }
    } catch (error) {
      console.error(`Error fetching item by ID ${id}:`, error);
      return null;
    }
  },

  // ✅ Delete by ID
  async delete(id) {
    try {
      const response = await fetch('http://102.217.125.3:8088/api/navbal/deleteNavBal?id=1', {
        method: 'DELETE'
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting item:', error);
      return false;
    }
  },

  // ✅ Create new NavBal
  async create(data) {
    try {
      const response = await fetch('http://102.217.125.3:8088/api/navbal/createNavBal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          nbCustId: parseInt(data.nbCustId),
          nbNavBal: parseFloat(data.nbNavBal),
          nbBillBal: parseFloat(data.nbBillBal),
          nbPdId: parseInt(data.nbPdId),
          nbClientId: parseInt(data.nbClientId)
        })
      });
      return response.ok;
    } catch (error) {
      console.error('Error creating data:', error);
      return false;
    }
  }
};
