// Модальные окна

let currentProduct = null;

// Открытие модального окна товара
function openProductModal(product) {
    currentProduct = product;

    // Заполняем данные товара
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = `от ${product.price} BYN`;
    document.getElementById('product-description').textContent = product.description;

    // Подставляем изображение, если есть
    const productImage = document.getElementById('product-image');
    if (product.image) {
        productImage.style.backgroundImage = `url(${product.image})`;
        productImage.style.backgroundSize = 'cover';
        productImage.style.backgroundPosition = 'center';
        productImage.style.backgroundColor = 'transparent';
    } else {
        // Если изображения нет — оставляем заглушку
        productImage.style.backgroundImage = 'none';
        productImage.style.backgroundColor = '#e0e0e0';
        productImage.textContent = 'Фото недоступно';
    }

    // Открываем модальное окно
    openModal('product-modal');
}

// Запрос консультации
function requestConsultation() {
    if (currentProduct) {
        showNotification(`Консультация по товару: ${currentProduct.name}`);
    }
    closeModal('product-modal');
}

// Открытие корзины
function openCartModal() {
    updateCartDisplay();
    openModal('cart-modal');
}

// Открытие формы заказа
function openOrderForm() {
    updateOrderForm();
    closeModal('cart-modal');
    openModal('order-modal');
}

// Обновление отображения корзины - ОБНОВЛЕНО ДЛЯ ОТОБРАЖЕНИЯ ИЗОБРАЖЕНИЯ
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

// Удаление товара из корзины
function removeFromCart(index) {
    const cartItems = getCartItems();
    cartItems.splice(index, 1);
    saveCartItems(cartItems);
    updateCartDisplay();
    updateCartCount();
    showNotification('Товар удален из корзины');
}

// Обновление формы заказа
function updateOrderForm() {
    const cartItems = getCartItems();
    const summaryContainer = document.getElementById('order-cart-summary');

    if (cartItems.length === 0) {
        summaryContainer.innerHTML = '<p>Корзина пуста</p>';
        return;
    }

    let summaryHTML = '<h4>Ваш заказ:</h4>';
    let total = 0;

    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        summaryHTML += `
            <div class="summary-item">
                <span>${item.name} (${item.quantity} шт.)</span>
                <span>${itemTotal.toFixed(2)} BYN</span>
            </div>
        `;
    });

    summaryHTML += `
        <div class="summary-total">
            <span>Итого:</span>
            <span>${total.toFixed(2)} BYN</span>
        </div>
    `;

    summaryContainer.innerHTML = summaryHTML;
}

// Работа с корзиной
function getCartItems() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCartItems(items) {
    localStorage.setItem('cart', JSON.stringify(items));
}

function updateCartCount() {
    const cartItems = getCartItems();
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        countElement.textContent = count;
    }
}

// Добавление в корзину из модального окна товара - ДОБАВЛЕНО image
function addToCartFromModal() {
    if (!currentProduct) return;

    const material = document.getElementById('material-select').value;
    const color = document.getElementById('color-select').value;
    const length = document.getElementById('length-input').value;
    const width = document.getElementById('width-input').value;
    const height = document.getElementById('height-input').value;
    const hardware = document.getElementById('hardware-select').value;
    const led = document.getElementById('led-option').checked;
    const glass = document.getElementById('glass-option').checked;
    const mirror = document.getElementById('mirror-option').checked;
    const comment = document.getElementById('comment-textarea').value;

    const cartItem = {
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        quantity: 1,
        // Добавляем изображение товара
        image: currentProduct.image,
        material,
        color,
        dimensions: { length, width, height },
        hardware,
        options: { led, glass, mirror },
        comment
    };

    const cartItems = getCartItems();
    cartItems.push(cartItem);
    saveCartItems(cartItems);
    updateCartCount();

    closeModal('product-modal');
    showNotification('Товар добавлен в корзину!');
}

// Обработка формы заказа
document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitOrder(this);
        });
    }
});

// Отправка заказа
function submitOrder(form) {
    const formData = new FormData(form);
    const cartItems = getCartItems();

    const orderData = {
        name: formData.get('order-name'),
        phone: formData.get('order-phone'),
        email: formData.get('order-email'),
        address: formData.get('order-address'),
        comments: formData.get('order-comments'),
        items: cartItems,
        total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    // Здесь будет отправка на сервер
    console.log('Отправка заказа:', orderData);

    // Очищаем корзину
    localStorage.removeItem('cart');
    updateCartCount();

    // Показываем уведомление
    showNotification('Заказ оформлен! Мы свяжемся с вами.');

    // Очищаем форму
    form.reset();

    // Закрываем модальное окно
    closeModal('order-modal');
}