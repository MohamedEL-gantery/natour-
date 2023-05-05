/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = stripe(
  'pk_test_51LyhZwEGWJ91Qf5y4pnXG818zZNVX0e7mIIIKKkSgbkcWAmuP76I5NpssEpKKPpH5iJcXazVIgVOn2xMVgXLchVt00iWGfKrTa'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from api
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout from + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
