export const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  
  return password.length >= 6 && /[a-zA-Z]/.test(password) && /\d/.test(password);
};

export const validatePhone = (phone) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(String(phone));
};
