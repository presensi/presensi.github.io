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

// Add form submission handling
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Message sent!');
});