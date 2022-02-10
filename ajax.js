var token;
var fetched_events;
var fetched_shared_events;

// Log in
function loginAjax(event) {
    const username = document.getElementById("username").value; // Get the username from the form
    const password = document.getElementById("password").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password };

    fetch("login_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`); token=data.token;})
        .catch(err => console.error(err));
}

document.getElementById("login_btn").addEventListener("click", loginAjax, false); // Bind the AJAX call to button click


// Log out
function logoutAjax(event) {
    fetch("logout_ajax.php", {
            method: "GET"
        })
        .then(response => response.json())
        .then(data => console.log(data.success ? "You've logged out!" : `You were not logged out ${data.message}`))
        .catch(err => console.error(err));
}

document.getElementById("logout_btn").addEventListener("click", logoutAjax, false); // Bind the AJAX call to button click


// Registration
function registerAjax(event) {
    const username = document.getElementById("new_username").value; // Get the new_username from the form
    const password = document.getElementById("new_password").value; // Get the new_password from the form

    // Make a URL-encoded string for passing POST data:
    const data = { 'new_username': username, 'new_password': password };

    fetch("register_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {console.log(data.success ? "You've registered!" : `You were not registered ${data.message}`); token=data.token;})
        .catch(err => console.error(err));
}

document.getElementById("register_btn").addEventListener("click", registerAjax, false); // Bind the AJAX call to button click


// Event Creation
function createEventAjax(event) {
    const title = document.getElementById("event_title").value; // Get the new_username from the form
    const time = document.getElementById("event_time").value; // Get the new_password from the form
    const date = document.getElementById("event_date").value; // Get the new_password from the form
    const tag = document.getElementById("tag").value;
    const share_with = document.getElementById("event_share").value;

    // Make a URL-encoded string for passing POST data:
    const data = { 'title': title, 'time': time, 'date': date, 'tag': tag, 'share_with':share_with, 'token': token};

    fetch("create_event_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => console.log(data.success ? "You've created a new event!" : `You did not create an event ${data.message}`))
        .catch(err => console.error(err));
}

document.getElementById("event_create_btn").addEventListener("click", createEventAjax, false);


// Get events
// Returns events created by the currently logged in user
function updateEvents() {
    fetch("get_events_ajax.php", {
            method: 'POST',
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {console.log(data.success ? "You've retrieved events!" : `You do not have any events ${data.message}`); fetched_events = data.events;})
        .catch(err => console.error(err));
}

function getEvents(){
  return fetched_events;
}


// Event Deletion
function deleteEventAjax(event) {
    const id = event.target.value;

    // Make a URL-encoded string for passing POST data:
    const data = { 'id': id, 'token': token};

    fetch("delete_event_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => console.log(data.success ? "You've deleted an event!" : `You did not delete an event ${data.message}`))
        .catch(err => console.error(err));
}


// Save edited event
function saveEditAjax(event) {
    const id = document.getElementById("edit_id").value;
    const title = document.getElementById("edit_title").value;
    const time = document.getElementById("edit_time").value;
    const date = document.getElementById("edit_date").value;
    const tag = document.getElementById("edit_tag").value;

    // Make a URL-encoded string for passing POST data:
    const data = {'id': id, 'title': title, 'time': time, 'date': date, 'tag': tag, 'token': token};

    fetch("save_edited_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => console.log(data.success ? "You've saved the change!" : `You did not save the change ${data.message}`))
        .catch(err => console.error(err));
}

document.getElementById("save_edited_btn").addEventListener("click", saveEditAjax, false);


// Get events
// Returns events created by the currently logged in user
function updateSharedEvents() {
    fetch("get_shared_events_ajax.php", {
            method: 'POST',
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {console.log(data.success ? "You've retrieved shared events!" : `You do not have any events ${data.message}`); fetched_shared_events = data.events;})
        .catch(err => console.error(err));
}

function getSharedEvents(){
  return fetched_shared_events;
}
