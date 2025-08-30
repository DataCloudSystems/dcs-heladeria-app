// Product catalog data and modal renderer
window.productDetailsData = {
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
    emoji: '🍨'
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

// Name normalization to prevent mismatches by accents/case
function normalizeKey(s){
  try { return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase(); } catch(e) { return (s||'').toUpperCase(); }
}
const productDetailsByKey = {};
Object.keys(window.productDetailsData).forEach(k => { productDetailsByKey[normalizeKey(k)] = window.productDetailsData[k]; });

window.showProductDetails = function(productName) {
  const data = window.productDetailsData[productName] || productDetailsByKey[normalizeKey(productName)];
  if (!data) return;
  document.getElementById('productDetailsModalLabel').textContent = data.name;
  document.getElementById('productDetailsModalBody').innerHTML = `
    <div class="row g-4 align-items-start">
      <div class="col-md-5 text-center">
        <img src="${data.image}" alt="${data.name}" style="max-width:100%; max-height:300px; object-fit:contain; border-radius:20px;">
      </div>
      <div class="col-md-7">
        <div class="d-flex align-items-center mb-2">
          <span class="me-2" style="font-size:1.35rem; color:#ff4b8b;"><i class="fa-solid fa-ice-cream"></i></span>
          <span>
            ${'<i class="fas fa-star" style="color:#ffd700"></i>'.repeat(Math.floor(data.rating))}
            ${data.rating % 1 ? '<i class="fas fa-star-half-alt" style="color:#ffd700"></i>' : ''}
            <span class="ms-2 text-muted">(${data.rating}) ${data.reviews} reseñas</span>
          </span>
        </div>
        <p class="mb-3">${data.description}</p>
        <div class="mb-3">
          <span class="product-price" data-usd="${data.price}">${window.formatCurrency(window.currency === 'CRC' ? window.convertToColones(data.price) : data.price, window.currency)}</span>
        </div>
        <button class="btn btn-add-cart w-100" onclick="addToCart('${data.name}', ${data.price}, '${data.emoji}')">
          <i class="fas fa-plus"></i> Agregar al carrito
        </button>
      </div>
    </div>`;
  const modal = new bootstrap.Modal(document.getElementById('productDetailsModal'));
  modal.show();
};
