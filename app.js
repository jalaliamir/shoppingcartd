import { productsData } from './products.js';

const cartBtn = document.querySelector('.cart-btn');
const cartModal = document.querySelector('.cart');
const backDrop = document.querySelector('.backdrop');
const closeModal = document.querySelector('.cart-item-confirm');

const productsDOM = document.querySelector('.products-center');
const cartTotal = document.querySelector('.cart-total');
const cartItems = document.querySelector('.cart-items');
//1. get products

let cart = [];

class Products {
  // get from api and point
  getProducts() {
    return productsData;
  }
}

//2. display products

class UI {
  displayProducts(products) {
    let result = '';
    products.forEach((item) => {
      result += `<div class="product">
      <div class="img-container">
        <img src=${item.imageUrl} class="product-img" />
      </div>
      <div class="product-desc">
        <p class="product-price">$ ${item.price}</p>
        <p class="product-title">${item.title}</p>
      </div>
      <button class="btn add-to-cart " data-id=${item.id}>
        <i class="fas fa-shopping-cart"></i>
        add to cart
      </button>
    </div>`;
      productsDOM.innerHTML = result;
    });
  }

  getAddToCartBtns() {
    const addToCartBrtn = [...document.querySelectorAll('.add-to-cart')];
    addToCartBrtn.forEach((btn) => {
      const id = btn.dataset.id;
      // check if this product id is in cart or not
      const isInCart = cart.find((p) => p.id === id);
      if (isInCart) {
        btn.innerText = 'in Cart';
        btn.disabled = true;
      }
      btn.addEventListener('click', (e) => {
        // console.log(e.target.dataset.id);
        e.target.innerText = 'in Cart';
        e.target.disabled = true;
        //get product from products
        const addedProduct = Storage.getProduct(id);
        // add to cart
        cart = [...cart, { ...addedProduct, quantity: 1 }];
        // save cart to local storage
        Storage.saveCart(cart);
        // update cart value
        this.setCartValue(cart);
        // add to cart item
      });
    });
  }
  setCartValue(cart) {
    //1. cart items:
    //2. cart total price
    let tempCartItems = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      tempCartItems += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    cartTotal.innerText = `total price : ${totalPrice.toFixed(2)} $`;
    cartItems.innerText = tempCartItems;
    console.log(tempCartItems);
  }
}

//3.storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
  }
  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem('products'));
    return _products.find((p) => p.id === parseInt(id));
  }
  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const products = new Products();
  const productsData = products.getProducts();
  // console.log(productsData);
  const ui = new UI();
  ui.displayProducts(productsData);
  ui.getAddToCartBtns();
  Storage.saveProducts(productsData);
});

//* cart items modal

function showModalFunction() {
  backDrop.style.display = 'block';
  cartModal.style.opacity = '1';
  cartModal.style.top = '20%';
}

function closeModalFunction() {
  backDrop.style.display = 'none';
  cartModal.style.opacity = '0';
  cartModal.style.top = '-100%';
}

cartBtn.addEventListener('click', showModalFunction);
closeModal.addEventListener('click', closeModalFunction);
backDrop.addEventListener('click', closeModalFunction);
