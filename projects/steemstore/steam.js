const AUTH_KEY = "steemstore.auth.username";
const WISHLIST_KEY = "steemstore.wishlist";
const CART_KEY = "steemstore.cart";
const LIBRARY_KEY = "steemstore.library";

const paymentPresets = {
  visa: "4111 1111 1111 1111",
  mastercard: "5555 5555 5555 4444",
  amex: "3782 822463 10005",
  steamgift: "STEAM-GIFT-0000-0000"
};

const seedGames = [
  ["Counter-Strike 2", "action", ["multiplayer", "fps"]],
  ["Dota 2", "strategy", ["moba", "multiplayer"]],
  ["PUBG: BATTLEGROUNDS", "action", ["battle-royale", "multiplayer"]],
  ["Apex Legends", "action", ["battle-royale", "hero-shooter"]],
  ["NARAKA: BLADEPOINT", "action", ["multiplayer", "melee"]],
  ["Rust", "simulation", ["co-op", "story"]],
  ["Grand Theft Auto V", "adventure", ["story", "controller"]],
  ["Helldivers 2", "action", ["co-op", "controller"]],
  ["Destiny 2", "action", ["co-op", "looter-shooter"]],
  ["Lost Ark", "rpg", ["co-op", "controller"]],
  ["Team Fortress 2", "action", ["hero-shooter", "multiplayer"]],
  ["Warframe", "action", ["co-op", "story"]],
  ["Path of Exile", "rpg", ["co-op", "story"]],
  ["Baldur's Gate 3", "rpg", ["story", "controller"]],
  ["ELDEN RING", "rpg", ["story", "controller"]],
  ["Palworld", "adventure", ["co-op", "controller"]],
  ["Monster Hunter: World", "action", ["co-op", "controller"]],
  ["Tom Clancy's Rainbow Six Siege", "action", ["tactical", "multiplayer"]],
  ["DayZ", "simulation", ["co-op", "story"]],
  ["ARK: Survival Ascended", "simulation", ["co-op", "controller"]],
  ["Euro Truck Simulator 2", "simulation", ["controller", "story"]],
  ["Terraria", "adventure", ["indie", "co-op"]],
  ["Stardew Valley", "simulation", ["indie", "story"]],
  ["RimWorld", "simulation", ["indie", "story"]],
  ["Cyberpunk 2077", "rpg", ["story", "controller"]],
  ["Red Dead Redemption 2", "adventure", ["story", "controller"]],
  ["The Witcher 3: Wild Hunt", "rpg", ["story", "controller"]],
  ["Hogwarts Legacy", "adventure", ["story", "controller"]],
  ["Lethal Company", "adventure", ["co-op", "indie"]],
  ["Phasmophobia", "adventure", ["co-op", "vr"]],
  ["War Thunder", "simulation", ["vehicles", "multiplayer"]],
  ["Hearts of Iron IV", "strategy", ["grand-strategy", "singleplayer"]],
  ["Cities: Skylines II", "simulation", ["controller", "story"]],
  ["Ready or Not", "action", ["co-op", "controller"]],
  ["Squad", "action", ["co-op", "controller"]],
  ["Black Desert", "rpg", ["co-op", "story"]],
  ["Sea of Thieves", "adventure", ["co-op", "controller"]],
  ["No Man's Sky", "adventure", ["co-op", "vr"]],
  ["Forza Horizon 5", "sports", ["controller", "co-op"]],
  ["Football Manager 2024", "sports", ["management", "singleplayer"]]
];

const games = seedGames.map((entry, index) => {
  const [title, genre, tags] = entry;
  const rawPrice = 19.99 + (index % 8) * 7 + Math.floor(index / 6);
  const discount = [10, 15, 20, 25, 30, 35, 40, 45, 50][index % 9];
  return {
    id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    title,
    genre,
    tags,
    price: Number(rawPrice.toFixed(2)),
    discount,
    featured: index < 10,
    springSale: index % 2 === 0 || index % 5 === 0,
    trending: index < 24,
    newRelease: index % 3 === 0 || index % 7 === 0,
    topSeller: index < 32,
    rating: 80 + ((index * 3) % 20)
  };
});

const gamesById = new Map(games.map((game) => [game.id, game]));
const featuredGames = games.filter((game) => game.featured);

const state = {
  filter: "all",
  search: "",
  featuredIndex: 0,
  wishlist: new Set(),
  cart: new Set(),
  library: new Set(),
  checkoutIds: [],
  featuredTransitionToken: 0,
  featuredAnimating: false
};

function discountPrice(game) {
  return game.price * (1 - game.discount / 100);
}

function formatMoney(value) {
  return `$${value.toFixed(2)}`;
}

function toDisplayWord(value) {
  return value
    .split("-")
    .map((chunk) => {
      if (!chunk) {
        return chunk;
      }
      if (chunk.length <= 2) {
        return chunk.toUpperCase();
      }
      return chunk.charAt(0).toUpperCase() + chunk.slice(1);
    })
    .join("-");
}

function formatGenre(genre) {
  return toDisplayWord(genre);
}

function formatTags(tags) {
  return tags.map((tag) => toDisplayWord(tag)).join(" • ");
}

function reviewLabel(rating) {
  if (rating >= 95) {
    return "Overwhelmingly Positive";
  }
  if (rating >= 88) {
    return "Mostly Positive";
  }
  if (rating >= 80) {
    return "Mixed";
  }
  return "Mostly Negative";
}

function reviewStars(rating) {
  const filled = Math.max(1, Math.min(5, Math.round(rating / 20)));
  return "★".repeat(filled) + "☆".repeat(5 - filled);
}

function hashSeed(text) {
  let h = 0;
  for (let i = 0; i < text.length; i += 1) {
    h = (h * 31 + text.charCodeAt(i)) >>> 0;
  }
  return h;
}

function paletteForGame(game) {
  const genrePalettes = {
    action: [8, 18, 220],
    adventure: [185, 32, 48],
    rpg: [280, 22, 45],
    simulation: [155, 92, 206],
    strategy: [35, 12, 205],
    sports: [198, 118, 34]
  };

  const title = game.title.toLowerCase();
  if (title.includes("cyber") || title.includes("neon")) {
    return [302, 190, 212];
  }
  if (title.includes("desert") || title.includes("war")) {
    return [26, 8, 40];
  }
  if (title.includes("sky") || title.includes("sea") || title.includes("thieves")) {
    return [196, 162, 214];
  }

  return genrePalettes[game.genre] || [205, 145, 260];
}

function screenshotStyle(game, variant = 0) {
  const [baseA, baseB, baseC] = paletteForGame(game);
  const seed = hashSeed(`${game.id}:${variant}`);
  const hueA = (baseA + seed % 22) % 360;
  const hueB = (baseB + (seed >> 3) % 20) % 360;
  const hueC = (baseC + (seed >> 6) % 18) % 360;
  return `
    radial-gradient(circle at 16% 24%, hsla(${hueA}, 78%, 66%, 0.42), transparent 36%),
    radial-gradient(circle at 78% 64%, hsla(${hueB}, 76%, 54%, 0.38), transparent 42%),
    linear-gradient(135deg, hsl(${hueC}, 42%, 28%), hsl(${hueA}, 36%, 22%) 54%, hsl(${hueB}, 34%, 18%)),
    repeating-linear-gradient(-45deg, transparent, transparent 12px, rgba(255, 255, 255, 0.05) 12px, rgba(255, 255, 255, 0.05) 24px)
  `;
}

function loadSet(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function saveSet(key, setValue) {
  localStorage.setItem(key, JSON.stringify([...setValue]));
}

function totalForIds(ids) {
  return ids.reduce((sum, id) => {
    const game = gamesById.get(id);
    return game ? sum + discountPrice(game) : sum;
  }, 0);
}

function getLoggedInUsername() {
  return localStorage.getItem(AUTH_KEY) || "";
}

function isLoggedIn() {
  return Boolean(getLoggedInUsername());
}

function matchFilter(game, filter) {
  if (filter === "all") {
    return true;
  }

  if (["topSeller", "newRelease", "springSale", "trending"].includes(filter)) {
    return Boolean(game[filter]);
  }

  return game.genre === filter || game.tags.includes(filter);
}

function matchSearch(game, query) {
  if (!query) {
    return true;
  }

  const bag = `${game.title} ${game.genre} ${game.tags.join(" ")}`.toLowerCase();
  return bag.includes(query.toLowerCase());
}

function filteredGames() {
  return games.filter((game) => matchFilter(game, state.filter) && matchSearch(game, state.search));
}

function createCapsuleCard(game) {
  const article = document.createElement("article");
  article.className = "capsule";

  const art = document.createElement("div");
  art.className = "capsule-art";
  art.setAttribute("aria-hidden", "true");
  art.style.background = screenshotStyle(game, 1);

  const title = document.createElement("p");
  title.className = "capsule-title";
  title.textContent = game.title;

  const tags = document.createElement("p");
  tags.className = "capsule-tags";
  tags.textContent = `${formatGenre(game.genre)} • ${formatTags(game.tags)}`;

  const priceBar = document.createElement("div");
  priceBar.className = "price-bar";

  const discount = document.createElement("span");
  discount.className = "discount";
  discount.textContent = `-${game.discount}%`;

  const price = document.createElement("span");
  price.className = "price";
  price.textContent = formatMoney(discountPrice(game));

  const actions = document.createElement("div");
  actions.className = "capsule-actions";

  const wishBtn = document.createElement("button");
  wishBtn.type = "button";
  wishBtn.textContent = state.wishlist.has(game.id) ? "Wishlisted" : "Wishlist";
  wishBtn.disabled = state.library.has(game.id);
  wishBtn.dataset.action = "wishlist";
  wishBtn.dataset.id = game.id;

  const cartBtn = document.createElement("button");
  cartBtn.type = "button";
  cartBtn.className = "cart-priority";
  cartBtn.textContent = state.cart.has(game.id) ? "In Cart" : "Add Cart";
  cartBtn.disabled = state.library.has(game.id);
  cartBtn.dataset.action = "cart";
  cartBtn.dataset.id = game.id;

  const buyBtn = document.createElement("button");
  buyBtn.type = "button";
  buyBtn.className = "secondary-buy";
  buyBtn.textContent = state.library.has(game.id) ? "Owned" : "Buy Now";
  buyBtn.disabled = state.library.has(game.id);
  buyBtn.dataset.action = "buy";
  buyBtn.dataset.id = game.id;

  article.dataset.gameId = game.id;
  art.dataset.gameId = game.id;
  title.dataset.gameId = game.id;
  tags.dataset.gameId = game.id;

  actions.append(wishBtn, cartBtn, buyBtn);
  priceBar.append(discount, price);
  article.append(art, title, tags, priceBar, actions);
  return article;
}

function openGameDetail(gameId) {
  const game = gamesById.get(gameId);
  if (!game) {
    return;
  }
  window.location.href = `./game.html?id=${encodeURIComponent(game.id)}`;
}

function renderRow(targetId, data, maxItems) {
  const row = document.getElementById(targetId);
  if (!row) {
    return;
  }

  row.innerHTML = "";
  const list = data.slice(0, maxItems);

  if (!list.length) {
    const empty = document.createElement("p");
    empty.className = "empty-row";
    empty.textContent = "No games match this filter yet.";
    row.append(empty);
    return;
  }

  list.forEach((game) => {
    row.append(createCapsuleCard(game));
  });
}

function renderTopSellers(data) {
  const list = document.getElementById("topSellerList");
  if (!list) {
    return;
  }

  list.innerHTML = "";
  const sorted = [...data]
    .filter((game) => game.topSeller)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 20);

  if (!sorted.length) {
    const row = document.createElement("p");
    row.className = "empty-row";
    row.textContent = "No top sellers in this filter.";
    list.append(row);
    return;
  }

  sorted.forEach((game, index) => {
    const item = document.createElement("article");
    item.className = "seller-item";
    item.dataset.gameId = game.id;
    item.innerHTML = `
      <span class="seller-rank">#${index + 1}</span>
      <span class="seller-title">${game.title}</span>
      <span class="seller-genre">${formatGenre(game.genre)}</span>
      <span class="seller-rating">${game.rating}%</span>
      <span class="seller-price">${formatMoney(discountPrice(game))}</span>
    `;
    list.append(item);
  });
}

function renderOwnedList(targetId, ids, mode) {
  const list = document.getElementById(targetId);
  if (!list) {
    return;
  }

  if (mode === "library" && !isLoggedIn()) {
    list.innerHTML = "";
    return;
  }

  list.innerHTML = "";
  const collection = ids.map((id) => gamesById.get(id)).filter(Boolean);

  if (!collection.length) {
    const empty = document.createElement("p");
    empty.className = "empty-row";
    if (mode === "wishlist") {
      empty.textContent = "Wishlist is empty.";
    } else if (mode === "cart") {
      empty.textContent = "Cart is empty.";
    } else {
      empty.textContent = "Library is empty. Buy games to add them here.";
    }
    list.append(empty);
    return;
  }

  collection.forEach((game) => {
    const item = document.createElement("article");
    item.className = "owned-item";

    const title = document.createElement("span");
    title.className = "owned-title";
    title.textContent = game.title;

    const genre = document.createElement("span");
    genre.className = "owned-genre";
    genre.textContent = game.genre;

    const price = document.createElement("span");
    price.className = "owned-price";
    price.textContent = mode === "library" ? "Owned" : formatMoney(discountPrice(game));

    const action = document.createElement("button");
    action.type = "button";
    action.dataset.id = game.id;

    if (mode === "wishlist") {
      action.textContent = "Remove";
      action.dataset.action = "remove-wishlist";
    } else if (mode === "cart") {
      action.textContent = "Remove";
      action.dataset.action = "remove-cart";
    } else {
      action.textContent = "Play";
      action.disabled = true;
    }

    item.append(title, genre, price, action);
    list.append(item);
  });
}

function updateCommerceHud() {
  document.getElementById("wishlistCount").textContent = String(state.wishlist.size);
  document.getElementById("cartCount").textContent = String(state.cart.size);
  document.getElementById("libraryCount").textContent = isLoggedIn() ? String(state.library.size) : "Locked";
  const cartTotalValue = formatMoney(totalForIds([...state.cart]));
  document.getElementById("cartTotal").textContent = cartTotalValue;

  const globalCartCount = document.getElementById("globalCartCount");
  const globalCartTotal = document.getElementById("globalCartTotal");
  if (globalCartCount) {
    globalCartCount.textContent = String(state.cart.size);
  }
  if (globalCartTotal) {
    globalCartTotal.textContent = cartTotalValue;
  }
}

function renderAllRows() {
  const base = filteredGames();
  const lockNotice = document.getElementById("libraryLockNotice");

  renderRow(
    "specialOffersRow",
    base.filter((game) => game.springSale).sort((a, b) => b.discount - a.discount),
    12
  );

  renderRow(
    "trendingRow",
    base.filter((game) => game.trending).sort((a, b) => b.rating - a.rating),
    16
  );

  renderRow(
    "newReleasesRow",
    base.filter((game) => game.newRelease),
    16
  );

  renderTopSellers(base);
  renderOwnedList("wishlistList", [...state.wishlist], "wishlist");
  renderOwnedList("cartList", [...state.cart], "cart");
  renderOwnedList("libraryList", [...state.library], "library");

  if (lockNotice) {
    lockNotice.classList.toggle("hidden", isLoggedIn());
  }

  updateCommerceHud();
}

function updateCategoryButtons() {
  document.querySelectorAll(".category-link").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === state.filter);
  });
}

function updateFeatured(animated = true) {
  if (!featuredGames.length) {
    return;
  }

  if (animated && state.featuredAnimating) {
    return;
  }

  const token = ++state.featuredTransitionToken;
  const heroCard = document.querySelector(".hero-card");
  const applyCurrentFeatured = () => {
    if (token !== state.featuredTransitionToken) {
      return;
    }

    const game = featuredGames[state.featuredIndex % featuredGames.length];

    document.getElementById("featuredTitle").textContent = game.title;
    document.getElementById("featuredMeta").textContent = `${formatGenre(game.genre)} • ${formatTags(game.tags)}`;
    document.getElementById("featuredCaption").textContent = `Community rating: ${game.rating}% positive`;
    document.getElementById("featuredDiscount").textContent = `-${game.discount}%`;
    document.getElementById("featuredPrice").textContent = formatMoney(discountPrice(game));

    const featuredImage = document.getElementById("featuredImage");
    if (featuredImage) {
      featuredImage.style.background = screenshotStyle(game, 2);
    }

    const miniTiles = document.querySelectorAll(".mini-grid span");
    miniTiles.forEach((tile, index) => {
      tile.style.background = screenshotStyle(game, index + 3);
    });

    const dots = document.getElementById("featuredDots");
    dots.innerHTML = "";
    featuredGames.forEach((_, index) => {
      const dot = document.createElement("span");
      dot.classList.toggle("active", index === state.featuredIndex);
      dot.addEventListener("click", () => {
        state.featuredIndex = index;
        updateFeatured(true);
      });
      dots.append(dot);
    });
  };

  if (!animated) {
    applyCurrentFeatured();
    state.featuredAnimating = false;
    return;
  }

  if (!heroCard) {
    applyCurrentFeatured();
    state.featuredAnimating = false;
    return;
  }

  state.featuredAnimating = true;
  heroCard.classList.remove("is-prep-right", "is-sliding-in");
  heroCard.classList.add("is-sliding-out");

  setTimeout(() => {
    if (token !== state.featuredTransitionToken) {
      return;
    }

    applyCurrentFeatured();
    heroCard.classList.remove("is-sliding-out");
    heroCard.classList.add("is-prep-right");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        heroCard.classList.remove("is-prep-right");
        heroCard.classList.add("is-sliding-in");

        setTimeout(() => {
          if (token !== state.featuredTransitionToken) {
            return;
          }
          heroCard.classList.remove("is-sliding-in");
          state.featuredAnimating = false;
        }, 620);
      });
    });
  }, 260);
}

function updateCountdown() {
  const box = document.getElementById("saleCountdown");
  if (!box) {
    return;
  }

  const end = new Date();
  end.setDate(end.getDate() + 4);
  end.setHours(23, 0, 0, 0);

  function tick() {
    const now = new Date();
    const diff = Math.max(0, end.getTime() - now.getTime());
    const totalMinutes = Math.floor(diff / 60000);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    box.textContent = `${String(days).padStart(2, "0")}d : ${String(hours).padStart(2, "0")}h : ${String(minutes).padStart(2, "0")}m`;
  }

  tick();
  setInterval(tick, 30000);
}

function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

function openLoginModal() {
  openModal("loginModal");
  document.getElementById("usernameInput").focus();
}

function closeLoginModal() {
  closeModal("loginModal");
  const error = document.getElementById("loginError");
  error.classList.add("hidden");
  error.textContent = "";
}

function updateAuthUI() {
  const username = localStorage.getItem(AUTH_KEY) || "";
  const authLinks = document.getElementById("authLinks");
  const welcomeState = document.getElementById("welcomeState");
  const welcomeUser = document.getElementById("welcomeUser");

  if (username) {
    authLinks.classList.add("hidden");
    welcomeState.classList.remove("hidden");
    welcomeUser.textContent = username;
  } else {
    authLinks.classList.remove("hidden");
    welcomeState.classList.add("hidden");
    welcomeUser.textContent = "";
  }
}

function openCheckout(ids) {
  if (!isLoggedIn()) {
    openLoginModal();
    return;
  }

  if (!ids.length) {
    return;
  }

  state.checkoutIds = ids.filter((id) => gamesById.has(id) && !state.library.has(id));
  if (!state.checkoutIds.length) {
    return;
  }

  const paymentMethod = document.getElementById("paymentMethod");
  const paymentNumber = document.getElementById("paymentNumber");
  paymentMethod.value = "visa";
  paymentNumber.value = paymentPresets.visa;
  document.getElementById("billingName").value = "";

  const total = totalForIds(state.checkoutIds);
  document.getElementById("checkoutTotalText").textContent = `Total: ${formatMoney(total)}`;
  document.getElementById("checkoutError").classList.add("hidden");
  document.getElementById("checkoutError").textContent = "";

  openModal("checkoutModal");
}

function closeCheckout() {
  closeModal("checkoutModal");
  state.checkoutIds = [];
}

function setupAuthHandlers() {
  document.getElementById("loginTrigger").addEventListener("click", openLoginModal);
  document.getElementById("cancelLogin").addEventListener("click", closeLoginModal);

  document.getElementById("logoutTrigger").addEventListener("click", () => {
    localStorage.removeItem(AUTH_KEY);
    updateAuthUI();
    renderAllRows();
  });

  document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("usernameInput").value.trim();
    const error = document.getElementById("loginError");

    if (!username) {
      error.textContent = "Please enter a username.";
      error.classList.remove("hidden");
      return;
    }

    if (username.includes("@")) {
      error.textContent = "Username only. Email formats are not allowed.";
      error.classList.remove("hidden");
      return;
    }

    localStorage.setItem(AUTH_KEY, username);
    closeLoginModal();
    updateAuthUI();
    renderAllRows();
  });
}

function setupFeatureControls() {
  document.getElementById("featuredPrev").addEventListener("click", () => {
    state.featuredIndex = (state.featuredIndex - 1 + featuredGames.length) % featuredGames.length;
    updateFeatured(true);
  });

  document.getElementById("featuredNext").addEventListener("click", () => {
    state.featuredIndex = (state.featuredIndex + 1) % featuredGames.length;
    updateFeatured(true);
  });

  ["featuredImage", "featuredTitle", "featuredMeta", "featuredCaption", "featuredPrice"].forEach((id) => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }

    element.style.cursor = "pointer";
    element.addEventListener("click", () => {
      const current = featuredGames[state.featuredIndex % featuredGames.length];
      if (current) {
        openGameDetail(current.id);
      }
    });
  });

  setInterval(() => {
    state.featuredIndex = (state.featuredIndex + 1) % featuredGames.length;
    updateFeatured(true);
  }, 9200);
}

function setupFilters() {
  document.querySelectorAll(".category-link").forEach((button) => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter || "all";
      updateCategoryButtons();
      renderAllRows();
    });
  });

  document.getElementById("globalSearch").addEventListener("input", (event) => {
    state.search = event.target.value.trim();
    renderAllRows();
  });
}

function setupCommerceActions() {
  ["specialOffersRow", "trendingRow", "newReleasesRow"].forEach((rowId) => {
    const row = document.getElementById(rowId);
    row.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) {
        return;
      }

      const gameId = button.dataset.id;
      if (!gamesById.has(gameId)) {
        return;
      }

      const action = button.dataset.action;
      if (action === "wishlist") {
        if (state.wishlist.has(gameId)) {
          state.wishlist.delete(gameId);
        } else {
          state.wishlist.add(gameId);
        }
        saveSet(WISHLIST_KEY, state.wishlist);
      }

      if (action === "cart") {
        if (state.cart.has(gameId)) {
          state.cart.delete(gameId);
        } else {
          state.cart.add(gameId);
        }
        saveSet(CART_KEY, state.cart);
      }

      if (action === "buy") {
        openCheckout([gameId]);
      }

      renderAllRows();
    });

    row.addEventListener("click", (event) => {
      if (event.target.closest("button[data-action]")) {
        return;
      }

      const card = event.target.closest("[data-game-id]");
      if (!card) {
        return;
      }

      openGameDetail(card.dataset.gameId);
    });
  });

  document.getElementById("wishlistList").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action='remove-wishlist']");
    if (!button) {
      return;
    }
    state.wishlist.delete(button.dataset.id);
    saveSet(WISHLIST_KEY, state.wishlist);
    renderAllRows();
  });

  document.getElementById("cartList").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action='remove-cart']");
    if (!button) {
      return;
    }
    state.cart.delete(button.dataset.id);
    saveSet(CART_KEY, state.cart);
    renderAllRows();
  });

  document.getElementById("clearWishlist").addEventListener("click", () => {
    state.wishlist.clear();
    saveSet(WISHLIST_KEY, state.wishlist);
    renderAllRows();
  });

  document.getElementById("clearCart").addEventListener("click", () => {
    state.cart.clear();
    saveSet(CART_KEY, state.cart);
    renderAllRows();
  });

  document.getElementById("openCheckout").addEventListener("click", () => {
    openCheckout([...state.cart]);
  });

  document.getElementById("topSellerList").addEventListener("click", (event) => {
    const item = event.target.closest(".seller-item");
    if (!item) {
      return;
    }

    openGameDetail(item.dataset.gameId);
  });
}

function setupCheckout() {
  const paymentMethod = document.getElementById("paymentMethod");
  const paymentNumber = document.getElementById("paymentNumber");

  paymentNumber.value = paymentPresets.visa;

  paymentMethod.addEventListener("change", () => {
    paymentNumber.value = paymentPresets[paymentMethod.value] || paymentPresets.visa;
  });

  document.getElementById("cancelCheckout").addEventListener("click", closeCheckout);

  document.getElementById("checkoutForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const billingName = document.getElementById("billingName").value.trim();
    const error = document.getElementById("checkoutError");

    if (!billingName) {
      error.textContent = "Please provide a billing name.";
      error.classList.remove("hidden");
      return;
    }

    state.checkoutIds.forEach((id) => {
      state.library.add(id);
      state.cart.delete(id);
      state.wishlist.delete(id);
    });

    saveSet(LIBRARY_KEY, state.library);
    saveSet(CART_KEY, state.cart);
    saveSet(WISHLIST_KEY, state.wishlist);

    closeCheckout();
    renderAllRows();
  });
}

function loadStoreState() {
  state.wishlist = loadSet(WISHLIST_KEY);
  state.cart = loadSet(CART_KEY);
  state.library = loadSet(LIBRARY_KEY);
}

function init() {
  loadStoreState();
  updateAuthUI();
  setupAuthHandlers();
  setupFeatureControls();
  setupFilters();
  setupCommerceActions();
  setupCheckout();
  updateCategoryButtons();
  updateFeatured(false);
  updateCountdown();
  renderAllRows();
}

document.addEventListener("DOMContentLoaded", init);
