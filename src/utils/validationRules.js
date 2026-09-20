export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phone);
};

export const validateAadhaar = (aadharNumber) => {
  const regex = /^\d{12}$/;
  return regex.test(aadharNumber);
};

export const validatePasswordStrength = (password) => {
  // Minimum 8 characters, at least one letter and one number
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return regex.test(password);
};

export const validateFile = (file) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only PDF, JPG, JPEG, or PNG files are permitted.' };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: 'File size must not exceed 5MB.' };
  }
  return { valid: true, error: null };
};
