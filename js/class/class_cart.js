import { getEl } from './class_functions.js'

import { cart } from './class_init.js';

class Cart{

    #cart_items = [];
    #total_amount = 0;
    #total_price = 0;

    constructor(){

        if(localStorage.getItem('cart_items')){
            
            let ls = JSON.parse(localStorage.getItem('cart_items'));

            items.forEach((item)=>{
                ls.cart.forEach((val)=>{
                    if(val.id == item.id) {
                        item.amount = val.amount;
                        this.#cart_items.push(item);
                        this.#total_amount += +val.amount;
                        this.#total_price += (+item.price * +val.amount);          
                    }
                })
            });
        }
    }
    
    Change_cart(item){

        this.#total_price = 0;
        this.#total_amount = 0;
        
        if(typeof item == 'number'){
            this.#cart_items.splice(item, 1);
        }else if(typeof item == 'object' && !new Set(this.#cart_items).has(item)){
            item.amount = 1;
            item.all_price = +item.price * +item.amount;
            this.#cart_items.push(item);
        }

        const html_cart_items = document.getElementsByClassName('cart_items')[0];
            html_cart_items.innerText = '';
    
        const cart_items_amount = document.getElementsByClassName('cart_items_amount')[0];
            cart_items_amount.innerText = this.#cart_items.length;
        
        const buy_button = document.querySelector('.buy_button');
        const cart_header = document.getElementsByClassName('cart_header')[0];
        
        if(!this.#cart_items.length){
    
            localStorage.clear();
            cart_items_amount.style.display ='none';
            buy_button.disabled = true;

            if(cart_header.children.length > 1) cart_header.removeChild(cart_header.children[1]);
    
            let cart_item = document.createElement('div');
                cart_item.setAttribute('class', 'cart_item');
                cart_item.innerText = 'Cart is empty!';
            
            html_cart_items.appendChild(cart_item);
            
        }else{
            for(let key in this.#cart_items){
                
                this.#total_price += +this.#cart_items[key].price * +this.#cart_items[key].amount;
                this.#total_amount += +this.#cart_items[key].amount;
    
                let cart_item = document.createElement('div');
                    cart_item.setAttribute('class', 'cart_item');
                    cart_item.insertAdjacentHTML('afterBegin',
                        `<div class="cart_img_wrap">
                            <img src="img/${this.#cart_items[key].imgUrl}" alt="${this.#cart_items[key].name}">
                        </div>
                        <div class="cart_item_description">
                            <h5>${this.#cart_items[key].name}</h5>
                            <span>$ ${this.#cart_items[key].price}</span>
                        </div>`
                    );
            
                const cart_item_amount = document.createElement('div');
                    cart_item_amount.setAttribute('class', 'cart_item_amount');
                
                const btn_deduct = document.createElement('button');
                    btn_deduct.setAttribute('class', 'change_item_amount');
                    btn_deduct.innerHTML = '&#60;';
                    btn_deduct.addEventListener('click', function(event){
                        event.stopPropagation();
                        
                        ((cart)=>{
                            --cart.#cart_items[key].amount;
                            cart.#cart_items[key].all_price = cart.#cart_items[key].price * cart.#cart_items[key].amount;
                            --cart.#total_amount;
                            cart.#total_price -= cart.#cart_items[key].price;
                        
                            cart.Render_shopping_cart();
                        })(cart);
                        
                    });
    
                if(this.#cart_items[key].amount <= 1) btn_deduct.disabled = true;
                
                const span = document.createElement('span');
                    span.innerText = `${this.#cart_items[key].amount}`;
    
                const btn_add = document.createElement('button');
                    btn_add.setAttribute('class', 'change_item_amount');
                    btn_add.innerHTML = '&#62;';
                    btn_add.addEventListener('click', function(event){
                        event.stopPropagation();
                        
                        ((cart)=>{
                            ++cart.#cart_items[key].amount;
                            cart.#cart_items[key].all_price = cart.#cart_items[key].price * cart.#cart_items[key].amount;
                            ++cart.#total_amount;
                            cart.#total_price += cart.#cart_items[key].price;
                            
                            cart.Render_shopping_cart();
                        })(cart);
                    });
                
                if(this.#cart_items[key].amount >= 4) btn_add.disabled = true;
    
                const btn_remove = document.createElement('button');
                    btn_remove.setAttribute('class', 'remove_cart_item');
                    btn_remove.innerText = 'X';
                    btn_remove.addEventListener('click', function(event){
                        event.stopPropagation();
    
                        ((cart)=>{
                            cart.#total_amount -= cart.#cart_items[key].amount;
                            cart.#total_price -= cart.#cart_items[key].all_price;
                            
                            cart.Change_cart(+key);
                        })(cart);
                    });
            
                cart_item_amount.appendChild(btn_deduct);
                cart_item_amount.appendChild(span);
                cart_item_amount.appendChild(btn_add);
                cart_item_amount.appendChild(btn_remove);
            
                cart_item.appendChild(cart_item_amount);
            
                html_cart_items.appendChild(cart_item);
            }
    
            cart_items_amount.style.display ='flex';
            buy_button.disabled = false;
    
            if(this.#cart_items.length && cart_header.children.length < 2) cart_header.insertAdjacentHTML('beforeEnd', '<span>Checkout is almost done!</span>');
            
            localStorage.setItem('cart_items', JSON.stringify({
                cart: (()=>{
                    let arr = [];

                    this.#cart_items.forEach((val)=>{
                        arr.push({
                            id: val.id,
                            amount: val.amount,
                        })
                    });
                    return arr;
                })()
            }));
        }
    
        const cart_amount = document.querySelector('.cart_amount');

            cart_amount.children[0].children[0].innerText = this.#total_amount;
            cart_amount.children[1].children[0].innerText = this.#total_price;
    }

    Render_shopping_cart(){

        const header = getEl('header');

        header.insertAdjacentHTML('beforeEnd', `<div class="shopping_cart" transition-style class="--in-custom">
            <div class="cart_header">
                <h4>Shopping Cart</h4>
                ${(()=>(this.#cart_items.length) ? `<span>Checkout is almost done!</span>` : '')()}
            </div>
            <div class="cart_items"></div>
            <div class="cart_amount">
                <span>Total amount: <span>${this.#total_amount}</span></span>
                <span>Total price: <span>${this.#total_price}</span></span>
            </div>
            <button class="add_button buy_button" ${
                (()=>(!this.#cart_items.length) ? 'disabled' : '')()}>Buy</button>
            </div>`);
        
        const shopping_cart = getEl('.shopping_cart');
        
        const buy_button = getEl('.buy_button');
            buy_button.addEventListener('click', function(event){
                event.stopPropagation();
               
                alert('buy button');
            })
        
        const basket_logo = getEl('.basket_logo');
            basket_logo.addEventListener('click', function(event){
                event.stopPropagation();
                shopping_cart.classList.toggle('active');
            });
            this.Change_cart();
        }       
}

export { Cart }