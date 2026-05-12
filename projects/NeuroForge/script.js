const API_BASE = "http://127.0.0.1:8008";
const HISTORY_KEY = "neuroforge-history";
const RUNTIME_SOURCE_KEY = "neuroforge-runtime-source";
const LOCAL_MODEL_KEY = "neuroforge-local-model";
const WEBLLM_IMPORT_URL = "https://esm.run/@mlc-ai/web-llm";
const rootEl = document.documentElement;

const LOCAL_MODELS = [
  { id: "SmolLM2-1.7B-Instruct-q4f16_1-MLC", name: "SmolLM2 1.7B", size: "~1.1 GB", quality: "Basic", minTier: 1, desc: "Fastest option for lighter hardware." },
  { id: "gemma-2-2b-it-q4f16_1-MLC", name: "Gemma 2 2B", size: "~1.5 GB", quality: "Good", minTier: 1, desc: "A balanced lightweight model for local strategy passes." },
  { id: "Phi-3.5-mini-instruct-q4f16_1-MLC", name: "Phi-3.5 Mini", size: "~2.2 GB", quality: "Very Good", minTier: 2, desc: "Best all-round local model for structured generation." },
  { id: "Llama-3.2-3B-Instruct-q4f32_1-MLC", name: "Llama 3.2 3B", size: "~2.0 GB", quality: "Very Good", minTier: 2, desc: "Strong local reasoning with solid speed." },
  { id: "Llama-3.1-8B-Instruct-q4f32_1-MLC", name: "Llama 3.1 8B", size: "~5.0 GB", quality: "Excellent", minTier: 3, desc: "Highest quality local option for stronger GPUs." }
];

const TIERS = {
  3: { label: "Verified", detail: "Runs the best local models smoothly.", status: "online" },
  2: { label: "Playable", detail: "Runs good local models with solid performance.", status: "ready" },
  1: { label: "Minimum", detail: "Lighter local models only. Expect slower generation.", status: "ready" },
  0: { label: "Unavailable", detail: "Local WebLLM needs WebGPU plus a secure browser context.", status: "offline" }
};

const promptEl = document.getElementById("prompt");
const modeEl = document.getElementById("mode");
const toneEl = document.getElementById("tone");
const audienceEl = document.getElementById("audience");
const depthEl = document.getElementById("depth");
const runSourceEl = document.getElementById("runSource");
const localModelEl = document.getElementById("localModel");

const titleEl = document.getElementById("title");
const summaryEl = document.getElementById("summary");
const scoreEl = document.getElementById("score");
const feasibilityEl = document.getElementById("feasibility");
const launchEnergyEl = document.getElementById("launchEnergy");
const runtimeModeMetricEl = document.getElementById("runtimeModeMetric");
const scoreDetailEl = document.getElementById("scoreDetail");
const resultNarrativeEl = document.getElementById("resultNarrative");

const conceptListEl = document.getElementById("conceptList");
const executionListEl = document.getElementById("executionList");
const actionListEl = document.getElementById("actionList");
const riskListEl = document.getElementById("riskList");
const nextPromptsEl = document.getElementById("nextPrompts");
const historyListEl = document.getElementById("historyList");
const insightChipsEl = document.getElementById("insightChips");
const sampleListEl = document.getElementById("sampleList");
const runtimeInsightListEl = document.getElementById("runtimeInsightList");
const runtimeDiagMetaEl = document.getElementById("runtimeDiagMeta");

const statusPillEl = document.getElementById("statusPill");
const statusTextEl = document.getElementById("statusText");
const localPillEl = document.getElementById("localPill");
const localTextEl = document.getElementById("localText");
const localMetaEl = document.getElementById("localMeta");
const runtimeTierEl = document.getElementById("runtimeTier");
const runtimeGpuEl = document.getElementById("runtimeGpu");
const runtimeRecommendedEl = document.getElementById("runtimeRecommended");

const runBtn = document.getElementById("runBtn");
const sampleBtn = document.getElementById("sampleBtn");
const clearBtn = document.getElementById("clearBtn");
const loadModelBtn = document.getElementById("loadModelBtn");
const modelHintEl = document.getElementById("modelHint");
const modelProgressFillEl = document.getElementById("modelProgressFill");
const modelProgressTextEl = document.getElementById("modelProgressText");

const samples = [
  {
    prompt: "Turn a note-taking app into a social challenge platform for students who want to study together asynchronously.",
    mode: "invent",
    tone: "playful"
  },
  {
    prompt: "Create a portable productivity dashboard for remote teams that works well during low-bandwidth travel.",
    mode: "improve",
    tone: "professional"
  },
  {
    prompt: "Design an AI tutor for students with low bandwidth internet and strong progress accountability.",
    mode: "pitch",
    tone: "bold"
  },
  {
    prompt: "Outline a full-stack build plan for a creator analytics tool that converts video performance into action checklists.",
    mode: "code",
    tone: "technical"
  }
];

let runtimeInfo = null;
let webllmModule = null;
let localEngine = null;
let loadedModelId = null;
let loadingModel = false;
let pendingProgress = null;
let progressFrameId = 0;

const performanceHints = {
  lowMemory: typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 8,
  lowThreads: typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 8,
  reducedMotion: typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
};

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function setHistory(items) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 8)));
}

function getSelectedModel() {
  return LOCAL_MODELS.find((model) => model.id === localModelEl.value) || LOCAL_MODELS[0];
}

function setStatus(kind, text, detail) {
  statusPillEl.className = `status-pill ${kind}`;
  statusPillEl.textContent = text;
  statusTextEl.textContent = detail;
}

function setLocalStatus(kind, text, detail) {
  localPillEl.className = `status-pill ${kind}`;
  localPillEl.textContent = text;
  localTextEl.textContent = detail;
}

function renderBulletList(target, items) {
  if (!items.length) {
    target.innerHTML = "";
    return;
  }

  const fragment = document.createDocumentFragment();
  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "bullet-item";
    if (typeof item === "string") {
      row.innerHTML = `<div>${item}</div>`;
    } else {
      row.innerHTML = `<strong>${item.label}</strong><div>${item.text}</div>`;
    }
    fragment.appendChild(row);
  });
  target.replaceChildren(fragment);
}

function renderStackList(target, items, clickable = false) {
  if (!items.length) {
    target.innerHTML = "<div class=\"bullet-item\">Nothing here yet.</div>";
    return;
  }

  const fragment = document.createDocumentFragment();
  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "stack-item";
    row.innerHTML = typeof item === "string"
      ? `<div>${item}</div>`
      : `<strong>${item.title}</strong><div>${item.meta}</div>`;

    if (clickable && typeof item !== "string") {
      row.addEventListener("click", () => {
        promptEl.value = item.prompt;
        modeEl.value = item.mode;
        toneEl.value = item.tone;
        audienceEl.value = item.audience || "consumer";
        depthEl.value = item.depth || "detailed";
      });
    }

    fragment.appendChild(row);
  });
  target.replaceChildren(fragment);
}

function renderInsightChips(items) {
  if (!items.length) {
    insightChipsEl.innerHTML = "";
    return;
  }

  const fragment = document.createDocumentFragment();
  items.forEach((item) => {
    const chip = document.createElement("span");
    chip.className = "insight-chip";
    chip.textContent = item;
    fragment.appendChild(chip);
  });
  insightChipsEl.replaceChildren(fragment);
}

function renderHistory() {
  renderStackList(historyListEl, getHistory(), true);
}

function pushHistory(entry) {
  const history = getHistory();
  history.unshift(entry);
  setHistory(history);
  renderHistory();
}

function loadSample(sample) {
  promptEl.value = sample.prompt;
  modeEl.value = sample.mode;
  toneEl.value = sample.tone;
}

function renderSamples() {
  const fragment = document.createDocumentFragment();
  samples.forEach((sample) => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.textContent = sample.prompt.slice(0, 48) + (sample.prompt.length > 48 ? "..." : "");
    chip.addEventListener("click", () => loadSample(sample));
    fragment.appendChild(chip);
  });
  sampleListEl.replaceChildren(fragment);
}

function flushProgress() {
  progressFrameId = 0;
  if (!pendingProgress) {
    return;
  }

  modelProgressFillEl.style.width = `${pendingProgress.progress}%`;
  modelProgressTextEl.textContent = pendingProgress.text;
}

function setProgress(progress, text) {
  pendingProgress = {
    progress: Math.max(0, Math.min(100, progress)),
    text
  };

  if (progressFrameId) {
    return;
  }

  progressFrameId = window.requestAnimationFrame(flushProgress);
}

function updatePerformanceMode(forceLite) {
  rootEl.classList.toggle("perf-lite", forceLite);
}

function scheduleLowPriority(task) {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(() => {
      void task();
    }, { timeout: 1500 });
    return;
  }

  window.setTimeout(() => {
    void task();
  }, 32);
}

function extractKeywords(prompt) {
  const stopWords = new Set(["a", "an", "and", "as", "at", "for", "from", "in", "into", "of", "on", "or", "the", "to", "with"]);
  const cleaned = prompt.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const words = cleaned.split(/\s+/).filter((word) => word.length > 2 && !stopWords.has(word));
  return [...new Set(words)].slice(0, 5);
}

function clampScore(value, fallback) {
  const number = Number.parseInt(value, 10);
  if (!Number.isFinite(number)) {
    return fallback;
  }
  return Math.max(1, Math.min(100, number));
}

function estimateScore(seed, offset = 0) {
  return Math.max(45, Math.min(96, 52 + seed * 4 + offset));
}

function getBestModel(tier) {
  if (tier >= 3) {
    return LOCAL_MODELS.find((model) => model.id.includes("Llama-3.1-8B")) || LOCAL_MODELS[LOCAL_MODELS.length - 1];
  }
  if (tier >= 2) {
    return LOCAL_MODELS.find((model) => model.id.includes("Phi-3.5")) || LOCAL_MODELS[2];
  }
  return LOCAL_MODELS.find((model) => model.id.includes("SmolLM2")) || LOCAL_MODELS[0];
}

async function detectHardware() {
  const secureContext = window.isSecureContext || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const hw = {
    secureContext,
    webgpu: false,
    gpuName: "Unknown GPU",
    gpuVendor: "",
    ram: navigator.deviceMemory || null,
    cores: navigator.hardwareConcurrency || null,
    tier: 0
  };

  if (!secureContext || !navigator.gpu) {
    return hw;
  }

  try {
    const adapter = await navigator.gpu.requestAdapter({ powerPreference: "high-performance" });
    if (!adapter) {
      return hw;
    }

    hw.webgpu = true;

    try {
      const info = typeof adapter.requestAdapterInfo === "function"
        ? await adapter.requestAdapterInfo()
        : adapter.info || null;
      hw.gpuVendor = info?.vendor || "";
      hw.gpuName = info?.description || info?.device || info?.architecture || info?.vendor || "WebGPU Compatible GPU";
    } catch {
      hw.gpuName = "WebGPU Compatible GPU";
    }

    const ram = hw.ram || 4;
    const vendor = hw.gpuVendor.toLowerCase();
    const name = hw.gpuName.toLowerCase();
    const discrete = vendor.includes("nvidia") || vendor.includes("amd") || vendor.includes("apple")
      || name.includes("rtx") || name.includes("gtx") || name.includes("geforce")
      || name.includes("radeon") || name.includes("apple m");

    if (discrete && ram >= 8) {
      hw.tier = 3;
    } else if (discrete || ram >= 8) {
      hw.tier = 2;
    } else {
      hw.tier = 1;
    }
  } catch {
    hw.webgpu = true;
    hw.gpuName = "WebGPU Compatible GPU";
    hw.tier = 1;
  }

  return hw;
}

function populateModelSelect() {
  const recommendation = getBestModel(runtimeInfo?.tier || 0);
  const savedId = localStorage.getItem(LOCAL_MODEL_KEY);
  const defaultId = LOCAL_MODELS.some((model) => model.id === savedId) ? savedId : recommendation.id;

  const fragment = document.createDocumentFragment();
  LOCAL_MODELS.forEach((model) => {
    const option = document.createElement("option");
    option.value = model.id;
    option.disabled = (runtimeInfo?.tier || 0) < model.minTier;
    option.textContent = `${model.name} (${model.size}) — ${model.quality}${option.disabled ? " · needs stronger GPU" : ""}`;
    option.selected = model.id === defaultId && !option.disabled;
    fragment.appendChild(option);
  });
  localModelEl.replaceChildren(fragment);

  if (!localModelEl.value) {
    const firstEnabled = [...localModelEl.options].find((option) => !option.disabled);
    if (firstEnabled) {
      firstEnabled.selected = true;
    }
  }

  localStorage.setItem(LOCAL_MODEL_KEY, localModelEl.value);
}

function renderRuntimeDiagnostics(extraItems = []) {
  if (!runtimeInfo) {
    runtimeDiagMetaEl.textContent = "Awaiting scan";
    renderBulletList(runtimeInsightListEl, [{ label: "Scan", text: "Device runtime scan has not finished yet." }]);
    return;
  }

  const recommendation = getBestModel(runtimeInfo.tier);
  const items = [
    {
      label: "Compatibility",
      text: runtimeInfo.webgpu ? `${TIERS[runtimeInfo.tier].label} local runtime. ${TIERS[runtimeInfo.tier].detail}` : TIERS[0].detail
    },
    {
      label: "Hardware",
      text: `${runtimeInfo.gpuName} · ${runtimeInfo.ram ? `~${runtimeInfo.ram} GB RAM` : "RAM not reported"} · ${runtimeInfo.cores ? `${runtimeInfo.cores} threads` : "CPU threads not reported"}`
    },
    {
      label: "Recommendation",
      text: `${recommendation.name} ${recommendation.size} is the best fit for this device tier.`
    }
  ];

  if (loadedModelId) {
    const loadedModel = LOCAL_MODELS.find((model) => model.id === loadedModelId);
    if (loadedModel) {
      items.push({
        label: "Loaded Model",
        text: `${loadedModel.name} is ready for fully local strategy generation.`
      });
    }
  }

  extraItems.forEach((item) => items.push(item));
  runtimeDiagMetaEl.textContent = runSourceEl.value === "local" ? "Local WebLLM path selected" : "Backend API path selected";
  renderBulletList(runtimeInsightListEl, items);
}

function syncSourceUi() {
  const source = runSourceEl.value;
  localStorage.setItem(RUNTIME_SOURCE_KEY, source);
  runtimeModeMetricEl.textContent = source === "local" ? "LOCAL" : "API";
  renderRuntimeDiagnostics();

  if (source === "local") {
    modelHintEl.textContent = loadedModelId
      ? "A local model is already loaded. Generate Strategy will run entirely in-browser."
      : "Load a local model first. The first download can be several gigabytes depending on the model.";
  } else {
    modelHintEl.textContent = "Backend mode remains available immediately. Local model loading is optional.";
  }
}

async function scanLocalRuntime() {
  setLocalStatus("waiting", "Scanning", "Checking WebGPU support, device memory, CPU threads, and recommended local model tier.");
  runtimeInfo = await detectHardware();
  updatePerformanceMode(!runtimeInfo.webgpu || performanceHints.lowMemory || performanceHints.lowThreads || performanceHints.reducedMotion);
  populateModelSelect();
  const recommendation = getBestModel(runtimeInfo.tier);

  runtimeTierEl.textContent = runtimeInfo.webgpu ? TIERS[runtimeInfo.tier].label : TIERS[0].label;
  runtimeGpuEl.textContent = runtimeInfo.secureContext ? runtimeInfo.gpuName : "Secure context required";
  runtimeRecommendedEl.textContent = recommendation.name;

  if (!runtimeInfo.secureContext) {
    setLocalStatus("offline", "Blocked", "Serve NeuroForge from localhost or HTTPS to unlock WebGPU and on-device WebLLM.");
    localMetaEl.textContent = "The Study Buddy-style local runtime requires a secure context. Open the localhost build in Chrome or Edge if you are currently using a preview or embedded browser.";
  } else if (!runtimeInfo.webgpu) {
    setLocalStatus("offline", "Unavailable", "This browser surface does not expose WebGPU, so local WebLLM generation cannot start here.");
    localMetaEl.textContent = "Use the Python backend instead, or open the localhost app in desktop Chrome or Edge. Embedded browsers often hide WebGPU even on supported hardware.";
    if (runSourceEl.value === "local") {
      runSourceEl.value = "backend";
    }
  } else {
    const tier = TIERS[runtimeInfo.tier];
    setLocalStatus(tier.status, tier.label, `${tier.detail} Recommended model: ${recommendation.name}.`);
    localMetaEl.textContent = `${runtimeInfo.gpuName} detected. ${recommendation.name} is the best starting point for local generation.`;
  }

  renderRuntimeDiagnostics();
  syncSourceUi();
}

async function importWebLLM() {
  if (webllmModule) {
    return webllmModule;
  }

  try {
    setLocalStatus("waiting", "Importing", "Loading the WebLLM runtime so NeuroForge can run locally like Study Buddy.");
    webllmModule = await import(WEBLLM_IMPORT_URL);
    return webllmModule;
  } catch (error) {
    setLocalStatus("offline", "Import Failed", "WebLLM could not be imported from the CDN. Check browser console or network policy.");
    throw error;
  }
}

async function loadLocalModel(force = false) {
  if (loadingModel) {
    return false;
  }

  if (!runtimeInfo?.secureContext) {
    setLocalStatus("offline", "Blocked", "Local model loading requires localhost or HTTPS.");
    return false;
  }

  if (!runtimeInfo?.webgpu) {
    setLocalStatus("offline", "Unavailable", "WebGPU is not available, so local model loading cannot start.");
    return false;
  }

  const model = getSelectedModel();
  if (!force && localEngine && loadedModelId === model.id) {
    setLocalStatus("online", "Loaded", `${model.name} is already loaded and ready for local generation.`);
    setProgress(100, `${model.name} ready.`);
    return true;
  }

  loadingModel = true;
  loadModelBtn.disabled = true;
  loadModelBtn.textContent = "Loading...";
  setProgress(0, `Preparing ${model.name}...`);

  try {
    const webllm = await importWebLLM();
    setLocalStatus("waiting", "Loading Model", `Downloading and preparing ${model.name}. The first run can take a while.`);
    localEngine = await webllm.CreateMLCEngine(model.id, {
      initProgressCallback: (report) => {
        const progress = Math.round((report.progress || 0) * 100);
        setProgress(progress, report.text || `${progress}% loaded`);
      }
    });
    loadedModelId = model.id;
    setProgress(100, `${model.name} ready for local generation.`);
    setLocalStatus("online", "Loaded", `${model.name} is loaded locally. NeuroForge can now generate without the backend.`);
    localMetaEl.textContent = `${model.name} is cached locally in the browser runtime. Future loads should be faster.`;
    renderRuntimeDiagnostics([
      {
        label: "Load Status",
        text: `${model.name} finished loading and is ready for direct in-browser generation.`
      }
    ]);
    return true;
  } catch (error) {
    localEngine = null;
    loadedModelId = null;
    setProgress(0, `Failed to load ${model.name}.`);
    setLocalStatus("offline", "Load Failed", `Model load failed: ${String(error.message || error)}`);
    renderRuntimeDiagnostics([
      {
        label: "Load Failure",
        text: "The selected local model could not be initialized. Try a smaller model or stay on backend mode."
      }
    ]);
    return false;
  } finally {
    loadingModel = false;
    loadModelBtn.disabled = false;
    loadModelBtn.textContent = loadedModelId === model.id ? "Reload Local Model" : "Load Local Model";
  }
}

function resetOutput() {
  titleEl.textContent = "Ready for a fresh brief";
  summaryEl.textContent = "Run the generator to get a concept frame, execution layers, launch plan, risk readout, and follow-up prompts.";
  scoreEl.textContent = "--";
  feasibilityEl.textContent = "--";
  launchEnergyEl.textContent = "--";
  runtimeModeMetricEl.textContent = runSourceEl.value === "local" ? "LOCAL" : "API";
  scoreDetailEl.textContent = "Creativity score: --";
  renderInsightChips([]);
  renderBulletList(conceptListEl, []);
  renderBulletList(executionListEl, []);
  renderBulletList(actionListEl, []);
  renderBulletList(riskListEl, []);
  renderStackList(nextPromptsEl, []);
  resultNarrativeEl.textContent = "Your generated strategy will appear here.";
  renderRuntimeDiagnostics();
}

function normalizeList(value, fallback) {
  if (Array.isArray(value)) {
    const items = value
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }
        if (item && typeof item === "object") {
          return item.text || item.label || JSON.stringify(item);
        }
        return "";
      })
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 5);
    if (items.length) {
      return items;
    }
  }
  return fallback;
}

function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function extractJsonObject(text) {
  const direct = tryParseJson(text.trim());
  if (direct) {
    return direct;
  }

  const fenced = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/```\s*([\s\S]*?)```/i);
  if (fenced) {
    const parsed = tryParseJson(fenced[1].trim());
    if (parsed) {
      return parsed;
    }
  }

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    const parsed = tryParseJson(text.slice(start, end + 1));
    if (parsed) {
      return parsed;
    }
  }

  return null;
}

function fallbackPayload(prompt, rawText) {
  const keywords = extractKeywords(prompt);
  const keywordLead = keywords[0] || "strategy";
  const keywordSupport = keywords[1] || "workflow";
  const seed = Math.min(10, Math.max(3, keywords.length + Math.round(prompt.length / 90)));

  return {
    title: `${keywordLead.charAt(0).toUpperCase() + keywordLead.slice(1)} ${modeEl.value === "code" ? "Build Blueprint" : "Strategy Engine"}`,
    positioning: `A ${toneEl.value} ${modeEl.value} concept for ${audienceEl.value} users built around ${prompt.toLowerCase()}.`,
    creativity_score: estimateScore(seed, toneEl.value === "playful" || toneEl.value === "bold" ? 8 : 2),
    feasibility_score: estimateScore(seed, modeEl.value === "code" ? 10 : 4),
    launch_energy: estimateScore(seed, depthEl.value === "strategic" ? 9 : 5),
    keywords: keywords.map((keyword) => keyword.charAt(0).toUpperCase() + keyword.slice(1)),
    concept_frame: [
      `Position ${prompt} as a focused concept for ${audienceEl.value} users rather than a generic AI wrapper.`,
      `Use ${keywordSupport} as the visible differentiator that makes the idea easier to explain and sell.`,
      `Keep the user experience ${toneEl.value} while staying operational enough to ship in phases.`
    ],
    execution_layers: [
      `Build the first version around a clear ${modeEl.value} workflow with visible states and measurable outcomes.`,
      "Separate frontend orchestration, generation logic, and diagnostics so iteration stays fast.",
      "Instrument the result structure so the app can expose strategy, risk, and next actions without ambiguity."
    ],
    action_plan: [
      `Ship a thin but polished MVP that proves the core ${keywordLead} loop.`,
      "Add saved runs, comparison views, and stronger refinement prompts in the second pass.",
      "Track which outputs are actually reused so the product can tighten around real behavior."
    ],
    risks: [
      "The concept can feel too broad if the first-run value is not obvious within one session.",
      "Quality will drop if prompts remain vague, so the interface should encourage more specificity.",
      "Trust depends on making the strategy structure inspectable instead of purely magical."
    ],
    next_prompts: [
      `Rewrite this concept as a premium ${audienceEl.value} launch plan.`,
      "Turn the same idea into a 2-week MVP with tighter scope.",
      `Expand the analytics and reporting layer for ${keywordLead}.`
    ],
    narrative: rawText.trim() || `Local generation completed for ${prompt}.`
  };
}

function normalizePayload(rawText, prompt) {
  const parsed = extractJsonObject(rawText);
  const fallback = fallbackPayload(prompt, rawText);

  if (!parsed || typeof parsed !== "object") {
    return fallback;
  }

  const keywords = normalizeList(parsed.keywords, fallback.keywords);
  return {
    title: typeof parsed.title === "string" && parsed.title.trim() ? parsed.title.trim() : fallback.title,
    positioning: typeof parsed.positioning === "string" && parsed.positioning.trim() ? parsed.positioning.trim() : fallback.positioning,
    creativity_score: clampScore(parsed.creativity_score, fallback.creativity_score),
    feasibility_score: clampScore(parsed.feasibility_score, fallback.feasibility_score),
    launch_energy: clampScore(parsed.launch_energy, fallback.launch_energy),
    keywords,
    concept_frame: normalizeList(parsed.concept_frame, fallback.concept_frame),
    execution_layers: normalizeList(parsed.execution_layers, fallback.execution_layers),
    action_plan: normalizeList(parsed.action_plan, fallback.action_plan),
    risks: normalizeList(parsed.risks, fallback.risks),
    next_prompts: normalizeList(parsed.next_prompts, fallback.next_prompts),
    narrative: typeof parsed.narrative === "string" && parsed.narrative.trim() ? parsed.narrative.trim() : fallback.narrative
  };
}

function applyOutput(data) {
  titleEl.textContent = data.title;
  summaryEl.textContent = data.positioning;
  scoreEl.textContent = String(data.creativity_score);
  feasibilityEl.textContent = String(data.feasibility_score);
  launchEnergyEl.textContent = String(data.launch_energy);
  runtimeModeMetricEl.textContent = runSourceEl.value === "local" ? "LOCAL" : "API";
  scoreDetailEl.textContent = `Creativity score: ${data.creativity_score}`;
  renderInsightChips(data.keywords || []);
  renderBulletList(conceptListEl, data.concept_frame || []);
  renderBulletList(executionListEl, data.execution_layers || []);
  renderBulletList(actionListEl, data.action_plan || []);
  renderBulletList(riskListEl, data.risks || []);
  renderStackList(nextPromptsEl, (data.next_prompts || []).map((item) => ({ title: item, meta: "Prompt extension" })));
  resultNarrativeEl.textContent = data.narrative || "No narrative returned.";
}

async function refreshStatus() {
  try {
    const response = await fetch(`${API_BASE}/api/health`);
    if (!response.ok) {
      throw new Error("offline");
    }
    const data = await response.json();
    setStatus("online", "Online", `Backend ready. C++ scorer: ${data.cpp_status}. Modes: ${data.modes.join(", ")}.`);
  } catch {
    setStatus("offline", "Offline", "Backend not reachable. Start backend/server.py to enable API generation.");
  }
}

function buildLocalMessages(prompt) {
  const systemPrompt = [
    "You are NeuroForge, a local product strategy engine.",
    "Return only valid JSON with no markdown, no preamble, and no code fences.",
    "Use this schema exactly:",
    '{"title":"","positioning":"","creativity_score":0,"feasibility_score":0,"launch_energy":0,"keywords":[],"concept_frame":[],"execution_layers":[],"action_plan":[],"risks":[],"next_prompts":[],"narrative":""}',
    "All arrays should contain 3 to 5 concise strings.",
    "All score fields must be integers from 1 to 100.",
    "The narrative should be 2 to 4 short paragraphs."
  ].join(" ");

  const userPrompt = [
    `Prompt: ${prompt}`,
    `Mode: ${modeEl.value}`,
    `Tone: ${toneEl.value}`,
    `Audience: ${audienceEl.value}`,
    `Depth: ${depthEl.value}`,
    "Generate a structured product strategy that is concrete, useful, and realistic."
  ].join("\n");

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ];
}

function getTemperature() {
  if (toneEl.value === "playful") {
    return 0.85;
  }
  if (toneEl.value === "bold") {
    return 0.78;
  }
  if (toneEl.value === "technical") {
    return 0.45;
  }
  return 0.6;
}

async function generateLocal(prompt) {
  const ready = await loadLocalModel();
  if (!ready || !localEngine) {
    throw new Error("Local model is not ready. Load a supported model first.");
  }

  const model = getSelectedModel();
  setLocalStatus("waiting", "Generating", `${model.name} is generating the strategy locally on this device.`);
  renderRuntimeDiagnostics([
    {
      label: "Generation Path",
      text: `${model.name} is running locally with WebLLM instead of calling the Python backend.`
    }
  ]);

  const stream = await localEngine.chat.completions.create({
    messages: buildLocalMessages(prompt),
    stream: true,
    temperature: getTemperature(),
    max_tokens: 1400
  });

  let reply = "";
  for await (const chunk of stream) {
    reply += chunk.choices?.[0]?.delta?.content || "";
  }

  setLocalStatus("online", "Loaded", `${model.name} finished generating locally.`);
  renderRuntimeDiagnostics([
    {
      label: "Generation Path",
      text: `${model.name} completed a local strategy pass without using the backend.`
    }
  ]);
  return normalizePayload(reply, prompt);
}

async function generateBackend(prompt) {
  const response = await fetch(`${API_BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      mode: modeEl.value,
      tone: toneEl.value,
      audience: audienceEl.value,
      depth: depthEl.value
    })
  });

  if (!response.ok) {
    throw new Error("Backend not reachable. Start backend/server.py first.");
  }

  return response.json();
}

sampleBtn.addEventListener("click", () => {
  loadSample(samples[Math.floor(Math.random() * samples.length)]);
});

clearBtn.addEventListener("click", () => {
  promptEl.value = "";
  resetOutput();
});

runSourceEl.addEventListener("change", () => {
  if (runSourceEl.value === "local" && (!runtimeInfo?.secureContext || !runtimeInfo?.webgpu)) {
    runSourceEl.value = "backend";
  }
  syncSourceUi();
});

localModelEl.addEventListener("change", () => {
  localStorage.setItem(LOCAL_MODEL_KEY, localModelEl.value);
  const selected = getSelectedModel();
  loadModelBtn.textContent = loadedModelId === selected.id ? "Reload Local Model" : "Load Local Model";
  modelHintEl.textContent = `${selected.name} is selected. ${selected.desc}`;
  renderRuntimeDiagnostics();
});

loadModelBtn.addEventListener("click", async () => {
  await loadLocalModel(true);
  syncSourceUi();
});

runBtn.addEventListener("click", async () => {
  const prompt = promptEl.value.trim();
  if (!prompt) {
    resultNarrativeEl.textContent = "Please enter a prompt first.";
    return;
  }

  runBtn.disabled = true;
  runBtn.textContent = "Generating...";
  resultNarrativeEl.textContent = runSourceEl.value === "local"
    ? "Loading local runtime and generating entirely in-browser..."
    : "Calling the local Python backend and building a structured response...";

  try {
    let data;
    if (runSourceEl.value === "local") {
      data = await generateLocal(prompt);
      pushHistory({
        title: data.title,
        meta: `${data.creativity_score} creativity · local / ${getSelectedModel().name}`,
        prompt,
        mode: modeEl.value,
        tone: toneEl.value,
        audience: audienceEl.value,
        depth: depthEl.value
      });
    } else {
      setStatus("waiting", "Working", "Local backend is processing the current brief.");
      data = await generateBackend(prompt);
      pushHistory({
        title: data.title,
        meta: `${data.creativity_score} creativity · backend / ${modeEl.value}`,
        prompt,
        mode: modeEl.value,
        tone: toneEl.value,
        audience: audienceEl.value,
        depth: depthEl.value
      });
      setStatus("online", "Online", `Last backend run complete. Creativity ${data.creativity_score}, feasibility ${data.feasibility_score}.`);
    }

    applyOutput(data);
    syncSourceUi();
  } catch (error) {
    resultNarrativeEl.textContent = String(error.message || error);
    if (runSourceEl.value === "local") {
      setLocalStatus("offline", "Failed", `Local generation failed: ${String(error.message || error)}`);
    } else {
      setStatus("offline", "Offline", "Generation failed. Verify the local backend is running on port 8008.");
    }
  } finally {
    runBtn.disabled = false;
    runBtn.textContent = "Generate Strategy";
  }
});

runSourceEl.value = localStorage.getItem(RUNTIME_SOURCE_KEY) || "backend";
renderSamples();
renderHistory();
resetOutput();
updatePerformanceMode(performanceHints.lowMemory || performanceHints.lowThreads || performanceHints.reducedMotion);
window.requestAnimationFrame(() => {
  scheduleLowPriority(refreshStatus);
  scheduleLowPriority(scanLocalRuntime);
});
