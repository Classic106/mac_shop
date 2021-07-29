import { variables } from './variables.js';

import{ Change_cart, Modal_page } from './functions.js';

function init_and_slider(){

    const slider = document.querySelectorAll('.slider_item');
    
    for(let val of [...slider]) variables.arr_img_src.push(val.children[0].getAttribute('src').replace(/.+banners\//gi, '').replace(/\_banner.+/gi, '').split('_').join(' '));

    for(let key in items){
        
        if(variables.accord_items.price[0] > +items[key].price || variables.accord_items.price[0] == 0) variables.accord_items.price[0] = +items[key].price;
        if(variables.accord_items.price[1] < +items[key].price) variables.accord_items.price[1] = +items[key].price;

        if(items[key].category != null || !items[key].category == false) variables.categories.add(items[key].category.toLowerCase());
        if(items[key].os != null || !items[key].os == false) variables.accord_items.os.add(items[key].os.toLowerCase());
        
        ((r, s)=>{
            if(isNaN(r) || isNaN(r)) return;
            if(r.length == 4) variables.accord_items.memory.add(r / 1024+' GB');
            else variables.accord_items.memory.add(r+' GB');
            
            if(s.length == 4) variables.accord_items.memory.add(s / 1024+' TB');
            else if(s.length == 1) variables.accord_items.memory.add(s+' TB');
            else if(s.length == 2 || s.length == 3) variables.accord_items.memory.add(s+' GB');
            
        })(new String(items[key].ram), new String(items[key].storage));

        for(let item in items[key].color){
            variables.accord_items.color.add(items[key].color[item]);
        }

        for(let item in variables.arr_img_src){
            
            if(items[key].name.toLowerCase().includes(variables.arr_img_src[item])) {
                
                const slider_item = document.getElementsByClassName('slider_item')[item];

                if(slider_item.children.length == 2) continue;
                
                const div = document.createElement('div');
                    div.setAttribute("class", `slider_item_div ${(()=>{
                        return (item == 3 || item == 4 || item == 5) ? 'color_black' : '';
                    })()}`);
                    div.onclick = function(event){
                        event.stopPropagation();
                        Modal_page(items[key]);
                    };

                if(item == 2 || item == 4) div.setAttribute("style", `left: 0; top: -20%; width: ${(()=>(item == 4) ? '35%' : '50%')()}`);

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

            if(variables.arr_img_src.length == 0) return;
        }
    }

    variables.accord_items.memory = [...variables.accord_items.memory].sort((a, b)=>{

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

    variables.price = variables.accord_items.price;

}
export {init_and_slider}
