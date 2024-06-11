import {postJSON,getJSON} from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import {getCookie} from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";

// Add a scroll event listener to change the navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

window.onload = function()
{
    rc = Cookie.get('message'); //rc == result cookie

    if (rc.boolean === true) {
        var data = JSON.parse(decodeURIComponent(rc.data));
        alert(data.body.replace('+', ' '));
    }
}

function actionfunctionname(){
    let user={
        email:getValue("email"),
        githubusername:getValue("githubusername"),
        gitlabusername:getValue("gitlabusername"),
        githostusername:getValue("githostusername")
    };
    if (getCookie("login")===""){
        redirect("/signin");
    }else{
        postJSON(backend.user.data,"login",getCookie("login"),user,responseFunction);
        hide("buttonkirimaccount");
    }  
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const forgotPasswordLink = document.getElementById('forgot-password');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const resetForm = document.getElementById('reset-form');

    // Mengubah latar belakang navbar saat menggulir
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    forgotPasswordLink.addEventListener('click', function(event) {
        event.preventDefault();
        forgotPasswordForm.classList.toggle('hidden');
    });

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email === "admin@admin.com" && password === "admin") {
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