function setupNoteActions() {
  document.querySelectorAll(".deleteButton").forEach((button) => {
    button.addEventListener("click", function () {
      const noteId = this.getAttribute("data-id");
      deleteNote(noteId);
    });
  });

  document.querySelectorAll(".editButton").forEach((button) => {
    button.addEventListener("click", function () {
      const noteId = this.getAttribute("data-id");
      window.location.href = `edit-note.html?id=${noteId}`;
    });
  });
}

async function handleSearch(event) {
  const searchTerm = event.target.value;
  console.log("Search term:", searchTerm);

  try {
    const response = await fetch(
      `https://v1.appbackend.io/v1/rows/bVAk25wv21ot?search=${encodeURIComponent(
        searchTerm
      )}`
    );
    const result = await response.json();
    console.log("API result:", result);

    if (Array.isArray(result.data)) {
      updateNotes(result.data);
    } else {
      console.error("Unexpected result format:", result);
    }
  } catch (error) {
    console.error("Error fetching search results:", error);
  }
}

function updateNotes(notes) {
  const notesGrid = document.getElementById("notesGrid");
  notesGrid.innerHTML = "";

  notes.forEach((note) => {
    const { formattedTime, formattedDate } = formatTimestamp(note.updatedAt);
    console.log("Updating note:", note); // Debugging line
    const noteCard = document.createElement("div");
    noteCard.className = "gridItem";
    noteCard.innerHTML = `
        <article class="noteCard">
          <div class="noteCardHeader">
            <h1 class="noteCardTitle">${note.name}</h1>
            <button class="noteCardButton editButton" title="Edit Note" data-id="${note._id}">
              <!-- SVG icon untuk edit -->
              <!-- SVG code here -->
            </button>
            <button class="noteCardButton deleteButton" title="Delete Note" data-id="${note._id}">
              <!-- SVG icon untuk delete -->
              <!-- SVG code here -->
            </button>
            <div class="noteCardCategory">${note.category}</div>
          </div>
          <div class="noteCardBody">
            <p class="bodyContent">${note.description}</p>
          </div>
          <div class="noteCardFooter">
            <p class="noteCardTime">${formattedTime}</p>
            <p class="noteCardDate">${formattedDate}</p>
          </div>
        </article> 
      `;
    notesGrid.appendChild(noteCard);
  });

  // Menambahkan event listener untuk tombol delete dan edit
  document.querySelectorAll(".deleteButton").forEach((button) => {
    button.addEventListener("click", function () {
      const noteId = this.getAttribute("data-id");
      deleteNote(noteId);
    });
  });

  document.querySelectorAll(".editButton").forEach((button) => {
    button.addEventListener("click", function () {
      const noteId = this.getAttribute("data-id");
      window.location.href = `edit-note.html?id=${noteId}`;
    });
  });
}
