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
  
  // Return in format YYYY-MM-DDTHH:mm
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const navBalService = {
  //Test connection
  async testConnection() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch('http://102.217.125.3:8088/api/navbal/test', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok ? 'API is up' : 'API not reachable';
    } catch (error) {
      console.error('Error testing connection:', error);
      return 'Error connecting to API';
    }
  },

  //Get all NavBals
  async fetchAll() {
    try {
      console.log('Fetching data from API...');
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('http://102.217.125.3:8088/api/navbal/getAllNavBals?page=0&size=100&sortBy=nbId', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('Response received - Status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('API data processed successfully');

        const data = result.content || [];
        const mapped = data.map(item => ({
          ...item,
          status: item.status || 'Active'
        }));
        return { data: mapped, total: result.totalElements || 0 };

      } else {
        console.log('API error, using sample data');
        return this.getSampleData();
      }
    } catch (error) {
      console.log('Network error, using sample data');
      return this.getSampleData();
    }
  },

  // Fast sample data fallback
  getSampleData() {
    return {
      data: [
        {
          nbId: 1,
          nbCustId: 10829,
          nbNavBal: 0,
          nbBillBal: 0,
          nbPdId: 101,
          nbClientId: 10822,
          nbDate: "2025-06-23T00:00:00",
          status: 'Active'
        },
       
      ],
      total: 1
    };
  },

  //Get by ID
  async fetchById(id) {
    try {
      console.log(`Fetching record ID: ${id}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`http://102.217.125.3:8088/api/navbal/getNavBalById?id=${id}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Record fetched successfully');
        return data;
      } else {
        console.log(`Record ${id} not found`);
        return null;
      }
    } catch (error) {
      console.log(`Error fetching record ${id}:`, error.message);
      return null;
    }
  },

  //Delete by ID
  async delete(id) {
    try {
      console.log(`Deleting record ID: ${id}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`http://102.217.125.3:8088/api/navbal/deleteNavBal?id=${id}`, {
        method: 'DELETE',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log(`Delete ${id} - Status:`, response.status);
      
      return response.ok;
    } catch (error) {
      console.log(`Delete ${id} failed:`, error.message);
      return false;
    }
  },

  //Create new NavBal
  async create(data) {
    try {
      console.log('Creating record...');
      const payload = {
        ...data,
        nbCustId: parseInt(data.nbCustId),
        nbNavBal: parseFloat(data.nbNavBal) || 0,
        nbBillBal: parseFloat(data.nbBillBal) || 0,
        nbPdId: parseInt(data.nbPdId),
        nbClientId: parseInt(data.nbClientId)
      };
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('http://102.217.125.3:8088/api/navbal/createNavBal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('Create - Status:', response.status);
      
      return response.ok;
    } catch (error) {
      console.log('Create failed:', error.message);
      return false;
    }
  },

  //Update existing NavBal
  async update(id, data) {
    try {
      console.log(`Updating record ID: ${id}`);
      const payload = {
        ...data,
        nbCustId: parseInt(data.nbCustId),
        nbNavBal: parseFloat(data.nbNavBal) || 0,
        nbBillBal: parseFloat(data.nbBillBal) || 0,
        nbPdId: parseInt(data.nbPdId),
        nbClientId: parseInt(data.nbClientId)
      };
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`http://102.217.125.3:8088/api/navbal/updateNavBal?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log(`Update ${id} - Status:`, response.status);
      
      return response.ok;
    } catch (error) {
      console.log(`Update ${id} failed:`, error.message);
      return false;
    }
  }
};