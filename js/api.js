const API_URL = "https://mudakkik.ddns.net/api";

export async function verifyNews(content, token) {
    const res = await fetch(`${API_URL}/verify-news`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "text": content,
            "period": 365
        })
    });

    if (!res.ok) throw new Error("API failed" + " " + res);

    return await res.json();
}

export async function login(email, password) {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw new Error("API failed: Invalid credentials");

    return await res.json();
}

export async function logout(token) {
    await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });
}

export async function user(token) {
    const res = await fetch(`${API_URL}/user`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });
    if (!res.ok) throw new Error("API failed: Could not fetch user");
    return await res.json();
}