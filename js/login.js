document.getElementById('learn-more').addEventListener('click', function() {
    window.scrollTo({
        top: document.querySelector('.content').offsetTop - 60,  // Adjust for fixed navbar
        behavior: 'smooth'
    });
});

// Add a scroll event listener to change the navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const forgotPasswordLink = document.getElementById('forgot-password');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const resetForm = document.getElementById('reset-form');

    forgotPasswordLink.addEventListener('click', function(event) {
        event.preventDefault();
        loginForm.classList.toggle('hidden');
        forgotPasswordForm.classList.toggle('hidden');
    });

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email === "test@example.com" && password === "password123") {
            alert('Login successful!');
        } else {
            alert('Invalid email or password.');
        }
    });

    resetForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const resetEmail = document.getElementById('reset-email').value;
        alert(`Password reset link sent to ${resetEmail}`);
    });
});
