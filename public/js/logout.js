/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alert';

export const logout = async (e) => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    showAlert('Error logging out! try again.', 'error');
  }
};
