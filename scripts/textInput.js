export function setupTextInputMode(callback) {
  const textInputForm = document.getElementById("textInputForm");
  const submitButton = document.getElementById("submitText");

  textInputForm.style.display = "block"; // Show the text input area

  submitButton.addEventListener("click", () => {
    const userInput = document.getElementById("userText").value;
    if (userInput.trim() === "") {
      alert("Please enter some text!");
      return;
    }

    // Pass the input to the callback function provided by sidebar.js
    callback(userInput);
  });
}
