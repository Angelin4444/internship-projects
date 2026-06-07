/*
Contact Form JavaScript
Description: JavaScript for form validation and user feedback in the glass morphism contact form
*/

// DOM elements for form and input fields
const form = document.getElementById('contactForm');
const fullName = document.getElementById('fullName');
const email = document.getElementById('email');
const subject = document.getElementById('subject');
const message = document.getElementById('message');
const successMessage = document.getElementById('successMessage');

// Function to show error message for an input field
function showError(input, message) {
  const error = input.parentElement.querySelector('.error');
  error.textContent = message;
}

// Function to clear error message for an input field
function clearError(input) {
  const error = input.parentElement.querySelector('.error');
  error.textContent = '';
}

// Function to validate email format using regex
function validateEmail(emailValue) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(emailValue);
}

// Event listener for form submission with validation
form.addEventListener('submit', function(e) {
  e.preventDefault();
  let isValid = true;

  // Validate full name field
  if (fullName.value.trim() === '') {
    showError(fullName, 'Full Name is required');
    isValid = false;
  } else {
    clearError(fullName);
  }

  // Validate email field
  if (email.value.trim() === '') {
    showError(email, 'Email is required');
    isValid = false;
  } else if (!validateEmail(email.value.trim())) {
    showError(email, 'Enter a valid email');
    isValid = false;
  } else {
    clearError(email);
  }

  // Validate subject field
  if (subject.value.trim() === '') {
    showError(subject, 'Subject is required');
    isValid = false;
  } else {
    clearError(subject);
  }

  // Validate message field
  if (message.value.trim() === '') {
    showError(message, 'Message is required');
    isValid = false;
  } else {
    clearError(message);
  }

  // Process form if all validations pass
  if (isValid) {
    successMessage.textContent = 'Message sent successfully!';
    form.reset();
  } else {
    successMessage.textContent = '';
  }
});