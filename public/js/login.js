/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alert';

// Function to send data to the api login
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      // Show alert after login complete
      showAlert('Your are log in with success!', 'success');

      // Go to home page after 1500
      setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert(err.response.data.message, 'error');
  }
};
