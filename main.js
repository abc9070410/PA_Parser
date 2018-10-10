
function main()
{
    initUI();
    addListener();
}

function addListener()
{
    document.getElementById("idLoadFile").addEventListener('change', handleFileSelect, false);
    
    document.getElementById("idDownloadLog").addEventListener("click", downloadLog, false);
    document.getElementById("idDownloadErrLog").addEventListener("click", downloadErrLog, false);
    document.getElementById("idDownloadCheckCSV").addEventListener("click", downloadCheckCSV, false);
    document.getElementById("idDownloadErrCSV").addEventListener("click", downloadErrCSV, false);
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
    hideDIV("idDownloadCheckCSV");
    hideDIV("idDownloadErrCSV");
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
    
    initCheckList();
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

function initCheckList()
{
    var iCnt = 0;
    var iBase = 0;

    gaaFISCheck[CHECK_TEXT] = [];
    gaaFISCheck[CHECK_COUNT] = [];
    gaaFISCheck[CHECK_RESULT] = [];
    gaaFISCheck[CHECK_DETAIL] = [];
    gaaFISCheck[CHECK_AMOUNT] = [];
    
    for (var i = 0; i < FIS_CHECK_END_BASE; i++)
    {
        gaaFISCheck[CHECK_COUNT][i] = 0;
        gaaFISCheck[CHECK_RESULT][i] = true;
        gaaFISCheck[CHECK_DETAIL][i] = "NONE";
    }

    iCnt = 0;
    iBase = FIS_CHECK_D2H_FIS_BASE[1];
    
    gaaFISCheck[CHECK_TEXT][iBase + (iCnt++)] = "Device 收到 COMRESET 之後 , 都有在 1ms 內回應 D2H FIS";
    gaaFISCheck[CHECK_TEXT][iBase + (iCnt++)] = "回應 COMRESET 的 D2H FIS 內容應該是 LBA=1, SecCount=1, Error=1, Status=0x50";
    gaaFISCheck[CHECK_TEXT][iBase + (iCnt++)] = "Device 收到 NCQ cmd 之後 , 都有在 1ms 內回應相對的 D2H FIS";
    gaaFISCheck[CHECK_AMOUNT][iBase] = iCnt;
    
    iCnt = 0;
    iBase = FIS_CHECK_DATA_FIS_BASE[1];
    
    gaaFISCheck[CHECK_TEXT][iBase + (iCnt++)] = "PIO read/write 的 Data FIS 長度是 512 Bytes 的倍數";
    gaaFISCheck[CHECK_TEXT][iBase + (iCnt++)] = "DMA read/write 的 Data FIS 長度是 8KB 的倍數";
    gaaFISCheck[CHECK_TEXT][iBase + (iCnt++)] = "如果 Non NCQ read/write cmd 的 Data FIS 長度錯誤 , 那 Device 需回應帶 Error 的 D2H FIS";
    gaaFISCheck[CHECK_TEXT][iBase + (iCnt++)] = "如果 NCQ read/write cmd 的 Data FIS 長度錯誤 , 那 Device 需回應帶 Error 的 SDB FIS";
    gaaFISCheck[CHECK_AMOUNT][iBase] = iCnt;
    
    
    iCnt = 0;
    iBase = FIS_CHECK_LPM_BASE[1];
    
    gaaFISCheck[CHECK_TEXT][iBase + (iCnt++)] = "Device 收到 Partial 之後 , 都有在 1us 內回應 PMACK/PMNAK";
    gaaFISCheck[CHECK_TEXT][iBase + (iCnt++)] = "Device 收到 Slumber 之後 , 都有在 1us 內回應 PMACK/PMNAK";
    gaaFISCheck[CHECK_TEXT][iBase + (iCnt++)] = "Device 從 Partial 入睡 , 收到 COMWAKE 之後 , 都有在 1us 內回應 COMWAKE";
    gaaFISCheck[CHECK_TEXT][iBase + (iCnt++)] = "Device 從 Slumber 入睡 , 收到 COMWAKE 之後 , 都有在 1us 內回應 COMWAKE";
    gaaFISCheck[CHECK_TEXT][iBase + (iCnt++)] = "Device 啟用 DIPM 之後 , 都有在閒置 3s 內發出 PMREQ";
    gaaFISCheck[CHECK_AMOUNT][iBase] = iCnt;

    iCnt = 0;
    iBase = FIS_CHECK_OTHER_BASE[1];
    
    gaaFISCheck[CHECK_TEXT][iBase + (iCnt++)] = "Device 啟用 Auto Activate 之後 , 第一個 DMA Setup FIS 之後卻有出現 DMA Activate FIS";
    gaaFISCheck[CHECK_TEXT][iBase + (iCnt++)] = "Read/Write Multiple cmd 的 Data FIS 長度都有依照之前 Set Multiple 的規範";
    gaaFISCheck[CHECK_AMOUNT][iBase] = iCnt;
    
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
    
    buildCheckCSV();

    showDIV("idLogTitle");
    
    showDIV("idDownloadLog");
    showDIV("idDownloadErrLog");
    showDIV("idDownloadCheckCSV");
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

