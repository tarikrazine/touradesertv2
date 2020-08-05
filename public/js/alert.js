/* eslint-disable */

export const hideElement = () => {
  const alertDiv = document.querySelector('.alert');

  if (alertDiv) alertDiv.remove();
};

export const showAlert = (msg, type, time = 7) => {
  hideElement();

  const alert = `<div class='alert alert--${type}'>${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', alert);

  setTimeout(() => {
    hideElement();
  }, time * 1000);
};
