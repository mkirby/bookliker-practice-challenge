// ANCHOR DOM Elements
const listPanelDiv = document.querySelector('#list-panel')
const bookTitleList = document.querySelector('#list')
const showPanelDiv = document.querySelector('#show-panel')
//I guess I'm suppose to hard code this to make the really bad but desired like functionality to work
let user = {"id":1, "username":"pouros"}

// ANCHOR Event Listeners
function clickListeners() {
  document.addEventListener('click', event => {
    if (event.target.matches('#list li')) {
      getBookInformation(event)
      .then(renderBookShowPanel)
    } else if (event.target.matches('#show-panel button')) {
      likeBook(event)
    }
  })
}

// ANCHOR Event Handlers
function getBookInformation(event) {
  const bookId = event.target.dataset.id
  return fetch(`http://localhost:3000/books/${bookId}`)
  .then(response => response.json())
}

function likeBook(event) {
  getBookInformation(event)
  .then(bookObj => {
    const bookId = bookObj.id
    let newUsersDataArray
    
    if (!bookObj.users.find(el => el.id === user.id)) {
      newUsersDataArray = [...bookObj.users, user]
    } else {
      newUsersDataArray = [...bookObj.users]
      let index = newUsersDataArray.findIndex(el => el.id === user.id)
      newUsersDataArray.splice(index, 1)
    }
    
    fetch(`http://localhost:3000/books/${bookId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        "users": newUsersDataArray
      })
    })
    .then(response => response.json())
    .then(renderBookShowPanel)
  })

}

// ANCHOR Render Functions
function renderBookShowPanel(bookObj) {
  console.log("Rendered Book: ", bookObj)

  showPanelDiv.innerHTML = ''

  const img = document.createElement('img')
  img.src = bookObj.img_url
  img.alt = bookObj.title

  const titleH3 = document.createElement('h3')
  titleH3.textContent = bookObj.title

  const subtitleH3 = document.createElement('h3')
  subtitleH3.textContent = bookObj.subtitle

  const authorH3 = document.createElement('h3')
  authorH3.textContent = bookObj.authorH3

  const p = document.createElement('p')
  p.textContent = bookObj.description

  const ul = document.createElement('ul')

  bookObj.users.forEach(user => {
    const li = document.createElement('li')
    li.textContent = user.username
    ul.append(li)
  })

  const likeButton = document.createElement('button')
  likeButton.dataset.id = bookObj.id
  likeButton.textContent = 'LIKE'

  showPanelDiv.append(img, titleH3, subtitleH3, authorH3, p, ul, likeButton)
  
}

function renderAllBookTitles(booksObj) {
  booksObj.forEach(renderSingleBookTitle)
}

function renderSingleBookTitle(bookObj) {
  const li = document.createElement('li')
  li.dataset.id = bookObj.id
  li.textContent = bookObj.title
  bookTitleList.append(li)
}

// ANCHOR Initial Render
function initialize() {
  fetch(`http://localhost:3000/books`)
  .then(response => response.json())
  .then(renderAllBookTitles)
}

// ANCHOR Function Calls
initialize()
clickListeners()