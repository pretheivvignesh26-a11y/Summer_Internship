export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const getConditionColor = (condition) => {
  switch (condition) {
    case 'New':
      return 'var(--success-color)';
    case 'Like New':
      return 'var(--info-color)';
    case 'Good':
      return 'var(--warning-color)';
    case 'Fair':
      return 'var(--danger-color)';
    default:
      return 'var(--text-secondary)';
  }
};

export const getBookingStatusClass = (status) => {
  switch (status) {
    case 'Pending':
      return 'status-pending';
    case 'Approved':
      return 'status-approved';
    case 'Rejected':
      return 'status-rejected';
    case 'Cancelled':
      return 'status-cancelled';
    case 'Completed':
      return 'status-completed';
    default:
      return '';
  }
};
