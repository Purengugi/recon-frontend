import React, { useState, useEffect } from 'react';
import { Header, Footer, SearchBar, DataTable, SummaryStats, Modal } from './NavBalComponents.jsx';
import { navBalService } from '../utils/navBalUtils.js';
import '../styles.css'; 

const NavBalTable = () => {
  const [navBalData, setNavBalData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [nextId, setNextId] = useState(1);
  const [formData, setFormData] = useState({
    nbCustId: '',
    nbNavBal: '',
    nbBillBal: '',
    nbPdId: '',
    nbClientId: '',
    nbDate: '',
    status: 'Active'
  });

  const fetchNavBalData = async () => {
    try {
      const { data, total } = await navBalService.fetchAll();
      setNavBalData(data);
      setTotalRecords(total);
     
      // Set next ID based on existing data
      if (data.length > 0) {
        const maxId = Math.max(...data.map(item => item.nbId || item.nbCustId || 0));
        setNextId(maxId + 1);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNavBalData();
  }, []);

  useEffect(() => {
    const filtered = navBalData.filter(item =>
      item.nbCustId.toString().includes(searchTerm) ||
      item.nbClientId.toString().includes(searchTerm) ||
      item.nbPdId.toString().includes(searchTerm)
    );
    setFilteredData(filtered);
  }, [searchTerm, navBalData]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredData.map(item => item.nbId || item.nbCustId));
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
   
    if (type === 'edit' && item) {
      setFormData({
        nbCustId: item.nbCustId,
        nbNavBal: item.nbNavBal,
        nbBillBal: item.nbBillBal,
        nbPdId: item.nbPdId,
        nbClientId: item.nbClientId,
        nbDate: item.nbDate,
        status: item.status || 'Active'
      });
    } else if (type === 'add') {
      setFormData({
        nbCustId: '',
        nbNavBal: '',
        nbBillBal: '',
        nbPdId: '',
        nbClientId: '',
        nbDate: new Date().toISOString(),
        status: 'Active'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedItem(null);
    setFormData({
      nbCustId: '',
      nbNavBal: '',
      nbBillBal: '',
      nbPdId: '',
      nbClientId: '',
      nbDate: '',
      status: 'Active'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (modalType === 'add') {
        // Create new record with local ID
        const newRecord = {
          nbId: nextId,
          nbCustId: parseInt(formData.nbCustId),
          nbNavBal: parseFloat(formData.nbNavBal) || 0,
          nbBillBal: parseFloat(formData.nbBillBal) || 0,
          nbPdId: parseInt(formData.nbPdId),
          nbClientId: parseInt(formData.nbClientId),
          nbDate: formData.nbDate,
          status: formData.status
        };

        // Update UI immediately
        setNavBalData(prev => [...prev, newRecord]);
        setNextId(prev => prev + 1);
        
        // Try API in background
        navBalService.create(formData).catch(error => 
          console.error('API create failed:', error)
        );
      }
      else if (modalType === 'edit') {
        const updatedRecord = {
          ...selectedItem,
          nbCustId: parseInt(formData.nbCustId),
          nbNavBal: parseFloat(formData.nbNavBal) || 0,
          nbBillBal: parseFloat(formData.nbBillBal) || 0,
          nbPdId: parseInt(formData.nbPdId),
          nbClientId: parseInt(formData.nbClientId),
          nbDate: formData.nbDate,
          status: formData.status
        };

        // Update UI immediately
        setNavBalData(prev =>
          prev.map(item =>
            (item.nbId || item.nbCustId) === (selectedItem.nbId || selectedItem.nbCustId)
              ? updatedRecord
              : item
          )
        );
        
        // Try API in background
        navBalService.update(selectedItem.nbId, formData).catch(error => 
          console.error('API update failed:', error)
        );
      }
      else if (modalType === 'delete') {
        // Update UI immediately
        setNavBalData(prev =>
          prev.filter(item =>
            (item.nbId || item.nbCustId) !== (selectedItem.nbId || selectedItem.nbCustId)
          )
        );
        
        // Try API in background
        navBalService.delete(selectedItem.nbId).catch(error => 
          console.error('API delete failed:', error)
        );
      }
      else if (modalType === 'deleteSelected') {
        setNavBalData(prev =>
          prev.filter(item =>
            !selectedItems.includes(item.nbId || item.nbCustId)
          )
        );
        
        // Try API in background for each selected item
        selectedItems.forEach(itemId => {
          navBalService.delete(itemId).catch(error => 
            console.error(`API delete failed for item ${itemId}:`, error)
          );
        });
        
        setSelectedItems([]);
      }

      closeModal();
    } catch (error) {
      console.error('Error handling submit:', error);
    }
  };

  const handleDeleteSelected = () => {
    setModalType('deleteSelected');
    setShowModal(true);
  };

  // Simple loading 
  if (loading) {
    return (
      <div className="main-container">
        <Header />
        <main className="main-content">
          <div className="container-fluid p-4">
            <div className="text-center py-3">
              <span className="text-muted">Loading...</span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="main-container">
      <Header />
     
      <main className="main-content">
        <div className="container-fluid p-4">
          {/* Summary Stats First */}
          <SummaryStats data={filteredData} />
         
          {/* Search Bar */}
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            onAddClick={() => openModal('add')}
          />
         
          {/* Data Table */}
          <DataTable
            data={filteredData}
            onEdit={(item) => openModal('edit', item)}
            onDelete={(item) => openModal('delete', item)}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            onDeleteSelected={handleDeleteSelected}
          />
        </div>
      </main>
      
      <Footer />
      
      {/* Modal */}
      <Modal
        show={showModal}
        modalType={modalType}
        formData={formData}
        selectedItem={selectedItem}
        selectedItems={selectedItems}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onClose={closeModal}
      />
    </div>
  );
};

export default NavBalTable;