document
  .getElementById("note-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("title");
    const category = document.getElementById("category");
    const description = document.getElementById("description");

    let hasError = false;

    // Check title length
    if (title.value.length > 60) {
      hasError = true;
    } else {
      title.classList.remove("error");
    }

    // Check description length
    if (description.value.length > 250) {
      hasError = true;
    } else {
      description.classList.remove("error");
    }

    if (hasError) {
      return; // Stop form submission
    }

    if (title.value && category.value && description.value) {
      // Logic to save the note
      console.log("Note added successfully!");
    }
  });

document.getElementById("cancel").addEventListener("click", function () {
  document.getElementById("note-form").reset();
  document
    .querySelectorAll("input, textarea")
    .forEach((el) => el.classList.remove("error"));
});

document.getElementById("description").addEventListener("input", function () {
  const maxLength = 250;
  const currentLength = this.value.length;
  const remaining = maxLength - currentLength;
  document.getElementById(
    "char-count"
  ).textContent = `${remaining} characters remaining`;
});
