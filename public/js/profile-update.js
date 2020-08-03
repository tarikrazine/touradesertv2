/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alert';

export const profileUpdate = async (data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMe',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('Your profile updated with success!', 'success');
    }
  } catch (err) {
    showAlert(err.response.data.message, 'error');
  }
};
