const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users";
const users = JSON.parse(localStorage.getItem('favoriteUsers'))
const dataPanel = document.querySelector("#data-panel");

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
              <button class="btn btn-danger btn-remove-user" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}

//監聽 data panel
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-user")) {
    showUserModal(event.target.dataset.id);
  } else if (event.target.matches(".btn-remove-user")) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
});

//刪除收藏名單
function removeFromFavorite(id) {
  if (!users) return
  const userIndex = users.findIndex((user) => user.id === id)
  if (userIndex === -1) return
  users.splice(userIndex, 1)
  localStorage.setItem('favoriteUsers', JSON.stringify(users))
  renderUsersList(users)
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

renderUsersList(users)