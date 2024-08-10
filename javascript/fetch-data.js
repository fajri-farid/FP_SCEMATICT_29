import { filterNotes } from "./filter.js";

// Panggil fungsi filter untuk menampilkan semua notes saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  filterNotes("all"); // Pastikan ini ada

  // Tambahkan event listener untuk input pencarian
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    searchNotes(query);
  });
});

// Format tanggal
export function formatTimestamp(timestamp) {
  if (!timestamp) {
    // Handle cases where timestamp is missing or invalid
    console.error("Invalid timestamp:", timestamp);
    return { formattedTime: "00:00", formattedDate: "01 Januari 1970" };
  }

  const date = new Date(timestamp);

  // Format updateAt menjadi jam:menit
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`;

  // Format updateAt menjadi tanggal bulan tahun
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
let notes = []; // Simpan data notes di sini

fetch("https://v1.appbackend.io/v1/rows/bVAk25wv21ot")
  .then((response) => response.json())
  .then((result) => {
    console.log(result);
    notes = result.data; // Simpan data notes

    // Cek apakah result adalah array
    if (Array.isArray(notes)) {
      displayNotes(notes); // Tampilkan semua catatan saat halaman dimuat

      // Menambahkan event listener untuk tombol delete
      document.querySelectorAll(".deleteButton").forEach((button) => {
        button.addEventListener("click", function () {
          const noteId = this.getAttribute("data-id");
          deleteNote(noteId); // Panggil fungsi untuk delete note
        });
      });

      // Menambahkan event listener untuk tombol edit
      document.querySelectorAll(".editButton").forEach((button) => {
        button.addEventListener("click", function () {
          const noteId = this.getAttribute("data-id");
          window.location.href = `edit-note.html?id=${noteId}`;
        });
      });
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
    const noteCategory = note.category.toLowerCase(); // Menggunakan kategori dari data
    const { formattedTime, formattedDate } = formatTimestamp(note.updatedAt);

    // Membuat elemen note card
    const noteCard = document.createElement("div");
    noteCard.className = "gridItem";
    noteCard.id = `${noteCategory}Category`;
    noteCard.innerHTML = `
      <article class="noteCard">
        <div class="noteCardHeader">
          <h1 class="noteCardTitle">${note.name}</h1>
          <button class="noteCardButton editButton" title="Edit Note" data-id="${note._id}">
            <!-- SVG icon untuk edit -->
            <svg
              width="15px"
              height="15px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!-- SVG Path untuk edit -->
            </svg>
          </button>
          <button class="noteCardButton deleteButton" title="Delete Note" data-id="${note._id}">
            <!-- SVG icon untuk delete -->
            <svg
              width="15px"
              height="15px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!-- SVG Path untuk delete -->
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

    // Memasukkan noteCard ke grid yang disiapkan di HTML
    notesGrid.appendChild(noteCard);
  });

  // Menambahkan event listener untuk tombol delete
  document.querySelectorAll(".deleteButton").forEach((button) => {
    button.addEventListener("click", function () {
      const noteId = this.getAttribute("data-id");
      deleteNote(noteId); // Panggil fungsi untuk delete note
    });
  });

  // Menambahkan event listener untuk tombol edit
  document.querySelectorAll(".editButton").forEach((button) => {
    button.addEventListener("click", function () {
      const noteId = this.getAttribute("data-id");
      window.location.href = `edit-note.html?id=${noteId}`;
    });
  });
}

// Fungsi untuk mencari catatan berdasarkan query
function searchNotes(query) {
  const filteredNotes = notes.filter((note) => {
    return (
      note.name.toLowerCase().includes(query) ||
      note.description.toLowerCase().includes(query)
    );
  });
  displayNotes(filteredNotes); // Tampilkan catatan yang terfilter
}

// Fungsi untuk menghapus note berdasarkan _id
function deleteNote(noteId) {
  const url = "https://v1.appbackend.io/v1/rows/bVAk25wv21ot";

  fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify([noteId]), // Mengirimkan array yang berisi id note yang ingin dihapus
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      // Merefresh halaman setelah note berhasil dihapus
      window.location.reload();
    })
    .catch((error) => console.log("error", error));
}
