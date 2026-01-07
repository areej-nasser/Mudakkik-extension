const API_URL = "https://mudakkik.ddns.net/api";

const authDiv = document.getElementById("auth");
const appDiv = document.getElementById("app");

/* ---------- AUTH STATE ---------- */
document.addEventListener("DOMContentLoaded", async () => {
    const { token } = await chrome.storage.local.get("token");
    token ? renderApp() : renderAuth();
});

/* ---------- LOGIN ---------- */
document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        return console.log("Email and password required");
    }

    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
        showError("Invalid credentials");
        return;
    }

    const data = await res.json();

    await chrome.storage.local.set({ token: data.token });
    renderApp();
});


/* ---------- LOGOUT ---------- */
document.getElementById("logoutBtn").addEventListener("click", async () => {
    const { token } = await chrome.storage.local.get("token");

    await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    });

    await chrome.storage.local.clear();
    renderAuth();
});

/* ---------- UI ---------- */
function renderAuth() {
    authDiv.style.display = "block";
    appDiv.style.display = "none";
}

function renderApp() {
    authDiv.style.display = "none";
    appDiv.style.display = "block";
}

function showError(msg) {
    const el = document.getElementById("errorMsg");
    el.textContent = msg;
    el.classList.remove("hidden");
}



async function requireAuth() {
    const { token } = await chrome.storage.local.get("token");
    if (!token) {
        renderAuth();
        throw new Error("Not authenticated");
    }
    return token;
}

// Auto fact check on popup open if text is selected
document.addEventListener('DOMContentLoaded', async () => {
    const { token } = await chrome.storage.local.get("token");
    if (!token) return;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: 'getSelectedText' }, async (response) => {
        if (response && response.text && response.text.trim()) {
            document.getElementById('errorMsg').style.display = 'none';
            document.getElementById('loading').style.display = 'block';
            document.getElementById('results').style.display = 'none';
            try {
                await factCheck(response.text.trim());
            } catch (error) {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('errorMsg').textContent = 'Error: ' + error.message;
                document.getElementById('errorMsg').style.display = 'block';
            }
        }
    });
});

// Check selected text
document.getElementById('checkBtn').addEventListener('click', async () => {
    // const settings = await chrome.storage.sync.get(['tavilyKey', 'groqKey', 'domains']);
    const token = await requireAuth();

    // Get selected text from active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.sendMessage(tab.id, { action: 'getSelectedText' }, async (response) => {
        if (chrome.runtime.lastError) {
            document.getElementById('errorMsg').textContent = 'Could not access page. Try refreshing.';
            document.getElementById('errorMsg').style.display = 'block';
            return;
        }

        if (!response || !response.text) {
            document.getElementById('errorMsg').textContent = 'Please select some text on the page first';
            document.getElementById('errorMsg').style.display = 'block';
            return;
        }

        document.getElementById('errorMsg').style.display = 'none';
        document.getElementById('loading').style.display = 'block';
        document.getElementById('results').style.display = 'none';

        try {
            const { token } = await chrome.storage.local.get("token");
            await factCheck(response.text.trim());
        } catch (error) {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('errorMsg').textContent = 'Error: ' + error.message;
            document.getElementById('errorMsg').style.display = 'block';
        }
    });
});

async function factCheck(text) {
    try {
        const { token } = await chrome.storage.local.get("token");
        console.log(token);

        const res = await fetch(`${API_URL}/verify-news`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: text
            })
        });

        const data = await res.json();
        console.log(data);
        displayResults(text, data);


    } catch (error) {
        throw error;
    }
}



function displayResults(text, data) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('results').style.display = 'block';

    document.getElementById('selectedTextDiv').textContent = `"${text}"`;

    if (!data || !data.verdict) {
        showError("Invalid response from server");
        return;
    }

    let { confidence, label, summary } = data.verdict;

    // 🔥 FIX: "72%" → 72
    confidence = parseInt(confidence.replace('%', ''), 10);

    document.getElementById('percentage').textContent = `${confidence}%`;
    document.getElementById('verdict').textContent = label;
    document.getElementById('explanation').textContent = summary;

    const verdictBox = document.getElementById('verdictBox');
    verdictBox.className = 'verdict';

    if (confidence >= 70) {
        verdictBox.classList.add('true');
    } else if (confidence >= 40) {
        verdictBox.classList.add('neutral');
    } else {
        verdictBox.classList.add('false');
    }

    renderSources(data.sources);
}

function renderSources(sources = []) {
    const sourcesDiv = document.getElementById('sources');

    if (!sources.length) {
        sourcesDiv.innerHTML = '<h3>No sources found</h3>';
        return;
    }

    sourcesDiv.innerHTML = '<h3>Sources</h3>';

    sources.forEach(({ url, title }) => {
        const link = document.createElement('a');
        link.href = url;
        link.textContent = title || url;
        link.target = '_blank';
        link.className = 'source-link';

        sourcesDiv.appendChild(link);
    });
}



