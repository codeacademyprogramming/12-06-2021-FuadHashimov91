
const cartContainer = document.querySelector(".cart-container");
const productBox = document.querySelector(".product-box");
const cartList = document.querySelector(".cart-list");
const cartCountInfo = document.querySelector("#cart-count-info");
const cartTotalValue = document.querySelector("#cart-total-value");
const saleProduct = document.querySelectorAll(".sale-product");

let cartItemID = 1;
eventListener();
function eventListener(){
    window.addEventListener("DOMContentLoaded",()=>{
        loadJson();
        loadCart();
    });

    cartContainer.addEventListener("click",purchaseProduct);
    cartList.addEventListener("click",deleteProduct);
}
function updateCart() {
    let cartInfo = findCartInfo();
    cartCountInfo.textContent = cartInfo.productCount;
    cartTotalValue.textContent = cartInfo.total;
}
updateCart();
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
                            <figure class="product-image">
                                <img src="${element.imgSrc}" alt="Product Image">
                            </figure>
                            <div class="product-name">
                                <span class="productName">${element.name}</span>
                                <span class="productSize" >${element.size}</span>
                            </div>
                            <p class="product-detail">${element.details}</p>
                            <span class="price">${element.price}</span>
                            <br>
                            <div class="product-add">
                                <img class="saleProduct" src="${element.logoAddPro}" alt="Logo Sale">
                            </div>
                        </div>
                    </div>
                `;
            });
            cartContainer.innerHTML = html;
        }) ;
}
function purchaseProduct(e){
    if(e.target.classList.contains('saleProduct')){
        let product = e.target.parentElement.parentElement;
        getProductInfo(product);
    }
}
function getProductInfo(product) {
    let productInfo = {
        id:cartItemID,
        imgSrc:product.querySelector(".product-image img").src,
        name:product.querySelector(".productName").textContent,
        size:product.querySelector(".productSize").textContent,
        productDetail:product.querySelector(".product-detail").textContent,
        price:product.querySelector(".price").textContent
    };
    cartItemID++;
    addToCartList(productInfo);
    saveProductInStorage(productInfo);
}
function addToCartList(product) {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.setAttribute('data-id',`${product.id}`);
    cartItem.innerHTML =`
        <div class="row">
            <div class="col-4">
                <img src="${product.imgSrc}" alt="Sale Image">
            </div>
            <div class="col-8 d-flex justify-content-between align-items-center price-sel">
                <p>${product.productDetail}</p>
                <span>${product.price}<sup>$</sup></span>
                <button type = "button" class = "btn cart-item-del-btn">
                    <i class = "fas fa-times"></i>
                </button>
            </div>
        </div>
    `;
    cartList.appendChild(cartItem);
}
function saveProductInStorage(item) {
    let products = getProductFromStorage();
    products.push(item);
    localStorage.setItem('products',JSON.stringify(products));
    updateCart();
}
function getProductFromStorage(){
    return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
}
function loadCart() {
    let products = getProductFromStorage();
    if(products.length < 1){
        cartItemID = 1;
    }
    else{
        cartItemID = products[products.length - 1].id;
        cartItemID++;
    }
    products.forEach(product => addToCartList(product));
    updateCart();
}
//Calculate Price
function findCartInfo() {
    let products = getProductFromStorage();
    let total = products.reduce((acc,product)=>{
        let price = parseFloat(product.price.substr(0));
        return acc+=price;
    },0);
    return {
        total:total.toFixed(2),
        productCount:products.length
    }
}
function deleteProduct(e){
    let cart;
    if(e.target.tagname === "BUTTON"){
        cart = e.target.parentElement.parentElement.parentElement;
        cart.remove();
    }
    else if(e.target.tagname ="I"){
        cart = e.target.parentElement.parentElement.parentElement;
        cart.remove();
    }
    let products = getProductFromStorage();
    let updatePro = products.filter(product =>{
        return product.id !== parseInt(cart.dataset.id); 
    })
    localStorage.setItem('products',JSON.stringify(updatePro));
    updateCart();
}


