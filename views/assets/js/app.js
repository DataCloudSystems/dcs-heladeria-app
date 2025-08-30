

                // Función para mostrar el modal de detalles
                " alt="${data.name}" style="max-width:100%; max-height:300px; object-fit:contain; border-radius:20px;">
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
// Aggregator deprecated: logic moved to config.js, products.js, cart.js, ui.js
