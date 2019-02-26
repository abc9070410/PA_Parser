
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
    
    for (var i = 0; i < (CHECK_AMOUNT + 1); i++)
    {
        gaaFISCheck[i] = [];
    }
    
    for (var i = 0; i < FIS_CHECK_END_BASE; i++)
    {
        gaaFISCheck[CHECK_TOTAL_CNT][i] = 0;
        gaaFISCheck[CHECK_PASS_CNT][i] = 0;
        gaaFISCheck[CHECK_RESULT][i] = true;
        gaaFISCheck[CHECK_DETAIL][i] = "NONE";
        gaaFISCheck[CHECK_FAIL_TRACE][i] = "";
        gaaFISCheck[CHECK_PASS_TRACE][i] = "";
        gaaFISCheck[CHECK_TOTAL_TRACE][i] = "";
        gaaFISCheck[CHECK_FOLLOW_SPEC][i] = "";
    }
    
    gaaFISCheck[CHECK_TEXT][CHECK_D2H_FIS_IDX_0] = "Device 收到 COMRESET 之後 , 都有在 100ms 內回應 D2H FIS";
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_D2H_FIS_IDX_0] = "N";
    gaaFISCheck[CHECK_TEXT][CHECK_D2H_FIS_IDX_1] = "回應 COMRESET 的 D2H FIS 內容應該是 LBA=1, SecCount=1, Error=1, Status=0x50";
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_D2H_FIS_IDX_1] = "Y";
    gaaFISCheck[CHECK_TEXT][CHECK_D2H_FIS_IDX_2] = "Device 收到 NCQ cmd 之後 , 都有在 1ms 內回應相對的 D2H FIS";
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_D2H_FIS_IDX_2] = "N";
    gaaFISCheck[CHECK_AMOUNT][CHECK_D2H_FIS_IDX_0] = 3;
    
    gaaFISCheck[CHECK_TEXT][CHECK_DATA_FIS_IDX_0] = "PIO read/write 的 Data FIS 長度是 512 Bytes 的倍數";
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_DATA_FIS_IDX_0] = "Y";
    gaaFISCheck[CHECK_TEXT][CHECK_DATA_FIS_IDX_1] = "DMA read/write 的 Data FIS 長度是 8KB 的倍數";
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_DATA_FIS_IDX_1] = "N";
    //gaaFISCheck[CHECK_TEXT][] = "Device 收到 unrecognized FIS  , 應該回應 R_ERR  ";
    gaaFISCheck[CHECK_AMOUNT][CHECK_DATA_FIS_IDX_0] = 2;
    
    gaaFISCheck[CHECK_TEXT][CHECK_LPM_IDX_0] = "Device 收到 Partial 之後 , 都有在 100us 內回應 PMACK/PMNAK";
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_LPM_IDX_0] = "N";
    gaaFISCheck[CHECK_TEXT][CHECK_LPM_IDX_1] = "Device 收到 Slumber 之後 , 都有在 100us 內回應 PMACK/PMNAK";
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_LPM_IDX_1] = "N";
    gaaFISCheck[CHECK_TEXT][CHECK_LPM_IDX_2] = "Device 啟用 DIPM 之後 , 都有在閒置 3s 內發出 PMREQ";
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_LPM_IDX_2] = "N";
    gaaFISCheck[CHECK_TEXT][CHECK_LPM_IDX_3] = "Device 若在 idle state 進入 DEVSLP state , 離開 DEVSLP state 時需發出 COMINIT";
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_LPM_IDX_3] = "SATA LOGO IPM-13";
    gaaFISCheck[CHECK_TEXT][CHECK_LPM_IDX_4] = "Device 收到 COMWAKE 後 , 需 10 us 內離開 partial state "; // IPM-01, IPM-09
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_LPM_IDX_4] = "SATA LOGO IPM-01 IPM-09";
    gaaFISCheck[CHECK_TEXT][CHECK_LPM_IDX_5] = "Device 收到 COMWAKE 後 , 需 10 ms 內離開 slumber state "; // IPM-02, IPM-10
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_LPM_IDX_5] = "SATA LOGO IPM-02 IPM-10";
    gaaFISCheck[CHECK_TEXT][CHECK_LPM_IDX_6] = "Device 退出 partial or slumber state 後的速度 , 需跟進去之前的速度一樣 (ex. 睡之前GEN2  醒來也要Gen2)"; // IPM-03, IPM-11
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_LPM_IDX_6] = "SATA LOGO IPM-03 IPM-11";
    gaaFISCheck[CHECK_TEXT][CHECK_LPM_IDX_7] = "Device 收到 PMREQ_P , 可以有兩種作法: 1. 回至少 4 個 PMACK 並且進入 Partial state  2. 回 PMNAK , 直到 host 送出 SYNC 為止"; // IPM-04, IPM-05
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_LPM_IDX_7] = "SATA LOGO IPM-04 IPM-05";
    gaaFISCheck[CHECK_TEXT][CHECK_LPM_IDX_8] = "Device 收到 PMREQ_S , 可以有兩種作法: 1. 回至少 4 個 PMACK 並且進入 Slumber state  2. 回 PMNAK , 直到 host 送出 SYNC 為止"; // IPM-04, IPM-06
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_LPM_IDX_8] = "SATA LOGO IPM-04 IPM-06";
    gaaFISCheck[CHECK_TEXT][CHECK_LPM_IDX_9] = "觸發 DEVSLP 之後 , Device 不應再送出 COMINIT , 而且也不能回應 Host 的 COMRESET"; // IPM-12
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_LPM_IDX_9] = "SATA LOGO IPM-12";
    gaaFISCheck[CHECK_TEXT][CHECK_LPM_IDX_10] = "解除 DEVSLP 之後 , Device 收到 COMRESET 需在 20ms 內回應 COMINIT"; // IPM-13
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_LPM_IDX_10] = "SATA LOGO IPM-13";
    gaaFISCheck[CHECK_AMOUNT][CHECK_LPM_IDX_0] = 11;

    gaaFISCheck[CHECK_TEXT][CHECK_OOB_IDX_0] = "收到 COMRESET 後 , device 需在 10ms 內送出 COMINIT" // ASR-01
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_OOB_IDX_0] = "ASR-01";
    gaaFISCheck[CHECK_TEXT][CHECK_OOB_IDX_1] = "連線成功之前 , device 送出每個 COMINIT 的間隔時間需大於等於 10ms"; // ASR-02
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_OOB_IDX_1] = "ASR-02";
    gaaFISCheck[CHECK_AMOUNT][CHECK_OOB_IDX_0] = 2;
    
    // PS: 對於Read Data FIS , 檢查不出長度正常但被Host 回 R_ERR的case
    gaaFISCheck[CHECK_TEXT][CHECK_NCQ_ERR_HANDLE_IDX_0] = "如果 Read Data FIS 長度錯誤 , 那 Device 需回應帶 Error 的 SDB FIS (SACTIVE=0 , ERROR=0x84)"; // could be terminated by HAMT or SYNC escape
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_NCQ_ERR_HANDLE_IDX_0] = "參考他廠";
    gaaFISCheck[CHECK_TEXT][CHECK_NCQ_ERR_HANDLE_IDX_1] = "如果 Write Data FIS 長度錯誤 , 那 Device 需回應帶 Error 的 SDB FIS (SACTIVE=0 , ERROR=0x84)"; // could be terminated by HAMT or SYNC escape
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_NCQ_ERR_HANDLE_IDX_1] = "參考他廠";
    gaaFISCheck[CHECK_TEXT][CHECK_NCQ_ERR_HANDLE_IDX_2] = "如果 Data FIS 被 PA 檢查出 Frame Length Error (Protocl Error=8) , 那 Device 需回應帶 Error 的 SDB FIS (SACTIVE=0 , ERROR=0x84)";
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_NCQ_ERR_HANDLE_IDX_2] = "參考他廠";
    gaaFISCheck[CHECK_TEXT][CHECK_NCQ_ERR_HANDLE_IDX_3] = "如果 Data FIS 被 PA 檢查出 CRC Error (Protocl Error=10) , 那 Device 需回應帶 Error 的 SDB FIS (SACTIVE=0 , ERROR=0x84)";
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_NCQ_ERR_HANDLE_IDX_3] = "參考他廠";
    gaaFISCheck[CHECK_TEXT][CHECK_NCQ_ERR_HANDLE_IDX_4] = "如果 Cmd FIS 被 PA 檢查出 Error , 那 Device 不須回應 D2H/SDB FIS";
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_NCQ_ERR_HANDLE_IDX_4] = "參考他廠";
    gaaFISCheck[CHECK_TEXT][CHECK_NCQ_ERR_HANDLE_IDX_5] = "如果 Cmd FIS 的 C-bit=0 , 那 Device 不須回應 D2H/SDB FIS";
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_NCQ_ERR_HANDLE_IDX_5] = "參考他廠";
    
    gaaFISCheck[CHECK_TEXT][CHECK_NCQ_ERR_HANDLE_IDX_6] = "如果 NCQ cmd 還沒完成前就收到 non-NCQ cmd , device 應回應帶 Error 的 D2H FIS (STATUS=0x51 , ERROR=0x4) , 並傳出結束所有 NCQ cmd 的 SDB FIS (SACTIVE=0xFFFFFFFF)"; // NCQ-03
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_NCQ_ERR_HANDLE_IDX_6] = "SATA LOGO NCQ-03";
    gaaFISCheck[CHECK_TEXT][CHECK_NCQ_ERR_HANDLE_IDX_7] = "如果 NCQ cmd 還沒完成前就收到同個 TAG 的 NCQ cmd , device 應回應帶 Error 的 D2H FIS (STATUS=0x41 , ERROR=0x4 , I=0x1) , 並傳出結束所有 NCQ cmd 的 SDB FIS (SACTIVE=0xFFFFFFFF)"; // NCQ-04
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_NCQ_ERR_HANDLE_IDX_7] = "SATA LOGO NCQ-04";
    gaaFISCheck[CHECK_AMOUNT][CHECK_NCQ_ERR_HANDLE_IDX_0] = 8;
    
    gaaFISCheck[CHECK_TEXT][CHECK_NON_NCQ_ERR_HANDLE_IDX_0] = "如果 Read Data FIS 長度錯誤 , 那 Device 需回應帶 Error 的 D2H FIS (STATUS=0x51 , ERROR=0x84)"; // could be terminated by HAMT or SYNC escape
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_NON_NCQ_ERR_HANDLE_IDX_0] = "參考他廠";
    gaaFISCheck[CHECK_TEXT][CHECK_NON_NCQ_ERR_HANDLE_IDX_1] = "如果 Write Data FIS 長度錯誤 , 那 Device 需回應帶 Error 的 D2H FIS (STATUS=0x51 , ERROR=0x84)"; // could be terminated by HAMT or SYNC escape
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_NON_NCQ_ERR_HANDLE_IDX_1] = "參考他廠";
    gaaFISCheck[CHECK_TEXT][CHECK_NON_NCQ_ERR_HANDLE_IDX_2] = "如果 Data FIS 被 PA 檢查出 Frame Length Error (Protocl Error=8) , 那 Device 需回應帶 Error 的 D2H FIS (STATUS=0x51 , ERROR=0x84)";
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_NON_NCQ_ERR_HANDLE_IDX_2] = "參考他廠";
    gaaFISCheck[CHECK_TEXT][CHECK_NON_NCQ_ERR_HANDLE_IDX_3] = "如果 Data FIS 被 PA 檢查出 CRC Error (Protocl Error=10) , 那 Device 需回應帶 Error 的 D2H FIS (STATUS=0x51 , ERROR=0x84) ??"; // terminated by SYNC or DMAT
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_NON_NCQ_ERR_HANDLE_IDX_3] = "參考他廠";
    gaaFISCheck[CHECK_TEXT][CHECK_NON_NCQ_ERR_HANDLE_IDX_4] = "如果 Cmd FIS 被 PA 檢查出錯誤 (Protocol Error != 0), 那 Device 不須回應 D2H FIS";
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_NON_NCQ_ERR_HANDLE_IDX_4] = "參考他廠";
    gaaFISCheck[CHECK_TEXT][CHECK_NON_NCQ_ERR_HANDLE_IDX_5] = "如果 Cmd FIS 的 C-bit=0 , 那 Device 不須回應 D2H FIS";
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_NON_NCQ_ERR_HANDLE_IDX_5] = "參考他廠";
    //gaaFISCheck[CHECK_TEXT][CHECK_ERR_HANDLE_IDX_8] = "如果 Non-NCQ/NCQ cmd 被 PA 檢查出 Delimiter Error (Protocl Error=13) , 那 Device 不須回應 D2H/SDB FIS ??";
    gaaFISCheck[CHECK_TEXT][CHECK_NON_NCQ_ERR_HANDLE_IDX_6] = "如果收到 FIS type 錯誤的 FIS (Protocol Error=7) , 那 Device 不須回應 D2H FIS"; // 只回應 R_ERR , GTR-05
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_NON_NCQ_ERR_HANDLE_IDX_6] = "GTR-05";
    gaaFISCheck[CHECK_AMOUNT][CHECK_NON_NCQ_ERR_HANDLE_IDX_0] = 7;
    
    gaaFISCheck[CHECK_TEXT][CHECK_OTHER_IDX_0] = "Device 啟用 Auto Activate 之後 , 第一個 DMA Setup FIS 之後不應出現 DMA Activate FIS";
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_OTHER_IDX_0] = "Y";
    gaaFISCheck[CHECK_TEXT][CHECK_OTHER_IDX_1] = "Read/Write Multiple cmd 的 Data FIS 長度都有依照之前 Set Multiple 的規範";
    gaaFISCheck[CHECK_FOLLOW_SPEC][CHECK_OTHER_IDX_1] = "Y";
    gaaFISCheck[CHECK_AMOUNT][CHECK_OTHER_IDX_0] = 2;
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
        //checkVerification();
        //detectRule();
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

