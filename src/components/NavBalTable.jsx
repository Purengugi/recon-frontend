import React, { useState, useEffect } from 'react';
import { SearchBar, DataTable, SummaryStats, Modal } from './NavBalComponents.jsx';
import { navBalService } from '../utils/navBalUtils.js';

const NavBalTable = () => {
  const [navBalData, setNavBalData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    const data = await navBalService.fetchAll();
    setNavBalData(data);
    setLoading(false);
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
        const success = await navBalService.create(formData);
        if (success) {
          fetchNavBalData();
        }
      } else if (modalType === 'edit') {
        const updatedData = navBalData.map(item =>
          item.nbCustId === selectedItem.nbCustId ? {
            ...formData,
            nbCustId: parseInt(formData.nbCustId),
            nbNavBal: parseFloat(formData.nbNavBal),
            nbBillBal: parseFloat(formData.nbBillBal),
            nbPdId: parseInt(formData.nbPdId),
            nbClientId: parseInt(formData.nbClientId)
          } : item
        );
        setNavBalData(updatedData);
      } else if (modalType === 'delete') {
        const success = await navBalService.delete(selectedItem.nbCustId);
        if (success) {
          fetchNavBalData();
        } else {
          const updatedData = navBalData.filter(item => item.nbCustId !== selectedItem.nbCustId);
          setNavBalData(updatedData);
        }
      } else if (modalType === 'removeAll') {
        setNavBalData([]);
      }
      closeModal();
    } catch (error) {
      console.error('Error handling submit:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container-fluid p-4">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          onAddClick={() => openModal('add')}
        />

        <DataTable
          data={filteredData}
          onEdit={(item) => openModal('edit', item)}
          onDelete={(item) => openModal('delete', item)}
        />

        {filteredData.length > 0 && (
          <div className="mt-3">
            <button
              className="btn btn-danger"
              onClick={() => openModal('removeAll')}
            >
              Remove All
            </button>
          </div>
        )}

        <SummaryStats data={filteredData} />

        <Modal
          show={showModal}
          modalType={modalType}
          formData={formData}
          selectedItem={selectedItem}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      </div>

      <style jsx>{`
        @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');
        
        .table-hover tbody tr:hover {
          background-color: rgba(0, 0, 0, 0.025);
        }
        
        .card {
          border: none;
          border-radius: 8px;
        }
        
        .btn {
          border-radius: 6px;
        }
        
        .badge {
          font-size: 0.75rem;
          padding: 0.35rem 0.65rem;
        }
        
        .modal {
          z-index: 1050;
        }
        
        .modal-dialog {
          margin: 1.75rem auto;
        }
        
        .btn-close {
          background: none;
          border: none;
          font-size: 1.25rem;
          font-weight: bold;
          opacity: 0.5;
          cursor: pointer;
        }
        
        .btn-close:hover {
          opacity: 0.8;
        }
        
        .btn-close::before {
          content: '×';
        }
      `}</style>
    </div>
  );
};

export default NavBalTable;