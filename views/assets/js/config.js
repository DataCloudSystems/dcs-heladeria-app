// Global configuration and currency helpers
window.currency = 'CRC'; // default
window.exchangeRate = 550; // 1 USD = 550 CRC

window.convertToColones = function(usd) {
  return usd * window.exchangeRate;
};

window.formatCurrency = function(amount, curr) {
  if (curr === 'CRC') {
    return `₡${Math.round(amount).toLocaleString()}`;
  }
  return `$${Number(amount).toFixed(2)}`;
};

window.updatePrices = function() {
  const prices = document.querySelectorAll('.product-price');
  prices.forEach(el => {
    const usd = parseFloat(el.getAttribute('data-usd'));
    const val = window.currency === 'CRC' ? window.convertToColones(usd) : usd;
    el.textContent = window.formatCurrency(val, window.currency);
  });
  // If cart dialog is open, re-render using existing function
  if (document.querySelector('.swal2-container') && typeof window.showCart === 'function') {
    window.showCart();
  }
};

document.addEventListener('DOMContentLoaded', function(){
  // Currency toggle handler
  const toggle = document.getElementById('currencyToggle');
  if (toggle) {
    toggle.addEventListener('change', function(){
      window.currency = this.checked ? 'CRC' : 'USD';
      window.updatePrices();
    });
    // Initialize prices on load
    window.updatePrices();
  }
});

