// Mostrar/ocultar botón scroll arriba
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 200) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    // Scroll suave al hacer click
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });