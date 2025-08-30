// Cart state and operations
window.cart = [];
window.cartCount = 0;

window.updateCartCount = function() {
  const el = document.getElementById('cartCount');
  if (el) el.textContent = window.cartCount;
};

window.addToCart = function(name, price, emoji) {
  const itemPrice = window.currency === 'CRC' ? window.convertToColones(price) : price;
  const existing = window.cart.find(i => i.name === name);
  if (existing) {
    existing.quantity += 1;
    existing.totalPrice = existing.quantity * itemPrice;
  } else {
    window.cart.push({ name, price: itemPrice, originalPrice: price, emoji, quantity: 1, totalPrice: itemPrice, id: Date.now() });
  }
  window.cartCount++;
  window.updateCartCount();

  // Button micro interaction
  if (window.gsap) { gsap.to('.cart-btn', { duration: 0.1, scale: 1.1, yoyo: true, repeat: 1 }); }

  // Compact toast with thumbnail if available
  let productImg = null;
  try {
    if (typeof window.productDetailsData !== 'undefined' && window.productDetailsData[name] && window.productDetailsData[name].image) {
      productImg = window.productDetailsData[name].image;
    }
  } catch(e) {}
  const toastHtml = productImg
    ? `<div class="toast-row"><img class="toast-thumb" src="${productImg}" alt="${name}"><div><div class="toast-title">${name}</div><div class="toast-sub">Agregado al carrito</div></div></div>`
    : `<div class="toast-row"><span class="toast-icon"><i class="fa-solid fa-ice-cream"></i></span><div><div class="toast-title">${name}</div><div class="toast-sub">Agregado al carrito</div></div></div>`;

  Swal.fire({
    title: '',
    html: toastHtml,
    timer: 1600,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
    width: 300,
    background: '#fff',
    customClass: { popup: 'cart-toast' }
  });
};

window.removeFromCart = function(index) {
  const item = window.cart[index];
  if (!item) return;
  if (item.quantity > 1) {
    item.quantity -= 1;
    const unit = window.currency === 'CRC' ? window.convertToColones(item.originalPrice) : item.originalPrice;
    item.totalPrice = unit * item.quantity;
    window.cartCount--;
  } else {
    window.cart.splice(index, 1);
    window.cartCount--;
  }
  window.updateCartCount();
  window.showCart();
};

window.addQuantity = function(index) {
  const item = window.cart[index];
  if (!item) return;
  item.quantity += 1;
  const unit = window.currency === 'CRC' ? window.convertToColones(item.originalPrice) : item.originalPrice;
  item.totalPrice = unit * item.quantity;
  window.cartCount++;
  window.updateCartCount();
  window.showCart();
};

window.checkoutAtCounter = function(total) {
  const orderCode = 'HC' + Date.now().toString().slice(-6);
  const lines = window.cart.map(item => {
    const unit = window.currency === 'CRC' ? window.convertToColones(item.originalPrice) : item.originalPrice;
    const sub = unit * item.quantity;
    return `<div class="d-flex justify-content-between mb-1"><span>${item.quantity} × ${item.name}</span><strong>${window.formatCurrency(sub, window.currency)}</strong></div>`;
  }).join('');
  Swal.fire({
    title: 'Pagar en caja',
    html: `
      <div>
        <div class="mb-3 p-3" style="background:linear-gradient(135deg,#f8f9fa,#edf2f7);border-radius:12px;">
          ${lines}
          <hr>
          <div class="d-flex justify-content-between"><span>Total</span><strong style="color:#ff4b8b;">${window.formatCurrency(total, window.currency)}</strong></div>
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
    window.cart = [];
    window.cartCount = 0;
    window.updateCartCount();
  });
};

window.showCart = function() {
  if (!window.cart.length) {
    Swal.fire({
      title: 'Carrito vacío',
      html: '<div style="font-size: 3rem; margin-bottom: 0.5rem;"><i class="fa-solid fa-ice-cream"></i></div>No tienes productos en tu carrito',
      icon: 'info',
      confirmButtonText: 'Continuar comprando',
      confirmButtonColor: '#ff4b8b',
      background: 'white'
    });
    return;
  }
  let cartHTML = '<div class="cart-items" style="max-height: 400px; overflow-y: auto;">';
  let total = 0;
  window.cart.forEach((item, index) => {
    const unit = window.currency === 'CRC' ? window.convertToColones(item.originalPrice) : item.originalPrice;
    const sub = unit * item.quantity;
    total += sub;
    cartHTML += `
      <div class="cart-item d-flex justify-content-between align-items-center mb-3 p-3" style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 15px; border-left: 4px solid #ff4b8b">
        <div class="d-flex align-items-center">
          <span style="font-size: 1.6rem; margin-right: 12px;"><i class="fa-solid fa-ice-cream" style="color:#ff4b8b"></i></span>
          <div>
            <strong style="color: #2d3748;">${item.name}</strong><br>
            <small style="color: #718096;">${window.formatCurrency(unit, window.currency)} c/u</small>
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
          <strong style="color: #ff4b8b; min-width: 60px;">${window.formatCurrency(sub, window.currency)}</strong>
        </div>
      </div>`;
  });
  cartHTML += `</div>
    <hr style="margin: 1.2rem 0;">
    <div class="text-center">
      <h3 style="color: #2d3748; font-family: 'Fredoka', cursive;">Total: <span style="color: #ff4b8b;">${window.formatCurrency(total, window.currency)}</span></h3>
    </div>`;

  Swal.fire({
    title: '🛒 Tu Carrito de Helados',
    html: cartHTML,
    width: '700px',
    showCancelButton: true,
    confirmButtonText: '<i class="fas fa-store"></i> Pagar en caja',
    cancelButtonText: '<i class="fas fa-shopping-bag"></i> Seguir Comprando',
    confirmButtonColor: '#ff4b8b',
    cancelButtonColor: '#718096'
  }).then((result) => {
    if (result.isConfirmed) {
      window.checkoutAtCounter(total);
    }
  });
};

