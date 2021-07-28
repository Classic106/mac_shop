    const variables = {
        arr_img_src: new Array(),
        categories: new Set(),
        main_items: new Array(),
        choised_items: new Array(),
        cart_items: new Array(),
        choises: new Object(),
        category: 0,
        price: [0, 0],
        order: 'default',
        total_amount: 0,
        total_price: 0,
        stock: 0,
        accord_items: {
            price: [0, 0],
            color: new Set(),
            memory: new Set(),
            os: new Set(),
            display: ['2-5 inch', '5-7 inch', '7-12 inch', '12-16 inch', '16+ inch'],
        }
    }

    if(localStorage.getItem('cart_items')){
        
        let ls = JSON.parse(localStorage.getItem('cart_items'));
            variables.cart_items = ls.cart;
            variables.total_amount = ls.amount;
            variables.total_price = ls.price;
    }

    export { variables };