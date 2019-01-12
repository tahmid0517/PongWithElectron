const {app,BrowserWindow} = require('electron');

const windowWidth = 400;
const windowHeight = 380;
let mainWin;
function createMainWindow()
{
    mainWin = new BrowserWindow({width: windowWidth,height: windowHeight,show: false});
    mainWin.maxWidth = 400;
    mainWin.maxHeight = 380;
    mainWin.loadFile('./index.html');
    mainWin.setMenu(null);
    mainWin.once('ready-to-show',function()
    {
        mainWin.show();
    });
}

app.on('ready',createMainWindow);