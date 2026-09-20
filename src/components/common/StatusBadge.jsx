import React from 'react';

const StatusBadge = ({ status }) => {
  let badgeClass = 'bg-secondary text-white';
  let iconClass = 'bi-clock-history';

  switch (status) {
    case 'Submitted':
      badgeClass = 'bg-info text-white';
      iconClass = 'bi-send-fill';
      break;
    case 'Under Verification':
      badgeClass = 'bg-warning text-dark';
      iconClass = 'bi-person-badge-fill';
      break;
    case 'Document Verified':
      badgeClass = 'bg-primary text-white';
      iconClass = 'bi-file-earmark-check-fill';
      break;
    case 'Approved':
      badgeClass = 'bg-success text-white';
      iconClass = 'bi-check-circle-fill';
      break;
    case 'Rejected':
      badgeClass = 'bg-danger text-white';
      iconClass = 'bi-x-circle-fill';
      break;
    case 'Active':
      badgeClass = 'bg-success text-white';
      iconClass = 'bi-check-lg';
      break;
    case 'Blocked':
      badgeClass = 'bg-danger text-white';
      iconClass = 'bi-slash-circle';
      break;
    case 'Deleted':
      badgeClass = 'bg-dark text-white';
      iconClass = 'bi-trash-fill';
      break;
    default:
      badgeClass = 'bg-secondary text-white';
  }

  return (
    <span className={`badge ${badgeClass} rounded-pill d-inline-flex align-items-center gap-1 px-3 py-2 fw-semibold`}>
      <i className={`bi ${iconClass}`}></i>
      {status}
    </span>
  );
};

export default StatusBadge;
