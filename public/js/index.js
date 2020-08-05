/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login } from './login';
import { logout } from './logout';
import { profileUpdate } from './profile-update';
import { passwordUpdate } from './password-update';
import { bookTour } from './stripe';
import { showAlert } from './alert';

// DOM elements
const mapBox = document.getElementById('map');
const out = document.getElementById('logout');

// Form login
const formLogin = document.getElementById('form-login');

// Form update profile
const formProfile = document.getElementById('form-profile');

// Form password
const formPassword = document.getElementById('form-password');

// Button book tour
const btnBook = document.getElementById('book-tour');

// Delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);

  // Set locations data
  displayMap(locations);
}

// Form login event
if (formLogin) {
  // addListener to the form login
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = formLogin.email.value;
    const password = formLogin.password.value;

    login(email, password);
  });
}

// Log out event
if (out) {
  out.addEventListener('click', logout);
}

// From update profile event
if (formProfile) {
  formProfile.addEventListener('submit', (e) => {
    e.preventDefault();

    /* const name = formProfile.name.value;
    const email = formProfile.email.value; */

    const form = new FormData();

    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    profileUpdate(form);
  });
}

// Form update password event
if (formPassword) {
  formPassword.addEventListener('submit', async (e) => {
    e.preventDefault();

    let btnSavePassword = document.querySelector('.btn--password-save');

    btnSavePassword.textContent = 'Updating...';

    const currentPassword = formPassword.currentPassword.value;
    const newPassword = formPassword.password.value;
    const confirmPassword = formPassword.confirmPassword.value;

    await passwordUpdate(currentPassword, newPassword, confirmPassword);

    formPassword.currentPassword.value = '';
    formPassword.password.value = '';
    formPassword.confirmPassword.value = '';

    btnSavePassword.textContent = 'Save password';
  });
}

// Button book tour
if (btnBook) {
  btnBook.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';

    const tourID = e.target.dataset.tourId;

    bookTour(tourID);
  });
}

// For success booking
const alertMessage = document.querySelector('body').dataset.alert;

if (alertMessage) {
  showAlert(alertMessage, 'success', 20, 'booking');
}
