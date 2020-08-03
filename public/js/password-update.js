/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alert';

export const passwordUpdate = async (curr, newPass, confirm) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMyPassword',
      data: {
        passwordCurrent: curr,
        password: newPass,
        passwordConfirm: confirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('Your password updated with success!', 'success');
    }
  } catch (err) {
    showAlert(err.response.data.message, 'error');
  }
};
