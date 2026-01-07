# 🧠 AI Fact Checker – Chrome Extension

AI Fact Checker is a Chrome extension that helps users **verify the credibility of selected text instantly** using AI and trusted news sources.

🌐 **Platform Website:** https://mudakkik.ddns.net/  
📦 **GitHub Repository:** https://github.com/menaemg/Mudakkik.git

---

## ✨ Features

- 🔍 **Fact-check any selected text** on the web
- 🧠 **AI-powered credibility analysis**
- 📊 **Clear verdict** with confidence percentage
- 📰 **Trusted sources** and references
- 🔐 **Secure login & logout**
- 🕘 **Access your fact-check history**
- 🎨 **Clean, modern, and minimal UI**

---

## 🖱️ How to Use

1. **Select any text** on a webpage
2. **Right-click** → **"Fact Check"**
3. The extension popup opens automatically
4. View the **credibility score, verdict, explanation, and sources**

💡 **Tip:** You can also open the extension manually and click **"Check Selected Text"**.

---

## 🧩 Tech & Architecture

- **Chrome Extension** (Manifest V3)
- **Modular clean architecture**
- **Token-based authentication**
- **API-driven verification**
- **Modern UI** inspired by shadcn/ui

### 📂 Main Structure

```
/
├── js/
│   ├── api.js          # API integration layer
│   ├── auth.js         # Authentication logic
│   ├── ui.js           # UI components
│   └── popup.js        # Popup functionality
├── background.js       # Background service worker
└── content.js          # Content script
```

---

## 🔐 Permissions

- `storage` – Save authentication state
- `activeTab` – Access selected text
- `contextMenus` – Right-click actions
- `scripting` – Script injection

---

## 🚀 Installation (Development)

1. **Clone the repository:**

```bash
   git clone https://github.com/areej-nasser/Mudakkik-extension
   cd Mudakkik-extension
```

2. **Open Chrome** → `chrome://extensions`

3. **Enable** "Developer Mode" (toggle in top-right)

4. Click **"Load unpacked"**

5. **Select the project folder**

✅ Done! The extension is now installed and ready to use.

---

## 🌍 Platform & Team

The **Mudakkik platform** (API, AI pipeline, verification engine, and website) is a **team project**, developed collaboratively by the Mudakkik team.

This repository focuses on the **Chrome Extension**, which integrates with the Mudakkik platform to provide instant fact-checking directly inside the browser.

👉 **Platform:** https://mudakkik.ddns.net/

---

## 🧑‍💻 Chrome Extension Developer

**Areej Nasser**  
Software Developer  
GitHub: [@areej-nasser](https://github.com/areej-nasser)

---

## 👥 Team & Contributors

Mudakkik is a collaborative project built by a dedicated team:

| Name                  | GitHub                                             |
| --------------------- | -------------------------------------------------- |
| **Abdelmonaem Gamal** | [@menaemg](https://github.com/menaemg)             |
| **Aya Hamed**         | [@20180152aya](https://github.com/20180152aya)     |
| **Mohamed Ahmed**     | [@m-devo](https://github.com/m-devo)               |
| **Areej Nasser**      | [@areej-nasser](https://github.com/areej-nasser)   |
| **Abdelghany**        | [@abdelghany-77](https://github.com/abdelghany-77) |
| **Amr Rezzat**        | [@amrrezzatt](https://github.com/amrrezzatt)       |

---

Made with ❤️, curiosity, and a passion for fighting misinformation.
