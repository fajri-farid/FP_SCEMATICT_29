document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const noteId = urlParams.get("id");

  if (noteId) {
    const url = `https://v1.appbackend.io/v1/rows/bVAk25wv21ot/${noteId}`;

    // Fetch data note berdasarkan _id
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        console.log("API Response:", result); // Log the full response

        // Check the response structure and populate the form
        if (result) {
          const note = result;

          if (note) {
            document.getElementById("title").value = note.name || "";
            document.getElementById("category").value = note.category || "";
            document.getElementById("description").value =
              note.description || "";
          } else {
            console.error("Note not found in the response data.");
          }
        } else {
          console.error("Unexpected response structure:", result);
        }
      })
      .catch((error) => console.error("Error fetching note data:", error));
  } else {
    console.error("No note ID found in the URL.");
  }

  // Add event listener for form submission
  document
    .getElementById("note-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const title = document.getElementById("title").value;
      const category = document.getElementById("category").value;
      const description = document.getElementById("description").value;

      console.log("Updating note with ID:", noteId);
      console.log("Title:", title);
      console.log("Category:", category);
      console.log("Description:", description);

      if (title && category && description) {
        // Update note through API
        fetch(`https://v1.appbackend.io/v1/rows/bVAk25wv21ot`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: noteId,
            name: title,
            category: category,
            description: description,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((result) => {
            console.log("Note updated successfully!", result);
            window.location.href = "index.html";
          })
          .catch((error) => {
            console.error("Error updating note:", error);
            alert(
              "Failed to update note. Please check the details or try again later."
            );
          });
      } else {
        console.error("Please fill out all fields.");
      }
    });
});
