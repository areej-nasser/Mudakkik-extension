const authDiv = document.getElementById("auth");
const appDiv = document.getElementById("app");
const loading = document.getElementById("loading");
const results = document.getElementById("results");
const errorMsg = document.getElementById("errorMsg");

export function showAuth() {
    authDiv.style.display = "block";
    appDiv.style.display = "none";
}

export function showApp() {
    authDiv.style.display = "none";
    appDiv.style.display = "block";
}

export function showLoading() {
    loading.style.display = "flex";
}

export function hideLoading() {
    loading.style.display = "none";
}

export function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.remove("hidden");
    errorMsg.classList.add("shake");
}

export function clearError() {
    errorMsg.classList.add("hidden");
}

export function renderResults(text, data) {
    document.getElementById("selectedTextDiv").textContent = `"${text}"`;

    const confidence = parseInt(data.verdict.confidence);
    document.getElementById("percentage").textContent = data.verdict.confidence;
    document.getElementById("verdict").textContent = data.verdict.label;
    document.getElementById("explanation").textContent = data.verdict.summary;

    const verdictBox = document.getElementById("verdictBox");
    verdictBox.className = "verdict";

    if (confidence >= 70) verdictBox.classList.add("true");
    else if (confidence >= 40) verdictBox.classList.add("neutral");
    else verdictBox.classList.add("false");

    const sourcesDiv = document.getElementById("sources");
    sourcesDiv.innerHTML = "<h3>Sources</h3>";

    data.sources.forEach(src => {
        const a = document.createElement("a");
        a.href = src.url;
        a.textContent = src.title || src.url;
        a.target = "_blank";
        sourcesDiv.appendChild(a);
    });

    results.classList.remove("hidden");
    results.classList.add("fade-in");
}
