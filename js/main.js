// Основной JavaScript файл

// Плавная прокрутка при клике по навигации
document.addEventListener('DOMContentLoaded', function() {
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Добавляем подсветку активного пункта меню
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                // Плавная прокрутка
                window.scrollTo({
                    top: targetElement.offsetTop - 30,
                    behavior: 'smooth'
                });
                
                // Обновляем URL без перезагрузки страницы
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Фильтрация товаров
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterProducts(filter);
        });
    });
    
    // Сортировка товаров
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }
    
    // Загрузка товаров при инициализации
    loadProducts();
    
    // Обработка формы консультации
    const consultationForm = document.getElementById('consultation-form');
    if (consultationForm) {
        consultationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitConsultation(this);
        });
    }
    
    // Анимация при скролле
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0.2s';
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за секциями
    document.querySelectorAll('.catalog-section, .about-section, .services-section, .contact-section').forEach(section => {
        observer.observe(section);
    });
});

// Фильтрация товаров
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        if (category === 'all' || product.getAttribute('data-category') === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Сортировка товаров
function sortProducts(sortBy) {
    const productGrid = document.getElementById('product-grid');
    const products = Array.from(productGrid.children);
    
    products.sort((a, b) => {
        const aTitle = a.querySelector('.product-title').textContent;
        const bTitle = b.querySelector('.product-title').textContent;
        const aPrice = parseFloat(a.querySelector('.product-price').textContent.replace('от ', '').replace(' BYN', ''));
        const bPrice = parseFloat(b.querySelector('.product-price').textContent.replace('от ', '').replace(' BYN', ''));
        
        switch(sortBy) {
            case 'name':
                return aTitle.localeCompare(bTitle);
            case 'price':
                return aPrice - bPrice;
            case 'popularity':
                return Math.random() - 0.5; // Для демонстрации
            default:
                return 0;
        }
    });
    
    // Перемещаем отсортированные элементы
    products.forEach(product => {
        productGrid.appendChild(product);
    });
}

// Загрузка товаров (имитация)
function loadProducts() {
    const productGrid = document.getElementById('product-grid');
    
    // Пример данных товаров
    const products = [
        {
            id: 1,
            name: "Кухонный гарнитур 'Модерн'",
            price: 2500,
            description: "Современный кухонный гарнитур с функциональным дизайном.",
            category: "kitchen",
            image: "css/img/kitchen.jpg"
        },
        {
            id: 2,
            name: "Шкаф-купе 'Классик'",
            price: 1800,
            description: "Просторный шкаф-купе с зеркальными дверцами и удобной внутренней планировкой",
            category: "bedroom",
            image: "css/img/skaf.jpeg"
        },
        {
            id: 3,
            name: "Обеденный стол 'Сканди'",
            price: 950,
            description: "Минималистичный стол в скандинавском стиле из массива дерева",
            category: "kitchen",
            image: "css/img/dining-table.jpeg"
        },
        {
            id: 4,
            name: "Диван 'Комфорт'",
            price: 2200,
            description: "Уютный диван с мягкой обивкой и раскладным механизмом",
            category: "livingroom",
            image: "css/img/sofa.jpeg"
        },
        {
            id: 5,
            name: "Офисный стол 'Практик'",
            price: 700,
            description: "Функциональный стол для работы с отделениями для хранения документов",
            category: "office",
            image: "css/img/office-desk.jpg"
        },
        {
            id: 6,
            name: "Тумба прикроватная 'Лайт'",
            price: 350,
            description: "Компактная тумба с ящиком и полкой, отлично впишется в интерьер спальни",
            category: "bedroom",
            image: "css/img/tumba.jpg"
        }
    ];
    
    // Очищаем сетку
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-category', product.category);

        // Проверяем есть ли картинка
        const productImg = product.image 
            ? `<div class="product-img" style="background-image: url('${product.image}'); background-size: cover; background-position: center;"></div>`
            : `<div class="product-img"></div>`;

        productCard.innerHTML = `
            ${productImg}
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">от ${product.price} BYN</div>
                <p class="product-desc">${product.description}</p>
                <span class="category-tag">${getCategoryName(product.category)}</span>
                <button onclick="openProductModal(${JSON.stringify(product).replace(/"/g, '&quot;')})">Подробнее</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}


// Получение названия категории
function getCategoryName(category) {
    const categories = {
        'kitchen': 'Кухня',
        'bedroom': 'Спальня',
        'living': 'Гостиная',
        'office': 'Офис'
    };
    return categories[category] || category;
}

// Отправка формы консультации
function submitConsultation(form) {
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        project: formData.get('project')
    };
    
    // Здесь будет отправка на сервер
    console.log('Отправка данных консультации:', data);
    
    // Показываем уведомление
    showNotification('Спасибо! Мы свяжемся с вами.');
    
    // Очищаем форму
    form.reset();
}

// Показ уведомления
function showNotification(text) {
    const notification = document.getElementById('notification');
    notification.textContent = text;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Открытие модального окна
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Закрытие модального окна
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Закрытие модального окна при клике вне его
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Закрытие модального окна клавишей Esc
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
    }
});