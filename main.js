class Book {
    constructor(t, a, is) {
        this.title = t
        this.author = a
        this.isbn = is
    }
}

class UI {

    static displayBooks() {
        const storeBooks = Store.getBooks()
        storeBooks.forEach(book => {
            UI.addBookToList(book)
        })
    }

    static addBookToList(book) {
        const list = document.querySelector("#book-list")
        const row = document.createElement("tr") // <tr></tr>
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href=# class="btn btn-danger btn-sm delete">X</a></td>
        `
        list.appendChild(row)
    }

    static clearAllFields() {
        document.querySelector("#title").value = ""
        document.querySelector("#author").value = ""
        document.querySelector("#isbn").value = ""
    }

    static showAlert(msg, className) {
        const div = document.createElement("div")
        div.className = `alert alert-${className}`
        div.appendChild(document.createTextNode(msg))
        const form = document.querySelector("#book-form")
        const conrainer = document.querySelector(".container")
        conrainer.insertBefore(div, form)
        setTimeout(function () {
            document.querySelector(".alert").remove()
        }, 3000)
    }

    static deleteBook(el) {
        if (el.classList.contains("delete")) {
            el.parentElement.parentElement.remove()
            if (confirm("Are you sure"))
                UI.showAlert("Book Deleted Successfully", "danger")
            else
                UI.showAlert("Sahi hai", "dark")
        }
    }
}

class Store {

    static getBooks() {
        let books
        if (localStorage.getItem("books") === null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem("books"))
        }
        return books
    }

    static addBook(book){
        const books=Store.getBooks()
        books.push(book)
        localStorage.setItem("books",JSON.stringify(books))
    }

    static removeBook(isbn){
        const books=Store.getBooks()
        books.forEach((book,index) =>{
            if(book.isbn===isbn){
                books.splice(index,1)
            }
        })
        localStorage.setItem("books",JSON.stringify(books))
    }

}

document.querySelector("#book-form").addEventListener("submit", (e) => {
    e.preventDefault()
    const title = document.querySelector("#title").value
    const author = document.querySelector("#author").value
    const isbn = document.querySelector("#isbn").value
    if (title == "" || author == "" || isbn == "") {
        UI.showAlert("Please fill all the Fields", "warning")
    } else {
        const book = new Book(title, author, isbn)
        UI.addBookToList(book)
        UI.clearAllFields()
        UI.showAlert("Book Added Successfully", "success")
        Store.addBook(book)
    }
})

document.querySelector("#book-list").addEventListener("click", function (e) {
    UI.deleteBook(e.target)
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
})

document.addEventListener("DOMContentLoaded", UI.displayBooks())