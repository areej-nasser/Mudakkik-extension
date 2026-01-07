import { login, logout, verifyNews } from "./api.js";
import { saveToken, getToken, isAuthenticated, clearAuth } from "./auth.js";
import { showAuth, showApp, showLoading, hideLoading, showError, clearError, renderResults } from "./ui.js";

document.addEventListener("DOMContentLoaded", async () => {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        showAuth();
        return;
    }

    showApp();

    // Auto fact check on popup open if text is selected
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.sendMessage(tab.id, { action: "getSelectedText" }, async (res) => {
        if (!res?.text?.trim()) return;

        try {
            showLoading();

            const token = await getToken();
            const data = await verifyNews(res.text.trim(), token);

            hideLoading();
            renderResults(res.text.trim(), data.result);
        } catch (e) {
            hideLoading();
            showError(e.message);
        }
    });
});



/* ---------- LOGIN ---------- */
document.getElementById("loginBtn").addEventListener("click", async () => {
    try {
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        clearError();
        const data = await login(email, password);
        await saveToken(data.token);
        showApp();
        clearError();

    } catch (e) {
        showError(e.message);
    }
});

/* ---------- LOGOUT ---------- */
document.getElementById("logoutBtn").addEventListener("click", async () => {
    const token = await getToken();
    if (token) await logout(token);
    await clearAuth();
    showAuth();
});

/* ---------- FACT CHECK ---------- */
document.getElementById("checkBtn").addEventListener("click", async () => {
    try {
        const token = await getToken();
        if (!token) return showError("Please login first");

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.tabs.sendMessage(tab.id, { action: "getSelectedText" }, async (res) => {
            if (!res?.text) return showError("Select text first");

            showLoading();
            const data = await verifyNews(res.text, token);
            hideLoading();
            renderResults(res.text, data.result);
        });

    } catch (e) {
        hideLoading();
        showError(e.message);
    }
});



