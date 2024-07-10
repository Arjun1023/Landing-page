// Select The Elements
var toggle_btn;
var big_wrapper;
var hamburger_menu;

function declare() {
  toggle_btn = document.querySelector(".toggle-btn");
  big_wrapper = document.querySelector(".big-wrapper");
  hamburger_menu = document.querySelector(".hamburger-menu");
}

const main = document.querySelector("main");

declare();

let dark = false;

function toggleAnimation() {
  // Clone the wrapper
  dark = !dark;
  let clone = big_wrapper.cloneNode(true);
  if (dark) {
    clone.classList.remove("light");
    clone.classList.add("dark");
  } else {
    clone.classList.remove("dark");
    clone.classList.add("light");
  }
  clone.classList.add("copy");
  main.appendChild(clone);

  document.body.classList.add("stop-scrolling");

  clone.addEventListener("animationend", () => {
    document.body.classList.remove("stop-scrolling");
    big_wrapper.remove();
    clone.classList.remove("copy");
    // Reset Variables
    declare();
    events();
  });
}

function events() {
  toggle_btn.addEventListener("click", toggleAnimation);
  hamburger_menu.addEventListener("click", () => {
    big_wrapper.classList.toggle("active");
  });
}

events();

// Function to open a modal and close others if they are open
function openModal(modalId) {
  // Close any open modals
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.style.display = "none";
    const form = modal.querySelector("form");
    if (form) {
      form.reset(); // Reset the form if it exists
    }
  });

  // Open the requested modal
  document.getElementById(modalId).style.display = "block";
}

// Function to close a modal and reset the form inside it
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
  
  // Reset the form if it exists
  const form = document.querySelector(`#${modalId} form`);
  if (form) {
    form.reset();
  }
}

// Close modal if user clicks outside of it
window.onclick = function (event) {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
    
    // Reset the form if it exists
    const form = event.target.querySelector("form");
    if (form) {
      form.reset();
    }
  }
};

// Add event listeners to login and signup buttons
document.querySelector(".btn").addEventListener("click", (event) => {
  event.preventDefault(); // Prevent default anchor behavior
  openModal("signupModal");
});

// Add form submission handling
document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();
  // Handle login logic here
  alert("Login form submitted!");
  closeModal("loginModal");
});

document.getElementById("signupForm").addEventListener("submit", function (event) {
  event.preventDefault();
  // Handle signup logic here
  alert("Signup form submitted!");
  closeModal("signupModal");
});

// app.js (frontend)
document.getElementById('signupForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const formData = new FormData(this);
  const userData = {
    name: formData.get('signupName'),
    email: formData.get('signupEmail'),
    password: formData.get('signupPassword'),
  };

  try {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Signup failed');
    }

    alert('Signup successful! Please login.');
    closeModal('signupModal'); // Close signup modal if successful
  } catch (error) {
    console.error('Error:', error);
    alert('Signup failed');
  }
});

document.getElementById('loginForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const formData = new FormData(this);
  const userData = {
    email: formData.get('loginEmail'),
    password: formData.get('loginPassword'),
  };

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const { token } = await response.json();
    localStorage.setItem('token', token); // Store JWT token in localStorage
    alert('Login successful!');
    closeModal('loginModal'); // Close login modal if successful
  } catch (error) {
    console.error('Error:', error);
    alert('Login failed');
  }
});
