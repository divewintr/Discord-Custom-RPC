const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  loadGames: () => ipcRenderer.invoke("games:load"),
  refreshGames: () => ipcRenderer.invoke("games:refresh"),
  start: payload => ipcRenderer.invoke("rpc:start", payload),
  stop: () => ipcRenderer.invoke("rpc:stop")
});
