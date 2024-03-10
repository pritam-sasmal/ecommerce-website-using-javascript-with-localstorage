//Function to retrieve or initialize the user array in session storage
function getUsers() {
    let loggedin = JSON.parse(sessionStorage.getItem('loggedin'));
    if (!loggedin) {
        loggedin = [];
        sessionStorage.setItem('loggedin', JSON.stringify(loggedin));
    }
    return loggedin;
}

// Function to add a user to the array in session storage
function addUser(email) {
    let loggedin = getUsers();
    if (!loggedin.includes(email)) {
        loggedin.push(email);
        sessionStorage.setItem('loggedin', JSON.stringify(loggedin));
    }
}

// Check if user data exists in localStorage, if not, initialize it to an empty array
if (!localStorage.getItem("user")) {
    localStorage.setItem("user", JSON.stringify([]));
}

const login = document.getElementById("login");
const email = document.getElementById("email");
const password = document.getElementById("password");
const role = document.getElementById("role");

login.addEventListener('click', (e) => {
    e.preventDefault();
    var eValue = email.value;
    var p = password.value;
    var r = role.value;
    var localstoragedata = JSON.parse(localStorage.getItem("user"));
    var f = 0;
    localstoragedata.forEach(function (item) {
        if (item.email === eValue && item.password === p && item.role === r) {
            f = 1;
            // Add the logged-in user's email to session storage
            addUser(eValue);

            if (r === 'user') {
                location.href = './user/dash.html';
            } else {
                location.href = './admin/product.html';
            }
        }
    });
    if (f === 0) {
        alert("Invalid user");
    }
});
