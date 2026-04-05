// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('appear');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
  observer.observe(el);
});

// Shopping Cart Core Logic
let cart = JSON.parse(localStorage.getItem('trendy_cart')) || [];

function updateCartStorage() {
  localStorage.setItem('trendy_cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const countElements = document.querySelectorAll('.cart-count');
  const totalItems = cart.length;
  countElements.forEach(el => {
    el.textContent = totalItems;
    el.style.display = totalItems > 0 ? 'flex' : 'none';
  });
}

// Add to cart with immediate redirect to cart page
window.addToCart = function(name, price, image) {
  const product = { name, price, image, id: Date.now() };
  cart.push(product);
  updateCartStorage();
  
  // Custom toast before redirect
  showToast(name, price);
  
  // Redirect to cart page after a short delay
  setTimeout(() => {
    window.location.href = 'cart.html';
  }, 1000);
};

window.removeFromCart = function(id) {
  const itemElement = document.querySelector(`.cart-item[data-id="${id}"]`);
  if (itemElement) {
    itemElement.classList.add('removing');
    setTimeout(() => {
      cart = cart.filter(item => item.id !== id);
      updateCartStorage();
      renderCart();
    }, 400); // Match transition time (0.4s)
  } else {
    cart = cart.filter(item => item.id !== id);
    updateCartStorage();
    renderCart();
  }
};

function showToast(productName, price) {
  const toast = document.createElement('div');
  toast.className = 'cart-toast';
  toast.innerHTML = `
    <div class="toast-content">
      <i class="uil uil-check-circle"></i>
      <div class="toast-text">
        <p><strong>Added to Card!</strong></p>
        <p>${productName} - $${price}</p>
      </div>
    </div>
  `;
  
  if (!document.getElementById('toast-style')) {
    const style = document.createElement('style');
    style.id = 'toast-style';
    style.textContent = `
      .cart-toast {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: white;
        color: #333;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        z-index: 2000;
        animation: toastIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        border-left: 4px solid #e91e63;
      }
      @keyframes toastIn { from { transform: translateX(100%) scale(0.8); opacity: 0; } to { transform: translateX(0) scale(1); opacity: 1; } }
      @keyframes toastOut { to { transform: translateX(100%); opacity: 0; } }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.5s ease forwards';
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

// Render cart for the cart.html page
window.renderCart = function() {
  const cartGrid = document.querySelector('.cart-grid');
  if (!cartGrid) return;
  
  if (cart.length === 0) {
    cartGrid.innerHTML = `
      <div class="empty-cart-msg">
        <i class="uil uil-shopping-basket"></i>
        <h3>Your cart is empty</h3>
        <p>Explore our premium collection and find something you love.</p>
        <a href="gallery.html" class="btn btn-primary">Start Shopping</a>
      </div>
    `;
    updateSummary();
    return;
  }
  
  cartGrid.innerHTML = cart.map(item => `
    <div class="cart-item fade-in appear" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}">
      <div class="item-details">
        <h3>${item.name}</h3>
        <p class="item-price">$${item.price.toFixed(2)}</p>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">
        <i class="uil uil-trash-alt"></i>
      </button>
    </div>
  `).join('');
  
  updateSummary();
};

function updateSummary() {
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  
  const subtotalEl = document.getElementById('subtotal');
  const taxEl = document.getElementById('tax');
  const totalEl = document.getElementById('total');
  
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  if (window.location.pathname.includes('cart.html')) {
    renderCart();
  }

  // Mobile Menu Toggle
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileMenu.querySelector('i').classList.toggle('uil-bars');
      mobileMenu.querySelector('i').classList.toggle('uil-multiply');
    });
  }
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});
