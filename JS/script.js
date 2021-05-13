// async function Test(){
//     let response = await fetch("/DB/db.json");
//     let data = await response.json();
//     console.log(data);
// }
// Test();

const cartContainer = document.querySelector(".cart-container");
const productBox = document.querySelector(".product-box");


eventListener();
function eventListener(){
    window.addEventListener("DOMContentLoaded",()=>{
        loadJson();
    });
}

//load product items form json file
async function loadJson() {
    await fetch("/DB/db.json")
        .then(async response => {
            return await response.json();
        })
        .then(data => {
            let html = "";
            data.forEach(element => {
                html +=
                `
                    <div class="col-3">
                        <div class="product-box">
                            <figure>
                                <img src="${element.imgSrc}" alt="Product Image">
                            </figure>
                            <div class="product-name">
                                <span>${element.name}</span>
                                <span>${element.size}</span>
                            </div>
                            <p>${element.details}</p>
                            <span class="price">${element.price}</span>
                            <br>
                            <div class="product-add">
                                <img class="sale-product" src="${element.logoAddPro}" alt="Logo Sale">
                            </div>
                        </div>
                    </div>
                `;
            });
            cartContainer.innerHTML = html;
        })
        .catch((error)=>{
            alert("Server Error",error);
        })
}


