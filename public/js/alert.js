/* eslint-disable */

export const hideElement = () => {
  const alertDiv = document.querySelector('.alert');

  if (alertDiv) alertDiv.remove();
};

export const showAlert = (msg, type) => {
  hideElement();

  const alert = `<div class='alert alert--${type}'>${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', alert);

  setTimeout(() => {
    hideElement();
  }, 5000);
};
