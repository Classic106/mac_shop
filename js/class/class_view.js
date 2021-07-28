import {
    getEl,
    setEl,
    Change_input_price,
} from './class_functions.js';

import { cart, filter, view } from './class_init.js';

class View{
    constructor(){}
    
    search(categories){

        const search = getEl('.search');

        search.innerHTML = `<div class="input_container">
            <img src="img/icons/search.svg" alt="search">
                <input type="text" placeholder="Enter device name...">
                <img src="img/icons/icons/Filter.svg" alt="filter">
                <img src="img/icons/icons/Sort.svg" alt="sort">
            </div><div class="search_tune"></div><div class="sort"></div>`;
    
        search.querySelector('input').addEventListener('input', function(){
            filter.name = this.value;
            view.renderCards(filter.getItems());
        });

        const search_category_stock = setEl('div');
            search_category_stock.className = 'search_category_stock';

        const search_category = document.createElement('div');
            search_category.setAttribute('class', 'search_category');

        const search_stock = document.createElement('div');
            search_stock.setAttribute('class', 'search_stock');

        const search_order = document.createElement('div');
            search_order.setAttribute('class', 'search_order');

        let h4 = document.createElement('h4');

        const select = setEl('select', {
            className: 'search_menu',
            onchange: function(event){
                event.stopPropagation();
            
                filter.category = select.value;

                view.renderCards(filter.getItems());
            },
        });

        const input = setEl('input', {
            type: 'number',        
            value: 0,
            min: 0,
            onchange: function(){
                filter.stock = input.value;
                view.renderCards(filter.getItems());
            },
        });
        
    
        h4 = document.createElement('h4');
        h4.innerText = 'Category';
    
        const option_chose = setEl('option',{
            disabled: true,
            selected: true,
            innerText: 'Choose category',
        });
        
        select.appendChild(option_chose);

        const option_all = setEl('option',{
            value: 'all',
            innerText: 'All categories',
        });
        
        select.appendChild(option_all);

        categories.forEach((item)=>{

            const option = setEl('option', {
                value: item,
                innerText: item[0].toUpperCase()+item.slice(1, item.length),
            });
                
            select.appendChild(option);
        });

        search_category.append(h4, select);

        h4 = document.createElement('h4');
        h4.innerText = 'Stock';

        search_stock.append(h4, input);

        h4 = document.createElement('h4');
        h4.innerText = 'Order';

        search_order.appendChild(h4);

        const search_button = ['Default','Ascending','Descending'];

        for(let key = 0; key < search_button.length; key++){

            const button = document.createElement('button');
        
                if(key == 0) button.setAttribute("class", 'search_default search_button search_choise');
                else button.setAttribute("class", search_button[key].toLowerCase()+'_default search_button');
        
                button.setAttribute('value', search_button[key].toLocaleLowerCase());
                button.innerText = search_button[key];

                button.addEventListener('click', function(){
                    let btn = getEl('.search_choise');
                        btn.classList.toggle('search_choise');
                    button.setAttribute("class", button.className+' search_choise');
                
                    filter.order = button.value;
                    view.renderCards(filter.getItems());
                });

            search_order.appendChild(button);
        };

        search_category_stock.append(search_category, search_stock);

        const search_tune = search.querySelector('.search_tune');

        search_tune.appendChild(search_category_stock);
        search_tune.appendChild(search_order);

        getEl('.input_container').children[2].onclick = function(){

            const accordion_filter = document.querySelector('.accordion_filter');
            const items = document.querySelectorAll('.item');
        
            accordion_filter.classList.toggle('active');

            items.forEach((item)=>item.classList.toggle('item_two_elm'));
        };

        getEl('.input_container').children[3].onclick = function(event){
            event.stopPropagation();
            search_tune.classList.toggle('active');
        };
    }
        
    filter(accord_items){
    
        const accordion_filter = getEl('.accordion_filter');
    
        const main_ul = setEl('ul');
        accordion_filter.appendChild(main_ul);
            
        for(let key of Object.keys(accord_items)){
        
            const ul = setEl('ul');
            const li = setEl('li');
            const span = setEl('span');
            
            if(key === 'price'){
                    
                for(let item in accord_items[key]){
            
                    const li = setEl('li');
                    const span = setEl('span', {
                        innerText: (item == 0) ? 'From' : 'To'
                    });
                    const input = setEl('input', {
                        type: 'number',
                        max: accord_items.price[1],
                        min: accord_items.price[0],
                        value: (item == 0) ? accord_items.price[0] : accord_items.price[1],
                        oninput: function(){
                            let place = this.parentElement.children[0].innerText.toLowerCase();
                            let price = [accord_items.price[0], accord_items.price[1]];

                            if(place == 'from') price[0] = +input.value;
                            else price[1] = +input.value;
                            filter.price = price;
                            view.renderCards(filter.getItems());
                        }
                    });
        
                    li.append(span, input);
                    ul.appendChild(li);
                }
            
                ul.setAttribute('class', 'filter_'+key[0].toLowerCase()+key.slice(1, key.length));
                li.appendChild(span);
                li.appendChild(ul);
                    
                main_ul.appendChild(li);
        
            }else{
        
                let ai = [...accord_items[key]];

                for(let item in ai){
            
                    const li = document.createElement('li');
                        li.innerText = ai[item];

                    const input = document.createElement('input');
                        input.setAttribute('type', 'checkbox');
                        input.setAttribute('value', (()=>{    
                        let val = ai[item].match(/\d+/g);
                                
                            if(!val) return ai[item];
                            else return val;
                        })());
            
                    li.appendChild(input);
                    ul.appendChild(li);
                }
        
                ul.className = 'filter_'+key[0].toLowerCase()+key.slice(1, key.length);
                ul.addEventListener('click', function(event){
                        
                    event.stopPropagation();
        
                    if(event.target.localName == 'li'){

                        (event.target.children[0].checked) ? 
                            event.target.children[0].checked = false : 
                            event.target.children[0].checked = true;
                        filter[(this.className).split('_')[1]] = event.target.children[0].value;
                    }else{
                        filter[(this.className).split('_')[1]] = event.target.value;    
                    }
                    view.renderCards(filter.getItems());
                });
            }

            span.innerText = key[0].toUpperCase()+key.slice(1, key.length);
            span.addEventListener('click', function (event){
        
                event.stopPropagation();
                       
                if(getComputedStyle(event.target.parentElement.children[1]).display == 'none'){
                    this.parentElement.children[1].style.display = 'flex';
                    this.parentElement.className = 'rotate_after';
                }else{
                    this.parentElement.children[1].style.display = 'none';
                    this.parentElement.removeAttribute('class');
                };
            });

            li.append(span, ul);            
            main_ul.appendChild(li);
        }
    }
    
    renderCards(arr){
        
        const catalog = getEl('.items');

        if(!arr.length) return;
        else catalog.innerHTML = '';

        arr.forEach(value => {
            const item = setEl("div", {
                className: `item ${(
                    (getEl('.accordion_filter').classList.contains('active'))
                        ? 'item_two_elm': '')
                    }`,
                innerHTML: `
                    <img src="img/${value.imgUrl}" alt="${value.name}">
                    <div class="item_main">
                        <h1 class="model_name">${value.name}</h1>
                        <span class="inStock"><span ${(()=>{
                            return (value.orderInfo.inStock == 0) ? `class = 'no_stock'` : '';
                            })()}></span>${value.orderInfo.inStock} left in stock</span>
                        <span class="price">Price: ${value.price}</span>
                        <button class="add_button">Add to cart</button>
                    </div>
                    <div class="item_footer">
                        <img src="img/icons/icons/like_filled 1.svg" alt="like_filled">
                        <div class="reviews">
                            <span class="reviews_counts">${value.orderInfo.reviews}% Positive reviews</span>
                            <span>Above arrange</span>
                        </div>
                        <div class="orders">
                            <span class="order_counts">1500</span>
                            <span>orders</span>
                        </div>
                    </div>
                        <div class="item_favorite"></div>
                    `,
                    
                    onclick: function(event){
                        event.stopPropagation();
                        
                        if(event.target.classList.contains('item_favorite')){
                            event.target.classList.toggle('active');

                            (event.target.classList.contains('active')) ?
                                alert('Add to favorite') : alert('Remove from favorite');
                        }else{
                            view.RenderModal(value);
                        }
                    }
            });

            Object.assign(item.querySelector('button'), {
                onclick: (event)=>{
                    event.stopPropagation();
                    cart.Change_cart(value);
                },
                disabled : (value.orderInfo.inStock == 0) ? true : false,
            });
                
            catalog.appendChild(item);
        });
    }
    
    RenderModal(item){

        const modal_page = setEl("div", {
            className:  "modal_page",
            innerHTML: `
                <div class="modal_back"></div>
                <div class="modal_content">
                    <div class="modal_wrap_img">
                        <img src="img/${item.imgUrl}" alt="${item.name}">
                    </div>
                    <div class="modal_main">
                        <h2>${item.name}</h2>
                        <div class="modal_reviews item_footer">
                            <img src="img/icons/icons/like_filled 1.svg" alt="like_filled">
                            <div class="reviews">
                                <span class="reviews_counts"></span>
                                <span>Positive reviews</span>
                                <span>Above arrange</span>
                            </div>
                            <div class="orders">
                                <span class="order_counts">1500</span>
                                <span>orders</span>
                            </div>
                        </div>
                        <div class="modal_description">
                            <span>Color: ${(()=>{
                                let str = ''
                            
                                for(let key in item.color){
                                    str += `<span>${item.color[key]}</span>, `
                                }
                                return str.slice(0, str.length-2);
                            })()}</span>
                            <span>Operation system: <span>${item.os}</span></span>
                            <span>Chip: <span>${item.chip.name}</span>, cores: <span>${item.chip.cores}</span></span>
                            <span>Height: <span>${item.size.height}</span></span>
                            <span>Width: <span>${item.size.width}</span></span>
                            <span>Depth: <span>${item.size.depth}</span></span>
                            <span>Weigth: <span>${item.size.weight}</span></span>
                        </div>
                    </div>
                    <div class="modal_price">
                        <h2>$ ${item.price}</h2>
                        <span>Stock: ${item.orderInfo.inStock}</span>
                        <button class="add_button">Add to cart</button>
                    </div>
                </div>`,
        });

        Object.assign(modal_page.querySelector('.modal_back'), {
            onclick : (event)=>{
                event.stopPropagation();
                modal_page.remove();
            }
        });

        Object.assign(modal_page.querySelector('button'), {
            onclick: (event)=>{
                event.stopPropagation();
                cart.Change_cart(item);
            },
            disabled: (item.orderInfo.inStock == 0) ? true : false,
        });

        getEl('body').appendChild(modal_page);
    }
}

export { View }