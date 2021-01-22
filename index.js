const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users";
const users = [];
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const button = document.querySelector("#search-sumit-button")
const USERS_PER_PAGE = 12
const paginator = document.querySelector("#paginator")
let filteredUsers = []

// 串接API資料
axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results);
    console.log(users);
    renderPaginator(users.length)
    renderUsersList(getUsersByPage(1));
  })
  .catch((err) => console.log(err));

//渲染使用者名單
function renderUsersList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `<div class="col-sm-4 col-md-3 col-lg-2">
        <div class="card-deck mb-2">
          <div class="card";>
            <img src="${item.avatar}" class="card-img-top" alt="user-avatar">
            <div class="card-body">
              <h6 class="card-title">${item.name} ${item.surname}</h6>
              <button class="btn btn-primary btn-show-user" data-toggle="modal" data-target="#user-modal" data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-user" data-id="${item.id}">Add</button>
            </div>
          </div>
        </div>
      </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}

//渲染user modal資料
function showUserModal(id) {
  const modalBody = document.querySelector(
    ".modal-body")
  const modalTitle = document.querySelector("#user-modal-title");
  axios.get(INDEX_URL + "/" + id).then((response) => {
    const data = response.data;
    modalTitle.innerText = `${data.name} ${data.surname}`;
    modalBody.innerHTML = `<div class="modal-avatar col-sm-4">
                    <img src="${data.avatar}" alt="modal-avatar">
                  </div>
                  <div class="modal-description col-sm-8">
                    <p>Email: ${data.email}</br>
                      gender: ${data.gender}</br>
                      Age: ${data.age}</br>
                      Region: ${data.region}</br>
                      Birthday: ${data.birthday}</br>                 
                    </p>
                  </div>`
  })
}


// 切割使用者名單陣列
function getUsersByPage(page) {
  const data = filteredUsers.length ? filteredUsers : users
  const startIndex = (page - 1) * USERS_PER_PAGE
  // const currentPage = page
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
}

// 根據使用者名單數量製造分頁器
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item" ><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

// 分頁器設置監聽器
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderUsersList(getUsersByPage(page))
})

// 監聽search bar
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filteredUsers = users.filter((user) => user.name.toLowerCase().includes(keyword) || user.surname.toLowerCase().includes(keyword)
  )
  if (filteredUsers.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有找到相同姓名的人物`)
  }
  renderPaginator(filteredUsers.length)
  renderUsersList(getUsersByPage(1))
})


//監聽 data panel
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-user")) {
    showUserModal(event.target.dataset.id);
  } else if (event.target.matches(".btn-add-user")) {
    addToFavorite(Number(event.target.dataset.id))
  }
});

//新增到收藏名單，再存到 local storage
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
  const user = users.find((user) => user.id === id)
  if (list.some((user) => user.id === id)) {
    return alert('已經加入在收藏清單中!')
  }
  list.push(user)
  localStorage.setItem('favoriteUsers', JSON.stringify(list))
}
