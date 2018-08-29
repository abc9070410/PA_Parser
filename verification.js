
function checkAutoP2S()
{
    log("start checkAP2S");
    
    initFailInfo();
    
    var j;
    var bAP2S = false;
    var iWakeupFromPartialCnt = 0;
    var iWakeupFromSlumberCnt = 0;
    var iEnableCnt = 0;
    
    var bPartial = false;
    var bSlumber = false;

    for (var i = 0; i < giPAIndex; i++)
    {
        if (isEnableAP2S(i))
        {
            bAP2S = true;
            iEnableCnt++;
        }
        else if (isDisableAP2S(i))
        {
            bAP2S = false;
        }
    
        if (isPartial(i))
        {
            bPartial = true;
        }
        else if (isSlumber(i))
        {
            bSlumber = true;
        }

        if (isHostOOB(i) && isComwake(i))
        {
            log("Q");
            if (isComwake(i+1))
            {
                log("XX");
                if (isWakeupFromPartial(i+1))
                {
                    iWakeupFromPartialCnt++;
                    
                    if (bAP2S)
                    {
                        setFailInfo(i+1, "AP2S 已經啟用 , 卻不是從 Slumber 醒來");
                        break;
                    }
                    bPartial = false;
                    bSlumber = false;
                }
                else if (isWakeupFromSlumber(i+1))
                {
                    iWakeupFromSlumberCnt++;
                    
                    if (!bAP2S && bPartial)
                    {
                        setFailInfo(i+1, "AP2S 尚未啟用 , Partial 入睡卻是從 Slumber 醒來");
                        break;
                    }
                    bPartial = false;
                    bSlumber = false;
                }
                else
                {
                    setFailInfo(i+1, "Device 太晚回應 COMWAKE , 等了 " + getDuration(i, i+1) + "ns 才回應");
                    break;
                }
                i++;
            }
            else
            {
                setFailInfo(i+1, "Host 發出 COMWAKE , Device 沒有馬上回 COMWAKE");
                break;
            }
        }
    }
    
    updateResultWithTab("<hr>AP2S 檢查結果: ");
    
    if (gbFail)
    {
        updateFailResult(getClaim(giFailIdx) + "發生錯誤: " + gsTempErrLog);
    }
    else if (iEnableCnt == 0)
    {
        updatePassResult("不曾啟用 AP2S");
    }
    else if (iWakeupFromPartialCnt != 0 && iWakeupFromSlumberCnt != 0)
    {
        updatePassResult(iWakeupFromPartialCnt + "次從 Partial 醒來 , " + iWakeupFromSlumberCnt + "次從 Slumber 醒來");
    }
    else if (iWakeupFromPartialCnt != 0)
    {
        updatePassResult(iWakeupFromPartialCnt + "次從Partial醒來");
    }
    else if (iWakeupFromSlumberCnt != 0)
    {
        updatePassResult(iWakeupFromSlumberCnt + "次從Partial醒來");
    }
    else
    {
        updatePassResult("沒有 Partial/Slumber 紀錄");
    }
    
    log("Check AP2S done");
}



function checkAutoWakeupP2S()
{
    log("check AutoWakeupP2S");
    
    initFailInfo();

    var bAP2S = false;
    var iAutoWakeUpCnt = 0;
    var iNoAutoWakeUpCnt = 0;
    var iWakeupFromPartialCnt = 0;
    var iWakeupFromSlumberCnt = 0;
    var iEnableCnt = 0;
    
    var bPartial = false;
    var bSlumber = false;

    for (var i = 0; i < giPAIndex; i++)
    {
        if (isEnableAP2S(i))
        {
            bAP2S = true;
            iEnableCnt++;
        }
    
        if (isPartial(i))
        {
            bPartial = true;
        }
        else if (isSlumber(i))
        {
            bSlumber = true;
        }
        
        if (isPMACK(i))
        {
            if (isDeviceOOB(i+1) && isComwake(i+1)) // device issues COMWAKE
            {
                iAutoWakeUpCnt++;
                
                i++;
                
                log("Auto Wakeup PA:" + (i+1));
                
                if (!bAP2S)
                {
                    setFailInfo(i, "AP2S 尚未啟用 , 卻發生 Auto wakeup");
                    break;
                }
                
                if (!bPartial && !bSlumber)
                {
                    setFailInfo(i, "之前沒有 Partial/Slumber , 卻發生 Auto wakeup");
                    break;
                }
                else if (bSlumber)
                {
                    setFailInfo(i, "之前睡 Slumber , 卻發生 Auto wakeup");
                    break;
                }

                if (!isHostOOB(i+2) || !isComwake(i+2))
                {
                    setFailInfo(i, "device 發出 COMWAKE 之後 , Host 沒有緊接發出 COMWAKE");
                    break;
                }
                
                bPartial = false;
                bSlumber = false;
            }
            else
            {
                iNoAutoWakeUpCnt++;
                
                log("No Auto Wakeup PA:" + (i+1));
                
                if (bAP2S && bPartial)
                {
                    setFailInfo(i, "AP2S 已經啟用 , Device 從 Partial 入睡 , 卻沒有 Auto wakeup");
                    break;
                }
            }
        }
        
        if (isHostOOB(i) && isComwake(i))
        {
            if (isDeviceOOB(i+1) && isComwake(i+1))
            {
                if (isWakeupFromPartial(i+1))
                {
                    iWakeupFromPartialCnt++;
                    
                    if (bAP2S)
                    {
                        setFailInfo(i+1, "AP2S 已經啟用 , 卻還是從 Partial 醒來");
                        break;
                    }
                }
                else if (isWakeupFromSlumber(i+1))
                {
                    iWakeupFromSlumberCnt++;
                    
                    if (!bAP2S && bPartial)
                    {
                        setFailInfo(i+1, "AP2S 尚未啟用 , 從 Partial 入睡 , 卻從 Slumber 醒來");
                        break;
                    }
                }
                else
                {
                    setFailInfo(i+1, "Device 太晚回應 COMWAKE , 等了 " + getDuration(i, i+1) + "ns 才回應");
                    break;
                }
                i++;
                
                bPartial = false;
                bSlumber = false;
            }
            else
            {
            
            }
        }
    }
    
    updateResultWithTab("<hr>AWP2S 檢查結果: ");
    
    if (gbFail)
    {
        updateFailResult(getClaim(giFailIdx) + "發生錯誤: " + gsTempErrLog);
    }
    else if (iEnableCnt == 0)
    {
        updatePassResult("不曾啟用 AP2S");
    }
    else if (iAutoWakeUpCnt != 0 && iNoAutoWakeUpCnt != 0)
    {
        giAWP2SCheckResult = AWP2S_NOT_ALL_AUTO_WAKE_UP;
        updateFailResult("不是每次都auto wakeup");
    }
    else if (iAutoWakeUpCnt != 0)
    {
        giAWP2SCheckResult = AWP2S_ALL_AUTO_WAKE_UP;
        updatePassResult("每次都auto wakeup");
    }
    else if (iNoAutoWakeUpCnt != 0)
    {
        giAWP2SCheckResult = AWP2S_NO_AUTO_WAKE_UP;
        updatePassResult("都沒有auto wakeup");
    }
    else if (iWakeupFromPartialCnt != 0 || iWakeupFromSlumberCnt != 0)
    {
        updatePassResult("從 Partial 醒來" + iWakeupFromPartialCnt + "次 , 從 Slumber 醒來" + iWakeupFromSlumberCnt + "次");
    }
    else
    {
        giAWP2SCheckResult = AWP2S_NO_PMREQ;
        updatePassResult("都沒有PMREQ");
    }
    

    
    log("Check AWP2S: " + giAWP2SCheckResult);
}

function checkDIPM()
{
    // device PM_REQP/PM_REQS after idle 100ms -> enable DIPM 
    // no PM_REQP/PM_REQS after idle 100ms -> disable DIPM
    
    log("check DIPM");
    
    initFailInfo();

    var bDIPM = false;
    var iPMReq;
    var iACKCnt = 0;
    var iNAKCnt = 0;
    var iPartialReqCnt = 0;
    var iSlumberReqCnt = 0;
    var iEnableCnt = 0;
    
    var iThreshold = 100 * 1000 * 1000; // deafult 100ms
    
    for (var i = 0; i < giPAIndex; i++)
    {
        if (isEnableDIPM(i))
        {
            bDIPM = true;
            log("ENABLE DIPM");
            iEnableCnt++;
        }
        else if (isDisableDIPM(i))
        {
            bDIPM = false;
        }
        
        if (bDIPM && !isPMACK(i))
        {
            if (getIdleTime(i, i+1) > iThreshold && !isPartial(i+1) && !isSlumber(i+1))
            {
                setFailInfo(i+1, "啟用 DIPM 後 , 閒置超過" + getIdleTime(i, i+1) + "ns , Device 沒有發出 PMREQ");
                break;
            }
        }

        if (isDevicePrimitive(i))
        {
            if (isPartial(i))
            {
                iPartialReqCnt++;
            }
            else if (isSlumber(i))
            {
                iSlumberReqCnt++;
            }        
            else
            {
                continue;
            }
            
            var iIdleTime = getIdleTime(i-1, i);
            
            if (iIdleTime > giMaxDIPMIdleTime)
            {
                giMaxDIPMIdleTime = iIdleTime;
            }
            
            if (!bDIPM)
            {
                setFailInfo(i, "DIPM 尚未啟用 , Device 卻發出 PMREQ");
                break;
            }
        }
    }
    
    updateResultWithTab("<hr>DIPM 檢查結果: ");
    
    if (gbFail)
    {
        updateFailResult(getClaim(giFailIdx) + "發生錯誤: " + gsTempErrLog);
    }
    else if (iEnableCnt == 0)
    {
        updatePassResult("不曾啟用 DIPM");
    }
    else if (iPartialReqCnt == 0 && iSlumberReqCnt == 0)
    {
        updatePassResult("Device 沒有發出 Partial/Slumber");
    }
    else
    {
        updatePassResult(iEnableCnt + "次啟用 DIPM , 最長閒置時間:" + (giMaxDIPMIdleTime / 1000000) + "ms , Device 發出" + iPartialReqCnt + "次 Partial , " + iSlumberReqCnt + "次 Slumber");
    }
    
    log("Check DIPM done");
}


function checkHIPM()
{
    // host PM_REQP -> device PM_ACK -> enable HIPM
    // host PM_REQP -> device PM_NAK -> disable HIPM
    
    log("start checkHIPM");
    
    initFailInfo();

    var iPMReq;
    var iACKCnt = 0;
    var iNAKCnt = 0;
    var iPMReqCnt = 0;
    
    for (var i = 0; i < giPAIndex; i++)
    {
        // step 1. check PMREQ_S/PMREQ_P from Host
        if (isHostPrimitive(i) && isPMREQ(i))
        {
            iPMReqCnt++;
            
            var bFail = true;

            // step 2. check the next primitive is PMACK/PMNAK or not
            if (isDevicePrimitive(i+1))
            {
                if (isPMACK(i+1))
                {
                    iACKCnt++;
                    bFail = false;
                }
                else if (isPMNAK(i+1))
                {
                    iNAKCnt++;
                    bFail = false;
                }
            }
            
            if (isDevicePrimitive(i-1))
            {
                if (isPMACK(i-1) || isPMNAK(i-1))
                {
                    if (getEndTime(i-1) >= getStartTime(i))
                    {
                        // the previous ACK/NAK overlaps with the current PMREQ
                        bFail = false;
                    }
                }                
            }
            
            if (bFail)
            {
                setFailInfo(i, "PMREQ 之後沒有 PMACK 或 PMNAK");
                break;
            }
            else
            {
                log("Exist " + gaasPrimitiveSeq[gaasPASeq[i][IDX_PA_NO]][IDX_PRIMITIVE_TYPE]);
            }
        }
    }
    
    updateResultWithTab("<hr>HIPM 檢查結果: ");
    
    if (gbFail)
    {
        updateFailResult(getClaim(giFailIdx) + "發生錯誤: " + gsTempErrLog);
    }
    else if (iPMReqCnt == 0)
    {
        updatePassResult("Host 不曾發出 PMREQ");
    }
    else
    {
        updatePassResult(iPMReqCnt + "次 PMREQ , " + iACKCnt + "次 PMACK , " + iNAKCnt + "次 PMNAK");
    }
    
    log("Check HIPM done");
}

function checkAutoActivate()
{
    // disable: 41->39->46->39->46->39->46
    // enable : 41----->46->39->46->39->46

    log("check AutoActivate");
    
    initFailInfo();

    var bAutoActivate = false;
    var iDMACmdCnt = 0;
    var iEnableCnt = 0;
    
    for (var i = 0; i < giPAIndex; i++)
    {
        if (isEnableAutoActivate(i))
        {
            bAutoActivate = true;
            iEnableCnt++;
        }
        else if (isDisableAutoActivate(i))
        {
            bAutoActivate = false;
        }
        
        if (isDMASetupFIS(i))
        {
            iDMACmdCnt++;
            
            if (isDMAActivateFIS(i+1))
            {
                if (bAutoActivate)
                {
                    setFailInfo(i+1, "AutoActivate 已經啟用 , DMA Setup FIS 之後卻出現 DMA Activate FIS");
                    break;
                }
            }
            else 
            {
                if (!bAutoActivate)
                {
                    setFailInfo(i+1, "AutoActivate 尚未啟用 , DMA Setup FIS 之後卻沒有 DMA Activate FIS");
                    break;
                }
            }
        }
    }
    
    updateResultWithTab("<hr>AutoActivate 檢查結果: ");
    
    if (gbFail)
    {
        updateFailResult(getClaim(giFailIdx) + "發生錯誤: " + gsTempErrLog);
    }
    else if (iEnableCnt == 0)
    {
        updatePassResult("不曾啟用 AutoActivate");
    }
    else if (iDMACmdCnt == 0)
    {
        updatePassResult("不曾出現 DMA read/write cmd");
    }
    else
    {
        updatePassResult(iEnableCnt + "次啟用 Auto Activate , 共 " + iDMACmdCnt + " 個 DMA read/write cmd");
    }
    
    log("check AutoActivate done");
}

function checkPIOMultiple()
{
    log("start checkPIOMultiple");
    
    initFailInfo();

    var bSetMultiple = false;
    var bDoingRW = false;
    var iMultipleCnt = 0;
    var iDataSectCnt = 0;
    var iDataFISCnt = 0;
    var iExpectDataFISCnt = 0;
    var iTotalDataFISCnt = 0;
    var iSetMultipleCnt = 0;
    
    for (var i = 0; i < giPAIndex; i++)
    {
        if (isSetMultiple(i))
        {
            iMultipleCnt = getSectorCnt(i);
            iSetMultipleCnt++;
            bSetMultiple = true;
        }
        
        if (isReadWriteMultiple(i))
        {
            if (bSetMultiple)
            {
                iDataSectCnt = getSectorCnt(i);
                iExpectDataFISCnt = Math.ceil(iDataSectCnt / iMultipleCnt);
                bDoingRW = true;
                
                continue;
            }
            else
            {
                setFailInfo(i, "尚未做 Set Multiple 就做 Read/Write Multiple");
                break;
            }
        }
        
        if (bDoingRW)
        {
            if (isDataFIS(i))
            {
                iDataFISCnt++;
                iTotalDataFISCnt++;
            }
            else if (isPIOSetupFIS(i))
            {
            }
            else // D2H FIS or other cmd FIS, indicate transfer done
            {
                if (iDataFISCnt != iExpectDataFISCnt)
                {
                    setFailInfo(i, "要求傳 " + (iDataSectCnt / 2) + "KB , 預期有 " + iExpectDataFISCnt + " 個 Data FIS , 但卻只有 " + iDataFISCnt + " 個");
                    break;
                }
            
                bDoingRW = 0;
                iDataFISCnt = 0;
            }
        }
    }
    
    updateResultWithTab("<hr>PIOMultiple 檢查結果: ");
    
    if (gbFail)
    {
        updateFailResult(getClaim(giFailIdx) + "發生錯誤: " + gsTempErrLog);
    }
    else if (bSetMultiple && iTotalDataFISCnt != 0)
    {
        updatePassResult(iSetMultipleCnt + " 次 Set Multiple , 共 " + iTotalDataFISCnt + " 個 Data FIS");
    }
    else if (bSetMultiple)
    {
        updatePassResult("只有 Set Multiple , 沒有 Read/Write Multiple");
    }
    else
    {
        updatePassResult("沒有 Set Multiple 也沒有 Read/Write Multiple");
    }
}

function checkDataFIS()
{
    log("start check DataFIS");
    
    initFailInfo();
    
    for (var i = 0; i < giPAIndex; i++)
    {
        if (isFIS(i) && !isNonDataCmd(i))
        {
            var iDataLength = getDataFISLength(i);
            
            log(getClaim(i) + ":" + iDataLength);
            
            if (isDMACmd(i)) // DMA read/write cmd
            {
                if ((iDataLength % 8192) != 0)
                {
                    setFailInfo(i, "Data FIS 資料長度並沒有 aligned 8KB");
                }
            }
            else // PIO read/write cmd
            {
                if ((iDataLength % 512) != 0)
                {
                    setFailInfo(i, "Data FIS 資料長度並沒有 aligned 512Bytes");
                }
            }
        }
    }
    
    updateResultWithTab("<hr>DataFIS 檢查結果: ");
    
    if (gbFail)
    {
        updateFailResult(getClaim(giFailIdx) + "發生錯誤: " + gsTempErrLog);
    }
    else
    {
        updatePassResult("Data FIS 資料長度都符合預期");
    }
}
