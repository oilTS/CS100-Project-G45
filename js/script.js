/*
modify from CSTU team for academic purpose
*/

var root = document.querySelector(':root');
var rs = getComputedStyle(root);

const config = {
    backendUrl: "http://localhost:8000/", // Default backend URL
  };
  const port = 8000;

  const lighttheme = document.getElementById("light");
  const darktheme = document.getElementById("dark");
  lighttheme.addEventListener("click", () => {
    updateTheme();
  });
  darktheme.addEventListener("click", () => {
    updateTheme();
  });

  function updateTheme() {
    const lighttheme = document.getElementById("light");
    if (lighttheme.checked) {
      root.style.setProperty('--color-primary', 'black');
      root.style.setProperty('--color-secondary', '#888');
      root.style.setProperty('--color-accent', '#ccc');
      root.style.setProperty('--color-background', 'white');
      root.style.setProperty('--color-highlight', 'skyblue');
      root.style.setProperty('--color-approved', 'green');
      root.style.setProperty('--color-error', 'red');
    } else {
      root.style.setProperty('--color-primary', 'white');
      root.style.setProperty('--color-secondary', '#999');
      root.style.setProperty('--color-accent', '#444');
      root.style.setProperty('--color-background', 'black');
      root.style.setProperty('--color-highlight', '#e3f');
      root.style.setProperty('--color-approved', 'lightblue');
      root.style.setProperty('--color-error', 'orange');
    }
  }
  
  // Function to validate Firstname and Lastname
  function validateName() {
    const fullnameInput = document.getElementById("fullname");
    const names = fullnameInput.value.trim().split(" ");
    const errorElement = document.getElementById("fullnameError");
  
    if (names.length !== 2) {
      errorElement.textContent = "Please enter both your Firstname and Lastname.";
      fullnameInput.style.borderColor = rs.getPropertyValue('--color-error');
      return false;
    } else {
      errorElement.textContent = ""; // Clear the error message when valid
      fullnameInput.style.borderColor = rs.getPropertyValue('--color-approved');
    }
    return true;
  }
  
  // Function to validate Student ID
  function validateStudentID() {
    const studentIDInput = document.getElementById("studentID");
    const studentIDPattern = /^\d{10}$/;
    const errorElement = document.getElementById("studentIDError");
  
    if (!studentIDPattern.test(studentIDInput.value)) {
      errorElement.textContent = "Please enter a 10-digit Student ID.";
      studentIDInput.style.borderColor = rs.getPropertyValue('--color-error');
      return false;
    } else {
      errorElement.textContent = ""; // Clear the error message when valid
      studentIDInput.style.borderColor = rs.getPropertyValue('--color-approved');
    }
    return true;
  }
  
  // Function to validate University Email
  function validateEmail() {
    const emailInput = document.getElementById("email");
    const emailPattern = /^.\..+@dome\.tu\.ac\.th$/;
    const errorElement = document.getElementById("emailError");
  
    if (!emailPattern.test(emailInput.value)) {
      errorElement.textContent =
        "Please provide a valid university email.";
      emailInput.style.borderColor = rs.getPropertyValue('--color-error');
      return false;
    } else {
      errorElement.textContent = ""; // Clear the error message when valid
      emailInput.style.borderColor = rs.getPropertyValue('--color-approved');
    }
    return true;
  }

  function validateDescription() {
    const descriptionInput = document.getElementById("description");
    const errorElement = document.getElementById("descriptionError");
    const lengthCounter = document.getElementById("characterCount");
    const inputLength = descriptionInput.value.length;

    lengthCounter.textContent = inputLength + '/200';

    if (inputLength > 200) {
      errorElement.textContent = "Description must not exceeds 200 characters.";
      fullnameInput.style.borderColor = rs.getPropertyValue('--color-error');
      return false;
    } else {
      errorElement.textContent = ""; // Clear the error message when valid
      fullnameInput.style.borderColor = rs.getPropertyValue('--color-approved');
    }
    return true;
  }
  
  // Function to validate form inputs on user input
  function validateFormOnInput() {
    validateName();
    validateStudentID();
    validateEmail();
    validateDescription();
  }
  
  // Function to fetch activity types from the backend
  async function fetchActivityTypes() {
    try {
      const response = await fetch(`http://${window.location.hostname}:${port}/getActivityType`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Failed to fetch activity types.");
        return [];
      }
    } catch (error) {
      console.error("An error occurred while fetching activity types:", error);
      return [];
    }
  }
  
  // Function to populate activity types in the select element
  function populateActivityTypes(activityTypes) {
    const activityTypeSelect = document.getElementById("activityType");
  
    for (const type of activityTypes) {
      const option = document.createElement("option");
      option.value = type.id;
      option.textContent = type.value;
      activityTypeSelect.appendChild(option);
    }
  }
  
  // Event listener when the page content has finished loading
  document.addEventListener("DOMContentLoaded", async () => {
    const activityTypes = await fetchActivityTypes();
    populateActivityTypes(activityTypes);
  });
  
  // Function to submit the form
  // Function to submit the form
  async function submitForm(event) {
    event.preventDefault();
  
    // Validate form inputs before submission
    if (!validateName() || !validateStudentID() || !validateEmail() || !validateDescription) {
      return;
    }
  
    const startDateInput = document.getElementById("startDate").value;
    const endDateInput = document.getElementById("endDate").value;
    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);
  
    if (endDate <= startDate) {
      alert("End datetime should be after the start datetime.");
      return;
    }
  
    // Create the data object to send to the backend
    const formData = new FormData(event.target);
    const data = {
      first_name: formData.get("fullname").split(" ")[0],
      last_name: formData.get("fullname").split(" ")[1],
      student_id: parseInt(formData.get("studentID")),
      email: formData.get("email"),
      title: formData.get("workTitle"),
      type_of_work_id: parseInt(formData.get("activityType")),
      academic_year: parseInt(formData.get("academicYear")) - 543,
      semester: parseInt(formData.get("semester")),
      start_date: formData.get("startDate"),
      end_date: formData.get("endDate"),
      location: formData.get("location"),
      description: formData.get("description")
    };
  
    console.log(data);
  
    try {
      // Send data to the backend using POST request
      const response = await fetch(`http://${window.location.hostname}:${port}/record`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log("Form data submitted successfully!");
  
        // Format JSON data for display
        const formattedData = Object.entries(responseData.data)
          .map(([key, value]) => `"${key}": "${value}"`)
          .join("\n");
  
        // Display success message with formatted data
        alert(responseData.message + "\n" + formattedData);
  
        document.getElementById("myForm").reset();
      } else {
        console.error("Failed to submit form data.");
  
        // Display error message
        alert("Failed to submit form data. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred while submitting form data:", error);
    }
  }
  
  // Event listener for form submission
  document.getElementById("myForm").addEventListener("submit", submitForm);
  
  // Event listeners for input validation on user input
  document.getElementById("fullname").addEventListener("input", validateName);
  document
    .getElementById("studentID")
    .addEventListener("input", validateStudentID);
  document.getElementById("email").addEventListener("input", validateEmail);
  document.getElementById("description").addEventListener("input", validateDescription);