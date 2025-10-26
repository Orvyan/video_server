# Media Server 💠

A modern, lightweight media server designed for local and private streaming.  
It allows you to browse, upload, and stream your personal videos and files with a clean, minimal interface.

---

## ✨ Features
- **File Management** – browse, upload, move, and delete files and folders  
- **Media Streaming** – stream videos directly in your browser  
- **Cross-Platform Access** – works on desktop, mobile, and tablet  
- **Local Privacy** – no cloud storage, no tracking, full local control  

---

## ⚙️ Technology Stack
- **Backend:** Node.js (Express)  
- **Frontend:** HTML, CSS, JavaScript (Flutter app version in development)  
- **Storage:** Local filesystem  
- **Authentication:** Express-Session with bcrypt-based password hashing  

---

## 🧠 About
The Media Server is built for people who prefer hosting and controlling their own media environment —  
without relying on third-party services or cloud platforms.

---

## 🚀 Upcoming App Version
A native app version is currently in development.  
It will include:
- Offline playback  
- Push notifications  
- Animations and transitions  
- Optimized navigation and performance  

**Status:** Coming Soon ⚙️

---

## 🔧 Installation
1. Clone the repository  
   ```bash
   git clone https://github.com/yourusername/media-server.git
   cd media-server
   ```
2. Install dependencies  
   ```bash
   npm install
   ```
3. Start the server  
   ```bash
   npm start
   ```
4. Open your browser at  
   ```
   http://localhost:3000
   ```


---

## 🧱 API Overview
| Endpoint | Method | Description |
|-----------|--------|-------------|
| `/register` | POST | Register a new user |
| `/login` | POST | Login with username and password |
| `/logout` | POST | Logout current session |
| `/api/index` | GET | Retrieve media index |
| `/video?path=` | GET | Stream a specific video |
| `/health` | GET | Server status check |

---

## 🛡️ Security Notes

- Passwords are securely hashed with **bcrypt**  
- Use `HTTPS` in production for encrypted connections  


---

## 📜 License
MIT License  
Copyright © 2025

---

**Version:** 1.0 Beta  
**Status:** Active Development
