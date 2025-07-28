import React, { useState } from 'react';
import { Search, Edit, Trash2, Plus, Trash, Calendar, Clock } from 'lucide-react';
import { formatNumber, formatDateTime, statusOptions } from '../utils/navBalUtils.js';
import '../styles.css';

// Header Component
export const Header = () => (
  <header className="bg-primary text-white py-4 shadow-sm text-center">
    <div className="container-fluid">
      <div className="row align-items-center">
        <div className="col-md-8 mx-auto">
          <h1 className="h2 mb-0">Navigation Balance Management System</h1>
          <br></br><p className="mb-0 opacity-75">Manage customer navigation and billing balances</p>
        </div>
      </div>
    </div>
  </header>
);

// Footer Component
export const Footer = () => (
  <footer className="bg-dark text-white py-1 mt-auto footer-fixed text-center">
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <p className="mb-0">&copy; 2025 Navigation Balance System. All rights reserved.</p>
        </div>
        <div className="col-md-6 text-end">
          <small className="text-muted">Version 1.0.0</small>
        </div>
      </div>
    </div>
  </footer>
);

// Summary Stats Component
export const SummaryStats = ({ data }) => {
  const totalNavBal = data.reduce((sum, item) => sum + item.nbNavBal, 0);
  const totalBillBal = data.reduce((sum, item) => sum + item.nbBillBal, 0);
  const avgNavBal = data.length > 0 ? totalNavBal / data.length : 0;

  return (
    <div className="row mb-4">
      <div className="col-md-3 mb-3">
        <div className="card bg-primary-custom text-white h-100 summary-card">
          <div className="card-body">
            <h6 className="card-title mb-2">Total Records</h6>
            <h4 className="mb-0">{data.length}</h4>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-3">
        <div className="card bg-success-custom text-white h-100 summary-card">
          <div className="card-body">
            <h6 className="card-title mb-2">Total Nav Balance</h6>
            <h4 className="mb-0">{formatNumber(totalNavBal)}</h4>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-3">
        <div className="card bg-warning-custom text-black h-100 summary-card">
          <div className="card-body">
            <h6 className="card-title mb-2">Total Bill Balance</h6>
            <h4 className="mb-0">{formatNumber(totalBillBal)}</h4>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-3">
        <div className="card bg-info-custom text-white h-100 summary-card">
          <div className="card-body">
            <h6 className="card-title mb-2">Avg Nav Balance</h6>
            <h4 className="mb-0">{formatNumber(avgNavBal)}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

// Search Bar Component
export const SearchBar = ({ searchTerm, onSearchChange, onAddClick }) => (
  <div className="row mb-4">
    <div className="col-md-8">
      <div className="input-group search-container">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Customer ID, Client ID, or Product ID"
          value={searchTerm}
          onChange={onSearchChange}
        />
        <button className="btn btn-outline-secondary" type="button">
          <Search size={16} />
        </button>
      </div>
    </div>
    <div className="col-md-4 text-end">
      <button className="btn bg-primary-custom text-white" onClick={onAddClick}>
        <Plus size={16} className="me-2" />
        Add New Balance
      </button>
    </div>
  </div>
);

// Status Badge Component
export const StatusBadge = ({ status }) => {
  const statusConfig = statusOptions.find(option => option.value === status) || statusOptions[0];
  return (
    <span className={`badge ${statusConfig.color} status-badge`}>
      {statusConfig.label}
    </span>
  );
};

// Data Table Component with selection
export const DataTable = ({
  data,
  onEdit,
  onDelete,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onDeleteSelected
}) => {
  const isAllSelected = data.length > 0 && selectedItems.length === data.length;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < data.length;

  return (
    <div className="mb-4">
      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="alert alert-info d-flex justify-content-between align-items-center mb-3">
          <span>{selectedItems.length} item(s) selected</span>
          <button
            className="btn btn-danger btn-sm"
            onClick={onDeleteSelected}
          >
            <Trash size={14} className="me-1" />
            Delete Selected
          </button>
        </div>
      )}
     
      <div className="card shadow-sm table-container">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="py-3 px-4" style={{ width: '50px' }}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={isAllSelected}
                      ref={input => {
                        if (input) input.indeterminate = isIndeterminate;
                      }}
                      onChange={onSelectAll}
                    />
                  </th>
                  <th className="py-3 px-4">Customer ID</th>
                  <th className="py-3 px-4">Navigation Balance</th>
                  <th className="py-3 px-4">Bill Balance</th>
                  <th className="py-3 px-4">Product ID</th>
                  <th className="py-3 px-4">Client ID</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item.nbId || item.nbCustId}>
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedItems.includes(item.nbId || item.nbCustId)}
                          onChange={() => onSelectItem(item.nbId || item.nbCustId)}
                        />
                      </td>
                      <td className="py-3 px-4 fw-medium">{item.nbCustId}</td>
                      <td className="py-3 px-4 text-success fw-medium">
                        {formatNumber(item.nbNavBal)}
                      </td>
                      <td className="py-3 px-4 text-warning fw-medium">
                        {formatNumber(item.nbBillBal)}
                      </td>
                      <td className="py-3 px-4">{item.nbPdId}</td>
                      <td className="py-3 px-4">{item.nbClientId}</td>
                      <td className="py-3 px-4">{formatDateTime(item.nbDate)}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            title="Edit"
                            onClick={() => onEdit(item)}
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Delete"
                            onClick={() => onDelete(item)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-5 text-muted">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom Date Time Picker Component
const DateTimePicker = ({ value, onChange, onConfirm, onCancel, show }) => {
  const [tempDate, setTempDate] = useState(value || '');
  const [tempTime, setTempTime] = useState('');

  React.useEffect(() => {
    if (value) {
      const date = new Date(value);
      const dateStr = date.toISOString().split('T')[0];
      const timeStr = date.toTimeString().split(' ')[0].substring(0, 5);
      setTempDate(dateStr);
      setTempTime(timeStr);
    }
  }, [value]);

  const handleOk = () => {
    if (tempDate && tempTime) {
      const combinedDateTime = `${tempDate}T${tempTime}:00`;
      onChange(combinedDateTime);
      onConfirm(combinedDateTime);
    }
  };

  const handleCancel = () => {
    if (value) {
      const date = new Date(value);
      const dateStr = date.toISOString().split('T')[0];
      const timeStr = date.toTimeString().split(' ')[0].substring(0, 5);
      setTempDate(dateStr);
      setTempTime(timeStr);
    }
    onCancel();
  };

  if (!show) return null;

  return (
    <div className="position-absolute bg-white border rounded shadow-lg p-3" style={{ 
      zIndex: 1050, 
      minWidth: '300px',
      top: '100%',
      left: '0'
    }}>
      <div className="mb-3">
        <label className="form-label small text-muted">Date</label>
        <div className="input-group">
          <span className="input-group-text">
            <Calendar size={16} />
          </span>
          <input
            type="date"
            className="form-control"
            value={tempDate}
            style={{ cursor: 'pointer' }}
            onChange={(e) => setTempDate(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label small text-muted">Time</label>
        <div className="input-group">
          <span className="input-group-text">
            <Clock size={16} />
          </span>
          <input
            type="time"
            className="form-control"
            value={tempTime}
            style={{ cursor: 'pointer' }}
            onChange={(e) => setTempTime(e.target.value)}
          />
        </div>
      </div>
      <div className="d-flex justify-content-end gap-2 border-top pt-2">
        <button 
          type="button" 
          className="btn btn-sm btn-secondary"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button 
          type="button" 
          className="btn btn-sm btn-primary"
          onClick={handleOk}
          disabled={!tempDate || !tempTime}
        >
          OK
        </button>
      </div>
    </div>
  );
};

// Modal Component
export const Modal = ({
  show,
  modalType,
  formData,
  onInputChange,
  onSubmit,
  onClose,
  selectedItem,
  selectedItems
}) => {
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

  if (!show) return null;

  const getTitle = () => {
    switch (modalType) {
      case 'add': return 'Add New Balance';
      case 'edit': return 'Edit Balance';
      case 'delete': return 'Confirm Delete';
      case 'deleteSelected': return 'Confirm Delete Selected';
      default: return '';
    }
  };

  const getSubmitButtonText = () => {
    switch (modalType) {
      case 'add': return 'Add Balance';
      case 'edit': return 'Save Changes';
      case 'delete': return 'Delete';
      case 'deleteSelected': return 'Delete Selected';
      default: return 'Submit';
    }
  };

  const getSubmitButtonClass = () => {
    return modalType === 'delete' || modalType === 'deleteSelected'
      ? 'btn btn-danger'
      : 'btn bg-primary-custom text-white';
  };

  const handleDateTimeChange = (newDateTime) => {
    onInputChange({
      target: {
        name: 'nbDate',
        value: newDateTime
      }
    });
  };

  const handleDateTimeConfirm = (newDateTime) => {
    setShowDateTimePicker(false);
  };

  const handleDateTimeCancel = () => {
    setShowDateTimePicker(false);
  };

  const formatDisplayDateTime = (dateTime) => {
    if (!dateTime) return 'Select Date & Time';
    try {
      const date = new Date(dateTime);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Select Date & Time';
    }
  };

  return (
    <div className="modal d-block modal-backdrop-custom">
      <div className="modal-dialog modal-lg modal-dialog-custom">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{getTitle()}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {(modalType === 'add' || modalType === 'edit') && (
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Customer ID</label>
                  <input
                    type="number"
                    className="form-control"
                    name="nbCustId"
                    value={formData.nbCustId}
                    onChange={onInputChange}
                    
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Client ID</label>
                  <input
                    type="number"
                    className="form-control"
                    name="nbClientId"
                    value={formData.nbClientId}
                    onChange={onInputChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Navigation Balance</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name="nbNavBal"
                    value={formData.nbNavBal}
                    onChange={onInputChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Bill Balance</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name="nbBillBal"
                    value={formData.nbBillBal}
                    onChange={onInputChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Product ID</label>
                  <input
                    type="number"
                    className="form-control"
                    name="nbPdId"
                    value={formData.nbPdId}
                    onChange={onInputChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={onInputChange}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Date & Time</label>
                  <div className="position-relative">
                    <div
                      className="form-control d-flex align-items-center justify-content-between cursor-pointer"
                      onClick={() => setShowDateTimePicker(!showDateTimePicker)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span>{formatDisplayDateTime(formData.nbDate)}</span>
                      <Calendar size={16} className="text-muted" />
                    </div>
                    <DateTimePicker
                      show={showDateTimePicker}
                      value={formData.nbDate}
                      onChange={handleDateTimeChange}
                      onConfirm={handleDateTimeConfirm}
                      onCancel={handleDateTimeCancel}
                    />
                  </div>
                </div>
              </div>
            )}
            {modalType === 'delete' && (
              <p>
                Are you sure you want to delete the balance record for Customer ID: <strong>{selectedItem?.nbCustId}</strong>?
              </p>
            )}
            {modalType === 'deleteSelected' && (
              <p>
                Are you sure you want to delete <strong>{selectedItems?.length || 0}</strong> selected record(s)? This action cannot be undone.
              </p>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className={getSubmitButtonClass()} onClick={onSubmit}>
              {getSubmitButtonText()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};