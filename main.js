import "./style.css";

// Book Class: represents a book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
// UI Class: handles UI tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.map((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");
    row.setAttribute("class", "h-10");

    row.innerHTML = `
      <td class="border-2 border-gray-500 rounded pl-2">${book.title}</td>
      <td class="border-2 border-gray-500 rounded pl-2">
        ${book.author}
      </td>
      <td class="border-2 border-gray-500 rounded pl-2">${book.isbn}</td>
      <td class="border-2 border-gray-500 rounded text-center">
        <a class="delete bg-red-500 text-white z-10 p-2" href="#">X</a>
      </td>
    `;

    list.appendChild(row);
  }

  static deleteBook(element) {
    if (element.classList.contains("delete")) {
      element.parentElement.parentElement.remove();
    }
  }

  static ShowAlert(message, className, time) {
    const div = document.createElement("div");
    div.className = `alert w-9/12 h-10 ${className} mx-auto mt-5 p-2 text-white`;
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");

    container.insertBefore(div, form);
    // Remove alert after 3 seconds
    setTimeout(function () {
      container.removeChild(div);
    }, time);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

// Store Class: handles storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach(function (book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}
// Event: displays books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: add a book
document.querySelector("#book-form").addEventListener("submit", function (e) {
  // Prevent actual submit (browser default behaviour)
  e.preventDefault();

  // Get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  // validate form
  if (title === "" || author === "" || isbn === "") {
    UI.ShowAlert("Please fill in all Fields!", "bg-red-500", 1000);
  } else {
    // Instatiate book
    const book = new Book(title, author, isbn);

    // Add book to UI
    UI.addBookToList(book);

    // Add book to store
    Store.addBook(book);

    // Show successfull alert
    UI.ShowAlert("Booked added successfully.", "bg-green-500", 1000);

    // Clear fields
    UI.clearFields();
  }
});
// Event: remove a book
document.querySelector("#book-list").addEventListener("click", function (e) {
  // delete a book from UI
  UI.deleteBook(e.target);

  // delete book from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Show successfull alert
  UI.ShowAlert("Book deleted Successfully.", "bg-green-500", 500);
});
