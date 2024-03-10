if (!localStorage.getItem("product")) {
    localStorage.setItem("product", JSON.stringify([]));
}

var btn = document.getElementById("btn");
var name1 = document.getElementById("name");
var price = document.getElementById("price");
var qty = document.getElementById("qty");
var pid = document.getElementById("pid");
var table = document.getElementById("productTable");
var lgout=document.getElementById("logout");
document.addEventListener('DOMContentLoaded', () => {

    const products = JSON.parse(localStorage.getItem("product"));
    if (!products || products.length === 0) {
        return;
    }
    products.forEach((item) => {
        renderTable(item);

    })
})
lgout.addEventListener('click',(e)=>{
    alert("logout");
    sessionStorage.setItem('loggedin', JSON.stringify([]));
    location.href="../user/dash.html";
})
function renderTable(obj) {
    if (!table.querySelector("thead")) {
        var thead = document.createElement('thead');
        var tr = document.createElement('tr');
        var th1 = document.createElement('th');
        th1.innerText = 'Index';
        var th6 = document.createElement('th');
        th6.innerText = 'Image';
        var th2 = document.createElement('th');
        th2.innerText = 'Product ID'; // Add Product ID column
        var th3 = document.createElement('th');
        th3.innerText = 'Name';
        var th4 = document.createElement('th');
        th4.innerText = 'Price';
        var th5 = document.createElement('th');
        th5.innerText = 'Quantity';
        var th7 = document.createElement('th');
        th7.innerText = 'Actions';
        tr.append(th1, th6, th2, th3, th4, th5, th7); // Add th7 for Actions
        thead.append(tr);
        table.append(thead);
    }

    var tbody = table.querySelector('tbody');
    if (!tbody) {
        tbody = document.createElement('tbody');
        table.append(tbody);
    }
    var tr = document.createElement('tr');
    var td1 = document.createElement('td');
    td1.innerText = obj.ind;

    var td2 = document.createElement('td');
    var img = document.createElement('img');
    img.src = obj.image; // Set the image source to the URL or file path
    img.alt = "Product Image";
    img.style.maxWidth = "100px";
    td2.appendChild(img);

    var td3 = document.createElement('td');
    td3.innerText = obj.pid; // Display Product ID

    var td4 = document.createElement('td');
    td4.innerText = `${obj.name}`;

    var td5 = document.createElement('td');
    td5.innerText = `${obj.price}`;

    var td6 = document.createElement('td');
    td6.innerText = `${obj.Quantity}`;

    var td7 = document.createElement('td');
    var edit = document.createElement("button");
    var del = document.createElement("button");
    edit.innerText = "Edit";
    del.innerText = "Delete";
    edit.setAttribute("onClick", "handleedit(this)")
    del.setAttribute("onClick", "handledelete(this)")
    td7.append(edit);
    td7.append(del);

    tr.append(td1, td2, td3, td4, td5, td6, td7);
    tbody.append(tr);
}


var productForm = document.getElementById("productForm");

productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    var formData = new FormData(productForm);
    var products = JSON.parse(localStorage.getItem("product")) || [];

    // Check if a product with the same pid already exists
    if (products.some(product => product.pid === formData.get("pid"))) {
        alert("Product with the same ID already exists!");
        return;
    }

    var reader = new FileReader();
    var imageFile = formData.get("image");

    reader.onload = function () {
        var img = new Image();
        img.src = reader.result;

        img.onload = function () {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            // Calculate the new width and height to maintain aspect ratio
            var maxWidth = 800; // Max width for the image
            var maxHeight = 600;    // Max height for the image
            var width = img.width;
            var height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;

            // Draw image on canvas
            ctx.drawImage(img, 0, 0, width, height);

            // Get the resized image as a data URL
            var resizedImage = canvas.toDataURL('image/jpeg', 0.7); // 0.7 is the quality (0-1)

            var obj = {
                ind: products.length + 1,
                pid: formData.get("pid"), // Add Product ID
                name: formData.get("name"),
                price: parseFloat(formData.get("price")),
                Quantity: parseFloat(formData.get("Quantity")),
                image: resizedImage
            };

            products.push(obj);
            localStorage.setItem("product", JSON.stringify(products));
            renderTable(obj);

            // Reset the form after submission
            //productForm.reset();
        };
    };

    reader.readAsDataURL(imageFile);

});

var editMode = false;
var editRow = null;

function handleedit(ob) {
    if (editMode == false) {
        // alert("false");
        editRow = ob.parentNode.parentNode;
        //editRow.cells[1].contentEditable = true;
        editRow.cells[3].contentEditable = true;
        editRow.cells[4].contentEditable = true;
        editRow.cells[5].contentEditable = true;
        //editRow.cells[3].contentEditable = true;
        editRow.cells[3].style.border = "3px black solid";
        editRow.cells[4].style.border = "3px black solid"
        editRow.cells[5].style.border = "3px black solid"
        ob.innerText = "Save";
        editMode = true;
    } else {
        //editRow.cells[1].contentEditable = false;
        editRow.cells[3].contentEditable = false;
        editRow.cells[4].contentEditable = false;
        editRow.cells[5].contentEditable = false;
        editRow.cells[3].style.border = "1px black solid";
        editRow.cells[4].style.border = "1px black solid"
        editRow.cells[5].style.border = "1px black solid"
        ob.innerText = "Edit";
        editMode = false;


        const products = JSON.parse(localStorage.getItem("product"));
        const ind = editRow.cells[0].innerText;
        const updatedObj = {
            ind: parseInt(ind),
            pid: editRow.cells[2].innerText,
            name: editRow.cells[3].innerText,
            price: editRow.cells[4].innerText,
            Quantity: editRow.cells[5].innerText
        };
        const updatedProducts = products.map(item => {
            if (item.ind === updatedObj.ind) {
                return updatedObj;
            }
            return item;
        });
        localStorage.setItem("product", JSON.stringify(updatedProducts));
    }
}

function handledelete(button) {
    if (confirm("Are you sure you want to delete this row?")) {
        var row = button.parentNode.parentNode;
        var ind = parseInt(row.cells[0].innerText);
        row.remove();

        const products = JSON.parse(localStorage.getItem("product"));
        const updatedProducts = products.filter(item => item.ind !== ind);
        localStorage.setItem("product", JSON.stringify(updatedProducts));
        updatedProducts.forEach((item, index) => {
            item.ind = index + 1;
        });
        localStorage.setItem("product", JSON.stringify(updatedProducts));


        table.innerHTML = "";
        updatedProducts.forEach(item => {
            renderTable(item);
        });

        alert("Data deleted successfully!");
    } else {
        alert("Deletion cancelled.");
    }
}
