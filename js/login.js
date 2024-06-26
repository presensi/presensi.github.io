document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const loginDetails = {
        email: email,
        password: password
    };

    try {
        const response = await fetch('https://asia-southeast2-presensi-423310.cloudfunctions.net/cekin/data/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginDetails)
        });

        if (response.ok) {
            const user = await response.json();
            // Store user information in local storage or cookie if needed
            // Redirect to the admin dashboard
            window.location.href = 'https://presensi.github.io/dashboard-admin.html';
        } else {
            document.getElementById("error").style.display = "block";
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("error").style.display = "block";
    }
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