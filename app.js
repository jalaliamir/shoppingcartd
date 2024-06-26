import { productsData } from './products.js';

const cartBtn = document.querySelector('.cart-btn');
const cartModal = document.querySelector('.cart');
const backDrop = document.querySelector('.backdrop');
const closeModal = document.querySelector('.cart-item-confirm');

const productsDOM = document.querySelector('.products-center');
const cartTotal = document.querySelector('.cart-total');
const cartItems = document.querySelector('.cart-items');
const cartContent = document.querySelector('.cart-content');
const clearCart = document.querySelector('.clear-cart');
//1. get products

let cart = [];

let buttonsDOM = [];
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
        add to cart
      </button>
    </div>`;
      productsDOM.innerHTML = result;
    });
  }

  getAddToCartBtns() {
    const addToCartBrtn = [...document.querySelectorAll('.add-to-cart')];
    buttonsDOM = addToCartBrtn;
    addToCartBrtn.forEach((btn) => {
      const id = btn.dataset.id;
      // check if this product id is in cart or not
      const isInCart = cart.find((p) => p.id === parseInt(id));
      if (isInCart) {
        btn.innerText = 'in Cart';
        btn.disabled = true;
      }
      btn.addEventListener('click', (e) => {
        // console.log(e.target.dataset.id);
        e.target.innerText = 'in Cart';
        e.target.disabled = true;
        //get product from products
        const addedProduct = { ...Storage.getProduct(id), quantity: 1 };
        // add to cart
        cart = [...cart, addedProduct];
        // save cart to local storage
        Storage.saveCart(cart);
        // update cart value
        this.setCartValue(cart);
        // add to cart item
        this.addCartItem(addedProduct);
        // get cart from storage!
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
  }
  addCartItem(cartItem) {
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `<img class="cart-item-img" src=${cartItem.imageUrl} />
    <div class="cart-item-desc">
      <h4>${cartItem.title}</h4>
      <h5>$ ${cartItem.price}</h5>
    </div>
    <div class="cart-item-conteoller">
      <i class="fas fa-chevron-up" data-id=${cartItem.id}></i>
      <p>${cartItem.quantity}</p>
      <i class="fas fa-chevron-down" data-id=${cartItem.id}></i>
      </div>
      <i class="far fa-trash-alt" data-id=${cartItem.id}></i>`;
    cartContent.appendChild(div);
  }
  setUpApp() {
    //get cart from storage
    cart = Storage.getCart();
    // add cart item
    this.setCartValue(cart);
    // cart.forEach((cartItem) => this.addCartItem(cartItem));
  }
  cartLogic() {
    // clear cart
    clearCart.addEventListener('click', () => {
      this.clearCart();
    });

    // cart functionality
    cartContent.addEventListener('click', (e) => {
      // console.log([...e.target.classList][1]);
      if (e.target.classList.contains('fa-chevron-up')) {
        console.log(e.target.dataset.id);
        const addQuatity = e.target;
        // 1. get item from cart
        const addedItem = cart.find(
          (cItem) => cItem.id == addQuatity.dataset.id
        );
        // 2. save cart
        addedItem.quantity++;
        this.setCartValue(cart);
        // 3. update cart value
        Storage.saveCart(cart);
        // 4. update cart in UI
        addQuatity.nextElementSibling.innerText = addedItem.quantity;
      } else if (e.target.classList.contains('fa-trash-alt')) {
        const removeItem = e.target;
        const _removedItem = cart.find((c) => c.id == removeItem.dataset.id);
        this.removeItem(_removedItem.id);
        Storage.saveCart(cart);
        cartContent.removeChild(removeItem.parentElement);
        //remove from cartItem
        // remove
      } else if (e.target.classList.contains('fa-chevron-down')) {
        const subQuantity = e.target;
        const subStractedItem = cart.find(
          (c) => c.id == subQuantity.dataset.id
        );
        if (subStractedItem.quantity === 1) {
          this.removeItem(subStractedItem.id);
          cartContent.removeChild(subQuantity.parentElement.parentElement);
          return;
        }
        subStractedItem.quantity--;
        this.setCartValue(cart);
        Storage.saveCart(cart);
        subQuantity.previousElementSibling.innerText = subStractedItem.quantity;
      }
    });
  }
  clearCart() {
    // remove :(DRY)
    console.log('clear');
    cart.forEach((cItem) => this.removeItem(cItem.id));
    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.children[0]);
    }
    closeModalFunction();
  }
  removeItem(id) {
    // update cart
    console.log(id);
    cart = cart.filter((cItem) => cItem.id !== id);
    // total price and cart items
    this.setCartValue(cart);
    console.log(cart);
    console.log(this.setCartValue(cart));
    // update storage
    Storage.saveCart(cart);
    //get add to cart btns => update text and disable
    this.getSingleButton(id);
  }
  getSingleButton(id) {
    const button = buttonsDOM.find(
      (btn) => parseInt(btn.dataset.id) === parseInt(id)
    );
    button.innerText = 'add to cart';
    button.disabled = false;
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
  static getCart() {
    return JSON.parse(localStorage.getItem('cart')) && [];
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const products = new Products();
  const productsData = products.getProducts();
  // set up : get cart and set up app:
  const ui = new UI();
  ui.setUpApp();
  ui.displayProducts(productsData);
  ui.getAddToCartBtns();
  ui.cartLogic();
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
