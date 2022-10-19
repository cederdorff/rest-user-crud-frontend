// ====== REST SERVICE ("model") ====== //
const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1"
const serverUrl = 'API_URL_HERE';
const endpoint = isLocalhost ? 'http://localhost:3000' : serverUrl;

// === READ (GET) === //
async function getUsers() {
    const res = await fetch(`${endpoint}/users`);
    const users = await res.json();
    return users;
}

async function getUser(id) {
    const res = await fetch(`${endpoint}/users/${id}`);
    const data = await res.json();
    return data;
}

// === CREATE (POST) === //
async function createUser(user) {
    const userAsJson = JSON.stringify(user);
    const res = await fetch(`${endpoint}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: userAsJson
    });
    console.log(res);
}

// === UPDATE (PUT) === //
async function updateUser(user) {
    const userAsJson = JSON.stringify(user);
    const res = await fetch(`${endpoint}/users/${user.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: userAsJson
    });
    const data = await res.json();
    console.log(data);
}

// === DELETE (DELETE) === //
async function deleteUser(id) {
    const res = await fetch(`${endpoint}/users/${id}`, { method: "DELETE" });
    console.log(res);
}

// ====== REST SERVICE END ====== //

// ====== EVENTS ====== ("controller+view") //

let selectedUserId;

function appendUsers(userList) {
    let html = "";

    for (const user of userList) {
        html += /*html*/ `
             <article>
                <img src="${user.image}">
                <h2>${user.name}</h2>
                <p>${user.title}</p>
                <a href="mailto:${user.mail}">${user.mail}</a>
                 <div class="btns">
                    <button class="btn-update-user" data-id="${user.id}">Update</button>
                    <button class="btn-delete-user" data-id="${user.id}">Delete</button>
                </div>
            </article>
        `;
    }

    document.querySelector("#users-grid").innerHTML = html;
    addUserClickEvents();
}

function addUserClickEvents() {
    //delete event
    document.querySelectorAll(".btn-delete-user").forEach(
        btn =>
            (btn.onclick = async () => {
                const userId = btn.getAttribute("data-id");
                const shouldDelete = confirm("Are you sure you want to delete this user?");
                if (shouldDelete) {
                    await deleteUser(userId);
                    onUsersListChanged();
                }
            })
    );

    //update event
    document.querySelectorAll(".btn-update-user").forEach(
        btn =>
            (btn.onclick = async () => {
                selectedUserId = btn.getAttribute("data-id");
                const user = await getUser(selectedUserId);
                const form = document.querySelector("#form-update");
                form.name.value = user.name;
                form.title.value = user.title;
                form.mail.value = user.mail;
                form.image.value = user.image;
                form.scrollIntoView({ behavior: "smooth" });
            })
    );
}

function createSubmitEvent() {
    document.querySelector("#form-create").onsubmit = async event => {
        event.preventDefault();
        const name = event.target.name.value;
        const title = event.target.title.value;
        const mail = event.target.mail.value;
        const image = event.target.image.value;
        await createUser({ name, title, mail, image });
        onUsersListChanged();
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
}

function updateSubmitEvent() {
    document.querySelector("#form-update").onsubmit = async event => {
        event.preventDefault();
        const name = event.target.name.value;
        const title = event.target.title.value;
        const mail = event.target.mail.value;
        const image = event.target.image.value;
        await updateUser({ id: selectedUserId, name, mail, title, image });
        onUsersListChanged();
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
}

async function onUsersListChanged() {
    const users = await getUsers();
    appendUsers(users);
}

// ========= EVENTS END ====== //

// === INITIALIZE APP === //

function initApp() {
    onUsersListChanged();
    createSubmitEvent();
    updateSubmitEvent();
}

initApp();

// ====== INITIALIZE APP END ====== //
