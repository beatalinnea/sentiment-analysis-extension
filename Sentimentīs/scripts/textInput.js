export function setupTextInputMode(callback) {
  const textInputForm = document.getElementById("textInputForm");
  const submitButton = document.getElementById("submitText");

  textInputForm.style.display = "block";

  submitButton.addEventListener("click", () => {
    const userInput = document.getElementById("userText").value;
    if (userInput.trim() === "") {
      alert("Please enter some text!");
      return;
    }
    callback(userInput);
  });
}
