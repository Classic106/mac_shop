$( document ).ready(function() {
    
/*______________________________________variables_____________________________________________________*/ 

    const arr_img_src = new Array();
    const categories = new Set();
    let main_items = new Array();
    let choised_items = new Array();
    let cart_items = new Array();
    let choises = new Object();
    let category = 0;
    let price = [0, 0];
    let order = 'default';
    let total_amount = 0;
    let total_price = 0;
    let stock = 0;
    
    if(localStorage.getItem('cart_items')){
        
        let ls = JSON.parse(localStorage.getItem('cart_items'));
            cart_items = ls.cart;
            total_amount = ls.amount;
            total_price = ls.price;
    }

    let accord_items = {
        price: [0, 0],
        color: new Set(),
        memory: new Set(),
        os: new Set(),
        display: ['2-5 inch', '5-7 inch', '7-12 inch', '12-16 inch', '16+ inch'],
    };

/*______________________________________slider_____________________________________________________*/ 
    
    const slider = document.getElementsByClassName('slider')[0].children;
    
    for(let val of slider) arr_img_src.push(val.children[0].getAttribute('src').replace(/.+banners\//gi, '').replace(/\_banner.+/gi, '').split('_').join(' '));

    for(let key in items){
        
        if(accord_items.price[0] > +items[key].price || accord_items.price[0] == 0) accord_items.price[0] = +items[key].price;
        if(accord_items.price[1] < +items[key].price) accord_items.price[1] = +items[key].price;

        if(items[key].category != null || !items[key].category == false) categories.add(items[key].category.toLowerCase());
        if(items[key].os != null || !items[key].os == false) accord_items.os.add(items[key].os.toLowerCase());
        
        ((r, s)=>{
            if(isNaN(r) || isNaN(r)) return;
            if(r.length == 4) accord_items.memory.add(r / 1024+' GB');
            else accord_items.memory.add(r+' GB');
            
            if(s.length == 4) accord_items.memory.add(s / 1024+' TB');
            else if(s.length == 1) accord_items.memory.add(s+' TB');
            else if(s.length == 2 || s.length == 3) accord_items.memory.add(s+' GB');
            
        })(new String(items[key].ram), new String(items[key].storage));

        for(let item in items[key].color){
            accord_items.color.add(items[key].color[item]);
        }

        for(let item in arr_img_src){
            
            if(items[key].name.toLowerCase().includes(arr_img_src[item])) {
                
                const slider_item = document.getElementsByClassName('slider_item')[item];

                if(slider_item.children.length == 2) continue;
                
                const div = document.createElement('div');
                    div.setAttribute("class", `slider_item_div ${(()=>{
                        return (item == 3 || item == 4 || item == 5) ? 'color_black' : '';
                    })()}`);

                if(item == 2 || item == 4) div.setAttribute("style", `left: 0; top: 10%; width: ${(()=>(item == 4) ? '35%' : '50%')()}`);

                const h1 = document.createElement('h1');
                    h1.innerText = (items[key].name);
                
                const button = document.createElement('button');
                    button.setAttribute('class', 'add_button');
                    button.innerText = ('Add to cart');
                    button.onclick = (event)=>{
                        event.stopPropagation();
                        Change_cart(items[key]);
                    };
                
                if(items[key].orderInfo.inStock == 0) button.setAttribute("disabled", "disabled");
                
                div.append(h1);
                div.append(button);
                slider_item.prepend(div);
            }

            if(arr_img_src.length == 0) return;
        }
    }

    accord_items.memory = [...accord_items.memory].sort((a, b)=>{

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

    price = accord_items.price;

/*______________________________________shopping_cart_____________________________________________________*/ 

const header = document.getElementsByTagName('header')[0];

    header.insertAdjacentHTML('beforeEnd', `<div class="shopping_cart" tabindex="0">
    <div class="cart_header">
        <h4>Shopping Cart</h4>
        ${(()=>(cart_items.length) ? `<span>Checkout is almost done!</span>` : '')()}
    </div>
    <div class="cart_items"></div>
    <div class="cart_amount">
        <span>Total amount: <span>${total_amount}</span></span>
        <span>Total price: <span>${total_price}</span></span>
    </div>
        <button class="add_button buy_button" ${
            (()=>{
                return (!cart_items.length) ? 'disabled' : '';
            })()
        }>Buy</button>
    </div>`);

const shopping_cart = document.querySelector('.shopping_cart');

const buy_button = document.getElementsByClassName('buy_button')[0];
    buy_button.addEventListener('click', function(event){
        event.stopPropagation();
        console.log('buy button');
    })

const basket_logo = document.querySelector('.basket_logo');
    basket_logo.addEventListener('click', function(event){
        event.stopPropagation();
        shopping_cart.classList.toggle('active');
    });

    if(cart_items.length) Change_cart();

/*______________________________________search_____________________________________________________*/ 

const search = document.getElementsByClassName('input_container')[0];

const search_line = search.children[1];
    search_line.addEventListener('input', function(){

        document.getElementsByClassName('items')[0].innerHTML = '';

        document.getElementsByClassName('search_menu')[0].value = 'disabled';
        
        if(search_line.value.length > 0) {
            choised_items = items.filter((item)=>{
                if(item.name.match(new RegExp(`${search_line.value}`, 'gi'))) return item;
            });
        }
        
        (!search_line.value.length || !choised_items.length) ? (()=>{
            if(main_items.length > 0) main_items.forEach((item)=> Add_item_to_catalog(item));
            else Random_six_items();
            choised_items.length = 0;
        })() : choised_items.forEach(item=>Add_item_to_catalog(item));
    });
    
    const search_tune = document.querySelector('.search_tune');

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
            category = select.value;
            
            if(select.value == 0){
                choised_items = [...items];
                price = accord_items.price;
                
                Order();
            }else{
                choised_items.length = 0;
                price = [0, 0];
                
                for(let key = 0; key < items.length; key++){                      
                    if(items[key].category.toLocaleLowerCase() == select.value){
                        choised_items.push(items[key]);
                        Change_price(items[key]);
                    }
                }
                if(Object.keys(choises).length) Choised_items();
                else Order();
                /*let inputs = document.querySelectorAll('input[type=checkbox]');
                inputs.forEach(item=>item.checked = false);*/
                //Order();
            }
        });

    const input = document.createElement('input');
        input.setAttribute('type', 'number');        
        input.setAttribute('value', 0);
        input.setAttribute('min', 0);
        input.addEventListener('change', function(){
            document.getElementsByClassName('items')[0].innerHTML = '';
            
            stock = input.value;
            
            let max = 0;
            let result;
            
            if(!choised_items.length) choised_items = items;

            result = choised_items.filter((item)=>{
                if(max < item.orderInfo.inStock) input.setAttribute('max', max = item.orderInfo.inStock);
                if(item.orderInfo.inStock >= input.value) return true;
            });
            Order(result);
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
                let btn = document.querySelector('.search_choise');
                    btn.classList.toggle('search_choise');
                    //btn.setAttribute('class', btn.className.replace(/(search_choise)/gi, ''));
                    //btn.setAttribute('class', btn.className.slice(0, btn.className.length -14));
                button.setAttribute("class", button.className+' search_choise');
                
                order = button.value;
                Order();
            })
    
        search_order.appendChild(button);
    };

    search_category_stock.appendChild(search_category);
    search_category_stock.appendChild(search_stock);

    search_tune.appendChild(search_category_stock);
    search_tune.appendChild(search_order);
    
const filter = search.children[2];
    filter.onclick = function(){
        
        const accordion_filter = document.querySelector('.accordion_filter');
        const items = document.querySelectorAll('.item');
            
        accordion_filter.classList.toggle('active');

        items.forEach((item)=>item.classList.toggle('item_two_elm'));
      
        /*if(getComputedStyle(accordion_filter).display == 'none'){

            accordion_filter.style.display = 'flex';
            open_filter = true;

            for(let key in items){
                items[key].className = 'item item_two_elm';
            }
        }else{
           
            accordion_filter.style.display = 'none';
            open_filter = false;

            for(let key in items){
                items[key].className = 'item';
            }
        }*/
    };

const sort = search.children[3];
    sort.onclick = function(event){
        event.stopPropagation();
        search_tune.classList.toggle('active');
        /*if(getComputedStyle(search_tune).display == 'none'){
            search_tune.style.display = 'flex';
        }else{
            search_tune.style.display = 'none';
        }*/
    };

/*______________________________________filter_____________________________________________________*/

    const accordion_filter = document.getElementsByClassName('accordion_filter')[0];

    const main_ul = document.createElement('ul');
        accordion_filter.appendChild(main_ul);
    
    for(let key of Object.keys(accord_items)){

        const ul = document.createElement('ul');
        const span = document.createElement('span');
        const li = document.createElement('li');
        
        if(key === 'price'){
            
            for(let item in accord_items[key]){
    
                const li = document.createElement('li');
                const span = document.createElement('span');
                    span.innerText = (item == 0) ? 'From' : 'To';

                const input = document.createElement('input');
                    input.setAttribute('type', 'number');
                    input.setAttribute('max', price[1]);
                    input.setAttribute('min', price[0]);
                    input.setAttribute('value', (item == 0) ? accord_items.price[0] : accord_items.price[1]);
                    input.addEventListener('input', function(){

                        let place = this.parentElement.children[0].innerText.toLowerCase();

                        if(place == 'from') price[0] = +input.value;
                        else price[1] = +input.value;
                    });

                li.appendChild(span);
                li.appendChild(input);
                ul.appendChild(li);
            }
            
            span.innerText = key[0].toUpperCase()+key.slice(1, key.length);
            span.addEventListener('click',function (event){

                event.stopPropagation();
               
                if(getComputedStyle(event.target.parentElement.children[1]).display == 'none'){
                    this.parentElement.children[1].style.display = 'flex';
                    this.parentElement.className = 'rotate_after';
                }else{
                    this.parentElement.children[1].style.display = 'none';
                    this.parentElement.removeAttribute('class');
                };
            })
    
            ul.setAttribute('class', 'filter_'+key[0].toLowerCase()+key.slice(1, key.length));
            li.appendChild(span);
            li.appendChild(ul);
            
            main_ul.appendChild(li);

        }else{

            let ai =[...accord_items[key]];

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

            ul.setAttribute('class', 'filter_'+key[0].toLowerCase()+key.slice(1, key.length));
            ul.addEventListener('click', function(event){
                
                event.stopPropagation();

                if(event.target.localName == 'li'){

                    if(event.target.children[0].checked) {

                        event.target.children[0].checked = '';
                        Remove_from_filter(key, event.target.children[0].value);
                    }else{

                        event.target.children[0].checked = 'checked';
                        Add_to_filter(key, event.target.children[0].value);
                    }
                }else{
                    if(event.target.checked) Add_to_filter(key, event.target.value);
                    else Remove_from_filter(key, event.target.value);
                }
            });

            li.appendChild(span);
            li.appendChild(ul);
            
            main_ul.appendChild(li);
        }
    }

/*______________________________________catalog_____________________________________________________*/ 
    
    Random_six_items();

/*______________________________________functions_____________________________________________________*/ 

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

    function RandomInteger(min, max) {
        let rand = min + Math.random() * (max - min);
        return Math.floor(rand);
    }

    function Change_cart(item){

        total_price = 0;
        total_amount = 0;

        if(typeof item == 'number'){
            cart_items.splice(item, 1);
        }else if(typeof item == 'object' && !new Set(cart_items).has(item)){
            item.amount = 1;
            item.all_price = item.price * item.amount;
            cart_items.push(item);
           
        }
        
        const html_cart_items = document.getElementsByClassName('cart_items')[0];
            html_cart_items.innerText = '';

        const cart_items_amount = document.getElementsByClassName('cart_items_amount')[0];
            cart_items_amount.innerText = cart_items.length;
        
        const buy_button = document.querySelector('.buy_button');
        const cart_header = document.getElementsByClassName('cart_header')[0];
        
        if(!cart_items.length) {

            localStorage.clear();
            cart_items_amount.style.display ='none';
            buy_button.disabled = true;
            cart_header.removeChild(cart_header.children[1]);

            let cart_item = document.createElement('div');
                cart_item.setAttribute('class', 'cart_item');
                cart_item.innerText = 'Cart is empty!';
            
            html_cart_items.appendChild(cart_item);
            
        }else{
            
            for(let key in cart_items){
                
                total_price += cart_items[key].all_price;
                total_amount += cart_items[key].amount;
    
                let cart_item = document.createElement('div');
                    cart_item.setAttribute('class', 'cart_item');
                    cart_item.insertAdjacentHTML('afterBegin',
                        `<div class="cart_img_wrap">
                            <img src="img/${cart_items[key].imgUrl}" alt="${cart_items[key].name}">
                        </div>
                        <div class="cart_item_description">
                            <h5>${cart_items[key].name}</h5>
                            <span>$ ${cart_items[key].price}</span>
                        </div>`
                    );
            
                const cart_item_amount = document.createElement('div');
                    cart_item_amount.setAttribute('class', 'cart_item_amount');
                
                const btn_deduct = document.createElement('button');
                    btn_deduct.setAttribute('class', 'change_item_amount');
                    btn_deduct.innerHTML = '&#60;';
                    btn_deduct.addEventListener('click', function(event){
                        event.stopPropagation();
                        
                        --cart_items[key].amount;
                        cart_items[key].all_price = cart_items[key].price * cart_items[key].amount;
                        --total_amount;
                        total_price -= cart_items[key].price;
                        
                        Change_cart(cart_items[key]);
                    });
    
                if(cart_items[key].amount == 1) btn_deduct.disabled = true;
                
                const span = document.createElement('span');
                    span.innerText = `${cart_items[key].amount}`;
    
                const btn_add = document.createElement('button');
                    btn_add.setAttribute('class', 'change_item_amount');
                    btn_add.innerHTML = '&#62;';
                    btn_add.addEventListener('click', function(event){
                        event.stopPropagation();
                        
                        ++cart_items[key].amount;
                        cart_items[key].all_price = cart_items[key].price * cart_items[key].amount;
                        ++total_amount;
                        total_price += cart_items[key].price;
                        
                        Change_cart(cart_items[key]);
                    });
                
                if(cart_items[key].amount == 4) btn_add.disabled = true;
    
                const btn_remove = document.createElement('button');
                    btn_remove.setAttribute('class', 'remove_cart_item');
                    btn_remove.innerText = 'X';
                    btn_remove.addEventListener('click', function(event){
                        event.stopPropagation();

                        total_amount -= cart_items[key].amount;
                        total_price -= cart_items[key].all_price;

                        Change_cart(+key);
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

            if(cart_items.length && cart_header.children.length < 2) cart_header.insertAdjacentHTML('beforeEnd', '<span>Checkout is almost done!</span>');
            
            localStorage.setItem('cart_items', JSON.stringify({
                cart: cart_items,
                amount: total_amount,
                price: total_price,
            }));
        }

        const cart_amount = document.getElementsByClassName('cart_amount')[0];
            cart_amount.children[0].children[0].innerText = total_amount;
            cart_amount.children[1].children[0].innerText = total_price;
    }

    function Remove_from_filter(cat, choise){
        
        if(choises.hasOwnProperty(cat)){
            
            if(choises[cat].includes(choise)){
                const index = choises[cat].indexOf(choise);
                choises[cat].splice(index, 1);
            }
            if(choises[cat].length == 0) {
                delete choises[cat];
            }
        }else choises[cat] = new Array(choise);

        if(!Object.keys(choises).length) {

            choised_items.length = 0;

            if(category) {
                price = [0,0];
                for(let key = 0; key < items.length; key++){                      
                    if(items[key].category.toLocaleLowerCase() == category){
                        choised_items.push(items[key]);
                        Change_price(items[key]);
                    }
                }
            }else price = [...accord_items.price];

            Order();
        }else Choised_items();
    }

    function Add_to_filter(category, choise){
        
        (choises.hasOwnProperty(category)) ? 
            (()=>{
                if(!choises[category].includes(choise)) choises[category].push(choise);
            })() : choises[category] = new Array(choise);
        Choised_items();
    }
    
    function Choised_items(){

        let choised_arr;

        if(category) choised_arr = new Array(...choised_items);
        else if(!category || !choised_items.length) choised_arr = new Array(...items);
        
        price = [0, 0];
        let set = new Set();

        choised_arr.forEach((arr_item)=>{

            for(let [key, val] of Object.entries(choises)){
                
                if(key == 'memory'){
                    let ram = +arr_item.ram;
                    let storage = +arr_item.storage;
                    
                    if(new String(ram).length == 4) ram /= 1024;
                    if(new String(storage).length == 4) storage /= 1024;

                    if(val.some(item=>(item == ram || item == storage) ? true : false)){
                        Change_price(arr_item);
                        set.add(arr_item);
                    };
                }else if(!arr_item[key]){
                    continue;
                }else if(Array.isArray(arr_item[key])){
                    if(val.some(item=> arr_item[key].includes(item))) {
                        Change_price(arr_item);
                        set.add(arr_item);
                    };
                }else if(typeof arr_item[key] == 'object'){
                    if(Object.values(arr_item[key]).some((item)=>val.includes(item))){
                        Change_price(arr_item);
                        set.add(arr_item);
                    };
                }else{
                    val.forEach((item)=>{
                        if(item.split(',').length == 2){

                            let values = item.split(',');
    
                            if(+arr_item[key] > +values[0] && +arr_item[key] < +values[1]){
                                Change_price(arr_item);
                                set.add(arr_item);
                            }
                        }else if(!isNaN(+item)){
                            if(+arr_item[key] === +val){
                                Change_price(arr_item);
                                set.add(arr_item);
                            }
                        }else if(item === arr_item[key].toLowerCase()){
                            Change_price(arr_item);
                            set.add(arr_item);
                        }
                    })
                }
            }
        })

        if(![...set].length) alert('Совпaдений не найдено!');
        else choised_items = [...set];

        if(choised_items.length === 0) {
            price = [...accord_items.price];
            Order();
        }
        Order(choised_items);
    }

    function Change_price(val){
        if(price[0] > +val.price || price[0] == 0) price[0] = +val.price;
        if(price[1] < +val.price) price[1] = +val.price;
    }

    function Order(val){

        document.getElementsByClassName('items')[0].innerHTML = '';
        
        let arr;

        if(val && val.length > 0) arr = new Array(...val);
        else if(!choised_items.length) arr = new Array(...main_items);
        else arr = new Array(...choised_items);
        
        let filter_price_children = document.getElementsByClassName('filter_price')[0].children;
            filter_price_children[0].children[1].value = price[0];
            filter_price_children[0].children[1].setAttribute('min', price[0]);
            filter_price_children[1].children[1].value = price[1];
            filter_price_children[1].children[1].setAttribute('max', price[1]);

        if(order == 'ascending'){
            arr.sort((a, b)=> a.price - b.price);
            arr.forEach((item)=>{
                if(item.orderInfo.inStock < stock) return;
                Add_item_to_catalog(item);
            });
        }else if(order == 'descending'){
            arr.sort((a, b)=> b.price - a.price);
            arr.forEach((item)=>{
                if(item.orderInfo.inStock < stock) return;
                Add_item_to_catalog(item);
            });
        }else arr.forEach((item)=>{
            if(item.orderInfo.inStock < stock) return;
            Add_item_to_catalog(item);
        });
    }

    function Random_six_items(){
        
        let set_random = new Set();
        
        if(main_items.length > 0) main_items.length = 0;
            
        for(let i = 0; i < 6;){

            let key = RandomInteger(0, items.length);
        
            if(set_random.has(key)) continue;
            else {
                set_random.add(key);
                i++;
            };
            main_items.push(items[key]);
        }
        Order();
    }

    function Add_item_to_catalog(value){
        
        const item = document.createElement("div");
            item.setAttribute("class", `item ${((accordion_filter.classList.contains('active')) ? 'item_two_elm': '')}`);
            item.innerHTML = `
                <img src="img/${value.imgUrl}" alt="${value.name}">
                <div class="item_main">
                    <h1 class="model_name">${value.name}</h1>
                    <span class="inStock"><span ${(()=>{
                        /*return (item.orderInfo.inStock == 0) ? `style = 
                            "background: url('img\/icons\/icons\/close 1.svg') center\/100% no-repeat;
                            transform: scale(1.3);"` : '';*/
                        return (value.orderInfo.inStock == 0) ? `class = 'no_stock'` : '';
                        })()}></span>${value.orderInfo.inStock} left in stock</span>
                    <span class="price">Price: ${value.price}</span>
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
                </div>`
            item.onclick = function(event){
                event.stopPropagation();

                document.querySelector('.search_tune').style.display = 'none';
                Modal_page(value);
            };

        const catalog = document.getElementsByClassName('items')[0];
            catalog.append(item);
        
        const button = document.createElement("button");
            button.setAttribute("class", "add_button");
            button.innerText = ('Add to cart');
            button.onclick = (event)=>{
                event.stopPropagation();
                Change_cart(value);
            };
         
        if(value.orderInfo.inStock == 0) button.setAttribute("disabled", "disabled");

        const item_main = document.getElementsByClassName('item_main');
              item_main[item_main.length-1].appendChild(button);
                
        /*const item = document.createElement("div");
            item.setAttribute("class", "item");
            item.onclick = (event)=>{
                event.stopPropagation();
                Modal_page(items[key]);
            };

        const item_main = document.createElement("div");
            item_main.setAttribute("class", "item_main");
        
        const item_footer = document.createElement("div");
            item_footer.setAttribute("class", "item_footer");
        
        const img_main = document.createElement("img");
            img_main.setAttribute("src", `img/${items[key].imgUrl}`);
            img_main.setAttribute("alt", items[key].name);
        
        const name = document.createElement("h1");
            name.innerText = (items[key].name);
        
        const instock = document.createElement("span");
            instock.setAttribute("class", "inStock");
            instock.innerText = (`${items[key].orderInfo.inStock} left in stock`);
        
        const instock_span = document.createElement("span");
            if(items[key].orderInfo.inStock == 0){
                instock_span.style.background = `url('img/icons/icons/close 1.svg') center/100% no-repeat`;
                instock_span.style.transform = `scale(1.3)`;
            }

        const price = document.createElement("span");
            price.setAttribute("class", "price");
            price.innerText = (`Price: ${items[key].price}`);
    
        const button = document.createElement("button");
            button.setAttribute("class", "add_button");
            button.innerText = ('Add to cart');
            button.onclick = ()=>{Add_to_cart(items[key])};
        
        if(items[key].orderInfo.inStock == 0) button.setAttribute("disabled", "disabled");

        const img_footer = document.createElement("img");
            img_footer.setAttribute("src", 'img/icons/icons/like_filled 1.svg');
            img_footer.setAttribute("alt", "item");
        
        const reviews = document.createElement("div");
            reviews.setAttribute("class", 'reviews');
        
        const orders = document.createElement("div");
            orders.setAttribute("class", 'orders');
        
        const reviews_counts = document.createElement("span");
            reviews_counts.setAttribute("class", 'reviews_counts');
            reviews_counts.innerText = (`${items[key].orderInfo.reviews}% Positive reviews`);

        const reviews_span = document.createElement("span");
            reviews_span.innerText = ('Above arrange');

        const order_counts = document.createElement("span");
            order_counts.setAttribute("class", 'orders_counts');
            order_counts.innerText = ('1500');
        
        const order_span = document.createElement("span");
            order_span.innerText = ('orders');

        
        reviews.append(reviews_counts);
        reviews.append(reviews_span);
            
        orders.append(order_counts);
        orders.append(order_span);
    
        instock.prepend(instock_span);

        item_main.append(name);
        item_main.append(instock);
        item_main.append(price);
        item_main.append(button);

        item_footer.append(img_footer);
        item_footer.append(reviews);
        item_footer.append(orders);
        
        item.append(img_main);
        item.append(item_main);
        item.append(item_footer);

    const catalog = document.getElementsByClassName('catalog')[0];
        catalog.append(item);*/
    }

    function Modal_page(item){

        const modal_page = document.createElement("div");
            modal_page.setAttribute("class", "modal_page");
            modal_page.innerHTML = `
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
                </div>
            </div>`

        const main = document.querySelector('main');
            main.append(modal_page);
        
        const modal_back = document.querySelector('.modal_back');
            modal_back.onclick = (event)=>{
                event.stopPropagation();
                modal_page.remove();
            }

        const modal_price = document.querySelector('.modal_price');
        const button = document.createElement("button");
            button.setAttribute("class", "add_button");
            button.innerText = ('Add to cart');
            button.onclick = (event)=>{
                event.stopPropagation();
                Change_cart(item);
            };
        if(item.orderInfo.inStock == 0) button.setAttribute("disabled", "disabled");

        modal_price.append(button);
    }
});

