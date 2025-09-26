// Работа с корзиной
// Инициализация корзины при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});

// Получение товаров из корзины
function getCartItems() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Сохранение товаров в корзине
function saveCartItems(items) {
    localStorage.setItem('cart', JSON.stringify(items));
}

// Обновление счетчика корзины
function updateCartCount() {
    const cartItems = getCartItems();
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        countElement.textContent = count;
    }
}

// Добавление товара в корзину
function addToCart(product, options = {}) {
    const cartItems = getCartItems();
    // Проверяем, есть ли уже такой товар с такими же опциями
    const existingItemIndex = cartItems.findIndex(item =>
        item.id === product.id &&
        JSON.stringify(item.options) === JSON.stringify(options)
    );
    if (existingItemIndex !== -1) {
        // Если товар уже есть, увеличиваем количество
        cartItems[existingItemIndex].quantity += 1;
    } else {
        // Если товара нет, добавляем новый
        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image, // Сохраняем изображение
            ...options
        };
        cartItems.push(cartItem);
    }
    saveCartItems(cartItems);
    updateCartCount();
    return cartItems;
}

// Удаление товара из корзины
function removeFromCart(index) {
    const cartItems = getCartItems();
    cartItems.splice(index, 1);
    saveCartItems(cartItems);
    updateCartCount();
    return cartItems;
}

// Изменение количества товара
function updateItemQuantity(index, quantity) {
    const cartItems = getCartItems();
    if (cartItems[index] && quantity > 0) {
        cartItems[index].quantity = quantity;
        saveCartItems(cartItems);
        updateCartCount();
        return cartItems;
    }
    return null;
}

// Очистка корзины
function clearCart() {
    localStorage.removeItem('cart');
    updateCartCount();
}

// Получение общей стоимости
function getCartTotal() {
    const cartItems = getCartItems();
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Получение количества товаров
function getCartItemCount() {
    const cartItems = getCartItems();
    return cartItems.reduce((count, item) => count + item.quantity, 0);
}

// Обновление отображения корзины - ОБНОВЛЕНА ФУНКЦИЯ
function updateCartDisplay() {
    const cartItems = getCartItems();
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total-amount');

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <p>Корзина пуста</p>
                <p>Добавьте товары из каталога</p>
            </div>
        `;
        cartTotalElement.textContent = '0';
        return;
    }

    let cartHTML = '';
    let total = 0;

    cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        // Определяем HTML для изображения
        let imageHtml = '<div class="cart-item-image-placeholder"></div>';
        if (item.image) {
             // Используем стиль background-image для отображения изображения
            imageHtml = `<div class="cart-item-image" style="background-image: url('${item.image}'); background-size: cover; background-position: center;"></div>`;
        } else {
            // Если изображения нет, показываем заглушку
             imageHtml = '<div class="cart-item-image" style="background: linear-gradient(45deg, #e0e0e0, #d0d0d0); display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px;">Нет фото</div>';
        }

        cartHTML += `
            <div class="cart-item">
                ${imageHtml}
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price} BYN</div>
                    <div class="cart-item-options">
                        Материал: ${item.material || 'Не указан'}, Цвет: ${item.color || 'Не указан'}
                    </div>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="changeQuantity(${index}, -1)">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="changeQuantity(${index}, 1)">+</button>
                    </div>
                    <div class="remove-item" onclick="removeFromCart(${index})">✕</div>
                </div>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = cartHTML;
    cartTotalElement.textContent = total.toFixed(2);
}

// Изменение количества товара в корзине
function changeQuantity(index, change) {
    const cartItems = getCartItems();
    if (cartItems[index]) {
        cartItems[index].quantity += change;
        if (cartItems[index].quantity < 1) {
            cartItems[index].quantity = 1;
        }
        saveCartItems(cartItems);
        updateCartDisplay();
        updateCartCount();
    }
}