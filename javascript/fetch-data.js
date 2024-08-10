import { filterNotes } from "./filter.js";

// Panggil fungsi filter untuk menampilkan semua notes saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  filterNotes("all");

  // Tambahkan event listener untuk input pencarian
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    searchNotes(query);
  });
});

// Format timestamp
export function formatTimestamp(timestamp) {
  if (!timestamp) {
    console.error("Invalid timestamp:", timestamp);
    return { formattedTime: "00:00", formattedDate: "01 Januari 1970" };
  }

  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`;

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

// Fetch data dari API
let notes = [];

fetch("https://v1.appbackend.io/v1/rows/bVAk25wv21ot")
  .then((response) => response.json())
  .then((result) => {
    console.log(result);
    notes = result.data;

    if (Array.isArray(notes)) {
      displayNotes(notes);
      setupNoteActions();
    } else {
      console.error("Expected an array, but got:", result);
    }
  })
  .catch((error) => console.log("error", error));

// Fungsi untuk menampilkan catatan
function displayNotes(notes) {
  const notesGrid = document.getElementById("notesGrid");
  notesGrid.innerHTML = "";

  notes.forEach((note) => {
    const noteCategory = note.category.toLowerCase();
    const { formattedTime, formattedDate } = formatTimestamp(note.updatedAt);

    const noteCard = document.createElement("div");
    noteCard.className = "gridItem";
    noteCard.id = `${noteCategory}Category`;
    noteCard.innerHTML = `
      <article class="noteCard">
        <div class="noteCardHeader">
          <h1 class="noteCardTitle">${note.name}</h1>
          <button class="noteCardButton editButton" title="Edit Note" data-id="${note._id}">
              <svg
                  width="15px"
                  height="15px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                    stroke="#000000"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                    stroke="#000000"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
          </button>
          <button class="noteCardButton deleteButton" title="Delete Note" data-id="${note._id}">
            <svg
                  width="15px"
                  height="15px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16"
                    stroke="#000000"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
          </button>
          <div class="noteCardCategory" id="${note.category}">${note.category}</div>
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

  // Panggil setupNoteActions setelah menampilkan catatan
  setupNoteActions();
}

// Fungsi untuk mencari catatan berdasarkan query
function searchNotes(query) {
  const filteredNotes = notes.filter((note) => {
    return (
      note.name.toLowerCase().includes(query) ||
      note.description.toLowerCase().includes(query)
    );
  });
  displayNotes(filteredNotes);
}

// Fungsi untuk menghapus note berdasarkan _id
function deleteNote(noteId) {
  const url = "https://v1.appbackend.io/v1/rows/bVAk25wv21ot";

  fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify([noteId]),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      window.location.reload();
    })
    .catch((error) => console.log("error", error));
}

// Fungsi untuk setup aksi tombol edit dan delete
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
