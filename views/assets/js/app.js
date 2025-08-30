// Initialize AOS
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });

        // Cart functionality
    let cart = [];
    let cartCount = 0;
    let currency = 'CRC'; // Default currency
        const exchangeRate = 550; // 1 USD = 550 CRC

        // Function to convert USD to CRC
        function convertToColones(usdAmount) {
            return usdAmount * exchangeRate;
        }

        // Function to format currency
        function formatCurrency(amount, currency) {
            if (currency === 'CRC') {
                return `₡${Math.round(amount).toLocaleString()}`;
            } else {
                return `$${amount.toFixed(2)}`;
            }
        }

        // Function to update prices based on selected currency
        function updatePrices() {
            const prices = document.querySelectorAll('.product-price');
            prices.forEach(priceElement => {
                const usdPrice = parseFloat(priceElement.getAttribute('data-usd'));
                priceElement.textContent = formatCurrency(
                    currency === 'CRC' ? convertToColones(usdPrice) : usdPrice, 
                    currency
                );
            });
            
            // Update cart if it's open
            if (document.querySelector('.swal2-container')) {
                showCart();
            }
        }

        // Toggle currency
        document.getElementById('currencyToggle').addEventListener('change', function() {
            currency = this.checked ? 'CRC' : 'USD';
            updatePrices();
        });

        function addToCart(name, price, emoji) {
            // Convert price if currency is CRC
            const itemPrice = currency === 'CRC' ? convertToColones(price) : price;
            const originalPrice = price; // Store original USD price
            
            const existingItem = cart.find(item => item.name === name);
            
            if (existingItem) {
                existingItem.quantity += 1;
                existingItem.totalPrice = existingItem.quantity * itemPrice;
            } else {
                cart.push({
                    name: name,
                    price: itemPrice,
                    originalPrice: originalPrice, // Store original USD price
                    emoji: emoji,
                    quantity: 1,
                    totalPrice: itemPrice,
                    id: Date.now()
                });
            }
            
            cartCount++;
            updateCartCount();
            
            // GSAP animation for cart button
            gsap.to('.cart-btn', {duration: 0.1, scale: 1.1, yoyo: true, repeat: 1});
            
            Swal.fire({
                title: '¡Agregado al carrito!',
                html: `<div style="font-size: 3rem; margin-bottom: 1rem;">${emoji}</div>
                       <strong>${name}</strong> ha sido agregado a tu carrito`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end',
                background: 'linear-gradient(135deg, #ff70a6 0%, #ff4b8b 100%)',
                color: 'white'
            });
        }

        function updateCartCount() {
            document.getElementById('cartCount').textContent = cartCount;
        }

        function showCart() {
            if (cart.length === 0) {
                Swal.fire({
                    title: 'Carrito vacío',
                    html: '<div style="font-size: 4rem; margin-bottom: 1rem;">🛒</div>No tienes productos en tu carrito',
                    icon: 'info',
                    confirmButtonText: 'Continuar comprando',
                    confirmButtonColor: '#ff4b8b',
                    background: 'white',
                    customClass: {
                        popup: 'animated bounceIn'
                    }
                });
                return;
            }

            let cartHTML = '<div class="cart-items" style="max-height: 400px; overflow-y: auto;">';
            let total = 0;

            cart.forEach((item, index) => {
                // Update price based on current currency
                const itemPrice = currency === 'CRC' ? convertToColones(item.originalPrice) : item.originalPrice;
                const itemTotal = itemPrice * item.quantity;
                total += itemTotal;
                
                cartHTML += `
                    <div class="cart-item d-flex justify-content-between align-items-center mb-3 p-3" style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 15px; border-left: 4px solid #ff4b8b">
                        <div class="d-flex align-items-center">
                            <span style="font-size: 2rem; margin-right: 15px;">${item.emoji}</span>
                            <div>
                                <strong style="color: #2d3748;">${item.name}</strong><br>
                                <small style="color: #718096;">${formatCurrency(itemPrice, currency)} c/u</small>
                            </div>
                        </div>
                        <div class="d-flex align-items-center">
                            <button class="btn btn-sm btn-outline-danger me-2" onclick="removeFromCart(${index})" style="border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="mx-3" style="font-weight: 600; min-width: 20px; text-align: center;">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-success me-3" onclick="addQuantity(${index})" style="border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-plus"></i>
                            </button>
                            <strong style="color: #ff4b8b; min-width: 60px;">${formatCurrency(itemTotal, currency)}</strong>
                        </div>
                    </div>
                `;
            });

            cartHTML += `</div>
                <hr style="margin: 2rem 0;">
                <div class="text-center">
                    <h3 style="color: #2d3748; font-family: 'Fredoka', cursive;">Total: <span style="color: #ff4b8b;">${formatCurrency(total, currency)}</span></h3>
                </div>`;

            Swal.fire({
                title: '🛒 Tu Carrito de Helados',
                html: cartHTML,
                width: '700px',
                showCancelButton: true,
                confirmButtonText: '<i class="fas fa-store"></i> Pagar en caja',
                cancelButtonText: '<i class="fas fa-shopping-bag"></i> Seguir Comprando',
                confirmButtonColor: '#ff4b8b',
                cancelButtonColor: '#718096',
                customClass: {
                    popup: 'animated fadeInUp'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    checkoutAtCounter(total);
                }
            });
        }

        // Nuevo flujo: pagar en caja (sin pasarela)
        function checkoutAtCounter(total) {
            const orderCode = 'HC' + Date.now().toString().slice(-6);
            const lines = cart.map(item => {
                const unit = currency === 'CRC' ? convertToColones(item.originalPrice) : item.originalPrice;
                const sub = unit * item.quantity;
                return `<div class="d-flex justify-content-between mb-1"><span>${item.quantity} × ${item.name}</span><strong>${formatCurrency(sub, currency)}</strong></div>`;
            }).join('');
            Swal.fire({
                title: 'Pagar en caja',
                html: `
                    <div>
                        <div class="mb-3 p-3" style="background:linear-gradient(135deg,#f8f9fa,#edf2f7);border-radius:12px;">
                            ${lines}
                            <hr>
                            <div class="d-flex justify-content-between"><span>Total</span><strong style="color:#ff4b8b;">${formatCurrency(total, currency)}</strong></div>
                        </div>
                        <div class="text-center">
                            <div class="mb-2" style="font-family:'Fredoka',cursive;font-size:1.1rem;color:#2d3748;">Código de orden</div>
                            <div style="font-size:1.8rem;font-weight:800;color:#ff4b8b;letter-spacing:1px;">${orderCode}</div>
                            <div class="mt-2 text-muted" style="font-size:.9rem;">Muestra este código en caja para pagar. Reservamos tu pedido por 15 minutos.</div>
                        </div>
                    </div>
                `,
                icon: 'info',
                confirmButtonText: '<i class="fas fa-check"></i> Listo',
                confirmButtonColor: '#ff4b8b'
            }).then(() => {
                cart = [];
                cartCount = 0;
                updateCartCount();
            });
        }

        function removeFromCart(index) {
            const item = cart[index];
            if (item.quantity > 1) {
                item.quantity -= 1;
                // Update total price based on current currency
                const itemPrice = currency === 'CRC' ? convertToColones(item.originalPrice) : item.originalPrice;
                item.totalPrice = item.quantity * itemPrice;
                cartCount--;
            } else {
                cart.splice(index, 1);
                cartCount--;
            }
            updateCartCount();
            showCart();
        }

        function addQuantity(index) {
            cart[index].quantity += 1;
            // Update total price based on current currency
            const itemPrice = currency === 'CRC' ? convertToColones(cart[index].originalPrice) : cart[index].originalPrice;
            cart[index].totalPrice = cart[index].quantity * itemPrice;
            cartCount++;
            updateCartCount();
            showCart();
        }

        function processOrder(total) {
            Swal.fire({
                title: '¡Pedido Confirmado!',
                html: `
                    <div class="text-center">
                        <div style="font-size: 5rem; margin-bottom: 1.5rem;">🎉</div>
                        <h4 style="color: #2d3748; margin-bottom: 1rem;">¡Gracias por tu pedido!</h4>
                        <p style="color: #718096; margin-bottom: 1rem;">Tu pedido por <strong style="color: #ff4b8b;">${formatCurrency(total, currency)}</strong> ha sido confirmado y está siendo preparado con mucho amor.</p>
                        <div style="background: linear-gradient(135deg, #ff4b8b 0%, #ff70a6 100%); color: white; padding: 15px; border-radius: 10px; margin: 1rem 0;">
                            <i class="fas fa-clock"></i> <strong>Tiempo estimado: 20-25 minutos</strong>
                        </div>
                        <p style="color: #718096;">Recibirás una notificación cuando tu pedido esté listo para recoger o cuando nuestro repartidor esté en camino.</p>
                        <div style="margin-top: 1rem;">
                            <small style="color: #a0aec0;">Número de pedido: #GP${Date.now().toString().slice(-6)}</small>
                        </div>
                    </div>
                `,
                icon: 'success',
                confirmButtonText: '<i class="fas fa-heart"></i> ¡Perfecto!',
                confirmButtonColor: '#ff70a6',
                customClass: {
                    popup: 'animated bounceIn'
                }
            }).then(() => {
                cart = [];
                cartCount = 0;
                updateCartCount();
            });
        }

            // Simulate payment processing
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Update scroll progress
            const scrollProgress = document.getElementById('scrollProgress');
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        });

        // Counter animation
        function animateCounters() {
            const counters = document.querySelectorAll('[data-count]');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = Math.floor(current).toLocaleString();
                }, 16);
            });
        }

        // Intersection Observer for counters
        const statsSection = document.querySelector('.stats-section');
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        });

        if (statsSection) {
            statsObserver.observe(statsSection);
        }

        // Loading screen
        window.addEventListener('load', function() {
            const loadingOverlay = document.getElementById('loadingOverlay');
            setTimeout(() => {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 500);
            }, 1500);
        });

        // GSAP animations
        gsap.registerPlugin();

        // Actualizar precios a CRC al cargar si el switch está activado
        window.addEventListener('DOMContentLoaded', function() {
            updatePrices();
        });

        // Hero animations
        gsap.timeline()
            .from('.hero-title', {duration: 1, y: 50, opacity: 0, delay: 2})
            .from('.hero-subtitle', {duration: 1, y: 30, opacity: 0}, '-=0.5')
            .from('.hero-buttons', {duration: 1, y: 30, opacity: 0}, '-=0.5')
            .from('.hero-features', {duration: 1, y: 30, opacity: 0}, '-=0.5');

        // Product cards hover effect
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                gsap.to(this, {duration: 0.3, y: -10, scale: 1.02});
            });
            
            card.addEventListener('mouseleave', function() {
                gsap.to(this, {duration: 0.3, y: 0, scale: 1});
            });
        });

        // Add to cart button animation
                document.querySelectorAll('.btn-add-cart').forEach(btn => {
                        btn.addEventListener('click', function() {
                                gsap.to(this, {duration: 0.1, scale: 0.95, yoyo: true, repeat: 1});
                        });
                });

                // Datos de productos para el modal
                const productDetailsData = {
                        'CHOCO COPA': {
                                name: 'CHOCO COPA',
                                image: 'views/assets/img/CHOCOCOPA .png',
                                rating: 4.9,
                                reviews: 234,
                                description: 'Helado de chocolate con toppings y salsa especial.',
                                price: 5.50,
                                emoji: '🍫'
                        },
                        'MANGONADA': {
                                name: 'MANGONADA',
                                image: 'views/assets/img/2.png',
                                rating: 4.8,
                                reviews: 189,
                                description: 'Refrescante mangonada tropical con chile y limón.',
                                price: 6.00,
                                emoji: '🥭'
                        },
                        'MILKSHAKE': {
                                name: 'MILKSHAKE',
                                image: 'views/assets/img/MILKSHAKE.png',
                                rating: 4.7,
                                reviews: 156,
                                description: 'Milkshake cremoso con galleta y chocolate.',
                                price: 5.25,
                                emoji: '🥤'
                        },
                        'Vainilla Madagascar': {
                                name: 'Vainilla Madagascar',
                                image: 'views/assets/img/logo heladeria con edicion.png',
                                rating: 4.9,
                                reviews: 298,
                                description: 'Helado de vainilla premium de Madagascar.',
                                price: 4.75,
                                emoji: '🍦'
                        },
                        'Coco Caribeño': {
                                name: 'Coco Caribeño',
                                image: 'views/assets/img/Diseño Sticker heladería.png',
                                rating: 4.6,
                                reviews: 142,
                                description: 'Helado de coco con sabor caribeño.',
                                price: 5.10,
                                emoji: '🥥'
                        },
                        'Limón Siciliano': {
                                name: 'Limón Siciliano',
                                image: 'views/assets/img/COPO HELADO.png',
                                rating: 4.8,
                                reviews: 167,
                                description: 'Helado refrescante de limón siciliano.',
                                price: 4.90,
                                emoji: '🍋'
                        }
                };

                // Función para mostrar el modal de detalles
                window.showProductDetails = function(productName) {
                        const data = productDetailsData[productName];
                        if (!data) return;
                        // Actualizar título
                        document.getElementById('productDetailsModalLabel').textContent = data.name;
                        // Actualizar cuerpo
                        document.getElementById('productDetailsModalBody').innerHTML = `
                                <div class="row">
                                    <div class="col-md-5 text-center">
                                        <img src="${data.image}" alt="${data.name}" style="max-width:100%; max-height:300px; object-fit:contain; border-radius:20px;">
                                    </div>
                                    <div class="col-md-7">
                                        <div class="mb-2">
                                            <span style="font-size:1.5rem; color:#ff4b8b;">${data.emoji}</span>
                                            <span class="ms-2">
                                                ${'<i class="fas fa-star" style="color:#ffd700"></i>'.repeat(Math.floor(data.rating))}
                                                ${data.rating % 1 ? '<i class="fas fa-star-half-alt" style="color:#ffd700"></i>' : ''}
                                                <span class="ms-2 text-muted">(${data.rating}) ${data.reviews} reseñas</span>
                                            </span>
                                        </div>
                                        <p class="mb-3">${data.description}</p>
                                        <div class="mb-3">
                                            <span class="product-price" data-usd="${data.price}">${formatCurrency(currency === 'CRC' ? convertToColones(data.price) : data.price, currency)}</span>
                                        </div>
                                        <button class="btn btn-add-cart w-100" onclick="addToCart('${data.name}', ${data.price}, '${data.emoji}')">
                                            <i class="fas fa-plus"></i> Agregar al Carrito
                                        </button>
                                    </div>
                                </div>
                        `;
                        // Mostrar modal Bootstrap
                        const modal = new bootstrap.Modal(document.getElementById('productDetailsModal'));
                        modal.show();
                }
                
// UI extra para modal de producto: badges + lista de especificaciones
document.addEventListener('DOMContentLoaded', function() {
    const modalEl = document.getElementById('productDetailsModal');
    if (!modalEl) return;
    modalEl.addEventListener('show.bs.modal', function() {
        try {
            const body = document.getElementById('productDetailsModalBody');
            if (!body) return;
            const right = body.querySelector('.col-md-7');
            if (!right) return;
            // Badges (si no existen)
            if (!right.querySelector('.product-meta')) {
                const badges = document.createElement('div');
                badges.className = 'd-flex flex-wrap gap-2 mb-3 product-meta';
                badges.innerHTML = [
                    '<span class="badge"><i class="fa-solid fa-leaf me-1"></i>Natural</span>',
                    '<span class="badge"><i class="fa-solid fa-snowflake me-1"></i>Helado</span>',
                    '<span class="badge"><i class="fa-solid fa-star me-1"></i>Top ventas</span>'
                ].join('');
                const p = right.querySelector('p');
                right.insertBefore(badges, p || right.firstChild);
            }
            // Lista de especificaciones (si no existe)
            if (!right.querySelector('.spec-list')) {
                const specs = document.createElement('ul');
                specs.className = 'list-inline text-muted small mb-3 spec-list';
                specs.innerHTML = [
                    '<li class="list-inline-item me-3"><i class="fa-solid fa-ice-cream me-1"></i> 1 bola</li>',
                    '<li class="list-inline-item me-3"><i class="fa-solid fa-weight-scale me-1"></i> 200 g</li>',
                    '<li class="list-inline-item"><i class="fa-solid fa-fire me-1"></i> 250 kcal</li>'
                ].join('');
                const priceBlock = right.querySelector('.product-price')?.parentElement || right.firstChild;
                right.insertBefore(specs, priceBlock);
            }
        } catch (e) {
            console.warn('Enhance product modal failed', e);
        }
    });
});

// Flujo de checkout: pagar en caja (sin pasarela)
