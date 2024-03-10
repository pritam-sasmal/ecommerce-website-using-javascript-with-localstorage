if (!localStorage.getItem("user")) {
    localStorage.setItem("user", JSON.stringify([]));
}
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

const signup = document.getElementById("signup");
const name1 = document.getElementById("name"); // Added name input element
const email = document.getElementById("email");
const password = document.getElementById("password");
const role = document.getElementById("role");

signup.addEventListener('click', (e) => {
    e.preventDefault();
    var nvalue = name1.value; // Get the value of the name input
    var evalue = email.value;
    var pvalue = password.value;
    var r = role.value;
    var localstoragedata = JSON.parse(localStorage.getItem("user"));
    var flag = 1;
    localstoragedata.forEach(function (item) {
        if (item.email === evalue) {
            flag = 0;
            alert("already signed up");
            location.href = './login.html';
        }
    })
    if (flag == 1) {
        const obj = {
            name: nvalue, // Include the name in the object to be stored
            email: evalue,
            password: pvalue,
            role: r
        }
        if (r === 'user') {
            localstoragedata.push(obj);
            localStorage.setItem("user", JSON.stringify(localstoragedata));
            addUser(evalue);
            location.href = './user/dash.html';
        } else {
            if (evalue === 'a@gmail.com' && pvalue === '1234') {
                localstoragedata.push(obj);
                localStorage.setItem("user", JSON.stringify(localstoragedata));
                addUser(evalue);
                location.href = './admin/product.html';
            } else {
                alert("You are not admin😂");
            }
        }
    }
})
