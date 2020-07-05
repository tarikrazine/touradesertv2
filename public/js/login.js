/* eslint-disable */

// Get login form
const form = document.querySelector('.form');

// Function to send data to the api login
const login = async (email, password) => {
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
      console.log(res.data.message);
      setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log(err.response.data.message);
  }
};

// addListener to the form login
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = form.email.value;
  const password = form.password.value;

  login(email, password);
});
