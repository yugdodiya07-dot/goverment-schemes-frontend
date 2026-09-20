export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Approved':
      return 'bg-success text-white';
    case 'Under Verification':
    case 'Document Verified':
      return 'bg-warning text-dark';
    case 'Rejected':
      return 'bg-danger text-white';
    case 'Submitted':
    default:
      return 'bg-info text-white';
  }
};
