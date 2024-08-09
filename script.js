document
  .getElementById("note-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;

    if (title && category && description) {
      alert("Note added successfully!");
      // Here you can add the logic to save the note
    } else {
      alert("Please fill in all fields.");
    }
  });

document.getElementById("cancel").addEventListener("click", function () {
  document.getElementById("note-form").reset();
});
