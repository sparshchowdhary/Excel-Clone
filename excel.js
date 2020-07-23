const {app,BrowserWindow}=require('electron');
const reload = require('electron-reload');
const path = require('path');
const ejse=require('ejs-electron'); //ejs electron object

ejse.data({
  row:1000,
  col:26,
  pageName:"Excel Prototype",
  title:"Excel",
});

function createWindow(){
   const window=new BrowserWindow({
       width:800,
       height:600,
       show:false,
       webPreferences:{//to use node modules for other js file
           nodeIntegration:true,
       }
   });
   window.loadFile('index.ejs').then(function(){
      window.removeMenu();//hide electron's inbuilt menu bar
      window.maximize();//open maximized screen
      window.show();
      window.webContents.openDevTools();//open dev tools for debugging
   });
}

reload(__dirname, {
    electron: path.join(__dirname, 'node_modules/.bin/electron.cmd')
});

//for Mac OS (Quit when all windows are closed)
// On macOS it is common for applications and their menu bar
// to stay active until the user quits explicitly with Cmd + Q
app.on('window-all-closed', ()=>{
    if(process.platform!=='darwin'){
        app.quit();
    }
})
// On macOS it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
app.on('activate',()=>{
    if(BrowserWindow.getAllWindows().length===0){
        createWindow();
    }
})
app.whenReady().then(createWindow);