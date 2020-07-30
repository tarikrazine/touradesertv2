/* eslint-disable */
import axios from 'axios';

import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51H9c8NBfbiiusskymnxibHCv2tl1jkXSu8hiViXvkMh1U9kgpOZrv3uH17uK26z9pSbUisNb17aniiJX3GNUMPF800GIM6uMG9'
);

export const bookTour = async (tourID) => {
  try {
    //Get checkout session from API
    const session = await axios(
      `http://localhost:3000/api/v1/booking/checkout-session/${tourID}`
    );

    // Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert(err, 'error');
  }
};
