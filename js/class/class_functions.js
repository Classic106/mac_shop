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

function Change_input_price(price){

    const input_price = getEl('.filter_price').querySelectorAll('input');
        
    Object.assign(input_price[0], {
        min: price[0],
        max: price[1],
        value: price[0],
    });
        
    Object.assign(input_price[1], {
        min: price[0],
        max: price[1],
        value: price[1],
    });
}

export {
    Random_items,
    getEl,
    getAllEl,
    setEl,
    Change_input_price,
}