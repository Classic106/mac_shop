import { variables } from './variables.js';

import{
    Remove_from_filter,
    Add_to_filter,
} from './functions.js';

function filter(){
    
    const accordion_filter = document.querySelector('.accordion_filter');

    const main_ul = document.createElement('ul');
        accordion_filter.appendChild(main_ul);
    
    for(let key of Object.keys(variables.accord_items)){

        const ul = document.createElement('ul');
        const span = document.createElement('span');
        const li = document.createElement('li');
        
        if(key === 'price'){
            
            for(let item in variables.accord_items[key]){
    
                const li = document.createElement('li');
                const span = document.createElement('span');
                    span.innerText = (item == 0) ? 'From' : 'To';

                const input = document.createElement('input');
                    input.setAttribute('type', 'number');
                    input.setAttribute('max', variables.price[1]);
                    input.setAttribute('min', variables.price[0]);
                    input.setAttribute('value', (item == 0) ? variables.accord_items.price[0] : variables.accord_items.price[1]);
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

            let ai = [...variables.accord_items[key]];

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
}

export { filter }