/**
 * Chope More Fast Food & Restaurant - Main JavaScript
 * High performance, standards-compliant, responsive and accessible.
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Fast Page Preloader
  // =========================================================================
  const preloader = document.getElementById('pagePreloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        if (preloader.parentElement) {
          preloader.style.display = 'none';
        }
      }, 500);
    }, 350);
  }

  // =========================================================================
  // 2. Mobile Navigation Toggle
  // =========================================================================
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const toggleIconOpen = document.getElementById('toggleIconOpen');
  const toggleIconClose = document.getElementById('toggleIconClose');

  if (mobileNavToggle && mobileDrawer) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileNavToggle.setAttribute('aria-expanded', String(isOpen));
      if (toggleIconOpen && toggleIconClose) {
        toggleIconOpen.style.display = isOpen ? 'none' : 'inline-block';
        toggleIconClose.style.display = isOpen ? 'inline-block' : 'none';
      }
    });

    // Close mobile drawer when clicking a navigation link
    const mobileLinks = mobileDrawer.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        if (toggleIconOpen && toggleIconClose) {
          toggleIconOpen.style.display = 'inline-block';
          toggleIconClose.style.display = 'none';
        }
      });
    });
  }

  // =========================================================================
  // 3. Active Nav Link on Scroll
  // =========================================================================
  const sections = document.querySelectorAll('section[id], footer[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  function updateActiveNavOnScroll() {
    const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);
    if (isAtBottom) {
      desktopNavLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#footer') {
          link.classList.add('active');
        }
      });
      return;
    }

    const scrollPos = window.scrollY + 120;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        desktopNavLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavOnScroll, { passive: true });

  // =========================================================================
  // 4. User Authentication State (LocalStorage Sync)
  // =========================================================================
  const headerAuthWidget = document.getElementById('headerAuthWidget');

  function syncUserState() {
    const sessionDataRaw = localStorage.getItem('laHotActiveSession');
    let session = null;
    if (sessionDataRaw) {
      try {
        session = JSON.parse(sessionDataRaw);
      } catch (e) {
        session = null;
      }
    }

    const currentMobileAuth = document.getElementById('mobileAuthLink');

    if (session && session.loggedIn && session.name) {
      // User is logged in
      if (headerAuthWidget) {
        headerAuthWidget.innerHTML = `
          <div class="user-logged-box">
            <span class="user-greeting">Hi,</span>
            <span class="user-name-badge">${escapeHtml(session.name.split(' ')[0])}</span>
            <button type="button" class="btn-logout" id="btnLogoutUser" title="Sign Out" aria-label="Sign Out">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          </div>
        `;

        const btnLogout = document.getElementById('btnLogoutUser');
        if (btnLogout) {
          btnLogout.addEventListener('click', () => {
            localStorage.removeItem('laHotActiveSession');
            showToast('You have been signed out.', 'info');
            syncUserState();
          });
        }
      }

      if (currentMobileAuth) {
        const freshMobileAuth = currentMobileAuth.cloneNode(true);
        currentMobileAuth.parentNode.replaceChild(freshMobileAuth, currentMobileAuth);
        freshMobileAuth.innerHTML = `
          <i class="fa-solid fa-user-check"></i>
          <span>Signed in as ${escapeHtml(session.name)} (Sign Out)</span>
        `;
        freshMobileAuth.setAttribute('href', '#');
        freshMobileAuth.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem('laHotActiveSession');
          showToast('You have been signed out.', 'info');
          syncUserState();
        });
      }
    } else {
      // User is guest
      if (headerAuthWidget) {
        headerAuthWidget.innerHTML = `
          <a href="accountlogin.html" class="btn-auth-link" id="authBtnLink">
            <i class="fa-solid fa-user" aria-hidden="true"></i>
            <span>Log In</span>
          </a>
        `;
      }

      if (currentMobileAuth) {
        const freshMobileAuth = currentMobileAuth.cloneNode(true);
        currentMobileAuth.parentNode.replaceChild(freshMobileAuth, currentMobileAuth);
        freshMobileAuth.innerHTML = `
          <i class="fa-solid fa-user"></i>
          <span>Sign In / Register</span>
        `;
        freshMobileAuth.setAttribute('href', 'accountlogin.html');
      }
    }
  }

  syncUserState();

  // =========================================================================
  // 5. Menu Category Filter Pills
  // =========================================================================
  const categoryBtns = document.querySelectorAll('.category-btn');
  const dishCards = document.querySelectorAll('.dish-card');

  categoryBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedCategory = btn.getAttribute('data-category');

      dishCards.forEach((card) => {
        const cardCat = card.getAttribute('data-category');
        if (selectedCategory === 'all' || cardCat === selectedCategory) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // =========================================================================
  // 6. Shopping Cart & Online Order System
  // =========================================================================
  let cart = [];

  // Load persisted cart from localStorage
  const savedCart = localStorage.getItem('chopeMoreCart');
  if (savedCart) {
    try {
      const parsed = JSON.parse(savedCart);
      cart = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      cart = [];
    }
  }

  const cartCountBadge = document.getElementById('cartCountBadge');
  const openCartBtn = document.getElementById('openCartBtn');
  const heroOrderBtn = document.getElementById('heroOrderBtn');
  const orderModalBackdrop = document.getElementById('orderModalBackdrop');
  const closeOrderModalBtn = document.getElementById('closeOrderModalBtn');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartTotalPrice = document.getElementById('cartTotalPrice');
  const orderCheckoutForm = document.getElementById('orderCheckoutForm');
  const btnSubmitOrder = document.getElementById('btnSubmitOrder');

  function saveCart() {
    localStorage.setItem('chopeMoreCart', JSON.stringify(cart));
    updateCartUI();
  }

  function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  function getCartTotalAmount() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  function updateCartUI() {
    const totalCount = getCartItemCount();
    if (cartCountBadge) {
      cartCountBadge.textContent = totalCount;
    }

    if (cartTotalPrice) {
      cartTotalPrice.textContent = `₦${getCartTotalAmount().toLocaleString()}`;
    }

    renderCartModalList();
  }

  function renderCartModalList() {
    if (!cartItemsList) return;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="cart-empty-state">
          <i class="fa-solid fa-bowl-food"></i>
          <p>Your order is empty right now.</p>
          <span>Click "+ Add to Order" on any dish in the menu to begin!</span>
        </div>
      `;
      return;
    }

    cartItemsList.innerHTML = '';
    cart.forEach((item) => {
      const itemRow = document.createElement('div');
      itemRow.className = 'cart-item-row';
      itemRow.innerHTML = `
        <div class="cart-item-info">
          <img src="${escapeHtml(item.img)}" alt="${escapeHtml(item.name)}" class="cart-item-thumb">
          <div>
            <div class="cart-item-name">${escapeHtml(item.name)}</div>
            <div class="cart-item-unit-price">₦${(item.price * item.quantity).toLocaleString()} (₦${item.price.toLocaleString()} each)</div>
          </div>
        </div>
        <div class="cart-qty-controls">
          <button type="button" class="btn-qty btn-qty-minus" data-id="${item.id}" aria-label="Decrease quantity">-</button>
          <span class="cart-qty-num">${item.quantity}</span>
          <button type="button" class="btn-qty btn-qty-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
          <button type="button" class="btn-remove-item" data-id="${item.id}" aria-label="Remove item" title="Remove item">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
      cartItemsList.appendChild(itemRow);
    });

    // Wire up quantity modification buttons
    cartItemsList.querySelectorAll('.btn-qty-plus').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const target = cart.find((i) => i.id === id);
        if (target) {
          target.quantity += 1;
          saveCart();
        }
      });
    });

    cartItemsList.querySelectorAll('.btn-qty-minus').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const target = cart.find((i) => i.id === id);
        if (target) {
          target.quantity -= 1;
          if (target.quantity <= 0) {
            cart = cart.filter((i) => i.id !== id);
          }
          saveCart();
        }
      });
    });

    cartItemsList.querySelectorAll('.btn-remove-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        cart = cart.filter((i) => i.id !== id);
        saveCart();
      });
    });
  }

  // Handle "+ Add to Order" clicks on menu cards
  const addCartButtons = document.querySelectorAll('.btn-add-cart');
  addCartButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.dish-card');
      if (!card) return;

      const id = card.getAttribute('data-id');
      const name = card.getAttribute('data-name');
      const price = parseInt(card.getAttribute('data-price'), 10) || 0;
      const img = card.getAttribute('data-img') || 'images/egusi 2.png';

      const existing = cart.find((item) => item.id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ id, name, price, img, quantity: 1 });
      }

      saveCart();
      showToast(`Added ${name} to your order!`, 'success', 2500);

      // Button micro-interaction
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
      setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-plus"></i> Add to Order';
      }, 1000);
    });
  });

  // Modal Open & Close Logic
  function openOrderModal() {
    if (!orderModalBackdrop) return;
    renderCartModalList();
    orderModalBackdrop.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';

    // Autofill user details if logged in
    const sessionDataRaw = localStorage.getItem('laHotActiveSession');
    if (sessionDataRaw) {
      try {
        const session = JSON.parse(sessionDataRaw);
        const nameInput = document.getElementById('orderCustomerName');
        if (nameInput && !nameInput.value && session.name) {
          nameInput.value = session.name;
        }
      } catch (e) {
        // ignore
      }
    }
  }

  function closeOrderModal() {
    if (!orderModalBackdrop) return;
    orderModalBackdrop.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  if (openCartBtn) {
    openCartBtn.addEventListener('click', openOrderModal);
  }
  if (heroOrderBtn) {
    heroOrderBtn.addEventListener('click', openOrderModal);
  }
  if (closeOrderModalBtn) {
    closeOrderModalBtn.addEventListener('click', closeOrderModal);
  }

  if (orderModalBackdrop) {
    orderModalBackdrop.addEventListener('click', (e) => {
      if (e.target === orderModalBackdrop) {
        closeOrderModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && orderModalBackdrop && !orderModalBackdrop.hasAttribute('hidden')) {
      closeOrderModal();
    }
  });

  // Handle Order Checkout Submission
  if (orderCheckoutForm) {
    orderCheckoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (btnSubmitOrder && btnSubmitOrder.classList.contains('loading')) return;

      if (cart.length === 0) {
        showToast('Your order is empty. Please select some dishes first!', 'error');
        return;
      }

      const name = document.getElementById('orderCustomerName').value.trim();
      const phone = document.getElementById('orderCustomerPhone').value.trim();
      const address = document.getElementById('orderCustomerAddress').value.trim();

      if (!name || !phone || !address) {
        showToast('Please fill in your name, phone, and delivery address.', 'error');
        return;
      }

      btnSubmitOrder.classList.add('loading');

      setTimeout(() => {
        btnSubmitOrder.classList.remove('loading');
        const orderSummary = `Thank you, ${name}! Your order of ₦${getCartTotalAmount().toLocaleString()} is confirmed and will be delivered to ${address}.`;

        // Clear cart
        cart = [];
        saveCart();
        orderCheckoutForm.reset();
        closeOrderModal();

        showToast(orderSummary, 'success', 6000);
      }, 1000);
    });
  }

  // Handle Direct WhatsApp Order Dispatch to 08155800735
  const btnWhatsAppOrder = document.getElementById('btnWhatsAppOrder');
  if (btnWhatsAppOrder) {
    btnWhatsAppOrder.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Your order is empty. Please select some dishes first!', 'error');
        return;
      }

      const name = document.getElementById('orderCustomerName').value.trim() || 'Valued Customer';
      const phone = document.getElementById('orderCustomerPhone').value.trim() || 'Not provided';
      const address = document.getElementById('orderCustomerAddress').value.trim() || 'Pickup / Direct order';
      const paymentSelect = document.getElementById('orderPaymentMethod');
      const payment = paymentSelect ? paymentSelect.options[paymentSelect.selectedIndex].text : 'Pay on Delivery';

      let itemsText = cart.map(item => `• ${item.name} x ${item.quantity} = ₦${(item.price * item.quantity).toLocaleString()}`).join('\n');
      const totalText = `₦${getCartTotalAmount().toLocaleString()}`;

      const message = `*NEW ORDER - CHOPE MORE FAST FOOD*\n` +
        `----------------------------------------\n` +
        `👤 *Customer:* ${name}\n` +
        `📞 *Phone:* ${phone}\n` +
        `📍 *Delivery Address:* ${address}\n` +
        `💳 *Payment Method:* ${payment}\n\n` +
        `🍲 *Items Ordered:*\n${itemsText}\n` +
        `----------------------------------------\n` +
        `💰 *TOTAL AMOUNT:* ${totalText}\n\n` +
        `_Order sent via Chope More Website_`;

      const whatsappUrl = `https://wa.me/2348155800735?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      showToast('Opening WhatsApp to dispatch your order to 08155800735...', 'info', 4000);
    });
  }

  // Initial Cart UI sync
  updateCartUI();

  // =========================================================================
  // 7. Table Reservation Form Handler
  // =========================================================================
  const tableReservationForm = document.getElementById('tableReservationForm');
  const reserveSubmitBtn = document.getElementById('reserveSubmitBtn');

  function formatLocalDateTime(date) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function getTomorrowEvening() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(19, 0, 0, 0);
    return tomorrow;
  }

  if (tableReservationForm) {
    // Set default datetime to tomorrow at 7:00 PM local time
    const dateInput = document.getElementById('reserveDateTime');
    if (dateInput) {
      dateInput.min = formatLocalDateTime(new Date());
      dateInput.value = formatLocalDateTime(getTomorrowEvening());
    }

    tableReservationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (reserveSubmitBtn && reserveSubmitBtn.classList.contains('loading')) return;

      const name = document.getElementById('reserveName').value.trim();
      const phone = document.getElementById('reservePhone').value.trim();
      const email = document.getElementById('reserveEmail').value.trim();
      const guestsSelect = document.getElementById('reserveGuests');
      const guests = guestsSelect ? guestsSelect.options[guestsSelect.selectedIndex].text : '2 Persons';
      const datetime = document.getElementById('reserveDateTime').value;

      if (!name || !phone || !email || !datetime) {
        showToast('Please fill in all required reservation fields.', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address for confirmation.', 'error');
        return;
      }

      const selectedDate = new Date(datetime);
      if (selectedDate <= new Date()) {
        showToast('Please select a date and time in the future.', 'error');
        return;
      }

      const formattedDate = selectedDate.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });

      reserveSubmitBtn.classList.add('loading');

      setTimeout(() => {
        reserveSubmitBtn.classList.remove('loading');
        showToast(`Table reserved for ${name} (${guests}) on ${formattedDate}! Confirmation sent to ${email}.`, 'success', 6000);
        tableReservationForm.reset();
        if (dateInput) {
          dateInput.min = formatLocalDateTime(new Date());
          dateInput.value = formatLocalDateTime(getTomorrowEvening());
        }
      }, 900);
    });
  }

  // =========================================================================
  // 8. Toast Notification Utility
  // =========================================================================
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'info', duration = 4000) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'error') iconClass = 'fa-triangle-exclamation';

    toast.innerHTML = `
      <i class="fa-solid ${iconClass}" aria-hidden="true"></i>
      <span class="toast-message">${escapeHtml(message)}</span>
      <button type="button" class="toast-close" aria-label="Dismiss message">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));

    toastContainer.appendChild(toast);

    const autoDismiss = setTimeout(() => {
      removeToast(toast);
    }, duration);

    function removeToast(el) {
      clearTimeout(autoDismiss);
      el.style.opacity = '0';
      el.style.transform = 'translateX(40px)';
      setTimeout(() => {
        if (el.parentElement) el.parentElement.removeChild(el);
      }, 300);
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
});
