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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                    confirmButtonColor: '#667eea',
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
                    <div class="cart-item d-flex justify-content-between align-items-center mb-3 p-3" style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 15px; border-left: 4px solid #667eea;">
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
                            <strong style="color: #667eea; min-width: 60px;">${formatCurrency(itemTotal, currency)}</strong>
                        </div>
                    </div>
                `;
            });

            cartHTML += `</div>
                <hr style="margin: 2rem 0;">
                <div class="text-center">
                    <h3 style="color: #2d3748; font-family: 'Fredoka', cursive;">Total: <span style="color: #667eea;">${formatCurrency(total, currency)}</span></h3>
                </div>`;

            Swal.fire({
                title: '🛒 Tu Carrito de Helados',
                html: cartHTML,
                width: '700px',
                showCancelButton: true,
                confirmButtonText: '<i class="fas fa-credit-card"></i> Proceder al Pago',
                cancelButtonText: '<i class="fas fa-shopping-bag"></i> Seguir Comprando',
                confirmButtonColor: '#667eea',
                cancelButtonColor: '#718096',
                customClass: {
                    popup: 'animated fadeInUp'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    // Show payment modal
                    document.getElementById('totalAmount').textContent = formatCurrency(total, currency);
                    document.getElementById('paymentModal').classList.add('active');
                }
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
                        <p style="color: #718096; margin-bottom: 1rem;">Tu pedido por <strong style="color: #667eea;">${formatCurrency(total, currency)}</strong> ha sido confirmado y está siendo preparado con mucho amor.</p>
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 10px; margin: 1rem 0;">
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
                confirmButtonColor: '#4ecdc4',
                customClass: {
                    popup: 'animated bounceIn'
                }
            }).then(() => {
                cart = [];
                cartCount = 0;
                updateCartCount();
                closePayment();
            });
        }

        // Payment form handling
        document.getElementById('paymentForm').addEventListener('submit', function(e) {
            e.preventDefault();
            // Calculate total
            let total = 0;
            cart.forEach(item => {
                const itemPrice = currency === 'CRC' ? convertToColones(item.originalPrice) : item.originalPrice;
                total += itemPrice * item.quantity;
            });
            // Simulate payment processing
            Swal.fire({
                title: 'Procesando pago...',
                html: '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-3">Por favor espera</p>',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            });
            // Simulate API call
            setTimeout(() => {
                Swal.close();
                closePayment(); // Cierra el modal de pago automáticamente
                processOrder(total);
            }, 2000);
        });

        function closePayment() {
            document.getElementById('paymentModal').classList.remove('active');
        }

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