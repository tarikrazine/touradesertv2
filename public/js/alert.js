/* eslint-disable */

export const hideElement = () => {
  const alertDiv = document.querySelector('.alert');

  if (alertDiv) alertDiv.remove();
};

export const showAlert = (msg, type, time = 7, booking = '') => {
  hideElement();

  const alert = `<div class='alert ${booking} alert--${type}'>${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', alert);

  setTimeout(() => {
    hideElement();
  }, time * 1000);
};
