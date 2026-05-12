const products = [
  {
    id: 1,
    name: "PulseBuds Pro",
    category: "electronics",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.6,
    reviews: 12840,
    stock: 32,
    dealPercent: 31,
    claimed: 72,
    badge: "Limited time deal",
    color: "linear-gradient(145deg,#1f2937,#4b5563)",
    features: ["Spatial audio", "32-hour battery", "Multi-device switching"],
    ratingBreakdown: [72, 18, 6, 3, 1]
  },
  {
    id: 2,
    name: "DeskGlow Light Bar",
    category: "home",
    price: 39.5,
    originalPrice: 59.99,
    rating: 4.5,
    reviews: 6621,
    stock: 27,
    dealPercent: 34,
    claimed: 61,
    badge: "Best seller",
    color: "linear-gradient(145deg,#0f766e,#14b8a6)",
    features: ["Bias lighting", "USB-C power", "Warm and cool scenes"],
    ratingBreakdown: [68, 20, 7, 3, 2]
  },
  {
    id: 3,
    name: "ForgeFit Kettlebell",
    category: "fitness",
    price: 54.0,
    originalPrice: 69.0,
    rating: 4.7,
    reviews: 4530,
    stock: 18,
    dealPercent: 22,
    claimed: 44,
    badge: "Top rated",
    color: "linear-gradient(145deg,#3f3f46,#71717a)",
    features: ["Powder-coated grip", "Compact home design", "Balanced weight feel"],
    ratingBreakdown: [76, 15, 5, 2, 2]
  },
  {
    id: 4,
    name: "Nimbus Mechanical Keys",
    category: "gaming",
    price: 119.0,
    originalPrice: 149.99,
    rating: 4.8,
    reviews: 20412,
    stock: 23,
    dealPercent: 21,
    claimed: 86,
    badge: "Prime deal",
    color: "linear-gradient(145deg,#312e81,#6366f1)",
    features: ["Hot-swappable switches", "Sound-dampened frame", "RGB profiles"],
    ratingBreakdown: [81, 12, 4, 2, 1]
  },
  {
    id: 5,
    name: "SnapBrew Portable Espresso",
    category: "home",
    price: 69.0,
    originalPrice: 94.99,
    rating: 4.3,
    reviews: 3840,
    stock: 46,
    dealPercent: 27,
    claimed: 37,
    badge: "Travel favorite",
    color: "linear-gradient(145deg,#7c2d12,#ea580c)",
    features: ["Manual pressure system", "Compact brew chamber", "Insulated shell"],
    ratingBreakdown: [61, 22, 9, 5, 3]
  },
  {
    id: 6,
    name: "EchoView 4K Mini Cam",
    category: "creator",
    price: 149.0,
    originalPrice: 199.0,
    rating: 4.4,
    reviews: 7202,
    stock: 11,
    dealPercent: 25,
    claimed: 83,
    badge: "Creator pick",
    color: "linear-gradient(145deg,#164e63,#06b6d4)",
    features: ["4K sensor", "Desk-mount ready", "Low-light tuning"],
    ratingBreakdown: [65, 21, 8, 4, 2]
  },
  {
    id: 7,
    name: "StrideCore Jump Rope",
    category: "fitness",
    price: 24.99,
    originalPrice: 32.0,
    rating: 4.2,
    reviews: 1944,
    stock: 80,
    dealPercent: 22,
    claimed: 29,
    badge: "Quick ship",
    color: "linear-gradient(145deg,#365314,#84cc16)",
    features: ["Weighted handles", "Adjustable length", "Grip texture"],
    ratingBreakdown: [57, 24, 11, 5, 3]
  },
  {
    id: 8,
    name: "Arcade Nova Controller",
    category: "gaming",
    price: 64.99,
    originalPrice: 79.99,
    rating: 4.6,
    reviews: 15092,
    stock: 36,
    dealPercent: 19,
    claimed: 58,
    badge: "Choice",
    color: "linear-gradient(145deg,#7f1d1d,#ef4444)",
    features: ["Hall effect sticks", "Low-latency wireless", "Rear buttons"],
    ratingBreakdown: [70, 18, 7, 3, 2]
  },
  {
    id: 9,
    name: "FocusDock USB-C Hub",
    category: "creator",
    price: 79.0,
    originalPrice: 109.99,
    rating: 4.7,
    reviews: 8242,
    stock: 14,
    dealPercent: 28,
    claimed: 74,
    badge: "Desk essential",
    color: "linear-gradient(145deg,#334155,#64748b)",
    features: ["Dual monitor support", "100W pass-through", "SD and Ethernet"],
    ratingBreakdown: [74, 16, 6, 2, 2]
  },
  {
    id: 10,
    name: "CloudRest Weighted Throw",
    category: "home",
    price: 58.0,
    originalPrice: 74.0,
    rating: 4.5,
    reviews: 2290,
    stock: 21,
    dealPercent: 22,
    claimed: 41,
    badge: "Home upgrade",
    color: "linear-gradient(145deg,#5f6caf,#95afc0)",
    features: ["Soft cotton outer shell", "Balanced weight", "Minimal look"],
    ratingBreakdown: [67, 19, 8, 4, 2]
  },
  {
    id: 11,
    name: "VoltFrame Monitor Arm",
    category: "creator",
    price: 112.0,
    originalPrice: 139.99,
    rating: 4.8,
    reviews: 6810,
    stock: 19,
    dealPercent: 20,
    claimed: 67,
    badge: "Workspace favorite",
    color: "linear-gradient(145deg,#1f2937,#6b7280)",
    features: ["Gas spring lift", "Cable routing", "Ultra-wide compatible"],
    ratingBreakdown: [82, 10, 4, 2, 2]
  },
  {
    id: 12,
    name: "RiftGlass Gaming Display",
    category: "gaming",
    price: 229.0,
    originalPrice: 299.99,
    rating: 4.7,
    reviews: 9450,
    stock: 12,
    dealPercent: 24,
    claimed: 79,
    badge: "Hot deal",
    color: "linear-gradient(145deg,#1d3557,#457b9d)",
    features: ["180Hz refresh", "HDR-ready panel", "Slim bezel design"],
    ratingBreakdown: [78, 13, 5, 2, 2]
  }
];

const categories = ["all", "electronics", "home", "fitness", "gaming", "creator"];
const cart = new Map();
const saved = new Set([5, 11]);

const categoryStrip = document.getElementById("categoryStrip");
const promoGrid = document.getElementById("promoGrid");
const dealStrip = document.getElementById("dealStrip");
const tagFilters = document.getElementById("tagFilters");
const productGrid = document.getElementById("productGrid");
const savedItemsEl = document.getElementById("savedItems");
const sortSelect = document.getElementById("sortSelect");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchCategory = document.getElementById("searchCategory");
const shopDeals = document.getElementById("shopDeals");
const timerEl = document.getElementById("timer");
const dealProgress = document.getElementById("dealProgress");
const dealProgressText = document.getElementById("dealProgressText");

const cartDrawer = document.getElementById("cartDrawer");
const openCart = document.getElementById("openCart");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const subtotalEl = document.getElementById("subtotal");
const grandTotalEl = document.getElementById("grandTotal");
const cartCount = document.getElementById("cartCount");
const toast = document.getElementById("toast");

const productModal = document.getElementById("productModal");
const closeProduct = document.getElementById("closeProduct");
const modalVisual = document.getElementById("modalVisual");
const modalBadge = document.getElementById("modalBadge");
const modalName = document.getElementById("modalName");
const modalMeta = document.getElementById("modalMeta");
const modalPrice = document.getElementById("modalPrice");
const modalFeatures = document.getElementById("modalFeatures");
const ratingBars = document.getElementById("ratingBars");
const modalAddBtn = document.getElementById("modalAddBtn");
const modalSaveBtn = document.getElementById("modalSaveBtn");

let activeCategory = "all";
let activeSearch = "";
let activeProductId = products[0].id;

function titleCase(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1600);
}

function getProduct(id) {
  return products.find((product) => product.id === id);
}

function renderPromoGrid() {
  const promos = [
    {
      title: "Level up your setup",
      items: products.filter((item) => item.category === "creator").slice(0, 3)
    },
    {
      title: "Gaming essentials",
      items: products.filter((item) => item.category === "gaming").slice(0, 3)
    },
    {
      title: "Home upgrades",
      items: products.filter((item) => item.category === "home").slice(0, 3)
    },
    {
      title: "Move better",
      items: products.filter((item) => item.category === "fitness").slice(0, 3)
    }
  ];

  promoGrid.innerHTML = "";
  promos.forEach((promo) => {
    const card = document.createElement("article");
    card.className = "promo-card";
    card.innerHTML = `
      <h3>${promo.title}</h3>
      <div class="promo-list">
        ${promo.items.map((item) => `<div class="promo-item"><span>${item.name}</span><strong>$${item.price.toFixed(2)}</strong></div>`).join("")}
      </div>
    `;
    promoGrid.appendChild(card);
  });
}

function renderDealStrip() {
  dealStrip.innerHTML = "";
  products
    .slice()
    .sort((a, b) => b.dealPercent - a.dealPercent)
    .slice(0, 6)
    .forEach((product) => {
      const card = document.createElement("article");
      card.className = "deal-card";
      card.innerHTML = `
        <div class="deal-visual" style="background:${product.color}">${product.category.toUpperCase()}</div>
        <p class="deal-badge">${product.badge} · ${product.dealPercent}% off</p>
        <h3>${product.name}</h3>
        <p class="deal-meta">$${product.price.toFixed(2)} · ${product.claimed}% claimed</p>
      `;
      card.addEventListener("click", () => openProductModal(product.id));
      dealStrip.appendChild(card);
    });
}

function renderCategoryStrip() {
  categoryStrip.innerHTML = "";
  categories.slice(1).forEach((cat) => {
    const item = document.createElement("article");
    item.className = "category-card";
    item.innerHTML = `<h3>${titleCase(cat)}</h3><p>Top picks, deals, and more detailed product pages.</p>`;
    item.addEventListener("click", () => {
      activeCategory = cat;
      renderFilters();
      renderProducts();
    });
    categoryStrip.appendChild(item);
  });
}

function renderFilters() {
  tagFilters.innerHTML = "";
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "tag" + (cat === activeCategory ? " active" : "");
    btn.textContent = titleCase(cat);
    btn.addEventListener("click", () => {
      activeCategory = cat;
      renderFilters();
      renderProducts();
    });
    tagFilters.appendChild(btn);
  });
}

function filteredProducts() {
  const scopeCategory = searchCategory.value;
  let list = products.filter((product) => {
    const byCat = activeCategory === "all" || product.category === activeCategory;
    const byScope = scopeCategory === "all" || product.category === scopeCategory;
    const hay = `${product.name} ${product.category} ${product.badge}`.toLowerCase();
    const bySearch = hay.includes(activeSearch.toLowerCase());
    return byCat && byScope && bySearch;
  });

  const sort = sortSelect.value;
  if (sort === "priceAsc") list.sort((a, b) => a.price - b.price);
  if (sort === "priceDesc") list.sort((a, b) => b.price - a.price);
  if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
  if (sort === "deal") list.sort((a, b) => b.dealPercent - a.dealPercent);
  return list;
}

function addToCart(id) {
  const qty = cart.get(id) || 0;
  cart.set(id, qty + 1);
  saved.delete(id);
  renderSavedItems();
  renderCart();
  showToast("Added to cart");
}

function saveForLater(id) {
  saved.add(id);
  cart.delete(id);
  renderSavedItems();
  renderCart();
  showToast("Saved for later");
}

function adjustQty(id, delta) {
  const qty = (cart.get(id) || 0) + delta;
  if (qty <= 0) {
    cart.delete(id);
  } else {
    cart.set(id, qty);
  }
  renderCart();
}

function openProductModal(id) {
  const product = getProduct(id);
  if (!product) return;
  activeProductId = id;

  modalVisual.style.background = product.color;
  modalVisual.textContent = product.category.toUpperCase();
  modalBadge.textContent = `${product.badge} · ${product.dealPercent}% off`;
  modalName.textContent = product.name;
  modalMeta.textContent = `⭐ ${product.rating} (${product.reviews.toLocaleString()} ratings) · In stock: ${product.stock}`;
  modalPrice.textContent = `$${product.price.toFixed(2)}  |  was $${product.originalPrice.toFixed(2)}`;
  modalFeatures.innerHTML = product.features.map((feature) => `<li>${feature}</li>`).join("");

  ratingBars.innerHTML = "";
  [5, 4, 3, 2, 1].forEach((star, index) => {
    const pct = product.ratingBreakdown[index];
    const row = document.createElement("div");
    row.className = "rating-row";
    row.innerHTML = `
      <span>${star} star</span>
      <div class="bar"><span style="width:${pct}%"></span></div>
      <strong>${pct}%</strong>
    `;
    ratingBars.appendChild(row);
  });

  productModal.showModal();
}

function renderProducts() {
  const list = filteredProducts();
  productGrid.innerHTML = "";

  if (!list.length) {
    productGrid.innerHTML = "<p>No products match your filters. Try another search.</p>";
    return;
  }

  list.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product";
    card.innerHTML = `
      <div class="thumb" style="background:${product.color}">${product.category.toUpperCase()}</div>
      <div class="product-body">
        <p class="product-badge">${product.badge}</p>
        <h3>${product.name}</h3>
        <div class="meta">⭐ ${product.rating} (${product.reviews.toLocaleString()}) · In stock: ${product.stock}</div>
        <div class="price-line">
          <div class="price">$${product.price.toFixed(2)}</div>
          <div class="old-price">$${product.originalPrice.toFixed(2)}</div>
        </div>
        <div class="meta">${product.dealPercent}% off · ${product.claimed}% claimed</div>
        <div class="product-actions">
          <button class="add-btn">Add to Cart</button>
          <button class="ghost-btn">Quick View</button>
          <button class="secondary-btn">Save</button>
        </div>
      </div>
    `;

    const [addBtn, quickViewBtn, saveBtn] = card.querySelectorAll("button");
    addBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      addToCart(product.id);
    });
    quickViewBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      openProductModal(product.id);
    });
    saveBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      saveForLater(product.id);
    });
    card.addEventListener("click", () => openProductModal(product.id));
    productGrid.appendChild(card);
  });
}

function renderSavedItems() {
  savedItemsEl.innerHTML = "";
  const items = [...saved].map(getProduct).filter(Boolean);
  if (!items.length) {
    savedItemsEl.innerHTML = "<p>No saved items yet. Save products to compare later.</p>";
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "saved-card";
    card.innerHTML = `
      <strong>${item.name}</strong>
      <p class="saved-meta">$${item.price.toFixed(2)} · ${item.badge}</p>
      <div class="buy-row">
        <button class="add-btn">Move to Cart</button>
        <button class="ghost-btn">View</button>
      </div>
    `;
    const [moveBtn, viewBtn] = card.querySelectorAll("button");
    moveBtn.addEventListener("click", () => addToCart(item.id));
    viewBtn.addEventListener("click", () => openProductModal(item.id));
    savedItemsEl.appendChild(card);
  });
}

function renderCart() {
  cartItems.innerHTML = "";
  let subtotal = 0;
  let count = 0;

  for (const [id, qty] of cart.entries()) {
    const product = getProduct(id);
    if (!product) continue;
    count += qty;
    subtotal += product.price * qty;

    const row = document.createElement("article");
    row.className = "cart-item";
    row.innerHTML = `
      <h4>${product.name}</h4>
      <p>$${product.price.toFixed(2)} each · ${product.badge}</p>
      <div class="qty-row">
        <button>-</button>
        <span>Qty ${qty}</span>
        <button>+</button>
        <button class="ghost-btn">Save</button>
      </div>
    `;

    const buttons = row.querySelectorAll("button");
    buttons[0].addEventListener("click", () => adjustQty(id, -1));
    buttons[1].addEventListener("click", () => adjustQty(id, 1));
    buttons[2].addEventListener("click", () => saveForLater(id));
    cartItems.appendChild(row);
  }

  if (!cart.size) {
    cartItems.innerHTML = "<p>Your cart is empty. Add something excellent.</p>";
  }

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  grandTotalEl.textContent = `$${(subtotal * 1.05).toFixed(2)}`;
  cartCount.textContent = String(count);
}

function setupTimer() {
  const end = Date.now() + 1000 * 60 * 60 * 4 + 1000 * 60 * 13;
  setInterval(() => {
    const diff = Math.max(0, end - Date.now());
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    timerEl.textContent = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    const avgDemand = Math.round(products.reduce((sum, product) => sum + product.claimed, 0) / products.length);
    dealProgress.style.width = `${avgDemand}%`;
    dealProgressText.textContent = `${avgDemand}% of featured inventory already claimed`;
  }, 1000);
}

searchBtn.addEventListener("click", () => {
  activeSearch = searchInput.value.trim();
  renderProducts();
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    activeSearch = searchInput.value.trim();
    renderProducts();
  }
});

sortSelect.addEventListener("change", renderProducts);

shopDeals.addEventListener("click", () => {
  activeCategory = "creator";
  renderFilters();
  renderProducts();
});

openCart.addEventListener("click", () => cartDrawer.classList.add("open"));
closeCart.addEventListener("click", () => cartDrawer.classList.remove("open"));
closeProduct.addEventListener("click", () => productModal.close());
modalAddBtn.addEventListener("click", () => addToCart(activeProductId));
modalSaveBtn.addEventListener("click", () => saveForLater(activeProductId));
document.getElementById("checkoutBtn").addEventListener("click", () => {
  showToast(`Demo mode: order total ${grandTotalEl.textContent}`);
});

renderPromoGrid();
renderDealStrip();
renderCategoryStrip();
renderFilters();
renderProducts();
renderSavedItems();
renderCart();
setupTimer();
