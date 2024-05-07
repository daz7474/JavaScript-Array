// Ref to the html elements
const imgContainer = document.querySelector(".img-container");
let img;
const generateImage = document.getElementById("generate-img");
const email = document.getElementById("email");
const submit = document.getElementById("submit");
const select = document.getElementById("select");
const imageToEmail = document.getElementById("add-to-email");
const enterErrorDiv = document.querySelector(".enter-error");
const setErrorDiv = document.querySelector(".set-error");
let enterError = null;
let setError = null;

// Function to get the random image using fetch
function getRandomImage() {
  // URL of the image location
  fetch("https://picsum.photos/400/250")
    // Wait for response then set img variable to the img URL
    .then(response => {
      if (!response.ok) {
        throw new Error("Network error");
      }
      return response.url;
    })
    .then(imgUrl => {
      img = imgUrl;
      // Create the img HTML attribute
      const imgAttribute = `
        <img src="${imgUrl}" />
      `;
      // Place imgAttribute inside the img div
      imgContainer.innerHTML = imgAttribute;
    })
    .catch(error => {
      console.error("Fetch error: ", error.message);
      imgContainer.innerHTML = "<p>An error occurred. Please try again.</p>";
    });
}

// Call getRandomImage function when page loads
getRandomImage();

// On click, call getRandomImage function
generateImage.addEventListener("click", () => {
  getRandomImage();
});

// ----------------------------------------------

// Get email entered and store it in an option tag
function selectEmail() {
  // Trim any whitespace from email
  const emailValue = email.value.trim();

  // Check if the email already exists
  let exists = false;
  for (let i = 0; i < select.options.length; i++) {
    if (select.options[i].value === emailValue) {
      exists = true;
      break;
    }
  }

  // If the email does not exist, add it as a new option
  if (!exists) {
    let optionList = document.createElement("OPTION");
    optionList.value = emailValue;
    optionList.textContent = emailValue;
    select.appendChild(optionList);
    select.classList.add("flash");
    setTimeout(() => {
      select.classList.remove("flash");
    }, 800);
  } else {
    if (enterError) {
      enterError.remove();
    }
    enterError = document.createElement("p");
    enterError.textContent = "This email has already been added";
    enterErrorDiv.appendChild(enterError);
  }
}

// On click, submits the email value to the select option
submit.addEventListener("click", () => {
  // Email validation
  let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // If error already exists, remove it
  if (enterError) {
    enterError.remove();
    enterError = null;
  }

  if (!emailRegex.test(email.value)) {
    email.placeholder = "Email required";
    email.classList.add("required");
    enterError = document.createElement("p");
    enterError.textContent = "Please enter a valid email";
    enterErrorDiv.appendChild(enterError);
  } else {
    selectEmail();
  }
});

// ----------------------------------------------

// Add image to selected email and generate a new image
function addImage() {
  linkImage();
}

// On CLick, link the image to the selected email and display images for that email
imageToEmail.addEventListener("click", () => {
  // If error already exists, remove it
  if (setError) {
    setError.remove();
    setError = null;
  }

  if (select.value === "" || select.value === null) {
    setError = document.createElement("p");
    setError.textContent = "Please select an email";
    setErrorDiv.appendChild(setError);
  } else {
    if (enterError) {
      enterError.remove();
    }
    addImage();
  }
});

// ----------------------------------------------

// Empty array to store objects from emailImageLink
let emailImageArray = [];

function linkImage() {
  // Ref to select option value
  const selectedOption = select.options[select.selectedIndex];
  const selectedEmail = selectedOption.value;

  // Create a new object
  const emailImageLink = {
    email: selectedEmail,
    imgUrl: img
  };

  // Push the new object into the array
  emailImageArray.push(emailImageLink);

  // Call function to display selected email images
  displayImages(selectedEmail);
}

// ----------------------------------------------

// Function to display images for selected email
function displayImages(email) {
  const emailSavedTitle = document.querySelector(".email-address");
  const imgContent = document.querySelector(".img-content");

  // Empty any existing text and images
  emailSavedTitle.innerHTML = "";
  imgContent.innerHTML = "";

  // Filter the array for objects with the matching email
  const filteredImages = emailImageArray.filter(item => item.email === email);

  // If there are saved images in the emailImageArray, show
  if (filteredImages.length > 0) {
    // Display email title
    emailSavedTitle.innerHTML = `<h2>${filteredImages[0].email}</h2>`;

    // Display images for the selected email
    filteredImages.forEach(item => {
      let imgDiv = document.createElement("DIV");
      imgDiv.classList.add("email-saved-img");

      let savedImage = document.createElement("img");
      savedImage.src = item.imgUrl;

      let deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("btn");
      deleteBtn.setAttribute("data-img-url", item.imgUrl);

      deleteBtn.addEventListener("click", function (e) {
        deleteImage(item.email, e.target.getAttribute("data-img-url"));
      });

      // Add saved image and button to div
      imgDiv.appendChild(savedImage);
      imgDiv.appendChild(deleteBtn);
      imgContent.appendChild(imgDiv);
    });
  } else {
    // If no images, display text
    emailSavedTitle.innerHTML = "<h2>No images saved for this email</h2>";
  }
}

// Delete image
function deleteImage(email, imgUrl) {
  // Filter out the image to delete
  emailImageArray = emailImageArray.filter(item => !(item.email === email && item.imgUrl === imgUrl));

  // Call displayImages again to update images displayed
  displayImages(email);
}

// When dropdown option for email is changed, display images for the email selected
select.addEventListener("change", () => {
  const selectedEmail = select.value;
  displayImages(selectedEmail);
});