import { formatTimestamp } from "./fetch-data.js";

export function setupFilters() {
  // Ambil semua tombol filter dengan class 'nav-button'
  const buttons = document.querySelectorAll(".nav-button");

  // Tambahkan event listener untuk setiap tombol filter
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      // Hapus class 'active' dari semua tombol
      buttons.forEach((btn) => btn.classList.remove("active"));

      // Tambahkan class 'active' ke tombol yang diklik
      event.target.classList.add("active");

      // Ambil kategori dari id tombol yang diklik
      const category = button.id.toLowerCase();
      // Panggil fungsi untuk memfilter notes berdasarkan kategori
      filterNotes(category);
    });
  });

  // Set tombol 'All' sebagai aktif secara default saat halaman dimuat
  document.getElementById("all").classList.add("active");
}

// Fungsi untuk memfilter notes berdasarkan kategori
export function filterNotes(category) {
  fetch("https://v1.appbackend.io/v1/rows/bVAk25wv21ot")
    .then((response) => response.json())
    .then((result) => {
      const notes = result.data;
      const notesGrid = document.getElementById("notesGrid");
      notesGrid.innerHTML = "";

      if (Array.isArray(notes)) {
        notes.forEach((note) => {
          if (category === "all" || note.category.toLowerCase() === category) {
            const { formattedTime, formattedDate } = formatTimestamp(
              note.updatedAt
            );

            const noteCard = document.createElement("div");
            noteCard.className = "gridItem";
            noteCard.id = `${note.category.toLowerCase()}Category`;
            noteCard.innerHTML = `
                <article class="noteCard">
                  <div class="noteCardHeader">
                    <h1 class="noteCardTitle">${note.name}</h1>
                    <button class="noteCardButton editButton" title="Edit Note" data-id="${note._id}">
                      <!-- SVG icon untuk edit -->
                    </button>
                    <button class="noteCardButton deleteButton" title="Delete Note" data-id="${note._id}">
                      <!-- SVG icon untuk delete -->
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
          }
        });

        setupNoteActions();
      } else {
        console.error("Expected an array, but got:", result);
      }
    })
    .catch((error) => console.log("error", error));
}

// Panggil setupFilters saat halaman dimuat
document.addEventListener("DOMContentLoaded", setupFilters);
