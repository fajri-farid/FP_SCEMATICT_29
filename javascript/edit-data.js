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
            const descriptionElement = document.getElementById("description");
            descriptionElement.value = note.description || "";

            // Periksa dan perbarui jumlah karakter description saat halaman dimuat
            updateCharacterCount(descriptionElement, 250);
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
      const title = document.getElementById("title");
      const category = document.getElementById("category");
      const description = document.getElementById("description");

      let hasError = false;

      // Validate title length
      if (title.value.length > 60) {
        title.classList.add("error");
        hasError = true;
      } else {
        title.classList.remove("error");
      }

      // Validate description length
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
        // Update note through API
        fetch(`https://v1.appbackend.io/v1/rows/bVAk25wv21ot`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: noteId,
            name: title.value,
            category: category.value,
            description: description.value,
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

  // Event listener untuk tombol cancel
  document.getElementById("cancel").addEventListener("click", function () {
    document.getElementById("note-form").reset();
    document
      .querySelectorAll("input, textarea")
      .forEach((el) => el.classList.remove("error"));
  });

  // Fungsi untuk memperbarui jumlah karakter yang tersisa pada textarea description
  function updateCharacterCount(element, maxLength) {
    const currentLength = element.value.length;
    const remaining = maxLength - currentLength;
    document.getElementById(
      "char-count"
    ).textContent = `${remaining} characters remaining`;
  }

  // Attach input event listener for description to update character count
  document.getElementById("description").addEventListener("input", function () {
    updateCharacterCount(this, 250);
  });

  // Menangani event paste untuk mencegah karakter melebihi batas
  document
    .getElementById("description")
    .addEventListener("paste", function (event) {
      const maxLength = 250;
      const pasteText = (event.clipboardData || window.clipboardData).getData(
        "text"
      );
      const currentLength = this.value.length;
      const remainingLength = maxLength - currentLength;

      // Jika teks yang di-paste melebihi sisa karakter yang diperbolehkan, mencegah paste
      if (pasteText.length > remainingLength) {
        event.preventDefault();
        this.value += pasteText.substring(0, remainingLength);
        updateCharacterCount(this, maxLength);
      }
    });
});
