# 🧠 SafeSurf AI — Chrome Extension (Gemini Nano / Gemini API)

**SafeSurf AI** is a Google Chrome extension developed for the **Google Chrome Built-in AI Challenge 2025**.  
It leverages **Gemini Nano (on-device)** and **Gemini API (cloud)** to analyze, translate, and refine web content, offering a browsing experience that is more **secure, clear, and accessible**.

---

## 💡 Overview
SafeSurf AI operates directly within the browser, allowing users to interact with pages and text using Artificial Intelligence in a fast and integrated way.  
By using **Gemini Nano**, the system performs local analysis — without constant internet dependency — and automatically switches to **Gemini Cloud** when needed.

---

## 🚀 Features
- **Analyze Page:**  
  Generates an intelligent summary of the current tab, identifies key topics, and evaluates risk levels (security, credibility, suspicious links, etc.).  
  🆕 **Update:** The **Analyze Page** button now always analyzes the active tab, regardless of the menu selection.

- **Translate:**  
  Instantly translates text directly from the popup, with support for multiple languages.

- **Rewrite:**  
  Automatically rewrites text to make it clearer, more concise, and fluent.  
  (Feature fixed — now responds correctly through model fallback in case of server overload).

- **Proofread:**  
  Performs grammar and spelling checks, fixing punctuation and typographical errors.

- **Smart fallback:**  
  If **Gemini Nano** is unavailable, the extension automatically switches to the **Gemini API Cloud**.

---

## ⚙️ Technologies Used
- **Manifest V3** — Modern framework for Chrome Extensions  
- **JavaScript (ES Modules)** — Modular and asynchronous structure  
- **Gemini Nano + Gemini API** — On-device and cloud-based AI  
- **Chrome Storage & Messaging API** — Persistence and internal communication  
- **Minimalist HTML/CSS** — Lightweight and accessible interface  

---

## 🔒 Privacy
No data is stored locally or shared with third parties without user consent.  
The **cloud mode** is only activated when the user explicitly enables the “Enable Cloud Fallback” option in settings.

---

## 🧰 Installation
1. Download the repository (`Code > Download ZIP`)  
2. Open Chrome and navigate to: `chrome://extensions`  
3. Enable **Developer Mode**  
4. Click **Load unpacked**  
5. Select the `SafeSurfAI` folder  
6. The extension icon will appear in the Chrome toolbar  

---

## 🧪 How to Use
1. Open any webpage (e.g., Wikipedia)  
2. Click the **SafeSurf AI** icon  
3. Choose a function or click **Analyze Page** to analyze the active tab  
4. View the summary, risk level, entities, and suggestions directly in the popup  

---

## 👤 Author
**Matheus Amorim de Souza**  
Safety Technician and Developer  
💼 [GitHub](https://github.com/Matheus0805amorim) | 🔗 [LinkedIn](https://www.linkedin.com/in/matheus0805amorim)

---

## 🏆 Hackathon
This project was developed as part of the **Google Chrome Built-in AI Challenge 2025 — Innovate with Intelligence**, organized by **Devpost** and **Google**.  
SafeSurf AI demonstrates the potential of **embedded AI (Gemini Nano)** to create safer, smarter, and more autonomous web experiences.


