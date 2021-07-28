import{ Random_six_items } from './functions.js';

import{ init_and_slider } from './init_and_slider.js';
import{ shopping_cart } from './shopping_cart.js';
import{ search } from './search.js';
import{ filter } from './filter.js';

$( document ).ready(function(){
    init_and_slider();
    shopping_cart();
    search();
    filter();
    Random_six_items();
})
