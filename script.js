// Get reference to the recordContainer
const recordContainer = document.querySelector(".recordContainer");

// Function to add a student to local storage
function addStudent(name, id, email, phone, idDate = Date.now()) {
  const student = {
    idDate: idDate,
    name: name,
    id: id,
    email: email,
    contact: phone // Changed 'phone' to 'contact'
  };

  let studentData = localStorage.getItem("studentData");
  if (studentData) {
    studentData = JSON.parse(studentData);
    // Check if the student with the same ID already exists
    const existingStudent = studentData.find(s => s.id === id && s.idDate !== idDate);
    if (existingStudent) {
      alert("Student already exists!");
      return;
    }
  } else {
    studentData = [];
  }

  // Remove old record if editing
  studentData = studentData.filter(s => s.idDate !== idDate);

  studentData.push(student);
  localStorage.setItem("studentData", JSON.stringify(studentData));

  // Call displayStudent to update the displayed records after adding the student
  displayStudent();
}

// Function to display registered students
function displayStudent() {
  const studentData = JSON.parse(localStorage.getItem("studentData")) || [];

  // Clear existing records before displaying updated records
  recordContainer.innerHTML = '';

  for (let i = 0; i < studentData.length; i++) {
    //creating div 
    let tableContent = document.createElement("div");
    let name = document.createElement("div");
    let id = document.createElement("div");
    let email = document.createElement("div");
    let contact = document.createElement("div");
    let btn = document.createElement("div");
    //creating buttons
    let buttonEdit = document.createElement("button");
    let buttonRemove = document.createElement("button");

    //creating h4 element
    let nameH4 = document.createElement("h4");
    let idH4 = document.createElement("h4");
    let emailH4 = document.createElement("h4");
    let contactH4 = document.createElement("h4");

    //creating imgelement
    let imgEdit = document.createElement("img");
    let imgRemove = document.createElement("img");

    //adding src
    imgEdit.src = "./static/edit.svg";
    imgRemove.src = "./static/delete.svg";

    //setting id class and textcontent
    tableContent.classList.add(studentData[i].id, studentData[i].idDate, "tableContent");

    nameH4.textContent = studentData[i].name;
    idH4.textContent = studentData[i].id;
    emailH4.textContent = studentData[i].email;
    contactH4.textContent = studentData[i].contact; 

    buttonEdit.id = "buttonEdit";
    buttonEdit.classList.add(studentData[i].id, studentData[i].idDate);
    buttonRemove.id = "buttonRemove";
    buttonRemove.classList.add(studentData[i].id, studentData[i].idDate);
    btn.id = "controlButtons";
    imgEdit.id = "edit";
    imgRemove.id = "remove";

    //appending child
    name.appendChild(nameH4);
    id.appendChild(idH4);
    email.appendChild(emailH4);
    contact.appendChild(contactH4);
    buttonEdit.appendChild(imgEdit);
    buttonRemove.appendChild(imgRemove);
    btn.appendChild(buttonEdit);
    btn.appendChild(buttonRemove);

    tableContent.appendChild(name);
    tableContent.appendChild(id);
    tableContent.appendChild(email);
    tableContent.appendChild(contact);
    tableContent.appendChild(btn);

    recordContainer.appendChild(tableContent);
  }
}

// Event listener for form submission
document.getElementById("studentForm").addEventListener("submit", function(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  const id = document.getElementById("ID").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("tel").value;

  const submitButton = document.getElementById("submit");
  const idDate = submitButton.dataset.editing ? parseInt(submitButton.dataset.editing) : Date.now();

  addStudent(capitalizedName, id, email, phone, idDate);

  // Reset the form and update button text
  document.getElementById("studentForm").reset();
  submitButton.textContent = "Register";
  delete submitButton.dataset.editing;
});

// Display records upon page load
displayStudent();

// Event delegation for remove button and edit button
recordContainer.addEventListener("click", function(event) {
  // Remove button clicked
  if (event.target && event.target.id === "remove") {
    if (confirm("Do you want to remove this record?")) {
      const buttonRemove = event.target.closest("button");
      const classList = buttonRemove.classList;

      // Retrieve studentData
      let studentData = JSON.parse(localStorage.getItem("studentData")) || [];

      // Find the student by matching classList
      studentData = studentData.filter(student => student.id !== classList[0] && student.idDate !== parseInt(classList[1]));

      // Update localStorage with filtered studentData
      localStorage.setItem("studentData", JSON.stringify(studentData));

      // Refresh the displayed records
      displayStudent();
    }
  }

  // Edit button clicked
  if (event.target && event.target.id === "edit") {
    const buttonEdit = event.target.closest("button");
    const classList = buttonEdit.classList;

    // Retrieve studentData
    let studentData = JSON.parse(localStorage.getItem("studentData")) || [];

    // Find the student by matching id and idDate
    const studentToEdit = studentData.find(student =>
      student.id === classList[0] && student.idDate === parseInt(classList[1])
    );

    // Populate the form with the student data for editing
    if (studentToEdit) {
      document.getElementById("name").value = studentToEdit.name;
      document.getElementById("ID").value = studentToEdit.id;
      document.getElementById("email").value = studentToEdit.email;
      document.getElementById("tel").value = studentToEdit.contact;

      // Optionally, you might want to mark the form as being in "edit mode"
      const submitButton = document.getElementById("submit");
      submitButton.textContent = "Update Student";
      submitButton.dataset.editing = studentToEdit.idDate; // Store the idDate for updating
    }
  }
});
