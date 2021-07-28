import { variables } from './variables.js';

import{ Change_cart } from './functions.js';

function shopping_cart(){
    
const header = document.querySelector('header');

header.insertAdjacentHTML('beforeEnd', `<div class="shopping_cart" tabindex="0" transition-style class="--in-custom">
    <div class="cart_header">
        <h4>Shopping Cart</h4>
        ${(()=>(variables.cart_items.length) ? `<span>Checkout is almost done!</span>` : '')()}
    </div>
    <div class="cart_items"></div>
    <div class="cart_amount">
        <span>Total amount: <span>${variables.total_amount}</span></span>
        <span>Total price: <span>${variables.total_price}</span></span>
    </div>
    <button class="add_button buy_button" ${
        (()=>(!variables.cart_items.length) ? 'disabled' : '')()}>Buy</button>
    </div>`);

    const shopping_cart = document.querySelector('.shopping_cart');

const buy_button = document.getElementsByClassName('buy_button')[0];
    buy_button.addEventListener('click', function(event){
        event.stopPropagation();
        alert('buy button');
    })

const basket_logo = document.querySelector('.basket_logo');
    basket_logo.addEventListener('click', function(event){
        event.stopPropagation();
        shopping_cart.classList.toggle('active');
    });

    if(variables.cart_items.length) Change_cart();
}

export { shopping_cart }