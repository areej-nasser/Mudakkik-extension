const authDiv = document.getElementById("auth");
const appDiv = document.getElementById("app");
const loading = document.getElementById("loading");
const results = document.getElementById("results");
const errorMsg = document.getElementById("errorMsg");
const authError = document.getElementById("authError");

export function showAuth() {
    authDiv.style.display = "block";
    appDiv.style.display = "none";
}

export function showApp() {
    authDiv.style.display = "none";
    appDiv.style.display = "block";
}

export function showLoading() {
    const checkBtn = document.getElementById("checkBtn");
    if (checkBtn) checkBtn.style.display = "none";
    loading.style.display = "flex";
    results.classList.add("hidden");
}

export function hideLoading() {
    const checkBtn = document.getElementById("checkBtn");
    if (checkBtn) checkBtn.style.display = "flex";
    loading.style.display = "none";
}

export function showError(message) {
    const errorContainer = appDiv.style.display === "none" ? authError : errorMsg;
    errorContainer.textContent = message;
    errorContainer.classList.remove("hidden");
    errorContainer.classList.add("shake");

    // Remove shake class after animation
    setTimeout(() => {
        errorContainer.classList.remove("shake");
    }, 300);
}

export function clearError() {
    errorMsg.classList.add("hidden");
    authError.classList.add("hidden");
}

export function renderUser(user) {
    const userNameEl = document.getElementById("userName");
    const avatarEl = document.getElementById("userAvatar");

    userNameEl.textContent = user.name ?? "مستخدم";

    if (user.avatar) {
        const img = document.createElement("img");
        img.src = `https://mudakkik.ddns.net/storage/${user.avatar}`;
        img.alt = "الصورة الشخصية";
        avatarEl.innerHTML = "";
        avatarEl.appendChild(img);
    } else {
        avatarEl.textContent = user.name ? user.name.charAt(0).toUpperCase() : "م";
    }
}

export function renderResults(text, data) {
    const selectedTextDiv = document.getElementById("selectedTextDiv");
    selectedTextDiv.textContent = `"${text}"`;

    const confidence = parseInt(data.verdict.confidence) || 0;
    document.getElementById("percentage").textContent = `${confidence}%`;
    document.getElementById("verdict").textContent = data.verdict.label;
    document.getElementById("explanation").textContent = data.verdict.summary;

    const verdictBox = document.getElementById("verdictBox");
    verdictBox.className = "verdict";

    if (confidence >= 70) {
        verdictBox.classList.add("true");
    } else if (confidence >= 40) {
        verdictBox.classList.add("neutral");
    } else {
        verdictBox.classList.add("false");
    }

    // Render sources
    const sourcesDiv = document.getElementById("sources");
    sourcesDiv.innerHTML = `
        <h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            المصادر
        </h3>
    `;

    if (data.sources && data.sources.length > 0) {
        data.sources.forEach(src => {
            const sourceItem = document.createElement("div");
            sourceItem.className = "source-item";

            const domain = new URL(src.url).hostname.replace('www.', '');
            const date = src.date ? new Date(src.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }) : '';

            sourceItem.innerHTML = `
                <a href="${src.url}" target="_blank" rel="noopener noreferrer">
                    ${src.title || domain}
                </a>
                <div class="source-meta">
                    <span class="source-domain">${domain}</span>
                    ${date ? `<span class="source-date">${date}</span>` : ''}
                </div>
            `;
            sourcesDiv.appendChild(sourceItem);
        });
    } else {
        const noSources = document.createElement("p");
        noSources.style.cssText = "font-size: 13px; color: #64748b; text-align: center; padding: 16px;";
        noSources.textContent = "لم يتم العثور على مصادر";
        sourcesDiv.appendChild(noSources);
    }

    results.classList.remove("hidden");
    results.classList.add("fade-in");
}
