const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { Client } = require("@xhayper/discord-rpc");

const GAMES_FILE = path.join(__dirname, "games.json");
const CATALOG_URL = "https://discord.com/api/v9/applications/detectable";

let client = null;
let currentClientId = null;

async function ensureClient(clientId) {
  if (client && currentClientId === clientId) return;
  if (client) {
    try {
      await client.destroy();
    } catch (_) {}
    client = null;
  }
  const c = new Client({ clientId });
  c.on("disconnected", () => {
    if (client === c) client = null;
  });
  await c.login();
  client = c;
  currentClientId = clientId;
}

function readGames() {
  try {
    return JSON.parse(fs.readFileSync(GAMES_FILE, "utf-8"));
  } catch (_) {
    return [];
  }
}

ipcMain.handle("games:load", () => readGames());

ipcMain.handle("games:refresh", async () => {
  const res = await fetch(CATALOG_URL);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const apps = await res.json();
  const unique = new Map();
  for (const a of apps) {
    if (a?.id && a?.name && !unique.has(a.id)) {
      unique.set(a.id, {
        id: String(a.id),
        name: a.name,
        icon: a.icon_hash ?? a.icon ?? null,
        cover: a.cover_image_hash ?? null,
      });
    }
  }
  const games = [...unique.values()].sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
  );
  fs.writeFileSync(GAMES_FILE, JSON.stringify(games, null, 2), "utf-8");
  return games;
});

ipcMain.handle(
  "rpc:start",
  async (_e, { clientId, gameName, gameId, icon, mode }) => {
    try {
      if (!/^\d{15,25}$/.test(clientId || "")) {
        return { ok: false, error: "Enter a valid application (client) ID." };
      }
      await ensureClient(clientId);

      const activity = {
        startTimestamp: Date.now(),
        instance: false,
      };

      if (mode === "name") {
        activity.name = gameName;
      } else {
        activity.details = gameName;
      }
      if (icon && gameId) {
        activity.largeImageKey = `https://cdn.discordapp.com/app-icons/${gameId}/${icon}.png?size=512`;
        activity.largeImageText = gameName;
      }

      await client.user?.setActivity(activity);
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: `${err.message || err}. Is the Discord desktop app running?`,
      };
    }
  },
);

ipcMain.handle("rpc:stop", async () => {
  try {
    await client?.user?.clearActivity();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err.message || err) };
  }
});

function createWindow() {
  const win = new BrowserWindow({
    width: 460,
    height: 640,
    minWidth: 380,
    minHeight: 480,
    backgroundColor: "#1e1f22",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.loadFile("index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", async () => {
  try {
    await client?.user?.clearActivity();
  } catch (_) {}
  try {
    await client?.destroy();
  } catch (_) {}
  app.quit();
});
