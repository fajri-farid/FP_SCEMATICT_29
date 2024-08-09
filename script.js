document
  .getElementById("note-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("title");
    const category = document.getElementById("category");
    const description = document.getElementById("description");

    let hasError = false;

    if (title.value.length > 60) {
      title.classList.add("error");
      hasError = true;
    } else {
      title.classList.remove("error");
    }

    if (description.value.length > 250) {
      description.classList.add("error");
      hasError = true;
    } else {
      description.classList.remove("error");
    }

    if (hasError) {
      return; // Stop form submission
    }

    if (title.value && category.value && description.value) {
      // Logic to save the note
      const url = "https://v1.appbackend.io/v1/rows/bVAk25wv21ot";

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            name: title.value,
            description: description.value,
            category: category.value,
          },
        ]),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("Note added successfully!", result);
          document.getElementById("note-form").reset();
          document
            .querySelectorAll("input, textarea")
            .forEach((el) => el.classList.remove("error"));
        })
        .catch((error) => console.log("Error:", error));
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

  // Update border color based on character limit
  if (currentLength > maxLength) {
    this.classList.add("error");
  } else {
    this.classList.remove("error");
  }
});
