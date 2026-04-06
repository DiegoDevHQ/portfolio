const WISHLIST_KEY = "steemstore.wishlist";
const CART_KEY = "steemstore.cart";
const LIBRARY_KEY = "steemstore.library";
const AUTH_KEY = "steemstore.auth.username";

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
    rating: 80 + ((index * 3) % 20)
  };
});

const gamesById = new Map(games.map((game) => [game.id, game]));

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

function discountPrice(game) {
  return game.price * (1 - game.discount / 100);
}

function formatMoney(value) {
  return `$${value.toFixed(2)}`;
}

function updateGlobalCart(cart) {
  const count = document.getElementById("globalCartCount");
  const total = document.getElementById("globalCartTotal");
  const cartIds = [...cart];
  const totalValue = cartIds.reduce((sum, id) => {
    const game = gamesById.get(id);
    return game ? sum + discountPrice(game) : sum;
  }, 0);

  if (count) {
    count.textContent = String(cart.size);
  }

  if (total) {
    total.textContent = formatMoney(totalValue);
  }
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
    radial-gradient(circle at 18% 24%, hsla(${hueA}, 78%, 66%, 0.42), transparent 36%),
    radial-gradient(circle at 76% 58%, hsla(${hueB}, 76%, 54%, 0.38), transparent 42%),
    linear-gradient(130deg, hsl(${hueC}, 42%, 28%), hsl(${hueA}, 36%, 22%) 55%, hsl(${hueB}, 34%, 18%)),
    repeating-linear-gradient(-45deg, transparent, transparent 12px, rgba(255, 255, 255, 0.05) 12px, rgba(255, 255, 255, 0.05) 24px)
  `;
}

function getSelectedGame() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || "";
  return gamesById.get(id);
}

function init() {
  const game = getSelectedGame();
  if (!game) {
    document.getElementById("gameTitle").textContent = "Game Not Found";
    document.getElementById("statusText").textContent = "Return to store and open a valid game.";
    document.getElementById("wishlistBtn").disabled = true;
    document.getElementById("cartBtn").disabled = true;
    document.getElementById("buyBtn").disabled = true;
    return;
  }

  const wishlist = loadSet(WISHLIST_KEY);
  const cart = loadSet(CART_KEY);
  const library = loadSet(LIBRARY_KEY);
  updateGlobalCart(cart);

  const gameTitle = document.getElementById("gameTitle");
  const crumbGame = document.getElementById("crumbGame");
  const gameMeta = document.getElementById("gameMeta");
  const shortDescription = document.getElementById("shortDescription");
  const allReviewLabelText = document.getElementById("allReviewLabel");
  const allReviewCount = document.getElementById("allReviewCount");
  const releaseDate = document.getElementById("releaseDate");
  const developerName = document.getElementById("developerName");
  const publisherName = document.getElementById("publisherName");
  const aboutText = document.getElementById("aboutText");
  const reviewStarsText = document.getElementById("reviewStars");
  const reviewLabelText = document.getElementById("reviewLabel");
  const reviewSummary = document.getElementById("reviewSummary");
  const gamePrice = document.getElementById("gamePrice");
  const wishlistBtn = document.getElementById("wishlistBtn");
  const cartBtn = document.getElementById("cartBtn");
  const buyBtn = document.getElementById("buyBtn");
  const statusText = document.getElementById("statusText");

  const gameArt = document.getElementById("gameArt");

  const gameIndex = games.findIndex((item) => item.id === game.id);
  const releaseYear = 2021 + (gameIndex % 5);
  const releaseMonth = (gameIndex % 12) + 1;
  const releaseDay = ((gameIndex * 2) % 28) + 1;
  const votes = 11000 + gameIndex * 837;

  gameTitle.textContent = game.title;
  crumbGame.textContent = game.title;
  gameMeta.textContent = `${game.genre.toUpperCase()} • ${game.tags.join(" • ")}`;
  shortDescription.textContent = `${game.title} is a ${game.genre}-focused experience with ${game.tags.join(", ")} gameplay elements and online community features.`;
  reviewStarsText.textContent = reviewStars(game.rating);
  reviewLabelText.textContent = reviewLabel(game.rating);
  allReviewLabelText.textContent = reviewLabel(game.rating);
  allReviewCount.textContent = `(${votes.toLocaleString()} reviews)`;
  reviewSummary.textContent = `Recent Reviews: ${reviewLabel(game.rating)} (${game.rating}% positive from ${Math.floor(votes * 0.2).toLocaleString()} recent reviews)`;
  gamePrice.textContent = formatMoney(discountPrice(game));
  releaseDate.textContent = `${releaseMonth}/${releaseDay}/${releaseYear}`;
  developerName.textContent = `${game.title.split(" ")[0]} Studio`;
  publisherName.textContent = `${game.title.split(" ")[0]} Publishing`;
  aboutText.textContent = `Jump into ${game.title} with action-packed sessions, player progression systems, and replayable game modes. This storefront prototype models the Steam-style detail page composition with purchase actions and review sentiment snapshots.`;
  gameArt.style.background = screenshotStyle(game, 0);

  const thumbs = document.querySelectorAll(".thumb-strip span");
  thumbs.forEach((thumb, index) => {
    thumb.style.background = screenshotStyle(game, index + 1);
  });

  function refreshButtons() {
    if (library.has(game.id)) {
      wishlistBtn.textContent = "Owned";
      cartBtn.textContent = "Owned";
      buyBtn.textContent = "Owned";
      wishlistBtn.disabled = true;
      cartBtn.disabled = true;
      buyBtn.disabled = true;
      return;
    }

    if (!localStorage.getItem(AUTH_KEY)) {
      buyBtn.textContent = "Sign In to Buy";
      return;
    }

    wishlistBtn.disabled = false;
    cartBtn.disabled = false;
    buyBtn.disabled = false;
    wishlistBtn.textContent = wishlist.has(game.id) ? "Wishlisted" : "Add to Wishlist";
    cartBtn.textContent = cart.has(game.id) ? "In Cart" : "Add to Cart";
    buyBtn.textContent = "Buy Now";
  }

  wishlistBtn.addEventListener("click", () => {
    if (wishlist.has(game.id)) {
      wishlist.delete(game.id);
      statusText.textContent = "Removed from wishlist.";
    } else {
      wishlist.add(game.id);
      statusText.textContent = "Added to wishlist.";
    }
    saveSet(WISHLIST_KEY, wishlist);
    refreshButtons();
  });

  cartBtn.addEventListener("click", () => {
    if (cart.has(game.id)) {
      cart.delete(game.id);
      statusText.textContent = "Removed from cart.";
    } else {
      cart.add(game.id);
      statusText.textContent = "Added to cart.";
    }
    saveSet(CART_KEY, cart);
    updateGlobalCart(cart);
    refreshButtons();
  });

  buyBtn.addEventListener("click", () => {
    if (!localStorage.getItem(AUTH_KEY)) {
      statusText.textContent = "Please sign in on the store page to access and add to your library.";
      refreshButtons();
      return;
    }

    library.add(game.id);
    cart.delete(game.id);
    wishlist.delete(game.id);
    saveSet(LIBRARY_KEY, library);
    saveSet(CART_KEY, cart);
    saveSet(WISHLIST_KEY, wishlist);
    updateGlobalCart(cart);
    statusText.textContent = "Purchase complete. Game added to your library.";
    refreshButtons();
  });

  refreshButtons();
}

document.addEventListener("DOMContentLoaded", init);
