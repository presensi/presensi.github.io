document.addEventListener('DOMContentLoaded', function() {
  const registerButton = document.getElementById('registerButton');

  registerButton.addEventListener('click', function(event) {
    event.preventDefault();

    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;

    // Validasi sederhana untuk memastikan password dan konfirmasi password sama
    if (password !== confirmPassword) {
      alert('Yahh... Passwordnya ga sama nih kak..!');
      return;
    }

    const data = {
      fullname: fullname,
      email: email,
      password: password,
      confirm_password: confirmPassword
    };

    fetch('https://asia-southeast2-presensi-423310.cloudfunctions.net/cekin/data/adminregister', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Daftar berhasil..!');
        document.getElementById('fullname').value = '';
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        document.getElementById('confirm_password').value = '';
      } else {
        alert('Yahh... Daftar nya tidak berhasil nih kak :( ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    });
  });
});

document.getElementById('showPassword').addEventListener('change', function() {
  const passwordField = document.getElementById('password');
  const confirmPasswordField = document.getElementById('confirm_password');
  if (this.checked) {
      passwordField.type = 'text';
      confirmPasswordField.type = 'text';
  } else {
      passwordField.type = 'password';
      confirmPasswordField.type = 'password';
  }
});