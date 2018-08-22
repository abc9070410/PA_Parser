
function main()
{
    initUI();
    addListener();
}

function initUI()
{
    log("init data");
    
    updateTitle();
    
    hideDIV("idDownloadLog");
    hideDIV("idResultTitle");
    hideDIV("idLogTitle");
    hideDIV("idProgress");
}

function initData()
{
    gaoRead = [];
    giReadDoneCnt = 0;
    giFileCnt = 0;

    gsResult = "";
    gsTempLog = "";
    gsTempErrLog = "";
    
    giPAIndex = 0;
    gaasPASeq = [];
    
    gsResult = "";
    
    initCSV();
}

function addListener()
{
    document.getElementById("idDownloadLog").addEventListener("click", downloadLog, false);
    document.getElementById("idLoadFile").addEventListener('change', handleFileSelect, false);
}


function handleFileSelect(evt) 
{
    initData();

    files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        var sInfo = '<strong>' + escape(f.name) + '</strong>';
    
        output.push('<strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                  '');
                  
        gaoRead[i] = new FileReader();
        gaoRead[i].fileInfo = f.name + " (" + f.size + "KB) " + f.lastModifiedDate;
        gaoRead[i].readAsBinaryString(f);
        gaoRead[i].onloadend = loadFileDone;
        
        giFileCnt++;
        
        break; // only parse the first file
    }
    document.getElementById('idOutput').innerHTML = '' + output.join('') + '';
    
    showDIV("idResultTitle");
    
    showDIV("idProgress");
    
    moveStatusBar();
}

function loadFileDone()
{
    log("FileInfo:" + gaoRead[giReadDoneCnt].fileInfo + " , Text length: " + gsText.length);
    //log("Text content: " + gsText);
    
    moveStatusBar(10);
    
    giReadDoneCnt++;
    
    if (giReadDoneCnt == giFileCnt)
    {
        mainWork();
    }
}

function mainWork()
{
    for (var i = 0; i < giFileCnt; i++)
    {
        //updateResult('<hr><strong>' + gaoRead[i].fileInfo + '</strong>');
        
        gsText = gaoRead[i].result;
        
        formatText();
        parseText();
    }
}

function formatText()
{
    log("Text length : " + gsText.length);
    for (var i = 0; i < 100; i ++)
    {
        gsText = gsText.replace(/\.\./g, ".");
    }
    gsText = gsText.replace(/\(H\)/g, "");
    gsText = gsText.replace(/\n\s+/g, "\n");
    log("Text length : " + gsText.length);
    
    //log(gsText);
}


function parseText()
{
    parseSequence();

    //checkVerification();
    doStatistics();
    
    moveStatusBar(100);

    showDIV("idLogTitle");
    showDIV("idDownloadLog");
}

function checkVerification()
{
    checkHIPM();
    checkDIPM();
    checkAutoP2S();
    checkAutoWakeupP2S();
    checkAutoActivate();
    checkPIOMultiple();
}

function doStatistics()
{
    buildCSV();
    drawCSV();

}

