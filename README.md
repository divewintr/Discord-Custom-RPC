<div align="center">

# 🎮 RPC Picker

**Pick any game from Discord's detectable list and show it on your profile as custom Rich Presence.**

![Electron](https://img.shields.io/badge/Electron-33-47848F?style=for-the-badge&logo=electron&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Discord RPC](https://img.shields.io/badge/Discord-Rich%20Presence-5865F2?style=for-the-badge&logo=discord&logoColor=white)

</div>

<br>

## 📖 About

RPC Picker is a small desktop app with a searchable grid of games. Click one and it appears on your Discord profile as "Playing ...", using a single application you create in the Discord Developer Portal. It talks to your running Discord desktop app locally, so no tokens or logins are involved.

<br>

## 📋 Requirements

- [Node.js 18+](https://nodejs.org)
- The **Discord desktop app**, running (the browser version won't work)
- A free application from the [Discord Developer Portal](https://discord.com/developers/applications)

<br>

## 🚀 Install

```bash
git clone https://github.com/divewintr/Discord-Custom-RPC.git
cd Discord-Custom-RPC
npm install
npm start
```

<br>

## 🕹️ How to use

1. **Create an application** in the [Developer Portal](https://discord.com/developers/applications) and copy its **Application ID** from the General Information page.
2. **Open RPC Picker** with `npm start` and keep the Discord desktop app running.
3. Click the **⚙️ gear**, paste your Application ID, and choose a display mode:
   - **Name in header**: shows the game name in the "Playing ..." header (depends on your Discord client version).
   - **Details line**: the header shows your application's name, and the game name appears on the line below. Works everywhere.
4. Click the **🔄 refresh** button the first time to download the game list.
5. **Search** for a game (press `/` to jump to the search box) and **click it**. It shows on your profile within a few seconds.
6. Click **Stop** in the bottom bar to clear the presence.

<br>

## ⚠️ Disclaimer

This is a fun profile display tool. It does not track or fake playtime and does not use your user token. Discord shows the game as a custom activity from your own application, not a verified game detection. Not affiliated with or endorsed by Discord Inc. Game names and artwork belong to their respective owners.
