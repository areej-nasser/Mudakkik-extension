export async function saveToken(token) {
    await chrome.storage.local.set({ token });
}

export async function getToken() {
    const { token } = await chrome.storage.local.get("token");
    return token || null;
}

export async function isAuthenticated() {
    return !!(await getToken());
}

export async function clearAuth() {
    await chrome.storage.local.clear();
}
