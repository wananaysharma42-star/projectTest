# 🧑‍💻 Code Editor Web

A lightweight in-browser HTML code editor with live preview, custom console output, session history, and light/dark themes — built using pure HTML, CSS, and JavaScript.

No frameworks. No libraries. Just modern browser APIs.

---

## 🚀 Live Demo
  
https://wananaysharma42-star.github.io/projectTest/

---

## ✨ Features

- 📝 Code Editor
  - Line numbers with scroll synchronization
  - Tab indentation support
  - `! + Enter` shortcut for HTML boilerplate

- ▶️ Live Preview
  - Executes user code inside a sandboxed iframe
  - Real-time preview rendering
  - Expand / collapse preview panel

- 🖥️ Custom Console
  - Captures `console.log()` from user code
  - Displays output inside the editor UI
  - Toggleable console panel

- 💾 Session History
  - Save code snapshots with custom titles
  - Uses localStorage for persistence
  - Restores last 10 saved sessions

- 📂 File Upload
  - Import `.html` files directly into the editor

- 🌗 Light / Dark Mode
  - One-click theme toggle
  - Preview iframe syncs with editor theme

- 📱 Responsive Layout
  - Works on desktop, tablet, and mobile
  - Dynamic resizing on window resize

---

## 🧠 How It Works

- User writes HTML code in the editor textarea
- Code is sent to a sandboxed iframe using `postMessage`
- The iframe safely executes the code
- `console.log()` is overridden inside the iframe and forwarded to the editor
- Code sessions are stored and restored using localStorage

---

## 🗂️ Project Structure

code-editor-web/
├── index.html # Main editor UI
├── style.css # Styling (dark/light theme + responsive)
├── script.js # Editor logic, preview, console, history
├── preview.html # Sandboxed iframe runtime
└── README.md

---

## 🛠️ Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Browser APIs
  - iframe
  - postMessage
  - localStorage
  - FileReader

---

## ▶️ Getting Started

### 🌐 Try it Online (GitHub Pages)

Live demo:  
https://wananaysharma42-star.github.io/projectTest/

---

### 💻 Run Locally

#### 1. Clone the repository

git clone https://github.com/wananaysharma42-star/projectTest.git

### 2. Open the project

### 3. Run the project

Open `index.html` directly in your browser.

No build step required.

---

## 🔐 Security

- Code runs inside a sandboxed iframe:
    sandbox="allow-scripts allow-same-origin allow-popups"
- Same-origin message validation
- No direct DOM access between editor and preview

---

## ⚠️ Limitations

- Supports HTML only (inline CSS and JavaScript)
- Captures `console.log()` only
- No backend or server-side execution

---

## 🌱 Future Improvements

- Multi-file support (HTML / CSS / JS tabs)
- Console error and warning capture
- Download / export code
- Search and replace
- Keyboard shortcuts (Ctrl + S, Ctrl + Enter)
- Autosave sessions

---

## 🙌 Author

Built with ❤️ by **Ananay Sharma**
