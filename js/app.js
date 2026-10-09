/* ===================================================================
   VELOCITY LUXURY CAR RENTAL - INTERACTIVE LOGIC & STATE ENGINE
   =================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------------------------------------
  // STATE MANAGEMENT
  // -------------------------------------------------------------
  let currentCurrency = localStorage.getItem("velo_currency") || "USD";
  let wishlist = new Set(JSON.parse(localStorage.getItem("velo_wishlist") || "[]"));
  let bookings = JSON.parse(localStorage.getItem("velo_bookings") || "[]");
  let compareList = [];

  let filters = {
    keyword: "",
    category: "all",
    transmission: "all",
    fuel: "all",
    maxPrice: 2000,
    sortBy: "featured"
  };

  let activeBooking = {
    car: null,
    pickupLoc: "lax",
    dropoffLoc: "lax",
    startDate: "",
    endDate: "",
    planId: "premium",
    addons: [],
    driver: {
      name: "",
      email: "",
      phone: "",
      age: "25+"
    },
    paymentMethod: "card",
    promoCode: "",
    discountPercent: 0,
    currentStep: 1
  };

  // -------------------------------------------------------------
  // DOM REFERENCES
  // -------------------------------------------------------------
  const navbar = document.getElementById("main-navbar");
  const currencySelect = document.getElementById("currency-select");
  const carsGridContainer = document.getElementById("cars-grid-container");
  const visibleCarsCount = document.getElementById("visible-cars-count");
  const wishlistBadgeCount = document.getElementById("wishlist-badge-count");
  const bookingsBadgeCount = document.getElementById("bookings-badge-count");
  const toastContainer = document.getElementById("toast-container");

  // Filter elements
  const filterKeywordInput = document.getElementById("filter-keyword-input");
  const filterSortSelect = document.getElementById("filter-sort-select");
  const categoryPillsContainer = document.getElementById("category-pills-list");
  const filterTransmissionSelect = document.getElementById("filter-transmission-select");
  const filterFuelSelect = document.getElementById("filter-fuel-select");
  const filterPriceRange = document.getElementById("filter-price-range");
  const priceRangeVal = document.getElementById("price-range-val");
  const btnResetFilters = document.getElementById("btn-reset-filters");

  // Comparison Dock elements
  const comparisonDock = document.getElementById("comparison-dock");
  const compareSlotsContainer = document.getElementById("compare-slots-container");
  const btnLaunchComparison = document.getElementById("btn-launch-comparison");
  const btnClearComparison = document.getElementById("btn-clear-comparison");
  const compareModal = document.getElementById("compare-modal");
  const compareModalContent = document.getElementById("compare-modal-content");
  const btnCloseCompareModal = document.getElementById("btn-close-compare-modal");

  // Vehicle Detail Modal elements
  const carDetailModal = document.getElementById("car-detail-modal");
  const detailModalContent = document.getElementById("detail-modal-content");
  const btnCloseDetailModal = document.getElementById("btn-close-detail-modal");

  // Booking Wizard elements
  const bookingModal = document.getElementById("booking-modal");
  const btnCloseBookingModal = document.getElementById("btn-close-booking-modal");
  const bookingCarSummaryHeader = document.getElementById("booking-selected-car-header");
  const bookingPickupLoc = document.getElementById("booking-pickup-loc");
  const bookingDropoffLoc = document.getElementById("booking-dropoff-loc");
  const bookingPickupDate = document.getElementById("booking-pickup-date");
  const bookingReturnDate = document.getElementById("booking-return-date");
  const protectionPlansContainer = document.getElementById("protection-plans-container");
  const addonsListContainer = document.getElementById("addons-list-container");
  const pricingBreakdownBox = document.getElementById("pricing-breakdown-box");
  const promoCodeInput = document.getElementById("promo-code-input");
  const btnApplyPromo = document.getElementById("btn-apply-promo");
  const promoStatusMsg = document.getElementById("promo-status-msg");
  const bookingFinalForm = document.getElementById("booking-final-form");
  const confirmationVoucherContent = document.getElementById("confirmation-voucher-content");
  const btnPrintVoucher = document.getElementById("btn-print-voucher");
  const btnFinishBooking = document.getElementById("btn-finish-booking");

  // Wizard Navigation Buttons
  const btnWizardStep1Next = document.getElementById("btn-wizard-step1-next");
  const btnWizardStep2Prev = document.getElementById("btn-wizard-step2-prev");
  const btnWizardStep2Next = document.getElementById("btn-wizard-step2-next");
  const btnWizardStep3Prev = document.getElementById("btn-wizard-step3-prev");
  const btnWizardStep3Next = document.getElementById("btn-wizard-step3-next");
  const btnWizardStep4Prev = document.getElementById("btn-wizard-step4-prev");

  // Drawers
  const drawerOverlay = document.getElementById("drawer-overlay");
  const bookingsDrawer = document.getElementById("bookings-drawer");
  const btnOpenBookings = document.getElementById("btn-open-bookings");
  const btnCloseBookingsDrawer = document.getElementById("btn-close-bookings-drawer");
  const bookingsDrawerList = document.getElementById("bookings-drawer-list");

  const wishlistDrawer = document.getElementById("wishlist-drawer");
  const btnOpenWishlist = document.getElementById("btn-open-wishlist");
  const btnCloseWishlistDrawer = document.getElementById("btn-close-wishlist-drawer");
  const wishlistDrawerList = document.getElementById("wishlist-drawer-list");

  // Quick Search Form
  const quickSearchForm = document.getElementById("quick-search-form");
  const searchPickupLoc = document.getElementById("search-pickup-loc");
  const searchStartDate = document.getElementById("search-start-date");
  const searchEndDate = document.getElementById("search-end-date");
  const searchCategorySelect = document.getElementById("search-category-select");

  // -------------------------------------------------------------
  // HELPER FUNCTIONS
  // -------------------------------------------------------------
  function formatPrice(usdAmount) {
    const curr = CURRENCIES[currentCurrency] || CURRENCIES.USD;
    const converted = Math.round(usdAmount * curr.rate);
    return `${curr.symbol}${converted.toLocaleString()}`;
  }

  function getDaysBetween(startStr, endStr) {
    if (!startStr || !endStr) return 1;
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffTime = end.getTime() - start.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  }

  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    if (type === "info") {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      <div style="color: ${type === 'success' ? 'var(--accent-green)' : 'var(--accent-electric)'}; display: flex; align-items: center;">${iconSvg}</div>
      <div style="font-size: 0.9rem; font-weight: 500;">${message}</div>
    `;

    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(50px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function updateCounters() {
    wishlistBadgeCount.textContent = wishlist.size;
    bookingsBadgeCount.textContent = bookings.length;
  }

  // Set default dates (tomorrow to tomorrow + 3 days)
  function initDefaultDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const threeDaysLater = new Date(tomorrow);
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    const fmtTom = tomorrow.toISOString().split("T")[0];
    const fmtEnd = threeDaysLater.toISOString().split("T")[0];

    searchStartDate.value = fmtTom;
    searchStartDate.min = fmtTom;
    searchEndDate.value = fmtEnd;
    searchEndDate.min = fmtTom;

    bookingPickupDate.value = fmtTom;
    bookingPickupDate.min = fmtTom;
    bookingReturnDate.value = fmtEnd;
    bookingReturnDate.min = fmtTom;

    activeBooking.startDate = fmtTom;
    activeBooking.endDate = fmtEnd;
  }

  // -------------------------------------------------------------
  // POPULATE LOCATION DROPDOWNS
  // -------------------------------------------------------------
  function populateLocations() {
    const optionsHtml = LOCATIONS.map(loc => `
      <option value="${loc.id}">${loc.name} (${loc.city})</option>
    `).join("");

    bookingPickupLoc.innerHTML = optionsHtml;
    bookingDropoffLoc.innerHTML = optionsHtml;
  }

  // -------------------------------------------------------------
  // FLEET RENDERING & LIVE FILTERING
  // -------------------------------------------------------------
  function renderFleet() {
    let filtered = CARS_DATA.filter(car => {
      // Keyword match
      if (filters.keyword.trim() !== "") {
        const q = filters.keyword.toLowerCase();
        const matchesName = car.name.toLowerCase().includes(q);
        const matchesBrand = car.brand.toLowerCase().includes(q);
        const matchesTag = car.tagline.toLowerCase().includes(q);
        const matchesFuel = car.specs.fuel.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesTag && !matchesFuel) return false;
      }

      // Category filter
      if (filters.category !== "all" && car.category !== filters.category) {
        return false;
      }

      // Transmission filter
      if (filters.transmission === "pdk" && !car.specs.transmission.toLowerCase().includes("pdk") && !car.specs.transmission.toLowerCase().includes("dual")) {
        return false;
      }
      if (filters.transmission === "direct" && !car.specs.transmission.toLowerCase().includes("direct")) {
        return false;
      }

      // Fuel filter
      if (filters.fuel === "gasoline" && !car.specs.fuel.toLowerCase().includes("gasoline")) {
        return false;
      }
      if (filters.fuel === "electric" && !car.specs.fuel.toLowerCase().includes("electric")) {
        return false;
      }

      // Price filter
      if (car.pricePerDay > filters.maxPrice) {
        return false;
      }

      return true;
    });

    // Sorting
    if (filters.sortBy === "price-asc") {
      filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (filters.sortBy === "price-desc") {
      filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else if (filters.sortBy === "power-desc") {
      filtered.sort((a, b) => {
        const hpA = parseInt(a.specs.power.replace(/\D/g, "")) || 0;
        const hpB = parseInt(b.specs.power.replace(/\D/g, "")) || 0;
        return hpB - hpA;
      });
    } else if (filters.sortBy === "rating-desc") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    visibleCarsCount.textContent = filtered.length;

    if (filtered.length === 0) {
      carsGridContainer.innerHTML = `
        <div class="empty-fleet-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <h3>No Vehicles Match Your Criteria</h3>
          <p>Try adjusting your price threshold, clearing keyword filters, or choosing "All Fleet" category.</p>
          <button class="btn-primary" id="btn-clear-empty-filters">Reset All Filters</button>
        </div>
      `;
      document.getElementById("btn-clear-empty-filters")?.addEventListener("click", resetAllFilters);
      return;
    }

    carsGridContainer.innerHTML = filtered.map(car => {
      const isFav = wishlist.has(car.id);
      const isComparing = compareList.includes(car.id);

      return `
        <article class="car-card" data-car-id="${car.id}">
          <div class="car-card-image-box">
            <span class="car-badge-pill">${car.badge}</span>
            <button class="car-fav-btn ${isFav ? 'active' : ''}" data-fav-id="${car.id}" title="${isFav ? 'Remove from Wishlist' : 'Add to Wishlist'}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <img src="${car.image}" alt="${car.name}" loading="lazy">
          </div>

          <div class="car-card-body">
            <div class="car-header-meta">
              <div class="car-title-block">
                <div class="car-category-sub">${car.brand} • ${car.category}</div>
                <h3>${car.name}</h3>
              </div>
              <div class="car-rating-tag">
                ★ <span>${car.rating}</span>
              </div>
            </div>

            <p class="car-card-desc">${car.tagline}</p>

            <div class="car-specs-grid">
              <div class="spec-item">
                <span class="spec-icon">⚡</span>
                <span class="spec-val">${car.specs.power}</span>
                <span class="spec-lbl">Output</span>
              </div>
              <div class="spec-item">
                <span class="spec-icon">⏱</span>
                <span class="spec-val">${car.specs.acceleration}</span>
                <span class="spec-lbl">0-60 mph</span>
              </div>
              <div class="spec-item">
                <span class="spec-icon">🏎</span>
                <span class="spec-val">${car.specs.topSpeed}</span>
                <span class="spec-lbl">Top Speed</span>
              </div>
              <div class="spec-item">
                <span class="spec-icon">👥</span>
                <span class="spec-val">${car.specs.seats} Seats</span>
                <span class="spec-lbl">Cap</span>
              </div>
            </div>

            <div class="car-card-footer">
              <div class="car-price-block">
                <div class="price-tag">${formatPrice(car.pricePerDay)}</div>
                <div class="price-sub">per day • zero hidden fees</div>
              </div>

              <div class="car-actions-block">
                <button class="btn-icon-details btn-quick-details" data-detail-id="${car.id}" title="Full Specs & Photos">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </button>
                <button class="btn-icon-details btn-add-compare ${isComparing ? 'active' : ''}" data-compare-id="${car.id}" title="${isComparing ? 'Remove comparison' : 'Compare with another car'}">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                </button>
                <button class="btn-primary btn-rent-card btn-start-booking" data-book-id="${car.id}">
                  <span>Rent Now</span>
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join("");

    attachCarCardListeners();
  }

  function attachCarCardListeners() {
    // Favorite buttons
    document.querySelectorAll(".car-fav-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const carId = btn.getAttribute("data-fav-id");
        toggleWishlist(carId);
      });
    });

    // Details button
    document.querySelectorAll(".btn-quick-details").forEach(btn => {
      btn.addEventListener("click", () => {
        const carId = btn.getAttribute("data-detail-id");
        openCarDetailModal(carId);
      });
    });

    // Compare button
    document.querySelectorAll(".btn-add-compare").forEach(btn => {
      btn.addEventListener("click", () => {
        const carId = btn.getAttribute("data-compare-id");
        toggleCompare(carId);
      });
    });

    // Rent Now button
    document.querySelectorAll(".btn-start-booking").forEach(btn => {
      btn.addEventListener("click", () => {
        const carId = btn.getAttribute("data-book-id");
        openBookingModal(carId);
      });
    });
  }

  // -------------------------------------------------------------
  // WISHLIST MANAGEMENT
  // -------------------------------------------------------------
  function toggleWishlist(carId) {
    const car = CARS_DATA.find(c => c.id === carId);
    if (!car) return;

    if (wishlist.has(carId)) {
      wishlist.delete(carId);
      showToast(`${car.name} removed from your Wishlist.`, "info");
    } else {
      wishlist.add(carId);
      showToast(`${car.name} saved to your VIP Wishlist!`, "success");
    }

    localStorage.setItem("velo_wishlist", JSON.stringify([...wishlist]));
    updateCounters();
    renderFleet();
    renderWishlistDrawer();
  }

  function renderWishlistDrawer() {
    if (wishlist.size === 0) {
      wishlistDrawerList.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-dim);">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 0.75rem;">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <p>Your wishlist is currently empty. Click the heart icon on any vehicle to save it for later.</p>
        </div>
      `;
      return;
    }

    const savedCars = CARS_DATA.filter(c => wishlist.has(c.id));
    wishlistDrawerList.innerHTML = savedCars.map(car => `
      <div class="booking-item-card">
        <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 0.75rem;">
          <img src="${car.image}" alt="${car.name}" style="width: 75px; height: 50px; object-fit: cover; border-radius: 6px;">
          <div style="flex: 1;">
            <h4 style="font-size: 1rem; font-weight: 700;">${car.name}</h4>
            <div style="color: var(--accent-gold); font-size: 0.88rem; font-weight: 800;">${formatPrice(car.pricePerDay)} / day</div>
          </div>
          <button class="modal-close-btn" data-remove-wishlist="${car.id}" style="position: static; width: 28px; height: 28px;" title="Remove">✕</button>
        </div>
        <button class="btn-primary" data-book-wishlist="${car.id}" style="width: 100%; padding: 0.55rem; font-size: 0.85rem;">
          Reserve This Car
        </button>
      </div>
    `).join("");

    wishlistDrawerList.querySelectorAll("[data-remove-wishlist]").forEach(btn => {
      btn.addEventListener("click", () => {
        toggleWishlist(btn.getAttribute("data-remove-wishlist"));
      });
    });

    wishlistDrawerList.querySelectorAll("[data-book-wishlist]").forEach(btn => {
      btn.addEventListener("click", () => {
        closeDrawers();
        openBookingModal(btn.getAttribute("data-book-wishlist"));
      });
    });
  }

  // -------------------------------------------------------------
  // CAR COMPARISON
  // -------------------------------------------------------------
  function toggleCompare(carId) {
    const index = compareList.indexOf(carId);
    if (index > -1) {
      compareList.splice(index, 1);
    } else {
      if (compareList.length >= 2) {
        showToast("You can compare up to 2 vehicles at a time. Clear one first.", "info");
        return;
      }
      compareList.push(carId);
      showToast("Added to comparison dock.", "success");
    }
    updateComparisonDock();
    renderFleet();
  }

  function updateComparisonDock() {
    if (compareList.length === 0) {
      comparisonDock.classList.remove("visible");
      return;
    }

    comparisonDock.classList.add("visible");
    const cars = compareList.map(id => CARS_DATA.find(c => c.id === id)).filter(Boolean);

    compareSlotsContainer.innerHTML = cars.map(car => `
      <div class="compare-thumbnail-slot" title="${car.name}">
        <img src="${car.image}" alt="${car.name}">
      </div>
    `).join("");
  }

  function openComparisonModal() {
    if (compareList.length < 2) {
      showToast("Please select 2 vehicles to compare side-by-side.", "info");
      return;
    }

    const [carA, carB] = compareList.map(id => CARS_DATA.find(c => c.id === id));
    if (!carA || !carB) return;

    compareModalContent.innerHTML = `
      <h2 style="font-family: var(--font-heading); font-size: 1.8rem; margin-bottom: 0.5rem; text-align: center;">Head-to-Head Comparison</h2>
      <p style="text-align: center; color: var(--text-muted); font-size: 0.95rem; margin-bottom: 2rem;">Benchmarking raw specs, power output, and rental rates.</p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <!-- Car A -->
        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass-light); border-radius: var(--radius-md); padding: 1.5rem; text-align: center;">
          <img src="${carA.image}" alt="${carA.name}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">
          <h3 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 0.25rem;">${carA.name}</h3>
          <div style="font-size: 1.4rem; font-weight: 800; color: var(--accent-gold); margin-bottom: 1.5rem;">${formatPrice(carA.pricePerDay)} <span style="font-size: 0.8rem; color: var(--text-dim);">/ day</span></div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem; text-align: left; font-size: 0.9rem;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.4rem;">
              <span style="color: var(--text-muted);">Horsepower:</span>
              <strong>${carA.specs.power}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.4rem;">
              <span style="color: var(--text-muted);">0 - 60 mph:</span>
              <strong style="color: var(--accent-electric);">${carA.specs.acceleration}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.4rem;">
              <span style="color: var(--text-muted);">Top Speed:</span>
              <strong>${carA.specs.topSpeed}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.4rem;">
              <span style="color: var(--text-muted);">Powertrain:</span>
              <strong>${carA.specs.fuel}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.4rem;">
              <span style="color: var(--text-muted);">Seating & Luggage:</span>
              <strong>${carA.specs.seats} Seats (${carA.specs.luggage})</strong>
            </div>
          </div>

          <button class="btn-primary" onclick="openBookingModal('${carA.id}')" style="width: 100%; margin-top: 1.5rem;">Rent ${carA.name}</button>
        </div>

        <!-- Car B -->
        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass-light); border-radius: var(--radius-md); padding: 1.5rem; text-align: center;">
          <img src="${carB.image}" alt="${carB.name}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">
          <h3 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 0.25rem;">${carB.name}</h3>
          <div style="font-size: 1.4rem; font-weight: 800; color: var(--accent-gold); margin-bottom: 1.5rem;">${formatPrice(carB.pricePerDay)} <span style="font-size: 0.8rem; color: var(--text-dim);">/ day</span></div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem; text-align: left; font-size: 0.9rem;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.4rem;">
              <span style="color: var(--text-muted);">Horsepower:</span>
              <strong>${carB.specs.power}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.4rem;">
              <span style="color: var(--text-muted);">0 - 60 mph:</span>
              <strong style="color: var(--accent-electric);">${carB.specs.acceleration}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.4rem;">
              <span style="color: var(--text-muted);">Top Speed:</span>
              <strong>${carB.specs.topSpeed}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.4rem;">
              <span style="color: var(--text-muted);">Powertrain:</span>
              <strong>${carB.specs.fuel}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.4rem;">
              <span style="color: var(--text-muted);">Seating & Luggage:</span>
              <strong>${carB.specs.seats} Seats (${carB.specs.luggage})</strong>
            </div>
          </div>

          <button class="btn-primary" onclick="openBookingModal('${carB.id}')" style="width: 100%; margin-top: 1.5rem;">Rent ${carB.name}</button>
        </div>
      </div>
    `;

    compareModal.classList.add("active");
  }

  // -------------------------------------------------------------
  // CAR DETAILS MODAL
  // -------------------------------------------------------------
  function openCarDetailModal(carId) {
    const car = CARS_DATA.find(c => c.id === carId);
    if (!car) return;

    detailModalContent.innerHTML = `
      <div>
        <div class="detail-gallery-main">
          <img src="${car.image}" alt="${car.name}" id="detail-main-img">
        </div>
        <div style="display: flex; gap: 0.5rem;">
          ${car.gallery.map(imgUrl => `
            <img src="${imgUrl}" alt="${car.name}" style="width: 80px; height: 50px; object-fit: cover; border-radius: 6px; cursor: pointer; border: 1px solid var(--border-glass);" onclick="document.getElementById('detail-main-img').src = '${imgUrl}'">
          `).join("")}
        </div>
      </div>

      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
          <div>
            <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--accent-gold); font-weight: 700; letter-spacing: 0.08em;">${car.brand} • ${car.category}</span>
            <h2 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; line-height: 1.2;">${car.name}</h2>
          </div>
          <div style="background: rgba(255,255,255,0.06); padding: 0.35rem 0.75rem; border-radius: 8px; font-weight: 700; color: #FBBF24;">
            ★ ${car.rating} (${car.reviewsCount} reviews)
          </div>
        </div>

        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.25rem;">${car.tagline}</p>

        <!-- Dynamic Specs Grid -->
        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.25rem;">
          <h4 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent-gold); margin-bottom: 0.75rem;">Engine & Chassis Highlights</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; font-size: 0.88rem;">
            <div><span style="color: var(--text-dim);">Horsepower:</span> <strong>${car.specs.power}</strong></div>
            <div><span style="color: var(--text-dim);">0-60 Time:</span> <strong style="color: var(--accent-electric);">${car.specs.acceleration}</strong></div>
            <div><span style="color: var(--text-dim);">Top Speed:</span> <strong>${car.specs.topSpeed}</strong></div>
            <div><span style="color: var(--text-dim);">Transmission:</span> <strong>${car.specs.transmission}</strong></div>
            <div><span style="color: var(--text-dim);">Drivetrain:</span> <strong>${car.specs.driveTrain}</strong></div>
            <div><span style="color: var(--text-dim);">Fuel/Engine:</span> <strong>${car.specs.fuel}</strong></div>
          </div>
        </div>

        <!-- Included Premium Features -->
        <h4 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent-gold); margin-bottom: 0.5rem;">Included Options</h4>
        <ul class="detail-features-list">
          ${car.features.map(f => `
            <li>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>${f}</span>
            </li>
          `).join("")}
        </ul>

        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border-glass);">
          <div>
            <div style="font-size: 1.6rem; font-weight: 800; font-family: var(--font-heading); color: var(--accent-gold);">${formatPrice(car.pricePerDay)}</div>
            <div style="font-size: 0.75rem; color: var(--text-dim);">Per day • Fully Insured Available</div>
          </div>
          <button class="btn-primary" onclick="openBookingModal('${car.id}')" style="padding: 0.85rem 1.8rem;">
            <span>Reserve This Vehicle</span>
          </button>
        </div>
      </div>
    `;

    carDetailModal.classList.add("active");
  }

  // -------------------------------------------------------------
  // MULTI-STEP BOOKING WIZARD
  // -------------------------------------------------------------
  window.openBookingModal = function(carId) {
    const car = CARS_DATA.find(c => c.id === carId);
    if (!car) return;

    activeBooking.car = car;
    activeBooking.currentStep = 1;

    // Close any other open modals
    carDetailModal.classList.remove("active");
    compareModal.classList.remove("active");

    // Populate car summary header
    bookingCarSummaryHeader.innerHTML = `
      <img src="${car.image}" alt="${car.name}" class="booking-car-thumb">
      <div style="flex: 1;">
        <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--accent-gold); font-weight: 700;">Selected Reservation</div>
        <h4 style="font-size: 1.2rem; font-weight: 700;">${car.name} (${car.year})</h4>
        <div style="font-size: 0.85rem; color: var(--text-muted);">${car.specs.power} • ${car.specs.transmission}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 1.3rem; font-weight: 800; color: var(--accent-gold); font-family: var(--font-heading);">${formatPrice(car.pricePerDay)}</div>
        <div style="font-size: 0.75rem; color: var(--text-dim);">per day rate</div>
      </div>
    `;

    // Populate protection plans
    renderProtectionPlans();

    // Populate add-ons
    renderAddons();

    // Reset steps
    setWizardStep(1);

    bookingModal.classList.add("active");
  };

  function setWizardStep(stepNumber) {
    activeBooking.currentStep = stepNumber;

    // Update Step Indicators
    for (let i = 1; i <= 4; i++) {
      const node = document.getElementById(`wizard-node-${i}`);
      const pane = document.getElementById(`wizard-step-${i}`);

      if (pane) {
        pane.classList.toggle("active", i === stepNumber);
      }

      if (node) {
        node.classList.remove("active", "completed");
        if (i === stepNumber) {
          node.classList.add("active");
        } else if (i < stepNumber) {
          node.classList.add("completed");
        }
      }
    }

    // Step 5 confirmation pane
    const pane5 = document.getElementById("wizard-step-5");
    if (stepNumber === 5) {
      document.querySelectorAll(".wizard-content-pane").forEach(p => p.classList.remove("active"));
      pane5.classList.add("active");
    }

    if (stepNumber === 4) {
      calculateAndRenderOrderBreakdown();
    }
  }

  function renderProtectionPlans() {
    protectionPlansContainer.innerHTML = PROTECTION_PLANS.map(plan => {
      const isSelected = activeBooking.planId === plan.id;
      return `
        <div class="plan-card-option ${isSelected ? 'selected' : ''}" data-plan-id="${plan.id}">
          ${plan.popular ? `<div style="position: absolute; top: -10px; right: 12px; background: var(--accent-gold); color: #07090E; font-size: 0.68rem; font-weight: 800; padding: 2px 8px; border-radius: 99px;">RECOMMENDED</div>` : ''}
          <div class="plan-title">${plan.name}</div>
          <div class="plan-price">${plan.pricePerDay === 0 ? 'Included ($0)' : `+${formatPrice(plan.pricePerDay)}/day`}</div>
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--accent-green); margin-bottom: 0.5rem;">${plan.liability}</div>
          <ul class="plan-features-mini">
            ${plan.features.map(f => `<li>• ${f}</li>`).join("")}
          </ul>
        </div>
      `;
    }).join("");

    protectionPlansContainer.querySelectorAll(".plan-card-option").forEach(card => {
      card.addEventListener("click", () => {
        activeBooking.planId = card.getAttribute("data-plan-id");
        renderProtectionPlans();
      });
    });
  }

  function renderAddons() {
    addonsListContainer.innerHTML = ADDONS.map(addon => {
      const isChecked = activeBooking.addons.includes(addon.id);
      return `
        <label class="addon-row-item ${isChecked ? 'checked' : ''}">
          <div class="addon-info-block">
            <input type="checkbox" class="addon-checkbox" data-addon-id="${addon.id}" ${isChecked ? 'checked' : ''}>
            <div>
              <strong style="font-size: 0.95rem;">${addon.name}</strong>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${addon.desc}</div>
            </div>
          </div>
          <div style="text-align: right; font-weight: 700; font-size: 0.95rem; color: var(--accent-gold);">
            +${formatPrice(addon.price)} <span style="font-size: 0.75rem; color: var(--text-dim);">/${addon.per}</span>
          </div>
        </label>
      `;
    }).join("");

    addonsListContainer.querySelectorAll(".addon-checkbox").forEach(box => {
      box.addEventListener("change", (e) => {
        const id = box.getAttribute("data-addon-id");
        if (e.target.checked) {
          if (!activeBooking.addons.includes(id)) activeBooking.addons.push(id);
        } else {
          activeBooking.addons = activeBooking.addons.filter(x => x !== id);
        }
        renderAddons();
      });
    });
  }

  function calculateAndRenderOrderBreakdown() {
    const car = activeBooking.car;
    if (!car) return;

    const days = getDaysBetween(activeBooking.startDate, activeBooking.endDate);
    const carTotalUSD = car.pricePerDay * days;

    const selectedPlan = PROTECTION_PLANS.find(p => p.id === activeBooking.planId) || PROTECTION_PLANS[0];
    const planTotalUSD = selectedPlan.pricePerDay * days;

    let addonsTotalUSD = 0;
    activeBooking.addons.forEach(aid => {
      const add = ADDONS.find(a => a.id === aid);
      if (add) {
        addonsTotalUSD += add.per === "day" ? (add.price * days) : add.price;
      }
    });

    const subtotalUSD = carTotalUSD + planTotalUSD + addonsTotalUSD;
    const discountUSD = Math.round(subtotalUSD * (activeBooking.discountPercent / 100));
    const taxesUSD = Math.round((subtotalUSD - discountUSD) * 0.08); // 8% local airport tax/fee
    const grandTotalUSD = (subtotalUSD - discountUSD) + taxesUSD;

    pricingBreakdownBox.innerHTML = `
      <div class="calc-line">
        <span>Vehicle Rental (${days} day${days > 1 ? 's' : ''} × ${formatPrice(car.pricePerDay)}):</span>
        <strong>${formatPrice(carTotalUSD)}</strong>
      </div>
      <div class="calc-line">
        <span>Protection Cover (${selectedPlan.name}):</span>
        <strong>${planTotalUSD === 0 ? 'Complimentary' : formatPrice(planTotalUSD)}</strong>
      </div>
      ${activeBooking.addons.length > 0 ? `
        <div class="calc-line">
          <span>Selected Extras & Amenities:</span>
          <strong>+${formatPrice(addonsTotalUSD)}</strong>
        </div>
      ` : ''}
      ${activeBooking.discountPercent > 0 ? `
        <div class="calc-line" style="color: var(--accent-green);">
          <span>Promo Discount (-${activeBooking.discountPercent}%):</span>
          <strong>-${formatPrice(discountUSD)}</strong>
        </div>
      ` : ''}
      <div class="calc-line">
        <span>Est. Local Taxes & Facility Charges (8%):</span>
        <strong>${formatPrice(taxesUSD)}</strong>
      </div>
      <div class="calc-line total-line">
        <span>Total Reservation Payable:</span>
        <span>${formatPrice(grandTotalUSD)}</span>
      </div>
      <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.5rem; text-align: right;">
        Security Deposit: ${selectedPlan.id === 'vip' ? 'WAIVED ($0)' : formatPrice(car.deposit) + ' (pre-authorization only)'}
      </div>
    `;

    activeBooking.computedTotalUSD = grandTotalUSD;
    activeBooking.computedDays = days;
  }

  // Promo code validation
  btnApplyPromo?.addEventListener("click", () => {
    const code = promoCodeInput.value.trim().toUpperCase();
    if (code === "VELOCITY10") {
      activeBooking.discountPercent = 10;
      activeBooking.promoCode = code;
      promoStatusMsg.innerHTML = `<span style="color: var(--accent-green);">✓ Code applied! 10% discount subtracted.</span>`;
      showToast("Coupon VELOCITY10 applied (-10%)!", "success");
    } else if (code === "VIP20") {
      activeBooking.discountPercent = 20;
      activeBooking.promoCode = code;
      promoStatusMsg.innerHTML = `<span style="color: var(--accent-green);">✓ VIP Code applied! 20% discount subtracted.</span>`;
      showToast("VIP20 coupon applied (-20%)!", "success");
    } else if (code === "FIRST15") {
      activeBooking.discountPercent = 15;
      activeBooking.promoCode = code;
      promoStatusMsg.innerHTML = `<span style="color: var(--accent-green);">✓ Welcome Member coupon applied (-15%).</span>`;
      showToast("FIRST15 coupon applied (-15%)!", "success");
    } else {
      activeBooking.discountPercent = 0;
      activeBooking.promoCode = "";
      promoStatusMsg.innerHTML = `<span style="color: var(--accent-red);">✕ Invalid coupon code. Try 'VELOCITY10' or 'VIP20'</span>`;
    }
    calculateAndRenderOrderBreakdown();
  });

  // Wizard Step Navigation listeners
  btnWizardStep1Next?.addEventListener("click", () => {
    const pDate = bookingPickupDate.value;
    const rDate = bookingReturnDate.value;
    if (!pDate || !rDate) {
      showToast("Please choose valid pickup and return dates.", "info");
      return;
    }
    if (new Date(rDate) < new Date(pDate)) {
      showToast("Return date cannot be earlier than pick-up date.", "info");
      return;
    }
    activeBooking.startDate = pDate;
    activeBooking.endDate = rDate;
    activeBooking.pickupLoc = bookingPickupLoc.value;
    activeBooking.dropoffLoc = bookingDropoffLoc.value;
    setWizardStep(2);
  });

  btnWizardStep2Prev?.addEventListener("click", () => setWizardStep(1));
  btnWizardStep2Next?.addEventListener("click", () => setWizardStep(3));

  btnWizardStep3Prev?.addEventListener("click", () => setWizardStep(2));
  btnWizardStep3Next?.addEventListener("click", () => setWizardStep(4));

  btnWizardStep4Prev?.addEventListener("click", () => setWizardStep(3));

  // Step 4 Final Submission
  bookingFinalForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("driver-name").value.trim();
    const email = document.getElementById("driver-email").value.trim();
    const phone = document.getElementById("driver-phone").value.trim();
    const age = document.getElementById("driver-age").value;

    if (!name || !email || !phone) {
      showToast("Please provide all required driver credentials.", "info");
      return;
    }

    activeBooking.driver = { name, email, phone, age };

    // Generate unique reservation ID
    const resId = "VEL-" + Math.floor(100000 + Math.random() * 900000);
    const pickupLocationObj = LOCATIONS.find(l => l.id === activeBooking.pickupLoc) || LOCATIONS[0];
    const returnLocationObj = LOCATIONS.find(l => l.id === activeBooking.dropoffLoc) || LOCATIONS[0];
    const planObj = PROTECTION_PLANS.find(p => p.id === activeBooking.planId) || PROTECTION_PLANS[0];

    const confirmedBooking = {
      id: resId,
      dateCreated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      car: {
        id: activeBooking.car.id,
        name: activeBooking.car.name,
        brand: activeBooking.car.brand,
        image: activeBooking.car.image,
        specs: activeBooking.car.specs
      },
      durationDays: activeBooking.computedDays,
      startDate: activeBooking.startDate,
      endDate: activeBooking.endDate,
      pickupLocation: pickupLocationObj.name,
      returnLocation: returnLocationObj.name,
      planName: planObj.name,
      driverName: activeBooking.driver.name,
      driverEmail: activeBooking.driver.email,
      totalAmountUSD: activeBooking.computedTotalUSD,
      status: "Confirmed (VIP Reserved)"
    };

    // Save to bookings list & localStorage
    bookings.unshift(confirmedBooking);
    localStorage.setItem("velo_bookings", JSON.stringify(bookings));
    updateCounters();

    // Render Confirmation Voucher
    confirmationVoucherContent.innerHTML = `
      <div class="voucher-header">
        <div>
          <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--accent-gold); font-weight: 800; letter-spacing: 0.1em;">OFFICIAL RENTAL CONFIRMATION</span>
          <h3 style="font-size: 1.4rem; font-weight: 800;">Reservation #${resId}</h3>
        </div>
        <div style="text-align: right;">
          <span style="background: rgba(16, 185, 129, 0.15); color: var(--accent-green); border: 1px solid var(--accent-green); padding: 0.3rem 0.8rem; border-radius: 99px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">VERIFIED RESERVED</span>
        </div>
      </div>

      <div style="display: flex; gap: 1.25rem; align-items: center; margin-bottom: 1.25rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-glass);">
        <img src="${confirmedBooking.car.image}" alt="${confirmedBooking.car.name}" style="width: 100px; height: 65px; object-fit: cover; border-radius: 8px;">
        <div>
          <h4 style="font-size: 1.15rem; font-weight: 700;">${confirmedBooking.car.name}</h4>
          <div style="font-size: 0.85rem; color: var(--text-muted);">${confirmedBooking.car.specs.power} • ${confirmedBooking.car.specs.fuel}</div>
        </div>
      </div>

      <div class="voucher-meta-grid">
        <div><strong style="color: var(--text-muted);">Lead Driver:</strong> ${confirmedBooking.driverName}</div>
        <div><strong style="color: var(--text-muted);">Duration:</strong> ${confirmedBooking.durationDays} Days</div>
        <div><strong style="color: var(--text-muted);">Pick-up:</strong> ${confirmedBooking.startDate} (${confirmedBooking.pickupLocation})</div>
        <div><strong style="color: var(--text-muted);">Return:</strong> ${confirmedBooking.endDate} (${confirmedBooking.returnLocation})</div>
        <div><strong style="color: var(--text-muted);">Protection Tier:</strong> ${confirmedBooking.planName}</div>
        <div><strong style="color: var(--text-muted);">Total Paid:</strong> <span style="color: var(--accent-gold); font-weight: 800;">${formatPrice(confirmedBooking.totalAmountUSD)}</span></div>
      </div>

      <div class="voucher-qr-wrap">
        <div class="voucher-qr-box">
          <svg viewBox="0 0 100 100" fill="none">
            <rect width="100" height="100" fill="#ffffff"/>
            <!-- Simulating QR Matrix -->
            <rect x="10" y="10" width="25" height="25" fill="#000000"/>
            <rect x="15" y="15" width="15" height="15" fill="#ffffff"/>
            <rect x="18" y="18" width="9" height="9" fill="#000000"/>
            <rect x="65" y="10" width="25" height="25" fill="#000000"/>
            <rect x="70" y="15" width="15" height="15" fill="#ffffff"/>
            <rect x="73" y="18" width="9" height="9" fill="#000000"/>
            <rect x="10" y="65" width="25" height="25" fill="#000000"/>
            <rect x="15" y="70" width="15" height="15" fill="#ffffff"/>
            <rect x="18" y="73" width="9" height="9" fill="#000000"/>
            <rect x="42" y="15" width="16" height="6" fill="#000000"/>
            <rect x="45" y="28" width="10" height="8" fill="#000000"/>
            <rect x="42" y="42" width="16" height="16" fill="#000000"/>
            <rect x="65" y="45" width="20" height="8" fill="#000000"/>
            <rect x="65" y="65" width="12" height="20" fill="#000000"/>
            <rect x="82" y="75" width="8" height="10" fill="#000000"/>
          </svg>
        </div>
        <div style="font-size: 0.78rem; color: var(--text-dim); margin-top: 0.5rem;">Present this digital QR to your handover concierge at vehicle delivery</div>
      </div>
    `;

    showToast(`Reservation #${resId} Confirmed! Enjoy your drive.`, "success");
    setWizardStep(5);
  });

  btnPrintVoucher?.addEventListener("click", () => {
    window.print();
  });

  btnFinishBooking?.addEventListener("click", () => {
    bookingModal.classList.remove("active");
    openBookingsDrawer();
  });

  // -------------------------------------------------------------
  // MY BOOKINGS DRAWER
  // -------------------------------------------------------------
  function openBookingsDrawer() {
    closeDrawers();
    renderBookingsDrawer();
    bookingsDrawer.classList.add("active");
    drawerOverlay.classList.add("active");
  }

  function renderBookingsDrawer() {
    if (bookings.length === 0) {
      bookingsDrawerList.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-dim);">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 0.75rem;">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <p>No active reservations yet. Explore our fleet to reserve your first vehicle.</p>
        </div>
      `;
      return;
    }

    bookingsDrawerList.innerHTML = bookings.map((b, idx) => `
      <div class="booking-item-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
          <div>
            <span style="font-size: 0.75rem; color: var(--accent-gold); font-weight: 700;">#${b.id}</span>
            <h4 style="font-size: 1.05rem; font-weight: 700;">${b.car.name}</h4>
          </div>
          <span style="font-size: 0.75rem; background: rgba(16, 185, 129, 0.15); color: var(--accent-green); padding: 2px 8px; border-radius: 99px; font-weight: 700;">Active</span>
        </div>

        <div style="display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.75rem;">
          <img src="${b.car.image}" alt="${b.car.name}" style="width: 70px; height: 45px; object-fit: cover; border-radius: 6px;">
          <div style="font-size: 0.8rem; color: var(--text-muted);">
            <div><strong>Dates:</strong> ${b.startDate} to ${b.endDate} (${b.durationDays}d)</div>
            <div><strong>Location:</strong> ${b.pickupLocation}</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-glass); padding-top: 0.6rem;">
          <span style="font-size: 0.95rem; font-weight: 800; color: var(--accent-gold);">${formatPrice(b.totalAmountUSD)}</span>
          <button class="btn-secondary" data-cancel-booking-idx="${idx}" style="padding: 0.35rem 0.75rem; font-size: 0.75rem; color: var(--accent-red); border-color: rgba(244,63,94,0.3);">
            Cancel Booking
          </button>
        </div>
      </div>
    `).join("");

    bookingsDrawerList.querySelectorAll("[data-cancel-booking-idx]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-cancel-booking-idx"));
        if (confirm("Are you sure you wish to cancel this reservation? (Free 100% refund applied)")) {
          const removed = bookings.splice(idx, 1)[0];
          localStorage.setItem("velo_bookings", JSON.stringify(bookings));
          updateCounters();
          renderBookingsDrawer();
          showToast(`Reservation #${removed.id} has been cancelled.`, "info");
        }
      });
    });
  }

  function closeDrawers() {
    bookingsDrawer.classList.remove("active");
    wishlistDrawer.classList.remove("active");
    drawerOverlay.classList.remove("active");
  }

  // -------------------------------------------------------------
  // FILTER EVENT LISTENERS
  // -------------------------------------------------------------
  filterKeywordInput?.addEventListener("input", (e) => {
    filters.keyword = e.target.value;
    renderFleet();
  });

  filterSortSelect?.addEventListener("change", (e) => {
    filters.sortBy = e.target.value;
    renderFleet();
  });

  categoryPillsContainer?.querySelectorAll(".category-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      categoryPillsContainer.querySelectorAll(".category-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      filters.category = pill.getAttribute("data-category");
      renderFleet();
    });
  });

  filterTransmissionSelect?.addEventListener("change", (e) => {
    filters.transmission = e.target.value;
    renderFleet();
  });

  filterFuelSelect?.addEventListener("change", (e) => {
    filters.fuel = e.target.value;
    renderFleet();
  });

  filterPriceRange?.addEventListener("input", (e) => {
    filters.maxPrice = parseInt(e.target.value);
    priceRangeVal.textContent = `${formatPrice(filters.maxPrice)}/day`;
    renderFleet();
  });

  function resetAllFilters() {
    filters = {
      keyword: "",
      category: "all",
      transmission: "all",
      fuel: "all",
      maxPrice: 2000,
      sortBy: "featured"
    };

    filterKeywordInput.value = "";
    filterSortSelect.value = "featured";
    filterTransmissionSelect.value = "all";
    filterFuelSelect.value = "all";
    filterPriceRange.value = 2000;
    priceRangeVal.textContent = `${formatPrice(2000)}/day`;

    categoryPillsContainer.querySelectorAll(".category-pill").forEach(p => {
      p.classList.toggle("active", p.getAttribute("data-category") === "all");
    });

    renderFleet();
    showToast("Fleet filters cleared.", "info");
  }

  btnResetFilters?.addEventListener("click", resetAllFilters);

  // -------------------------------------------------------------
  // QUICK SEARCH WIDGET SUBMISSION
  // -------------------------------------------------------------
  quickSearchForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const selCat = searchCategorySelect.value;
    filters.category = selCat;

    categoryPillsContainer.querySelectorAll(".category-pill").forEach(p => {
      p.classList.toggle("active", p.getAttribute("data-category") === selCat);
    });

    activeBooking.pickupLoc = searchPickupLoc.value;
    activeBooking.startDate = searchStartDate.value;
    activeBooking.endDate = searchEndDate.value;
    bookingPickupDate.value = searchStartDate.value;
    bookingReturnDate.value = searchEndDate.value;
    bookingPickupLoc.value = searchPickupLoc.value;

    renderFleet();

    // Smooth scroll down to fleet section
    document.getElementById("fleet")?.scrollIntoView({ behavior: "smooth" });
    showToast("Fleet filtered by your trip itinerary!", "success");
  });

  // Featured Demo Button in Hero
  document.getElementById("btn-hero-quick-demo")?.addEventListener("click", () => {
    openCarDetailModal("porsche-gt3-rs");
  });

  // -------------------------------------------------------------
  // CURRENCY CONVERSION HANDLER
  // -------------------------------------------------------------
  currencySelect?.addEventListener("change", (e) => {
    currentCurrency = e.target.value;
    localStorage.setItem("velo_currency", currentCurrency);
    
    // Update hero price display
    const heroPriceDisplay = document.getElementById("hero-price-display");
    if (heroPriceDisplay) {
      heroPriceDisplay.textContent = formatPrice(850);
    }

    priceRangeVal.textContent = `${formatPrice(filters.maxPrice)}/day`;
    renderFleet();
    renderWishlistDrawer();
    renderBookingsDrawer();
    showToast(`Currency switched to ${currentCurrency}`, "info");
  });

  // -------------------------------------------------------------
  // MODAL & DRAWER CLOSE HANDLERS
  // -------------------------------------------------------------
  btnCloseDetailModal?.addEventListener("click", () => carDetailModal.classList.remove("active"));
  btnCloseCompareModal?.addEventListener("click", () => compareModal.classList.remove("active"));
  btnCloseBookingModal?.addEventListener("click", () => bookingModal.classList.remove("active"));

  [carDetailModal, compareModal, bookingModal].forEach(modal => {
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("active");
    });
  });

  btnLaunchComparison?.addEventListener("click", openComparisonModal);
  btnClearComparison?.addEventListener("click", () => {
    compareList = [];
    updateComparisonDock();
    renderFleet();
  });

  btnOpenBookings?.addEventListener("click", openBookingsDrawer);
  btnCloseBookingsDrawer?.addEventListener("click", closeDrawers);

  btnOpenWishlist?.addEventListener("click", () => {
    closeDrawers();
    renderWishlistDrawer();
    wishlistDrawer.classList.add("active");
    drawerOverlay.classList.add("active");
  });
  btnCloseWishlistDrawer?.addEventListener("click", closeDrawers);
  drawerOverlay?.addEventListener("click", closeDrawers);

  // -------------------------------------------------------------
  // FAQ ACCORDION INTERACTIVITY
  // -------------------------------------------------------------
  document.querySelectorAll(".faq-header").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
      if (!wasOpen) {
        item.classList.add("open");
      }
    });
  });

  // -------------------------------------------------------------
  // NEWSLETTER / VIP CLUB
  // -------------------------------------------------------------
  document.getElementById("newsletter-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = e.target.querySelector("input");
    if (input.value) {
      input.value = "";
      showToast("Welcome to the VIP Club! Use code FIRST15 for 15% off.", "success");
      promoCodeInput.value = "FIRST15";
    }
  });

  // -------------------------------------------------------------
  // NAVBAR SCROLL EFFECT
  // -------------------------------------------------------------
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Global category helper for footer links
  window.filterByCategory = function(category) {
    filters.category = category;
    categoryPillsContainer.querySelectorAll(".category-pill").forEach(p => {
      p.classList.toggle("active", p.getAttribute("data-category") === category);
    });
    renderFleet();
  };

  // -------------------------------------------------------------
  // INITIALIZATION
  // -------------------------------------------------------------
  currencySelect.value = currentCurrency;
  initDefaultDates();
  populateLocations();
  updateCounters();
  renderFleet();
  updateComparisonDock();
});
