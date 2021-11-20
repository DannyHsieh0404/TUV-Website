BASE_URL = "https://randomuser.me/api/?"
let userPanel = document.querySelector('#user-panel')
let paginators = document.querySelector('.pagination')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

USERS_PER_PAGE = 12
NUM_OF_USERS = 120

const model = {
  users: [],
  favorite: [],
  filteredUsers: [],

  getUsersByPage(page) {
    // 1. Determine which user list to split
    let list = this.filteredUsers.length ? this.filteredUsers : this.users
    // 2. Find where to start
    let startIndex = (page - 1) * USERS_PER_PAGE
    // 3. Split the data of users
    return list.slice(startIndex, startIndex + USERS_PER_PAGE)
  }
}

const view = {
  loadUserData(users) {
    let rawHTML = ''
    let id = 0
    users.forEach(user => {
      rawHTML += `<div class="card m-4" id="user" style=" width: 16rem; data-id="${id}">
        <img src="${user.picture.large}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="name">${user.name.first} ${user.name.last}</h5>
          <h6 class="school">${user.location.city} University, ${user.location.country}</h6>
        </div>
      </div>`

      id++
    })
    userPanel.innerHTML = rawHTML
  },

  generateRandomUsers() {
    axios.get(BASE_URL + `&results=${NUM_OF_USERS}`)
      .then(response => {
        model.users.push(...response.data.results)
        this.loadUserData(model.getUsersByPage(1))
        this.renderPaginators(model.users.length)
      })
      .catch(error => console.log(error))
  },

  renderPaginators(numOfUsers) {
    const numOfPages = Math.ceil(numOfUsers / USERS_PER_PAGE)

    let rawHTML = ''
    for (let page = 1; page <= numOfPages; page++) {
      rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page = ${page}>${page}</a></li>`
    }
    paginators.innerHTML += rawHTML
  }
}


const controller = {
  renderUserPanel() {
    view.generateRandomUsers()
  },

  changePage() {
    // Change the pages (when clicking paginations)
    paginators.addEventListener('click', function onPaginatorClicked(event) {
      page = Number(event.target.dataset.page)
      view.loadUserData(model.getUsersByPage(page))
    })
  },

  searchUser() {
    // Event Listener
    searchForm.addEventListener('click', function onFormSubmitted(event) {
      event.preventDefault() // avoid the page being re-loaded
      utility.findUser(event)
      view.loadUserData(model.getUsersByPage(1)) // re-render the panel (page 1 by default)
      view.renderPaginators(model.filteredUsers.length) // re-render the paginators
    })
  },
}


const utility = {
  findUser(event) {
    // Get the keyword
    const keyword = searchInput.value.toLowerCase().trim()

    // Filter out the users that match
    model.filteredUsers = model.users.filter(function (user) {
      return user.name.first.toLowerCase().trim().includes(keyword) || user.name.last.toLowerCase().trim().includes(keyword)
    })

    // Deal with exceptions
    if (!model.filteredUsers.length && event.target.tagName === "BUTTON") {
      return alert("請輸入有效關鍵字!")
    }
  },
}


///////////////////////////////// Execution /////////////////////////////////
controller.renderUserPanel()

controller.changePage()

controller.searchUser()