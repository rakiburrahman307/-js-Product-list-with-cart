const cartItemsContainer = document.querySelector(".product-cart-items");
let products = [];
let cart = [];

const fetchData = async () => {
    try {
        const response = await fetch("data.json");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        products = await response.json(); 
        renderProducts(products);  
    } catch (error) {
        console.error("Fetch error:", error);
    }
};

const renderProducts = (products) => {
    const productList = document.querySelector(".product-list");
    productList.innerHTML = products
        .map((product) => {
            const cartItem = cart.find((item) => item.id === product.id);
            const quantity = cartItem ? cartItem.quantity : 0;

            return `
        <div class="product-item">
            <div class="product-img-container">
                <img src="${product?.image?.thumbnail}" alt="${product?.name}" />
                ${
                    quantity > 0
                        ? `<div class="cartQuantity-container">
                            <img onclick="handleDecreaseCartItem(${product?.id})" class="decrement" src="./assets/images/icon-decrement-quantity.svg" alt="icon-decrement-quantity">
                            <p class="quantity">${quantity}</p>
                            <img onclick="handleIncreaseCartItem(${product?.id})" class="increment" src="./assets/images/icon-increment-quantity.svg" alt="icon-increment-quantity">
                           </div>`
                        : `<button class="product-button" onclick="handleAddCart(${product?.id})"> 
                            <img class="add-to-cart-icon" src="./assets/images/icon-add-to-cart.svg" alt="icon-add-to-cart" /> Add to Cart</button>`
                }
            </div>
            <p class="product-category">${product?.category}</p>
            <h3 class="product-name">${product?.name}</h3>
            <p class="product-price">${product?.price} $</p>
        </div>
        `;
        })
        .join("");
};

const renderCartItems = () => {
    // Clear the cart container before rendering
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty</p>";
        return;
    }

    // Render each cart item
    cart.forEach((item) => {
        cartItemsContainer.innerHTML += `
        <li class="product-cart-item" data-id="${item.id}">
            <img src="${item.image.thumbnail}" alt="${item.name}" />
            <div class="cart-item-container">
                <h3 class="cart-item-name">${item.name}</h3>
                <div class="cart-item-details">
                    <p class="cart-item-quantity">${item.quantity}x</p>
                    <p class="cart-item-price">@ $${item.price}</p>
                    <p class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            </div>
            <img class="remove-icon" onclick="handleRemoveFromCart(${item.id})" src="./assets/images/icon-remove-item.svg" alt="remove-icon" />
            <hr/>
        </li>`;
    });

    handleCalculateTotalPrice(); 
};

const handleAddCart = (productId) => {
    const product = products.find((item) => item.id === productId);
    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 }); // Add new item with quantity 1
    }

    renderProducts(products); // Re-render the product list
    renderCartItems(); // Re-render the cart items
};

const handleIncreaseCartItem = (id) => {
    const cartItem = cart.find((item) => item.id === id);
    if (cartItem) {
        cartItem.quantity += 1;
        renderProducts(products);  // Re-render products
        renderCartItems(); // Re-render cart
    }
};

const handleDecreaseCartItem = (id) => {
    const cartItem = cart.find((item) => item.id === id);
    if (cartItem && cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        renderProducts(products);  // Re-render products
        renderCartItems(); // Re-render cart
    } else {
        cart = cart.filter((item) => item.id !== id); // Remove item from cart
        renderProducts(products);  // Re-render products
        renderCartItems(); // Re-render cart
    }
};

const handleCalculateTotalPrice = () => {
    let total = 0;

    cart.forEach((item) => {
        total += item.price * item.quantity;
    });

    const cartTotalElement = document.querySelector(".cart-total");
    if (cartTotalElement) {
        cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
    }
};

fetchData();
