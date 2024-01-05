class ValidationUtils {
  static validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

}

export default ValidationUtils;
