export const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getDefaultDueDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toISOString().split('T')[0];
};

export const extractErrorMessage = (error) => {
  const response = error?.response?.data;
  if (response?.data && typeof response.data === 'object') {
    const messages = Object.values(response.data);
    if (messages.length > 0) return messages.join(', ');
  }
  return response?.message || error.message || 'Something went wrong';
};
