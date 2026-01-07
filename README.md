# 🧠 AI Fact Checker – Chrome Extension

AI Fact Checker is a Chrome extension that helps users **verify the credibility of selected text instantly** using AI and trusted news sources.

🌐 Platform Website: https://mudakkik.ddns.net/  
📦 GitHub Repository: https://github.com/menaemg/Mudakkik.git

---

## ✨ Features

- 🔍 Fact-check any selected text on the web
- 🧠 AI-powered credibility analysis
- 📊 Clear verdict with confidence percentage
- 📰 Trusted sources and references
- 🔐 Secure login & logout
- 🕘 Access your fact-check history
- 🎨 Clean, modern, and minimal UI

---

## 🖱️ How to Use

1. Select any text on a webpage
2. Right-click → **Fact Check**
3. The extension popup opens automatically
4. View the credibility score, verdict, explanation, and sources

You can also open the extension manually and click **Check Selected Text**.

---

## 🧩 Tech & Architecture

- Chrome Extension (Manifest V3)
- Modular clean architecture
- Token-based authentication
- API-driven verification
- Modern UI inspired by shadcn/ui

Main structure:

/js
├── api.js
├── auth.js
├── ui.js
├── popup.js
/background.js
/content.js

---

## 🔐 Permissions

- `storage` – save authentication state
- `activeTab` – access selected text
- `contextMenus` – right-click actions
- `scripting` – script injection

---

## 🚀 Installation (Development)

1. Clone the repository
2. Open Chrome → `chrome://extensions`
3. Enable **Developer Mode**
4. Click **Load unpacked**
5. Select the project folder

---

## 🌍 Platform & Team

The **Mudakkik platform** (API, AI pipeline, verification engine, and website)  
is a **team project**, developed collaboratively by the Mudakkik team.

This repository focuses on the **Chrome Extension**, which integrates with the Mudakkik platform to provide instant fact-checking directly inside the browser.

👉 https://mudakkik.ddns.net/

---

## 🧑‍💻 Author (Chrome Extension)

**Areej Nasser**  
Software Developer

---

## 👥 Team & Contributors

Mudakkik is a collaborative project built by a dedicated team:

- Abdelmonaem Gamal – https://github.com/menaemg
- Aya Hamed – https://github.com/20180152aya
- Mohamed Ahmed– https://github.com/m-devo
- Areej Nasser – https://github.com/areej-nasser
- Abdelghany – https://github.com/abdelghany-77
- Amr Rezzat – https://github.com/amrrezzatt

---

## ❤️

Made with love, curiosity, and a passion for fighting misinformation.
