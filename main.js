const { app, BrowserWindow } = require("electron"); //destructured object
const ee = require("ejs-electron");

ee.data({
  pageName: "First Desktop App (Excel)",
  pageHeader: "This is an Excel Prototype",
  row: 1000,
  col: 26,
});
app.whenReady().then(function () {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
  });
  window.loadURL("file://" + __dirname + "/index.ejs").then(function () { //we can also use window.loadFile()
    //load ejs
    window.maximize();
    window.show();
  });
});
//below used componenets are for Mac OS (cross platform)
app.on('window-all-closed',() => {
  if(process.platform!=='darwin'){
    app.quit();
  }
})
app.on('activate', () => {
  if(BrowserWindow.getAllWindows().length===0){
    createWindow();
  }
})
