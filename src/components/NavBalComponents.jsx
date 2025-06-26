import React from 'react';
import { Search, Edit, Trash2, Plus } from 'lucide-react';
import { formatNumber, formatDateTime, formatDateTimeForInput, statusOptions } from '../utils/navBalUtils.js';

export const SearchBar = ({ searchTerm, onSearchChange, onAddClick }) => (
  <div className="row mb-4">
    <div className="col-md-6">
      <div className="input-group">
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
    <div className="col-md-6 text-end">
      <button className="btn btn-primary" onClick={onAddClick}>
        <Plus size={16} className="me-2" />
        Add New Balance
      </button>
    </div>
  </div>
);

export const StatusBadge = ({ status }) => {
  const statusConfig = statusOptions.find(option => option.value === status) || statusOptions[0];
  return (
    <span className={`badge ${statusConfig.color}`}>
      {statusConfig.label}
    </span>
  );
};

export const DataTable = ({ data, onEdit, onDelete }) => (
  <div className="card shadow-sm">
    <div className="card-body p-0">
      <div className="table-responsive">
        <table className="table table-striped table-hover mb-0">
          <thead className="table-light">
            <tr>
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
                <tr key={item.nbCustId}>
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
                <td colSpan="8" className="text-center py-5 text-muted">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export const SummaryStats = ({ data }) => {
  const totalNavBal = data.reduce((sum, item) => sum + item.nbNavBal, 0);
  const totalBillBal = data.reduce((sum, item) => sum + item.nbBillBal, 0);
  const avgNavBal = data.length > 0 ? totalNavBal / data.length : 0;

  return (
    <div className="row mt-4">
      <div className="col-md-3">
        <div className="card bg-primary text-white">
          <div className="card-body">
            <h5 className="card-title">Total Records</h5>
            <h3 className="mb-0">{data.length}</h3>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-success text-white">
          <div className="card-body">
            <h5 className="card-title">Total Nav Balance</h5>
            <h3 className="mb-0">{formatNumber(totalNavBal)}</h3>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-warning text-dark">
          <div className="card-body">
            <h5 className="card-title">Total Bill Balance</h5>
            <h3 className="mb-0">{formatNumber(totalBillBal)}</h3>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-info text-white">
          <div className="card-body">
            <h5 className="card-title">Avg Nav Balance</h5>
            <h3 className="mb-0">{formatNumber(avgNavBal)}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Modal = ({ 
  show, 
  modalType, 
  formData, 
  onInputChange, 
  onSubmit, 
  onClose,
  selectedItem 
}) => {
  if (!show) return null;

  const getTitle = () => {
    switch (modalType) {
      case 'add': return 'Add New Balance';
      case 'edit': return 'Edit Balance';
      case 'delete': return 'Confirm Delete';
      case 'removeAll': return 'Confirm Remove All';
      default: return '';
    }
  };

  const getSubmitButtonText = () => {
    switch (modalType) {
      case 'add': return 'Add Balance';
      case 'edit': return 'Save Changes';
      case 'delete': return 'Delete';
      case 'removeAll': return 'Remove All';
      default: return 'Submit';
    }
  };

  const getSubmitButtonClass = () => {
    return modalType === 'delete' || modalType === 'removeAll' 
      ? 'btn btn-danger' 
      : 'btn btn-primary';
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
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
                    disabled={modalType === 'edit'}
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
                  <label className="form-label">Date & Time </label>
                  <input
  type="datetime-local"
  className="form-control"
  name="nbDate"
  value={formData.nbDate ? formatDateTimeForInput(new Date(formData.nbDate)) : ''}
  onChange={onInputChange}
/>
                </div>
              </div>
            )}
            {modalType === 'delete' && (
              <p>
                Are you sure you want to delete the balance record for Customer ID: <strong>{selectedItem?.nbCustId}</strong>?
              </p>
            )}
            {modalType === 'removeAll' && (
              <p>
                Are you sure you want to remove all balance records? This action cannot be undone.
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
