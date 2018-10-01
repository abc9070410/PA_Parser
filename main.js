
function main()
{
    initUI();
    addListener();
}

function initUI()
{
    log("init data");
    
    updateTitle();
    
    hideDIV("idResultTitle");
    hideDIV("idLogTitle");
    hideDIV("idProgress");
        
    hideDIV("idDownloadLog");
    hideDIV("idDownloadErrLog");
    hideDIV("idDownloadErrCSV");    
    
    var n = b_crc32("https://stackoverflow.com/questions/18638900/javascript-crc32");
    
    err("CRC:" + n + "_" + n.toString(16));
    
}

function initData()
{
    gaoRead = [];
    giReadDoneCnt = 0;
    giFileCnt = 0;

    gsResult = "";
    gsTempLog = "";
    gsTempErrLog = "";
    gsTempFailLog = "";
    
    giPAIndex = 0;
    gaasPASeq = [];
    
    gsResult = "";
    
    initCSV();
    
    initTypeInfo();
}

function initTypeInfo()
{
    for (var i = 0; i < I_CMD_TYPE_AMOUNT; i++)
    {
        gaiCmdDrawCnt[i] = 0;
    }
    
    for (var i = 0; i < I_COMWAKE_TYPE_AMOUNT; i++)
    {
        gaiComwakeDrawCnt[i] = 0;
    }
    
    for (var i = 0; i < I_PARTIAL_TYPE_AMOUNT; i++)
    {
        gaiPartialDrawCnt[i] = 0;  
    }  
    
    for (var i = 0; i < I_SLUMBER_TYPE_AMOUNT; i++)
    {
        gaiSlumberDrawCnt[i] = 0;
    }
}

function addListener()
{
    document.getElementById("idLoadFile").addEventListener('change', handleFileSelect, false);
    
    document.getElementById("idDownloadLog").addEventListener("click", downloadLog, false);
    document.getElementById("idDownloadErrLog").addEventListener("click", downloadErrLog, false);
    document.getElementById("idDownloadErrCSV").addEventListener("click", downloadErrCSV, false);
}


function handleFileSelect(evt) 
{
    initData();

    files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        var sInfo = '<strong>' + escape(f.name) + '</strong>';
        
        gsNowFileName = f.name.split(/\./)[0];
    
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
    // ex. before: C.......................................0(H)
    //     after : C_BIT...................................0(H)
    gsText = gsText.replace(/C\.\.\.\./g, "C_BIT");
    
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

    if (!gbParseError || gbSkipParseError)
    {
        checkVerification();
        detectRule();
        doStatistics();
    }
    
    moveStatusBar(100);

    showDIV("idLogTitle");
    
    showDIV("idDownloadLog");
    showDIV("idDownloadErrLog");
    showDIV("idDownloadErrCSV");
}

function checkVerification()
{
    checkHIPM();
    checkDIPM();
    checkAutoP2S();
    checkAutoWakeupP2S();
    checkAutoActivate();
    checkPIOMultiple();
    checkDataFIS();
}

function detectRule()
{
    detectFIS();
    detectFSM();
}

function detectFSM()
{
    formatPrimitiveFSM();
    detectPrimitiveFSM();
}

function doStatistics()
{
    buildCSV();
    drawCSV();

}

