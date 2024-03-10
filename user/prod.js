var productContainer = document.getElementById("productContainer");
var viewmore = document.getElementById("view-more");
var viewless = document.getElementById("view-less");

var username=document.getElementById("username");
document.addEventListener('DOMContentLoaded', () => {
    var user1 = JSON.parse(sessionStorage.getItem('loggedin'));
    if (!user1 || user1.length === 0) {
        var username = document.getElementById("username");
        if (username) {
            username.parentNode.remove();
        }
    } else {
        var useremail = user1[0];
        const user = JSON.parse(localStorage.getItem("user"));
        const activeuser = user.filter((item) => {
            return item.email === useremail;
        })
        if (activeuser.length > 0) {
            var username = document.getElementById("username");
            if (username) {
                username.innerHTML = activeuser[0].name;
            }
        } else {
            var username = document.getElementById("username");
            if (username) {
                username.parentNode.remove();
            }
        }
    }
    const products = JSON.parse(localStorage.getItem("product"));
    const showAllProducts = localStorage.getItem("showAllProducts") === "true";

    if (!products || products.length === 0) {
        return;
    }

    const halfLength = Math.ceil(products.length / 2);
    if (showAllProducts) {
        showAllProductsInView(products);
    } else {
        showLimitedProductsInView(products, halfLength);
    }
})

function showLimitedProductsInView(products, limit) {
    productContainer.innerHTML = '';

    products.slice(0, limit).forEach((item) => {
        appendProduct(item);
    });

    viewmore.style.display = 'block';
    viewless.style.display = 'none';

    viewmore.addEventListener('click', () => {
        showAllProductsInView(products);
        localStorage.setItem("showAllProducts", "true");
    });
}

function showAllProductsInView(products) {
    productContainer.innerHTML = '';

    products.forEach((item) => {
        appendProduct(item);
    });

    viewmore.style.display = 'none';
    viewless.style.display = 'block';

    viewless.addEventListener('click', () => {
        const halfLength = Math.ceil(products.length / 2);
        showLimitedProductsInView(products, halfLength);
        localStorage.setItem("showAllProducts", "false");
    });
}




function appendProduct(item) {
    var div = document.createElement('div');
    div.classList.add('product-item');

    var name = document.createElement('p');
    name.innerText = `Name: ${item.name}`;
    div.appendChild(name);

    var price = document.createElement('p');
    price.innerText = `Price: ${item.price}`;
    div.appendChild(price);

    var quantity = document.createElement('p');
    quantity.innerText = `Quantity: ${item.Quantity}`;
    div.appendChild(quantity);


    if (item.image) {
        var img = document.createElement('img');
        img.src = item.image;
        img.alt = "Product Image";
        img.style.maxWidth = "100px";
        div.appendChild(img);
    }
    var br=document.createElement("br");
    div.append(br);
    var addtocart = document.createElement("button");
    addtocart.innerText = "Add to cart";
    addtocart.dataset.item = JSON.stringify(item);
    addtocart.addEventListener("click", handleaddtocart);
    div.appendChild(addtocart);

    productContainer.appendChild(div);
}


function handleaddtocart(event) {
    var button = event.target;
    var item = JSON.parse(button.dataset.item); // Retrieve item details from the button
    var isLoggedIn = checkUserLoggedIn();
    // alert(isLoggedIn[0]);
    if (isLoggedIn[0] != null) {
        var currentuser = isLoggedIn[0];
        var cart = JSON.parse(localStorage.getItem("cart")) || [];
        var userCart = cart.find((cartItem) => cartItem.email === currentuser);
        if (!userCart) {
            userCart = { email: currentuser, items: [] };
            cart.push(userCart);
        }
        if (userCart.items.some((cartItem) => cartItem.pid === item.pid)) {
            alert("Product already exists in your cart!");
        } else {
            userCart.items.push(item);
            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Product added to cart");
        }
    } else {
        location.href = '../login.html';
    }
}


function checkUserLoggedIn() {
    let loggedin = JSON.parse(sessionStorage.getItem('loggedin'));
    //alert(loggedin);
    return loggedin;
    // return session.getItem("isLoggedIn") === "true";
}



document.getElementById('logout').addEventListener('click', function() {
    // Remove the email from sessionStorage
    //alert("log out");
    //username.innerText = '';
    username.parentNode.remove();
    // var user1=JSON.parse(sessionStorage.getItem('loggedin'));
    // user1.pop();

    sessionStorage.setItem('loggedin', JSON.stringify([]));
});
