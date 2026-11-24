// ==========================================
// 1. INITIALIZE DATA
// ==========================================

const STORAGE_KEY = "djm_library_data_v3";

const DEFAULT_RULES = [
  "Observe silence inside the library.",
  "No eating or drinking inside the library.",
  "Books are for room-use only; taking books outside the library is strictly prohibited.",
  "Handle books with care. Do not write on or tear pages.",
  "Register your visit every time you enter.",
  "Return books to the proper shelf or reading table after use.",
  "Keep the library clean and follow the librarian’s instructions."
];

// Book data: title, author, year, approximate, genre
const RAW_BOOKS = [
  ["Innovative Thinkers: A Math Workbook 8", "Diwa", "", false, "Mathematics"],
  ["Practical Math 7", "Diwa", "", false, "Mathematics"],
  ["Solution to Problems in Mathematics (S.I. Version)", "Besavilla", 1978, false, "Mathematics"],
  ["Basic Calculus", "Diwa", "", false, "Mathematics"],
  ["Science for the 21st Century Learner 10", "Richard L. Antonio et al.", 2015, false, "Science"],
  ["Practical Science 8", "Eduard Christian R. Papa et al.", 2018, false, "Science"],
  ["Science for a Changing World 7", "Eduard Christian R. Papa et al.", 2024, false, "Science"],
  ["Discover Science 7 (Textbook)", "Ian Mark F. Allas et al.", 2013, false, "Science"],
  ["Discover Science 7 (Teacher's Guidebook)", "Ian Mark F. Allas et al.", 2013, false, "Science"],
  ["English for Innovative Minds 8", "Diwa", "", false, "English, Filipino & Values"],
  ["Practical English 10", "Diwa", "", false, "English, Filipino & Values"],
  ["Dynamic Minds: An English Workbook 10", "Diwa", "", false, "English, Filipino & Values"],
  ["Reading and Language 2", "Carmelita Emilia D. Isidoro", "", false, "English, Filipino & Values"],
  ["Pinagyamang Wika at Panitikan 8", "Diwa", "", false, "English, Filipino & Values"],
  ["Filipino Tungo sa Malayang Kamalayan 7", "Diwa", "", false, "English, Filipino & Values"],
  ["Filipino Tungo sa Malayang Kamalayan 8", "Diwa", "", false, "English, Filipino & Values"],
  ["Pagpapakatao 9 (Manwal ng Guro)", "Twila G. Punsalan et al.", 2014, false, "English, Filipino & Values"],
  ["Edukasyon sa Pagpapakatao: Modyul para sa Mag-aaral 9", "DepEd", 2015, false, "English, Filipino & Values"],
  ["Empowerment Technologies, 2nd Ed.", "Diwa", "", false, "Technology & Computing"],
  ["The Book of GIMP", "Olivier Lecarme & Karine Delvare", 2013, false, "Technology & Computing"],
  ["International Finance For Dummies", "Ayse Y. Evrensel", 2015, true, "Business, Finance & Medicine"],
  ["Training and Development For Dummies", "Elaine Biech", 2015, false, "Business, Finance & Medicine"],
  ["Basic and Clinical Pharmacology, 11th Ed.", "Katzung, Masters & Trevor", 2009, true, "Business, Finance & Medicine"],
  ["Apathy, Apostasy and Apostles", "G. Russell Evans", "", false, "Religion & Christian Living"],
  ["A People for His Name (Revised Ed.)", "Paul A. Beals", 1995, true, "Religion & Christian Living"],
  ["Acts of Faith", "Philip Caputo", 2005, true, "Fiction"],
  ["The Pilot's Wife", "Anita Shreve", 1998, true, "Fiction"],
  ["Island of Wives", "Norma Miraflor", "", false, "Fiction"],
  ["Dead in the Family", "Charlaine Harris", 2010, true, "Fiction"],
  ["Blue Cow at Sugar Creek", "Paul Hutchens", "", false, "Children & Young Readers"],
  ["Book Scavenger: The Unbreakable Code", "Jennifer Chambliss Bertman", 2017, false, "Children & Young Readers"],
  ["Ah-One, Ah-Two! Life with My Musical Family", "Lawrence Welk", 1974, true, "Biography, Memoir & History"],
  ["Rebel With a Cause", "Franklin Graham", 1995, true, "Biography, Memoir & History"],
  ["Hostage Bound, Hostage Free", "Ben & Carol Weir", 1987, true, "Biography, Memoir & History"],
  ["The Zookeeper's Wife", "Diane Ackerman", 2007, true, "Biography, Memoir & History"],
  ["Marco Polo Travel Handbook: Prague", "Marco Polo", "", false, "Travel"],
  ["The Rough Guide to Japan", "Rough Guides", "", false, "Travel"],
  ["The Innkeepers' Register, 9th Ed.", "Independent Innkeepers' Association", 1997, false, "Travel"],
  ["Fundamentals of Music", "Rosita F. Rivadelo", "", false, "Other"],
  ["Disney's Wonderful World of Knowledge, Vol. 22: Great Britain and Ireland", "Disney", "", false, "Other"],
  ["Entre Nous: A Woman's Guide to Finding Her Inner French Girl", "Debra Ollivier", 2003, false, "Other"]
];

// Convert book data into objects
const defaultBooks = RAW_BOOKS.map(function (item, index) {
  return {
    id: index + 1,
    title: item[0],
    author: item[1] || "N/A",
    year: item[2] ? (item[3] ? "c. " + item[2] : item[2]) : "N/A",
    genre: item[4],
    status: "Available"
  };
});

// Load saved data
const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY));

let books = (savedData && savedData.books) ? savedData.books : defaultBooks;
let visits = (savedData && savedData.visits) ? savedData.visits : [];
let violations = (savedData && savedData.violations) ? savedData.violations : [];

// Save data to browser storage
function saveData() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      books: books,
      visits: visits,
      violations: violations
    })
  );
}


// ==========================================
// 2. STUDENT PAGE FUNCTIONS
// ==========================================

// Display library rules
const studentRulesList = document.getElementById("studentRulesList");

if (studentRulesList) {
  for (let i = 0; i < DEFAULT_RULES.length; i++) {
    studentRulesList.innerHTML += "<li>" + DEFAULT_RULES[i] + "</li>";
  }
}

// Switch between student sections
function showStudentSection(sectionId) {
  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("browseSection").classList.add("hidden");

  document.getElementById(sectionId).classList.remove("hidden");

  document.getElementById("btnLoginSec").classList.remove("active");
  document.getElementById("btnBrowseSec").classList.remove("active");

  if (sectionId === "loginSection") {
    document.getElementById("btnLoginSec").classList.add("active");
  } else if (sectionId === "browseSection") {
    document.getElementById("btnBrowseSec").classList.add("active");
    renderStudentBooks();
  }
}

// Student visit form
const studentForm = document.getElementById("studentLoginForm");

if (studentForm) {
  studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const grade = document.getElementById("studentGrade").value;
    const section = document.getElementById("studentSection").value.trim();
    const dateTime = new Date().toLocaleString();

    visits.unshift({
      dateTime: dateTime,
      name: name,
      grade: grade,
      section: section
    });

    saveData();

    document.getElementById("loginFeedback").textContent =
      "Welcome, " + name + "! Your visit has been recorded.";

    studentForm.reset();
  });
}

// Display and search books
function renderStudentBooks() {
  const tableBody = document.getElementById("studentBookTable");

  if (!tableBody) return;

  const searchInput = document.getElementById("bookSearchInput");
  const genreSelect = document.getElementById("genreFilterSelect");

  const searchText = searchInput ? searchInput.value.toLowerCase() : "";
  const selectedGenre = genreSelect ? genreSelect.value : "All";

  tableBody.innerHTML = "";

  let count = 0;

  for (let i = 0; i < books.length; i++) {
    const book = books[i];

    const matchesGenre =
      selectedGenre === "All" || book.genre === selectedGenre;

    const matchesText =
      book.title.toLowerCase().includes(searchText) ||
      String(book.author).toLowerCase().includes(searchText) ||
      String(book.year).toLowerCase().includes(searchText);

    if (matchesGenre && matchesText) {
      count++;

      const statusClass =
        book.status === "Available"
          ? "badge-available"
          : "badge-unavailable";

      tableBody.innerHTML += `
        <tr>
          <td><strong>${book.title}</strong></td>
          <td>${book.author}</td>
          <td>${book.year}</td>
          <td>${book.genre}</td>
          <td><span class="${statusClass}">${book.status}</span></td>
        </tr>
      `;
    }
  }

  if (count === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-row">
          No books matched your search.
        </td>
      </tr>
    `;
  }

  const countText = document.getElementById("catalogCountText");

  if (countText) {
    countText.textContent =
      "Showing " + count + " of " + books.length +
      " books (Room-use reading only)";
  }
}


// ==========================================
// 3. LIBRARIAN PAGE FUNCTIONS
// ==========================================

// Display rules in the violation dropdown
const ruleViolatedSelect = document.getElementById("ruleViolated");

if (ruleViolatedSelect) {
  ruleViolatedSelect.innerHTML =
    '<option value="">-- Select Rule Violated * --</option>';

  for (let i = 0; i < DEFAULT_RULES.length; i++) {
    ruleViolatedSelect.innerHTML +=
      '<option value="' + DEFAULT_RULES[i] + '">' +
      'Rule #' + (i + 1) + ': ' + DEFAULT_RULES[i] +
      '</option>';
  }
}

// Librarian login
const adminLoginForm = document.getElementById("librarianLoginForm");

if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("adminUser").value.trim();
    const password = document.getElementById("adminPass").value;

    if (username === "Librarian" && password === "Library123") {
      document.getElementById("adminLoginBox").classList.add("hidden");
      document.getElementById("adminDashboard").classList.remove("hidden");

      updateDashboard();
    } else {
      document.getElementById("adminError").textContent =
        "Invalid Username or Password!";
    }
  });
}

// Librarian logout
function logoutAdmin() {
  document.getElementById("adminDashboard").classList.add("hidden");
  document.getElementById("adminLoginBox").classList.remove("hidden");

  document.getElementById("librarianLoginForm").reset();
  document.getElementById("adminError").textContent = "";
}

// Switch dashboard tabs
function switchAdminTab(tabId, btnId) {
  document.getElementById("booksTab").classList.add("hidden");
  document.getElementById("visitsTab").classList.add("hidden");

  document.getElementById(tabId).classList.remove("hidden");

  document.getElementById("tabBtnBooks").classList.remove("active");
  document.getElementById("tabBtnVisits").classList.remove("active");

  document.getElementById(btnId).classList.add("active");
}

// Add a new book
const addBookForm = document.getElementById("addBookForm");

if (addBookForm) {
  addBookForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const yearInput = document.getElementById("bookYear").value;

    const newBook = {
      id: books.length + 1,
      title: document.getElementById("bookTitle").value.trim(),
      author: document.getElementById("bookAuthor").value.trim() || "N/A",
      year: yearInput ? yearInput : "N/A",
      genre: document.getElementById("bookGenre").value,
      status: "Available"
    };

    books.unshift(newBook);

    saveData();
    addBookForm.reset();
    updateDashboard();
  });
}

// Change book availability
function toggleBookStatus(index) {
  if (books[index].status === "Available") {
    books[index].status = "Unavailable";
  } else {
    books[index].status = "Available";
  }

  saveData();
  updateDashboard();
}

// Remove a book
function removeBook(index) {
  if (confirm("Remove '" + books[index].title + "' from the list?")) {
    books.splice(index, 1);

    saveData();
    updateDashboard();
  }
}

// Record a library rule violation
const violationForm = document.getElementById("violationForm");

if (violationForm) {
  violationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const newViolation = {
      date: new Date().toLocaleDateString(),
      student: document.getElementById("violatorName").value.trim(),
      gradeSec: document.getElementById("violatorGradeSec").value.trim(),
      rule: document.getElementById("ruleViolated").value
    };

    violations.unshift(newViolation);

    saveData();
    violationForm.reset();
    updateDashboard();
  });
}


// ==========================================
// 4. UPDATE LIBRARIAN DASHBOARD
// ==========================================

function updateDashboard() {
  let availableCount = 0;
  let unavailableCount = 0;

  // Count available and unavailable books
  for (let i = 0; i < books.length; i++) {
    if (books[i].status === "Available") {
      availableCount++;
    } else {
      unavailableCount++;
    }
  }

  // Update dashboard numbers
  document.getElementById("statTotalBooks").textContent = books.length;
  document.getElementById("statAvailable").textContent = availableCount;
  document.getElementById("statUnavailable").textContent = unavailableCount;
  document.getElementById("statTotalVisits").textContent = visits.length;
  document.getElementById("statViolations").textContent = violations.length;

  // Display books
  const adminBookTable = document.getElementById("adminBookTable");

  adminBookTable.innerHTML = "";

  for (let i = 0; i < books.length; i++) {
    const book = books[i];

    const statusClass =
      book.status === "Available"
        ? "badge-available"
        : "badge-unavailable";

    adminBookTable.innerHTML += `
      <tr>
        <td><strong>${book.title}</strong></td>
        <td>${book.author}</td>
        <td>${book.year}</td>
        <td>${book.genre}</td>
        <td><span class="${statusClass}">${book.status}</span></td>
        <td style="white-space: nowrap;">
          <button class="toggle-btn" onclick="toggleBookStatus(${i})">
            Toggle
          </button>

          <button class="danger-btn" onclick="removeBook(${i})">
            Remove
          </button>
        </td>
      </tr>
    `;
  }

  // Display student visits
  const visitsTable = document.getElementById("visitsTable");

  visitsTable.innerHTML = "";

  if (visits.length === 0) {
    visitsTable.innerHTML = `
      <tr>
        <td colspan="4" class="empty-row">
          No student visits recorded yet.
        </td>
      </tr>
    `;
  } else {
    for (let i = 0; i < visits.length; i++) {
      visitsTable.innerHTML += `
        <tr>
          <td>${visits[i].dateTime}</td>
          <td><strong>${visits[i].name}</strong></td>
          <td>${visits[i].grade}</td>
          <td>${visits[i].section}</td>
        </tr>
      `;
    }
  }

  // Display rule violations
  const violationsTable = document.getElementById("violationsTable");

  violationsTable.innerHTML = "";

  if (violations.length === 0) {
    violationsTable.innerHTML = `
      <tr>
        <td colspan="4" class="empty-row">
          No rule violations recorded.
        </td>
      </tr>
    `;
  } else {
    for (let i = 0; i < violations.length; i++) {
      violationsTable.innerHTML += `
        <tr>
          <td>${violations[i].date}</td>
          <td><strong>${violations[i].student}</strong></td>
          <td>${violations[i].gradeSec}</td>
          <td>
            <span class="badge-unavailable">
              ${violations[i].rule}
            </span>
          </td>
        </tr>
      `;
    }
  }
}