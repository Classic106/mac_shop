import { variables } from './variables.js';

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

    variables.total_price = 0;
    variables.total_amount = 0;

    if(typeof item == 'number'){
        variables.cart_items.splice(item, 1);
    }else if(typeof item == 'object' && !new Set(variables.cart_items).has(item)){
        item.amount = 1;
        item.all_price = item.price * item.amount;
        variables.cart_items.push(item);
       
    }
    
    const html_cart_items = document.getElementsByClassName('cart_items')[0];
        html_cart_items.innerText = '';

    const cart_items_amount = document.getElementsByClassName('cart_items_amount')[0];
        cart_items_amount.innerText = variables.cart_items.length;
    
    const buy_button = document.querySelector('.buy_button');
    const cart_header = document.getElementsByClassName('cart_header')[0];
    
    if(!variables.cart_items.length) {

        localStorage.clear();
        cart_items_amount.style.display ='none';
        buy_button.disabled = true;
        cart_header.removeChild(cart_header.children[1]);

        let cart_item = document.createElement('div');
            cart_item.setAttribute('class', 'cart_item');
            cart_item.innerText = 'Cart is empty!';
        
        html_cart_items.appendChild(cart_item);
        
    }else{
        for(let key in variables.cart_items){
            
            variables.total_price += variables.cart_items[key].all_price;
            variables.total_amount += variables.cart_items[key].amount;

            let cart_item = document.createElement('div');
                cart_item.setAttribute('class', 'cart_item');
                cart_item.insertAdjacentHTML('afterBegin',
                    `<div class="cart_img_wrap">
                        <img src="img/${variables.cart_items[key].imgUrl}" alt="${variables.cart_items[key].name}">
                    </div>
                    <div class="cart_item_description">
                        <h5>${variables.cart_items[key].name}</h5>
                        <span>$ ${variables.cart_items[key].price}</span>
                    </div>`
                );
        
            const cart_item_amount = document.createElement('div');
                cart_item_amount.setAttribute('class', 'cart_item_amount');
            
            const btn_deduct = document.createElement('button');
                btn_deduct.setAttribute('class', 'change_item_amount');
                btn_deduct.innerHTML = '&#60;';
                btn_deduct.addEventListener('click', function(event){
                    event.stopPropagation();
                    
                    --variables.cart_items[key].amount;
                    variables.cart_items[key].all_price = variables.cart_items[key].price * variables.cart_items[key].amount;
                    --variables.total_amount;
                    variables.total_price -= variables.cart_items[key].price;
                    
                    Change_cart(variables.cart_items[key]);
                });

            if(variables.cart_items[key].amount == 1) btn_deduct.disabled = true;
            
            const span = document.createElement('span');
                span.innerText = `${variables.cart_items[key].amount}`;

            const btn_add = document.createElement('button');
                btn_add.setAttribute('class', 'change_item_amount');
                btn_add.innerHTML = '&#62;';
                btn_add.addEventListener('click', function(event){
                    event.stopPropagation();
                    
                    ++variables.cart_items[key].amount;
                    variables.cart_items[key].all_price = variables.cart_items[key].price * variables.cart_items[key].amount;
                    ++variables.total_amount;
                    variables.total_price += variables.cart_items[key].price;
                    
                    Change_cart(variables.cart_items[key]);
                });
            
            if(variables.cart_items[key].amount == 4) btn_add.disabled = true;

            const btn_remove = document.createElement('button');
                btn_remove.setAttribute('class', 'remove_cart_item');
                btn_remove.innerText = 'X';
                btn_remove.addEventListener('click', function(event){
                    event.stopPropagation();

                    variables.total_amount -= variables.cart_items[key].amount;
                    variables.total_price -= variables.cart_items[key].all_price;

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

        if(variables.cart_items.length && cart_header.children.length < 2) cart_header.insertAdjacentHTML('beforeEnd', '<span>Checkout is almost done!</span>');
        
        localStorage.setItem('cart_items', JSON.stringify({
            cart: variables.cart_items,
            amount: variables.total_amount,
            price: variables.total_price,
        }));
    }

    const cart_amount = document.getElementsByClassName('cart_amount')[0];
        cart_amount.children[0].children[0].innerText = variables.total_amount;
        cart_amount.children[1].children[0].innerText = variables.total_price;
}

function Remove_from_filter(cat, choise){
    
    if(variables.choises.hasOwnProperty(cat)){
        
        if(variables.choises[cat].includes(choise)){
            const index = variables.choises[cat].indexOf(choise);
            variables.choises[cat].splice(index, 1);
        }
        if(variables.choises[cat].length == 0) {
            delete variables.choises[cat];
        }
    }else variables.choises[cat] = new Array(choise);

    if(!Object.keys(variables.choises).length) {

        variables.choised_items.length = 0;

        if(variables.category) {
            variables.price = [0,0];
            for(let key = 0; key < items.length; key++){                      
                if(items[key].category.toLocaleLowerCase() == variables.category){
                    variables.choised_items.push(items[key]);
                    Change_price(items[key]);
                }
            }
        }else variables.price = [...variables.accord_items.price];

        Order();
    }else Choised_items();
}

function Add_to_filter(category, choise){
    
    (variables.choises.hasOwnProperty(category)) ? 
        (()=>{
            if(!variables.choises[category].includes(choise)) variables.choises[category].push(choise);
        })() : variables.choises[category] = new Array(choise);
    Choised_items();
}

function Choised_items(){

    let choised_arr;

    if(variables.category) choised_arr = new Array(...variables.choised_items);
    else if(!variables.category || !variables.choised_items.length) choised_arr = new Array(...items);

    variables.price = [0, 0];
    let set = new Set();

    choised_arr.forEach((arr_item)=>{
        
        for(let [key, val] of Object.entries(variables.choises)){
            
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
    else variables.choised_items = [...set];

    if(variables.choised_items.length === 0) {
        variables.price = [...variables.accord_items.price];
        Order();
    }
    Order(variables.choised_items);
}

function Change_price(val){
    if(variables.price[0] > +val.price || variables.price[0] == 0) variables.price[0] = +val.price;
    if(variables.price[1] < +val.price) variables.price[1] = +val.price;
}

function Order(val){

    document.getElementsByClassName('items')[0].innerHTML = '';
    
    let arr;

    if(val && val.length > 0) arr = new Array(...val);
    else if(!variables.choised_items.length) arr = new Array(...variables.main_items);
    else arr = new Array(...variables.choised_items);
    
    let filter_price_children = document.getElementsByClassName('filter_price')[0].children;
        filter_price_children[0].children[1].value = variables.price[0];
        filter_price_children[0].children[1].setAttribute('min', variables.price[0]);
        filter_price_children[1].children[1].value = variables.price[1];
        filter_price_children[1].children[1].setAttribute('max', variables.price[1]);

        if(variables.order == 'ascending'){
            arr.sort((a, b)=> a.price - b.price);
            arr.forEach((item)=>{
                if(item.orderInfo.inStock < variables.stock) return;
                Add_item_to_catalog(item);
            });
        }else if(variables.order == 'descending'){
            arr.sort((a, b)=> b.price - a.price);
            arr.forEach((item)=>{
                if(item.orderInfo.inStock < variables.stock) return;
                Add_item_to_catalog(item);
            });
        }else arr.forEach((item)=>{
            if(item.orderInfo.inStock < variables.stock) return;
            Add_item_to_catalog(item);
        });
}

function Random_six_items(){
    
    let set_random = new Set();
    
    if(variables.main_items.length > 0) variables.main_items.length = 0;
        
    for(let i = 0; i < 6;){

        let key = RandomInteger(0, items.length);
    
        if(set_random.has(key)) continue;
        else {
            set_random.add(key);
            i++;
        };
        variables.main_items.push(items[key]);
    }
    Order();
}

function Add_item_to_catalog(value){
    
    const item = document.createElement("div");
        item.setAttribute("class", `item ${(
            (document.querySelector('.accordion_filter').classList.contains('active'))
                ? 'item_two_elm': '')
            }`);
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
            </div>
            <div class="item_favorite"></div>`
            item.onclick = function(event){
                event.stopPropagation();
                debugger
                if(event.target.classList.contains('item_favorite')){
                    event.target.classList.toggle('active');

                    (event.target.classList.contains('active')) ?
                        alert('Add to favorite') : alert('Remove from favorite');
                }else{
                    Modal_page(value);
                }
            }

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

export{
    RandomInteger,
    Change_cart,
    Remove_from_filter,
    Add_to_filter,
    Choised_items,
    Change_price,
    Order,
    Random_six_items,
    Add_item_to_catalog,
    Modal_page,
}