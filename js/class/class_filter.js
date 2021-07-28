import { Change_input_price } from './class_functions.js';

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
    get price(){
        return this.#price;
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
  
        const price = [0, 0];

        const arr = items.filter(item => {

            const isSearch = item.name.toLowerCase().includes(this.#name);
            if (!isSearch) return false;
            
            const isPrice = (item.price >= this.#price[0] && item.price <= this.#price[1]) ? true : false;
            if (!isPrice) return false;

            if(this.#category){
                const isCategory = (item.category.toLowerCase() == this.#category) || (this.#category == 'all');
                if (!isCategory) return false;
            }

            let isColor= !this.#color.length;
            this.#color.forEach(color => {
                if (item.color.includes(color)) isColor = true;
            })
            if (!isColor) return false;
            
            let isMemory= !this.#memory.length;
            this.#memory.forEach(memory => {

                if(item.storage == +memory || item.ram == +memory) isMemory = true;
            })
            if (!isMemory) return false;
            
            let isDisplay = !this.#display.length;
            this.#display.forEach(display => {

                let values = display.split(',');
 
                if(item.display >= +values[0] && (!values[1]) ? true : item.display <= +values[1]) isDisplay = true;
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

            if(price[0] > +item.price || price[0] == 0) price[0] = +item.price;
            if(price[1] < +item.price) price[1] = +item.price;
            
            return true;
        });

        Change_input_price(price);

        if(this.#order == 'ascending'){
            arr.sort((a, b)=> a.price - b.price);
        }else if(this.#order == 'descending'){
            arr.sort((a, b)=> b.price - a.price);
        };

        return arr;
    }
}

export { Filter }