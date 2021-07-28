function RandomInteger(min, max) {
    return Math.floor(min + Math.random() * (max - min));
}

function Random_items(val = 6){

    let set_random = new Set();
    let arr = new Array();

    for(let i = 0; i < val;){

    let key = RandomInteger(0, items.length);

        if(set_random.has(key)) continue;
        else {
            set_random.add(key);
            i++;
        };
        arr.push(items[key]);
    }
    return arr;
}

function getEl(selector){ return document.querySelector(selector); }

function getAllEl(selector){ return document.querySelectorAll(selector); }

function setEl(selector, options={}){
    const el = document.createElement(selector);
    Object.assign(el, options);
    return el;
}

class Init {
        #arr_img_src = new Array();
        #categories = new Set();
        #price = [0, 0];
        #color = new Set();
        #memory = new Set();
        #os = new Set();
        #display = ['2-5 inch', '5-7 inch', '7-12 inch', '12-16 inch', '16+ inch'];

    constructor(){
        const slider = getAllEl('.slider_item');

        for(let val of [...slider]) this.#arr_img_src.push(val.children[0].getAttribute('src').replace(/.+banners\//gi, '').replace(/\_banner.+/gi, '').split('_').join(' '));

        for(let key in items){
        
            if(this.#price[0] > +items[key].price || this.#price[0] == 0) this.#price[0] = +items[key].price;
            if(this.#price[1] < +items[key].price) this.#price[1] = +items[key].price;

            if(items[key].category != null || !items[key].category == false) this.#categories.add(items[key].category.toLowerCase());
            if(items[key].os != null || !items[key].os == false) this.#os.add(items[key].os.toLowerCase());
        
            ((r, s)=>{
                if(isNaN(r) || isNaN(r)) return;
                if(r.length == 4) this.#memory.add(r / 1024+' GB');
                else this.#memory.add(r+' GB');
            
                if(s.length == 4) this.#memory.add(s / 1024+' TB');
                else if(s.length == 1) this.#memory.add(s+' TB');
                else if(s.length == 2 || s.length == 3) this.#memory.add(s+' GB');
            
            })(new String(items[key].ram), new String(items[key].storage));

            for(let item in items[key].color) this.#color.add(items[key].color[item]);

            for(let item in this.#arr_img_src){
            
                if(items[key].name.toLowerCase().includes(this.#arr_img_src[item])) {
                
                const slider_item = slider[item];

                if(slider_item.children.length == 2) continue;
                
                const div = setEl('div', {
                    className: `slider_item_div ${(()=>
                        (item == 3 || item == 4 || item == 5) ? 'color_black' : ''
                    )()}`,
                    style: (item == 2 || item == 4) ? `left: 0; top: 10%; width: ${(()=>(item == 4) ? '35%' : '50%')()}` : '',
                });
                
                const h1 = setEl('h1', {
                    innerText: items[key].name
                });
                
                const button = setEl('button', {
                    className: 'add_button',
                    innerText: ('Add to cart'),
                    onclick: (event)=>{
                        event.stopPropagation();
                        console.log(items[key]);
                        //Change_cart(items[key]);
                    },
                    disabled: (items[key].orderInfo.inStock == 0) ? true : false,
                });
                
                div.append(h1, button);
                slider_item.prepend(div);
                }
            }
        }

        this.#memory = [...this.#memory].sort((a, b)=>{

            if(new RegExp('GB', 'gi').test(a) && new RegExp('GB', 'gi').test(b)) {
                if(+a.match(/\d+/gi)[0] > +b.match(/\d+/gi)[0]) return -1;
                else if(+b.match(/\d+/gi)[0] < +a.match(/\d+/gi)[0]) return 1;
            }else if(new RegExp('TB', 'gi').test(a) && new RegExp('TB', 'gi').test(b)) {
                if(+a.match(/\d+/gi)[0] > +b.match(/\d+/gi)[0]) return -1;
                else if(+b.match(/\d+/gi)[0] < +a.match(/\d+/gi)[0]) return 1;
            }else{
                if(new RegExp('GB', 'gi').test(a)) return 1;
                else if(new RegExp('TB', 'gi').test(a)) return -1;
            };
            return 0;
        }).reverse();

        $('.slider').slick({
            infinite: true,
            autoplay: true,
            dots: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            adaptiveHeight: true,
            variableWidth: false,
            initialSlide: 0,
            prevArrow: false,
            nextArrow: false,
            fade: true,
        });
        
        filter.price = this.#price;

        cart.Render_shopping_cart();
        view.search(this.#categories);
        view.filter(this.getValues());
        view.renderCards(Random_items());
    }
    
    getValues(){
        return {
            price: this.#price,
            color: this.#color,
            memory: this.#memory,
            display: this.#display,
            os: this.#os,
        }
    }
}

class Cart{

    #cart_items = [];
    #total_amount = 0;
    #total_price = 0;

    constructor(){
        if(localStorage.getItem('cart_items')){
        
            let ls = JSON.parse(localStorage.getItem('cart_items'));
                this.#cart_items = ls.cart;
                this.#total_amount = ls.amount;
                this.#total_price = ls.price;
        }
    }
    
    Change_cart(item){
        //debugger
        this.#total_price = 0;
        this.#total_amount = 0;
    
        if(typeof item == 'number'){
            this.#cart_items.splice(item, 1);
        }else if(typeof item == 'object' && !new Set(this.#cart_items).has(item)){
            item.amount = 1;
            item.all_price = item.price * item.amount;
            this.#cart_items.push(item);
           
        }
        
        const html_cart_items = document.getElementsByClassName('cart_items')[0];
            html_cart_items.innerText = '';
    
        const cart_items_amount = document.getElementsByClassName('cart_items_amount')[0];
            cart_items_amount.innerText = this.#cart_items.length;
        
        const buy_button = document.querySelector('.buy_button');
        const cart_header = document.getElementsByClassName('cart_header')[0];
        
        if(!this.#cart_items.length) {
    
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
                
                this.#total_price += this.#cart_items[key].all_price;
                this.#total_amount += this.#cart_items[key].amount;
    
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
    
                if(this.#cart_items[key].amount == 1) btn_deduct.disabled = true;
                
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
                
                if(this.#cart_items[key].amount == 4) btn_add.disabled = true;
    
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
                cart: this.#cart_items,
                amount: this.#total_amount,
                price: this.#total_price,
            }));
        }
    
        const cart_amount = document.getElementsByClassName('cart_amount')[0];
            cart_amount.children[0].children[0].innerText = this.#total_amount;
            cart_amount.children[1].children[0].innerText = this.#total_price;
    }

    Render_shopping_cart(){
        //debugger
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
                debugger
                shopping_cart.classList.toggle('active');
            });
            this.Change_cart();
        }
        
}
class View{
    constructor(){}
    
    search(categories){
        const search = getEl('.search');
        search.innerHTML = `<div class="input_container">
            <img src="img/icons/search.svg" alt="search">
                <input type="text" placeholder="Enter device name...">
                <img src="img/icons/icons/Filter.svg" alt="filter">
                <img src="img/icons/icons/Sort.svg" alt="sort">
            </div><div class="search_tune"></div><div class="sort"></div>`
    
        search.querySelector('input').addEventListener('input', function(){

                filter.name = this.value;
                view.renderCards(filter.getItems());
            });

    const search_category_stock = document.createElement('div');
        search_category_stock.setAttribute('class', 'search_category_stock');

    const search_category = document.createElement('div');
        search_category.setAttribute('class', 'search_category');

    const search_stock = document.createElement('div');
        search_stock.setAttribute('class', 'search_stock');

    const search_order = document.createElement('div');
        search_order.setAttribute('class', 'search_order');

    let h4 = document.createElement('h4');

    const select = document.createElement('select');
        select.setAttribute('class', 'search_menu');
        select.addEventListener('change', function(event){
            event.stopPropagation();
            filter.category = select.value;
            view.renderCards(filter.getItems());
        });

    const input = document.createElement('input');
        input.setAttribute('type', 'number');        
        input.setAttribute('value', 0);
        input.setAttribute('min', 0);
        input.addEventListener('change', function(){
            filter.stock = input.value;
            view.renderCards(filter.getItems());
        });
    
        h4 = document.createElement('h4');
        h4.innerText = 'Category';
    
    const option_chose = document.createElement('option');
        option_chose.setAttribute("disabled", "disabled");
        option_chose.setAttribute("selected", 'selected');
        option_chose.setAttribute("value", 'disabled');
        option_chose.innerText = 'Choose category';
        select.appendChild(option_chose);

    const option_all = document.createElement('option');
        option_all.setAttribute("value", 0);
        option_all.innerText = 'All categories';
        select.appendChild(option_all);

        categories.forEach((item)=>{

            const option = document.createElement('option');
                option.setAttribute("value", item);
                option.innerText = item[0].toUpperCase()+item.slice(1, item.length);

            select.appendChild(option);
        });

    search_category.appendChild(h4);
    search_category.appendChild(select);

    h4 = document.createElement('h4');
    h4.innerText = 'Stock';

    search_stock.appendChild(h4);
    search_stock.appendChild(input);

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
            })

        search_order.appendChild(button);
    };

    search_category_stock.appendChild(search_category);
    search_category_stock.appendChild(search_stock);

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
                    </div>`,
                    
                    onclick: function(event){
                        event.stopPropagation();
                        console.log('item click');
                        view.RenderModal(value);
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
        //let c = modal_page.querySelector('.add_button');
        //debugger
        Object.assign(modal_page.querySelector('button'), {
            onclick: (event)=>{
                event.stopPropagation();
                console.log('modal add', item);
                //Change_cart(item);
            },
            disabled: (item.orderInfo.inStock == 0) ? true : false,
        });

        getEl('body').appendChild(modal_page);
    }
}

class Filter{

    #name = '';
    #category = '';
    #price = [];
    #color = [];
    #memory = [];
    #display = [];
    #os = [];
    #stock = 0;
    #order = 'default';

    constructor(){}
    
    set name(val){
        this.#name = val;
    }
    set category(val){
        this.#category = val;
    }
    set price(val){
        this.#price = val;
    }
    set color(val){
        if(this.#color.includes(val)){
            this.#color = this.#color.filter(col=>col != val);
        }else this.#color.push(val);
    }
    set memory(val){
        if(this.#memory.includes(val)){
            this.#memory = this.#memory.filter(memory=>memory != val);
        }else this.#memory.push(val);
    }
    set display(val){
        if(this.#display.includes(val)){
            this.#display = this.#display.filter(display=>display != val);
        }else this.#display.push(val);
    }
    set os(val){
        if(this.#os.includes(val)){
            this.#os = this.#os.filter(os=>os != val);
        }else this.#os.push(val);
    }
    set stock(val){
        this.#stock = +val;
    }
    set order(val){
        this.#order = val;
    }
    getItems(){
        
        const arr = items.filter(item => {

            const isSearch = item.name.toLowerCase().includes(this.#name);
            if (!isSearch) return false;
            
            const isPrice = (item.price >= this.#price[0] && item.price <= this.#price[1]) ? true : false;
            if (!isPrice) return false;

            if(this.#category){
                const isCategory = item.category.toLowerCase() == this.#category;
                if (!isCategory) return false;
            }

            let isColor= !this.#color.length;
            this.#color.forEach(color => {
                if (item.color.includes(color)) isColor = true;
            })
            if (!isColor) return false;
            
            let isMemory= !this.#memory.length;
            this.#memory.forEach(memory => {
                //debugger
                if(item.storage == +memory || item.ram == +memory) isMemory = true;
            })
            if (!isMemory) return false;
            
            let isDisplay = !this.#display.length;
            this.#display.forEach(display => {

                let values = display.split(',');

                if(item.display >= +values[0] && item.display <= +values[1]) isDisplay = true;
            })
            if (!isDisplay) return false;
            
            let isOs = !this.#os.length;
            this.#os.forEach(os => {

                if (item.os != null && item.os.toLowerCase() === os) {
                    isOs = true;
                }
            })
            if (!isOs) return false;

            let isStock = item.orderInfo.inStock >= this.#stock;
            if (!isStock) return false;
            return true;
        })

        if(this.#order == 'ascending'){
            arr.sort((a, b)=> a.price - b.price);
        }else if(this.#order == 'descending'){
            arr.sort((a, b)=> b.price - a.price);
        };

        return arr;
    }
}

const cart = new Cart();
const filter = new Filter();
const view = new View();
new Init();
    
