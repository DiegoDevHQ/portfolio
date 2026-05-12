const categories = [
  "All",
  "Gaming",
  "Music",
  "Coding",
  "Podcasts",
  "AI",
  "Live",
  "Design",
  "Recently uploaded"
];

const subscriptions = [
  { name: "Build Better", color: "#ff6b6b" },
  { name: "CodeCraft", color: "#4dabf7" },
  { name: "WaveRoom", color: "#845ef7" },
  { name: "Level Break", color: "#51cf66" },
  { name: "Neural Nest", color: "#ffa94d" }
];

const shorts = [
  { title: "The cleanest setup transition this month", creator: "Build Better", views: "2.1M views", color: "linear-gradient(180deg,#5f0a87,#a4508b)" },
  { title: "Five UI tricks that make apps feel premium", creator: "Design Pulse", views: "811K views", color: "linear-gradient(180deg,#232526,#414345)" },
  { title: "How creators script perfect openings", creator: "Longform Lab", views: "1.4M views", color: "linear-gradient(180deg,#134e5e,#71b280)" },
  { title: "A one-minute breakdown of agent memory", creator: "Neural Nest", views: "967K views", color: "linear-gradient(180deg,#141e30,#243b55)" }
];

const videos = [
  {
    id: "workspace-redesign",
    title: "Designing a Hyper-Clean Workspace in 30 Minutes",
    channel: "Build Better",
    subscribers: "4.3M subscribers",
    views: "1.2M views",
    age: "3 days ago",
    category: "Design",
    thumb: "linear-gradient(135deg,#2b2d42,#8d99ae)",
    avatarColor: "#ff6b6b",
    duration: "18:02",
    verified: true,
    live: false,
    reactions: "48K",
    description: "We rebuild a cluttered creator desk into a studio-grade workspace, dialing in lighting, shot composition, and desk flow so the entire setup feels intentional on camera and off.",
    comments: [
      { author: "Maya Lin", avatar: "#748ffc", text: "This pacing feels close to the real platform, especially the way the ideas land fast." },
      { author: "Devon R", avatar: "#69db7c", text: "The before-and-after framing makes the whole video easy to stay with." }
    ],
    related: ["agent-live", "vim-motion", "js-performance"]
  },
  {
    id: "js-performance",
    title: "The JavaScript Performance Tricks Nobody Talks About",
    channel: "CodeCraft",
    subscribers: "1.1M subscribers",
    views: "898K views",
    age: "1 week ago",
    category: "Coding",
    thumb: "linear-gradient(135deg,#141e30,#243b55)",
    avatarColor: "#4dabf7",
    duration: "14:47",
    verified: true,
    live: false,
    reactions: "35K",
    description: "A practical walkthrough of event delegation, layout stability, image loading strategy, and the tiny choices that compound into faster interfaces.",
    comments: [
      { author: "Tori K", avatar: "#f783ac", text: "The examples are simple enough to steal for real apps immediately." },
      { author: "Samir", avatar: "#ffd43b", text: "You finally explained jank in a way that clicked." }
    ],
    related: ["vim-motion", "agent-guide", "workspace-redesign"]
  },
  {
    id: "focus-lofi",
    title: "Ambient Lo-Fi for Deep Focus",
    channel: "WaveRoom",
    subscribers: "7.8M subscribers",
    views: "5.6M views",
    age: "2 months ago",
    category: "Music",
    thumb: "linear-gradient(135deg,#614385,#516395)",
    avatarColor: "#845ef7",
    duration: "1:05:16",
    verified: true,
    live: false,
    reactions: "112K",
    description: "A long-form focus session with subtle visual motion and a mix tuned for study blocks, quiet coding, and late-night design sprints.",
    comments: [
      { author: "Nina", avatar: "#20c997", text: "This would absolutely sit on the real site as a background-focus staple." },
      { author: "Luca", avatar: "#fcc419", text: "The gradient art makes the player preview feel premium." }
    ],
    related: ["podcast-creators", "workspace-redesign", "agent-guide"]
  },
  {
    id: "indie-vs-aaa",
    title: "Can Indie Devs Beat AAA in 2026?",
    channel: "Level Break",
    subscribers: "2.7M subscribers",
    views: "437K views",
    age: "4 days ago",
    category: "Gaming",
    thumb: "linear-gradient(135deg,#1f4037,#99f2c8)",
    avatarColor: "#51cf66",
    duration: "22:09",
    verified: false,
    live: false,
    reactions: "19K",
    description: "A comparison of production value, speed, originality, and community loyalty between indie teams and modern blockbuster studios.",
    comments: [
      { author: "Arlo", avatar: "#ffa94d", text: "The title and metadata feel much closer to a real recommendation row now." },
      { author: "Gwen", avatar: "#74c0fc", text: "Good balance between debate and actual analysis." }
    ],
    related: ["agent-live", "workspace-redesign", "focus-lofi"]
  },
  {
    id: "agent-live",
    title: "Live: Building an AI Agent in Public",
    channel: "StreamForge",
    subscribers: "603K subscribers",
    views: "302K watching",
    age: "Live now",
    category: "Live",
    thumb: "linear-gradient(135deg,#ff512f,#dd2476)",
    avatarColor: "#ff6b6b",
    duration: "LIVE",
    verified: true,
    live: true,
    reactions: "12K",
    description: "A live build sprint where the architecture changes in real time, bugs get fixed on stream, and viewers push the direction of the product.",
    comments: [
      { author: "Milo", avatar: "#b197fc", text: "The live badge and side recommendations are much closer to the actual viewing flow." },
      { author: "Rene", avatar: "#63e6be", text: "I like that the watch modal finally feels like a destination instead of a popup." }
    ],
    related: ["agent-guide", "js-performance", "vim-motion"]
  },
  {
    id: "podcast-creators",
    title: "Podcast: How Top Creators Actually Stay Consistent",
    channel: "Longform Lab",
    subscribers: "826K subscribers",
    views: "211K views",
    age: "5 days ago",
    category: "Podcasts",
    thumb: "linear-gradient(135deg,#134e5e,#71b280)",
    avatarColor: "#63e6be",
    duration: "49:20",
    verified: false,
    live: false,
    reactions: "7.8K",
    description: "A long conversation about systems, burnout prevention, audience trust, and the behind-the-scenes habits that keep publishing sustainable.",
    comments: [
      { author: "Parker", avatar: "#ffa8a8", text: "Feels like something I would click after a creator documentary." },
      { author: "Ivy", avatar: "#91a7ff", text: "Love the watch layout and the stronger content grouping." }
    ],
    related: ["focus-lofi", "workspace-redesign", "agent-guide"]
  },
  {
    id: "agent-guide",
    title: "Agentic AI for Beginners: A Complete Visual Guide",
    channel: "Neural Nest",
    subscribers: "3.2M subscribers",
    views: "1.9M views",
    age: "2 weeks ago",
    category: "AI",
    thumb: "linear-gradient(135deg,#16222a,#3a6073)",
    avatarColor: "#ffa94d",
    duration: "27:11",
    verified: true,
    live: false,
    reactions: "64K",
    description: "A visual-first explanation of tool calling, memory, planning, and guardrails for people trying to understand what agentic products actually do.",
    comments: [
      { author: "Sage", avatar: "#94d82d", text: "This feels like a real high-performing educational thumbnail and metadata combo." },
      { author: "Kai", avatar: "#74c0fc", text: "Good call making the side rail context-aware." }
    ],
    related: ["agent-live", "js-performance", "workspace-redesign"]
  },
  {
    id: "vim-motion",
    title: "From Zero to Productive in Vim Motions",
    channel: "Terminal Crew",
    subscribers: "512K subscribers",
    views: "620K views",
    age: "9 days ago",
    category: "Coding",
    thumb: "linear-gradient(135deg,#200122,#6f0000)",
    avatarColor: "#ff8787",
    duration: "16:33",
    verified: false,
    live: false,
    reactions: "26K",
    description: "A beginner-friendly walkthrough that focuses on the three motion groups you actually need first, without throwing ten plugins at the problem.",
    comments: [
      { author: "Dae", avatar: "#66d9e8", text: "This is exactly the sort of card that would show up beside a coding watch page." },
      { author: "Noor", avatar: "#ffd8a8", text: "The feed is much more believable with the extra metadata and avatars." }
    ],
    related: ["js-performance", "agent-guide", "workspace-redesign"]
  }
];

const chipsEl = document.getElementById("chips");
const shortsRailEl = document.getElementById("shortsRail");
const subListEl = document.getElementById("subList");
const gridEl = document.getElementById("videoGrid");
const feedTitleEl = document.getElementById("feedTitle");
const feedMetaEl = document.getElementById("feedMeta");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const voiceBtn = document.getElementById("voiceBtn");
const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");

const playerModal = document.getElementById("playerModal");
const closeModal = document.getElementById("closeModal");
const playerFrame = document.getElementById("playerFrame");
const playerTitle = document.getElementById("playerTitle");
const playerStats = document.getElementById("playerStats");
const playerChannel = document.getElementById("playerChannel");
const playerActions = document.getElementById("playerActions");
const playerMeta = document.getElementById("playerMeta");
const playerDescription = document.getElementById("playerDescription");
const commentCount = document.getElementById("commentCount");
const commentsList = document.getElementById("commentsList");
const relatedList = document.getElementById("relatedList");

let selectedCategory = "All";
let searchTerm = "";

function initials(value) {
  return value
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function isMobile() {
  return window.innerWidth < 980;
}

function renderSubscriptions() {
  subListEl.innerHTML = "";
  subscriptions.forEach((sub) => {
    const item = document.createElement("button");
    item.className = "sub-item";
    item.innerHTML = `
      <span class="sub-avatar" style="background:${sub.color}">${initials(sub.name)}</span>
      <span>${sub.name}</span>
    `;
    item.addEventListener("click", () => {
      searchInput.value = sub.name;
      searchTerm = sub.name;
      renderVideos();
    });
    subListEl.appendChild(item);
  });
}

function renderChips() {
  chipsEl.innerHTML = "";
  categories.forEach((cat) => {
    const chip = document.createElement("button");
    chip.className = "chip" + (cat === selectedCategory ? " active" : "");
    chip.textContent = cat;
    chip.addEventListener("click", () => {
      selectedCategory = cat;
      renderChips();
      renderVideos();
    });
    chipsEl.appendChild(chip);
  });
}

function renderShorts() {
  shortsRailEl.innerHTML = "";
  shorts.forEach((short) => {
    const card = document.createElement("article");
    card.className = "short-card";
    card.style.background = short.color;
    card.innerHTML = `
      <div class="short-content">
        <h3 class="short-title">${short.title}</h3>
        <p class="short-meta">${short.creator} · ${short.views}</p>
      </div>
    `;
    card.addEventListener("click", () => {
      const match = videos.find((video) => video.channel === short.creator) || videos[0];
      openVideo(match);
    });
    shortsRailEl.appendChild(card);
  });
}

function filteredVideos() {
  return videos.filter((video) => {
    const byCategory = selectedCategory === "All" || video.category === selectedCategory;
    const haystack = `${video.title} ${video.channel} ${video.category}`.toLowerCase();
    const bySearch = haystack.includes(searchTerm.toLowerCase());
    return byCategory && bySearch;
  });
}

function renderFeedHeading(listLength) {
  if (searchTerm) {
    feedTitleEl.textContent = `Results for "${searchTerm}"`;
    feedMetaEl.textContent = `${listLength} matching videos across creators and categories.`;
    return;
  }

  if (selectedCategory !== "All") {
    feedTitleEl.textContent = selectedCategory;
    feedMetaEl.textContent = `Fresh picks in ${selectedCategory.toLowerCase()} with cleaner discovery cues.`;
    return;
  }

  feedTitleEl.textContent = "Recommended";
  feedMetaEl.textContent = "Personalized picks with a stronger browse-to-watch flow.";
}

function relatedVideos(video) {
  const explicit = video.related
    .map((id) => videos.find((item) => item.id === id))
    .filter(Boolean);

  if (explicit.length) {
    return explicit;
  }

  return videos.filter((item) => item.id !== video.id && item.category === video.category).slice(0, 4);
}

function openVideo(video) {
  playerFrame.innerHTML = `
    <div class="player-art" style="background:${video.thumb}">
      <div class="player-overlay">
        <span class="player-pill">${video.live ? "LIVE STREAM" : `Preview ${video.duration}`}</span>
        <p>${video.channel} theater view with focused recommendations.</p>
      </div>
    </div>
  `;

  playerTitle.textContent = video.title;
  playerStats.textContent = `${video.views} · ${video.age}`;

  playerChannel.innerHTML = `
    <div class="channel-avatar" style="background:${video.avatarColor}">${initials(video.channel)}</div>
    <div class="channel-copy">
      <strong>${video.channel}${video.verified ? " · Verified" : ""}</strong>
      <span class="sub-copy">${video.subscribers}</span>
    </div>
    <button class="subscribe-btn">Subscribe</button>
  `;

  playerActions.innerHTML = `
    <button class="action-pill">Like ${video.reactions}</button>
    <button class="action-pill">Share</button>
    <button class="action-pill">Save</button>
  `;

  playerMeta.textContent = `${video.channel} · ${video.views} · ${video.age}`;
  playerDescription.textContent = video.description;
  commentCount.textContent = `${video.comments.length} featured responses`;

  commentsList.innerHTML = "";
  video.comments.forEach((comment) => {
    const item = document.createElement("article");
    item.className = "comment";
    item.innerHTML = `
      <div class="comment-avatar" style="background:${comment.avatar}">${initials(comment.author)}</div>
      <div>
        <strong>${comment.author}</strong>
        <p>${comment.text}</p>
      </div>
    `;
    commentsList.appendChild(item);
  });

  relatedList.innerHTML = "";
  relatedVideos(video).forEach((item) => {
    const card = document.createElement("article");
    card.className = "related-card";
    card.innerHTML = `
      <div class="related-thumb" style="background:${item.thumb}"></div>
      <div>
        <h4 class="related-title">${item.title}</h4>
        <p class="related-meta">${item.channel}</p>
        <p class="related-meta">${item.views} · ${item.age}</p>
      </div>
    `;
    card.addEventListener("click", () => openVideo(item));
    relatedList.appendChild(card);
  });

  playerModal.showModal();
}

function renderVideos() {
  const list = filteredVideos();
  renderFeedHeading(list.length);
  gridEl.innerHTML = "";

  if (!list.length) {
    gridEl.innerHTML = "<p>No results found. Try a broader search or another category.</p>";
    return;
  }

  list.forEach((video) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="thumb-wrap">
        <div class="thumb" style="background:${video.thumb}"></div>
        ${video.live ? '<span class="live-badge">LIVE</span>' : `<span class="duration">${video.duration}</span>`}
      </div>
      <div class="card-body">
        <div class="video-avatar" style="background:${video.avatarColor}">${initials(video.channel)}</div>
        <div>
          <h3 class="title">${video.title}</h3>
          <p class="meta-line">${video.channel}${video.verified ? " · Verified" : ""}</p>
          <p class="meta-line">${video.views} · ${video.age}</p>
        </div>
        <div class="more">...</div>
      </div>
    `;
    card.addEventListener("click", () => openVideo(video));
    gridEl.appendChild(card);
  });
}

searchBtn.addEventListener("click", () => {
  searchTerm = searchInput.value.trim();
  renderVideos();
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchTerm = searchInput.value.trim();
    renderVideos();
  }
});

voiceBtn.addEventListener("click", () => {
  searchInput.placeholder = "Voice search is demo-only. Try typing a topic.";
  searchInput.focus();
});

menuBtn.addEventListener("click", () => {
  if (isMobile()) {
    sidebar.classList.toggle("open");
  } else {
    sidebar.classList.toggle("compact");
  }
});

document.querySelectorAll(".nav-link").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

closeModal.addEventListener("click", () => playerModal.close());

renderSubscriptions();
renderChips();
renderShorts();
renderVideos();
