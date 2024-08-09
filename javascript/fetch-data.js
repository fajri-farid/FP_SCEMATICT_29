// Function to convert timestamp to the desired format
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  // Format time as jam:menit
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`;

  // Format date as tanggal bulan tahun
  const day = date.getDate().toString().padStart(2, "0");
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const formattedDate = `${day} ${month} ${year}`;

  return { formattedTime, formattedDate };
}

// Fetch data from the API
fetch("https://v1.appbackend.io/v1/rows/bVAk25wv21ot")
  .then((response) => response.json())
  .then((result) => {
    console.log(result);

    const notes = result.data;

    // Cek apakah result adalah array
    if (Array.isArray(notes)) {
      const notesGrid = document.getElementById("notesGrid");

      notesGrid.innerHTML = ""; // Clear existing content

      notes.forEach((note) => {
        const noteCategory = note.category.toLowerCase(); // Assuming your data has a 'category' field
        const { formattedTime, formattedDate } = formatTimestamp(
          note.updatedAt
        );

        // Create a note card element
        const noteCard = `
          <div class="gridItem" id="${noteCategory}Category">
            <article class="noteCard">
              <div class="noteCardHeader">
                <h1 class="noteCardTitle">${note.name}</h1>
                <button class="noteCardButton" id="editButton" title="Edit Note">
                  <!-- SVG icon for edit -->
                  <!-- (Your SVG icon code here) -->
                </button>
                <button class="noteCardButton" id="deleteButton" title="Delete Note">
                  <!-- SVG icon for delete -->
                  <!-- (Your SVG icon code here) -->
                </button>
                <div class="noteCardCategory" id=${note.category}>${note.category}</div>
              </div>
              <div class="noteCardBody">
                <p class="bodyContent">${note.description}</p>
              </div>
              <div class="noteCardFooter">
                <p class="noteCardTime">${formattedTime}</p>
                <p class="noteCardDate">${formattedDate}</p>
              </div>
            </article> 
          </div>
        `;

        // Append the note card to the grid
        notesGrid.innerHTML += noteCard;
      });
    } else {
      console.error("Expected an array, but got:", result);
    }
  })
  .catch((error) => console.log("error", error));
