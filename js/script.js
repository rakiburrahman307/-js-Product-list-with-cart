const cartItemsContainer = document.querySelector(".product-cart-items");

const fetchData = async () => {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        renderProducts(data);
        console.log(data)
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

const renderProducts = (products) => {
    const productList = document.querySelector('.product-list');
    productList.innerHTML = products?.map(product => `
        <div class="product-item">
            <div class="product-img-container">
            <img src="${product?.image?.thumbnail}" alt="${product?.name}" />
            <button class="product-button" onclick="handleAddCart(${product?.id})"> <img class="add-to-cart-icon" src="./assets//images/icon-add-to-cart.svg" alt="icon-add-to-cart" /> Add to Cart</button>
            </div>
            
            <p class="product-category">${product?.category}</p>
            <h3 class="product-name">${product?.name}</h3>
            <p class="product-price">${product?.price} $</p>
        </div>
    `).join('');
};

fetchData();

const handleAddCart = async (productId) => {
    try {
        const response = await fetch(`https://dummyjson.com/products/${productId}`);
        if (!response.ok) {
            throw new Error('Product fetch failed');
        }
        const product = await response.json();

        cartItemsContainer.innerHTML += `
            <li class="product-cart-item" data-id="${product?.id}">
                <img src="${product?.thumbnail}" alt="${product?.title}" />
                <h3>${product?.title}</h3>
                <p>${product?.price} EUR</p>
                <button onclick="handleRemoveFromCart(${product?.id})">Remove</button>
                <hr/>
            </li>
        `;
        handleCalculateTotalPrice();
    } catch (error) {
        console.error('Error fetching product', error);
    }
};

const handleRemoveFromCart = (productId) => {
    const cartItem = cartItemsContainer.querySelector(`.product-cart-item[data-id="${productId}"]`);
    if (cartItem) {
        cartItem.remove();
        handleCalculateTotalPrice(); // Update total price after removing an item
    }
};

const handleCalculateTotalPrice = () => {
    const items = cartItemsContainer.querySelectorAll('.product-cart-item');
    let total = 0;

    items.forEach(item => {
        const priceText = item.querySelector("p").textContent;
        const price = parseFloat(priceText.replace(' EUR', ''));
        total += price;
    });

    const cartTotalElement = document.querySelector('.cart-total');
    if (cartTotalElement) {
        cartTotalElement.textContent = `Total: ${total.toFixed(2)} EUR`;
    }
};
