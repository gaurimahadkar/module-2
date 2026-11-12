
const API_URL = "http://localhost:5000/api";

// Display messages
function showMessage(id, message, success = false) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = message;
        element.className =
            "form-message" + (success ? " success" : "");
    }
}

// Register User
async function registerUser(event) {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!name || !email || !password || !confirmPassword) {
        return showMessage("registerMessage", "Please fill all fields.");
    }

    if (password !== confirmPassword) {
        return showMessage("registerMessage", "Passwords do not match.");
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            return showMessage(
                "registerMessage",
                data.message || "Registration failed."
            );
        }

        showMessage(
            "registerMessage",
            "Registration successful! Please login.",
            true
        );

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);

    } catch (error) {
        console.error("Registration Error:", error);
        showMessage(
            "registerMessage",
            "Cannot connect to server. Please try again."
        );
    }
}

// Login User
async function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        return showMessage("loginMessage", "Please enter email and password.");
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            return showMessage(
                "loginMessage",
                data.message || "Invalid email or password."
            );
        }

        if (!data.token) {
            return showMessage(
                "loginMessage",
                "Login response does not contain a token. Check authController.js."
            );
        }

        localStorage.setItem("inkspireToken", data.token);
        localStorage.setItem(
            "inkspireCurrentUser",
            JSON.stringify(data.user)
        );

        showMessage("loginMessage", "Login successful! Redirecting...", true);

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 700);

    } catch (error) {
        console.error("Login Error:", error);
        showMessage(
            "loginMessage",
            "Cannot connect to server. Please try again."
        );
    }
}

// Form event listeners
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    if (registerForm) {
        registerForm.addEventListener("submit", registerUser);
    }

    if (loginForm) {
        loginForm.addEventListener("submit", loginUser);
    }
});
