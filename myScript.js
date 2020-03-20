// Execute in strict mode to prevent some common mistakes
"use strict";

// Make diary data item
function makeItem(type, data) {
  var itemObject = { type: type, data: data };
  return JSON.stringify(itemObject);
}

// Create and store demonstration items
function createDemoItems() {
  console.log('Adding demonstration items to local storage');

  var item, data, key;

  // Make a demo text item
  data =
    "Friday: We arrived to this wonderful guesthouse after a pleasant journey " +
    "and were made most welcome by the proprietor, Mike. Looking forward to " +
    "exploring the area tomorrow.";
  item = makeItem("text", data);

  // Store the item in local storage
  key = "diary1536771000001";
  localStorage.setItem(key, item);

  // Make a demo text item
  data =
    "Saturday: After a super breakfast, we took advantage of one of the many " +
    "signed walks nearby. For some of the journey this followed the path of a " +
    "stream to a charming village.";
  item = makeItem("text", data);

  // Store the item in local storage
  key = "diary1536771000002";
  localStorage.setItem(key, item);


  // Store the item in local storage
  key = "diary1536771000003";
  localStorage.setItem(key, item);

  // Make a demo text item
  data =
    "Sunday: Following a tip from Mike we drove to a gastropub at the head of " +
    "the valley - a great meal and fabulous views all round.";
  item = makeItem("text", data);

  // Store the item in local storage
  key = "diary1536771000004";
  localStorage.setItem(key, item);
}

// Add a section to the page containing the given element
function addSection(key, element) {
  // Create a section element to contain the new entry
  var sectionElement = document.createElement("SECTION");

  // Give the section a class to allow styling
  sectionElement.classList.add("entry");

  // Add the element to the section
  sectionElement.appendChild(element);

  // Add a button to delete the entry
  var deleteButton = document.createElement("BUTTON");
  deleteButton.innerHTML = "&times;";
  deleteButton.setAttribute("aria-label", "Delete entry");

  // Create a click event listener to delete the entry
  function deleteElement() {
    // Remove the section from the page
    sectionElement.parentNode.removeChild(sectionElement);
    localStorage.removeItem(key);
  }

  // Connect the click event listener to the button
  deleteButton.addEventListener("click", deleteElement);

  // Add the delete button to the section
  sectionElement.appendChild(deleteButton);

  // Get a reference to the element containing the diary entries
  var diaryElement = document.querySelector("main");

  // Get a reference to the first button section (Add entry/photo) in the diary element
  var buttonElement = diaryElement.querySelector("section.button");

  // Add the section to the page after existing entries,
  // but before the buttons
  diaryElement.insertBefore(sectionElement, buttonElement);
}

// Add a text entry to the page
function addTextEntry(key, text, isNewEntry) {
  // Create a textarea element to edit the entry
  var textareaElement = document.createElement("TEXTAREA");
  textareaElement.rows = 5;
  textareaElement.placeholder = "(new entry)";

  // Set the textarea's value to the given text (if any)
  textareaElement.value = text;

  // Add a section to the page containing the textarea
  addSection(key, textareaElement);

  // If this is a new entry (added by the user clicking a button)
  // move the focus to the textarea to encourage typing
  if (isNewEntry) {
    textareaElement.focus();
  }
  textareaElement.addEventListener('change',updateText);

  // a function to update the text and save to local storage when 
  // a change happens in the text area
  function updateText(){
    var value = textareaElement.value;
    textareaElement.value = value;
    var item = makeItem("text", value);
    localStorage.setItem(key,item);
  }
}

// Add an image entry to the page
function addImageEntry(key, url) {
  // Create a image element
  var imgElement = new Image();
  imgElement.alt = "Photo entry";

  // Load the image
  imgElement.src = url;

  // Add a section to the page containing the image
  addSection(key, imgElement);
}

// Show the diary items in local storage as diary entries on the page
function showEntries() {
  console.log('Adding items from local storage to the page');

  // Build a sorted list of keys for diary items
  var diaryKeys = [];

  // Loop through each key in storage by index
  for (var index = 0; index < localStorage.length; index++) {
    var key = localStorage.key(index);

    // If the key begins with "diary", assume it is for a diary entry
    // There may be other data in local storage, so we will ignore that
    if (key.slice(0, 5) == "diary") {
      // Append this key to the list of known diary keys
      diaryKeys.push(key);
    }
  }

  // Although browser developer tools show items in key order,
  // their actual order is browser-dependent, so sort the keys,
  // so that our diary entries are shown in the right order!
  diaryKeys.sort();

  // Loop through each diary item in storage by key
  for (var index = 0; index < diaryKeys.length; index++) {
    var key = diaryKeys[index];

    // Assume the item is a JSON string and decode it
    var item = JSON.parse(localStorage.getItem(key));

    if (item.type == "text") {
      // Assume the data attribute is text
      addTextEntry(key, item.data);
    } else if (item.type == "image") {
      // Assume the data attribute is an image URL
      addImageEntry(key, item.data);
    } else {
      // This should never happen - show an error and give up
      console.error("Unexpected item: " + item);
    }
  }
}

// Function to handle Add text button click
function addEntryClick() {
  // Add an empty text entry, using the current timestamp to make a key
  var key = "diary" + Date.now();
  var text = "";
  var isNewEntry = true;
  addTextEntry(key, text, isNewEntry);
}

// Function to handle Add photo button click
function addPhotoClick() {
  document.getElementById('fileInput').click();
}

// Function to handle a new file being selected
function processFile(event) {
  const input = document.querySelector('input[type="file"]');
  console.log(input.files)
  const reader = new FileReader()
  reader.readAsDataURL(input.files[0])
  reader.onload = function() {
    var key = "diary" + Date.now();
    var thisUrl = reader.result;
    addImageEntry(key, thisUrl);
    var item = makeItem("image", thisUrl)
    localStorage.setItem(key, item);
  }
}

// Function to connect event listeners and start the application
function initialize() {
  // A rough check for local storage support
  if (!window.localStorage) {
    
    // This could be more elegant too, but is sufficient for our demo
    document.querySelector("main").outerHTML =
      "<h1>Error: localStorage not supported!</h1>";

    // Stop the demo
    return;
  }

  // Connect the Add entry and Add photo buttons
  var addEntryButton = document.querySelector("#text button");
  addEntryButton.addEventListener("click", addEntryClick);
  var addPhotoButton = document.querySelector("#image button");
  addPhotoButton.addEventListener("click", addPhotoClick);

  // Connect the input file selected event listener
  // (note this may not trigger if you repeatedly select the same file)
  var inputElement = document.querySelector("#image input");
  inputElement.addEventListener("change", processFile);

  // Create some demonstration items
  createDemoItems();

  // Update the page to reflect stored items
  showEntries();
}

// Connect event listeners and start the application when the page loads
window.addEventListener("load", initialize);
