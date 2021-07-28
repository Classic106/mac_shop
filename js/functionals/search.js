import { variables } from './variables.js';

import{
    Choised_items,
    Change_price,
    Order,
    Random_six_items,
    Add_item_to_catalog,
} from './functions.js';

function search(){
    
const search = document.getElementsByClassName('input_container')[0];

const search_line = search.children[1];
    search_line.addEventListener('input', function(){

        document.getElementsByClassName('items')[0].innerHTML = '';

        document.getElementsByClassName('search_menu')[0].value = 'disabled';
        
        if(search_line.value.length > 0) {
            variables.choised_items = items.filter((item)=>{
                if(item.name.match(new RegExp(`${search_line.value}`, 'gi'))) return item;
            });
        }
        
        (!search_line.value.length || !variables.choised_items.length) ? (()=>{
            if(variables.main_items.length > 0) variables.main_items.forEach((item)=> Add_item_to_catalog(item));
            else Random_six_items();
            variables.choised_items.length = 0;
        })() : variables.choised_items.forEach(item=>Add_item_to_catalog(item));
    });
    
    const search_tune = document.querySelector('.search_tune');
        search_tune.setAttribute('tabindex', 0);
        search_tune.addEventListener('blur', function(event){
            event.stopPropagation();
            this.classList.remove('active');
        });
        search_tune.addEventListener('focus', function(event){
            event.stopPropagation();
            this.classList.add('active');
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
            variables.category = select.value;
            
            if(select.value == 0){
                variables.choised_items = [...items];
                variables.price = variables.accord_items.price;
                
                Order();
            }else{
                variables.choised_items.length = 0;
                variables.price = [0, 0];
                
                for(let key = 0; key < items.length; key++){                      
                    if(items[key].category.toLocaleLowerCase() == select.value){
                        variables.choised_items.push(items[key]);
                        Change_price(items[key]);
                    }
                }
                if(Object.keys(variables.choises).length) Choised_items();
                else Order();
            }
        });

    const input = document.createElement('input');
        input.setAttribute('type', 'number');        
        input.setAttribute('value', 0);
        input.setAttribute('min', 0);
        input.addEventListener('change', function(){
            document.getElementsByClassName('items')[0].innerHTML = '';
            
            variables.stock = input.value;
            
            let max = 0;
            let result;
            
            if(!variables.choised_items.length) variables.choised_items = items;

            result = variables.choised_items.filter((item)=>{
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

        variables.categories.forEach((item)=>{
    
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
                
                variables.order = button.value;
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

}

export { search }