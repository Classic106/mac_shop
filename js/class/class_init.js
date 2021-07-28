import {
    Random_items,
    getAllEl,
    setEl,
} from './class_functions.js'

import { Cart } from './class_cart.js';
import { Filter } from './class_filter.js';
import { View } from './class_view.js';

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
                style: (item == 2 || item == 4) ?
                    `padding-top: 55px; padding-right: ${(()=>(item == 4) ? '430px' : '335px;')()}` : '',
                onclick: function(event){
                    event.stopPropagation();
                    view.RenderModal(items[key]);
                }
            });
            
            const h1 = setEl('h1', {
                innerText: items[key].name
            });
            
            const button = setEl('button', {
                className: 'add_button',
                innerText: ('Add to cart'),
                onclick: (event)=>{
                    event.stopPropagation();
                    cart.Change_cart(items[key]);
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
    view.filter({
        price: this.#price,
        color: this.#color,
        memory: this.#memory,
        display: this.#display,
        os: this.#os,
    });
    view.renderCards(Random_items());
    }
}

const cart = new Cart();
const view = new View();
const filter = new Filter();

export { Init, cart, filter ,view }

