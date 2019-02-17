
function parseFIS(asLineToken, iTextLineIdx)
{
    // Port: I1
    // Start time: 13.670.007.046 (s)
    // FIS Type................................27(H)
    // PM Port.................................0(H)
    // Reserved................................0(H)
    // Reserved................................0(H)
    // Reserved................................0(H)
    // C.......................................1(H)
    // Command.................................EF(H)
    // Features................................90(H)
    // LBA Low.................................00(H)
    // LBA Mid.................................00(H)
    // LBA High................................00(H)
    // Device..................................E0(H)
    // LBA Low (exp)...........................00(H)
    // LBA Mid (exp)...........................00(H)
    // LBA High (exp)..........................00(H)
    // Features (exp)..........................00(H)
    // Sector Count............................02(H)
    // Sector Count (exp)......................00(H)
    // ICC.....................................00(H)
    // Control.................................00(H)
    // Auxiliary(7:0)..........................00(H)
    // Auxiliary(15:8).........................00(H)
    // Auxiliary(23:16)........................00(H)
    // Auxiliary(31:24)........................00(H)
    // CRC.....................................ADC96106(H)
    // Duration Time: 666 (ns)

    initPA(giPAIndex, TYPE_FIS, giFISIndex, asLineToken[iTextLineIdx]);
    initFIS(giFISIndex);

    log("No." + giPAIndex + " PA - " + "NO." + giFISIndex + " FIS");

    var bIsData = false;
    var iLength = asLineToken.length;
                
    for (var j = iTextLineIdx + 2; j < iLength; j++)
    {
        var asTemp = asLineToken[j].split(/\./);

        var k;
        for (k = 0; k < IDX_FIS_AMOUNT; k++)
        {
            if (asTemp[0].indexOf(TAG_FIS[k][0]) == 0)
            {
                var sBefore = gaasFISSeq[giFISIndex][TAG_FIS[k][1]];
                gaasFISSeq[giFISIndex][TAG_FIS[k][1]] = asTemp[1].trim();
                
                if (sBefore && sBefore != "")
                {
                    gaasFISSeq[giFISIndex][TAG_FIS[k][1]] += sBefore.trim();
                }

                log("match " + TAG_FIS[k][0] + " : " + TAG_FIS[k][1] + "," + gaasFISSeq[giFISIndex][TAG_FIS[k][1]]);
                
                if (k == IDX_FIS_DATA)
                {
                    bIsData = true;
                    
                    break;
                }
                else if (bIsData && k == IDX_FIS_CRC)
                {
                    bIsData = false;
                    
                    var sData =  gaasFISSeq[giFISIndex][TAG_FIS[IDX_FIS_DATA][1]];
                    
                    log(getClaim(giPAIndex) + ": Data length:" + (sData.length / 2));
                    //err(gaasFISSeq[giFISIndex][TAG_FIS[IDX_FIS_DATA][1]]);

                    break;
                }
            }
        }
        
        if (k == IDX_FIS_DATA)
        {
            continue; // go to check the following lines
        }

        // ex.
        // Data....................................19D108000000000010000000100000001000000010000000
        //                                         100000001000000010000000100000001000000010000000
        //                                         100000001000000010000000100000001000000010000000
        //                                         100000001000000010000000100000001000000010000000
        //                                         100000001000000010000000100000001000000010000000
        //                                         100000001000000010000000100000001000000010000000
        //                                         100000001000000010000000100000001000000010000000
        //                                         100000001000000010000000100000001000000010000000
        //                                         100000001000000010000000100000001000000010000000
        //                                         100000001000000010000000100000001000000010000000
        //                                         100000001000000010000000100000001000000010000000
        //                                         100000001000000010000000100000001000000010000000
        //                                         100000001000000010000000100000001000000010000000
        //                                         100000001000000010000000100000001000000010000000
        //                                         100000001000000010000000100000001000000010000000
        //                                         100000001000000010000000100000001000000010000000
        //                                         100000001000000010000000100000001000000010000000
        //                                         100000001000000010000000100000001000000010000000
        //                                         100000001000000010000000100000001000000010000000
        //                                         100000001000000010000000100000001000000010000000
        //                                         100000001000000010000000100000001000000010000000
        //                                         0000000019D10800(H)
        // CRC.....................................5DA42C6E(H)
        if (bIsData)
        {
            // add Data from the second line
            gaasFISSeq[giFISIndex][TAG_FIS[IDX_FIS_DATA][1]] += asLineToken[j].trim();
        }
        
        asTemp = asLineToken[j].split(/:/);
        
        for (var k = 0; k < IDX_INFO_AMOUNT; k++)
        {
            if (asTemp[0].indexOf(TAG_INFO[k][0]) == 0)
            {
                var iAdditionIdx = IDX_FIS_AMOUNT + TAG_INFO[k][1];
                gaasFISSeq[giFISIndex][iAdditionIdx] = asTemp[1].trim();
                
                log("match " + TAG_INFO[k][0] + " : " + iAdditionIdx + "," + gaasFISSeq[giFISIndex][iAdditionIdx]);
            }
        }
        
        if (asTemp[0].indexOf("_____________________________________________________________") == 0)
        {
            break; // the last line for this FIS
        }   
    }
    
    giFISIndex++;
    giPAIndex++;
}

function parseOOB(asLineToken, iTextLineIdx)
{
    // Port: T1
    // Start time: 15.350.761.493 (s)
    // OOB Type................................COMWAKE(H)
    //         -Burst...................................180 OOBI(H)
    //         -Idle....................................140 OOBI(H)
    //         -Burst...................................180 OOBI(H)
    //         -Idle....................................140 OOBI(H)
    //         -Burst...................................180 OOBI(H)
    //         -Idle....................................140 OOBI(H)
    //         -Burst...................................180 OOBI(H)
    //         -Idle....................................140 OOBI(H)
    //         -Burst...................................180 OOBI(H)
    //         -Idle....................................140 OOBI(H)
    //         -Burst...................................180 OOBI(H)
    //         -Negation Time...........................260 OOBI(H)
    // Duration Time: 1.360 (us)

    initPA(giPAIndex, TYPE_OOB, giOOBIndex, asLineToken[iTextLineIdx]);
    initOOB(giOOBIndex);
    

    log("No." + giPAIndex + " PA - " + "NO." + giOOBIndex + " OOB");

    for (var j = iTextLineIdx + 2; j < asLineToken.length; j++)
    {
        var asTemp = asLineToken[j].split(/\./);

        for (var k = 0; k < IDX_OOB_AMOUNT; k++)
        {
            if (asTemp[0].indexOf(TAG_OOB[k][0]) == 0)
            {
                gaasOOBSeq[giOOBIndex][TAG_OOB[k][1]] = asTemp[1];
                log("match " + TAG_OOB[k][0] + " : " + TAG_OOB[k][1] + "," + gaasOOBSeq[giOOBIndex][TAG_OOB[k][1]]);
            }
        }
        
        asTemp = asLineToken[j].split(/:/);
        
        for (var k = 0; k < IDX_INFO_AMOUNT; k++)
        {
            if (asTemp[0].indexOf(TAG_INFO[k][0]) == 0)
            {
                var iAdditionIdx = IDX_OOB_AMOUNT + TAG_INFO[k][1];
                gaasOOBSeq[giOOBIndex][iAdditionIdx] = asTemp[1];
                
                log("match " + TAG_INFO[k][0] + " : " + iAdditionIdx + "," + gaasOOBSeq[giOOBIndex][iAdditionIdx]);
            }
        }
        
        if (asTemp[0].indexOf("_____________________________________________________________") == 0)
        {
            break; // the last line for this OOB
        }   
    }
    
    giOOBIndex++;
    giPAIndex++;
}


function parsePrimitive(asLineToken, iTextLineIdx)
{
    // Port: I1
    // Start time: 10.071.393.046 (s)
    //                   __Host____________________________________RD__
    //                     SATA_PMREQ_P  (x2)                      +---
    // Duration Time: 53 (ns)    

    initPA(giPAIndex, TYPE_PRIMITIVE, giPrimitiveIndex, asLineToken[iTextLineIdx]);
    initPrimitive(giPrimitiveIndex);
    
    log("No." + giPAIndex + " PA - " + "NO." + giPrimitiveIndex + " Primitive");
                
    var iLength = asLineToken.length;

    for (var j = iTextLineIdx + 2; j < iLength; j++)
    {        
        if (asLineToken[j].indexOf(TAG_PRIMITIVE[IDX_PRIMITIVE_SENDER][0]) > 0)
        {
            gaasPrimitiveSeq[giPrimitiveIndex][IDX_PRIMITIVE_SENDER] = asLineToken[j].replace(/_/g, "").replace("RD", "");
            
            log("match " + TAG_PRIMITIVE[IDX_PRIMITIVE_SENDER][0] + " : " + TAG_PRIMITIVE[IDX_PRIMITIVE_SENDER][1] + "," + gaasPrimitiveSeq[giPrimitiveIndex][IDX_PRIMITIVE_SENDER]);
        }
        else if (asLineToken[j].indexOf(TAG_PRIMITIVE[IDX_PRIMITIVE_TYPE][0]) >= 0)
        {
            gaasPrimitiveSeq[giPrimitiveIndex][IDX_PRIMITIVE_TYPE] = asLineToken[j];
            
            log("match " + TAG_PRIMITIVE[IDX_PRIMITIVE_TYPE][0] + " : " + TAG_PRIMITIVE[IDX_PRIMITIVE_TYPE][1] + "," + gaasPrimitiveSeq[giPrimitiveIndex][IDX_PRIMITIVE_TYPE]);
        }
        
        asTemp = asLineToken[j].split(/:/);
        
        for (var k = 0; k < IDX_INFO_AMOUNT; k++)
        {
            if (asTemp[0].indexOf(TAG_INFO[k][0]) == 0)
            {
                var iAdditionIdx = IDX_PRIMITIVE_AMOUNT + TAG_INFO[k][1];
                gaasPrimitiveSeq[giPrimitiveIndex][iAdditionIdx] = asTemp[1];
                
                log("match " + TAG_INFO[k][0] + " : " + iAdditionIdx + "," + gaasPrimitiveSeq[giPrimitiveIndex][iAdditionIdx]);
            }
        }
        
        if (asTemp[0].indexOf("_____________________________________________________________") == 0)
        {
            break; // the last line for this Primitive
        }   
    }
    
    giPrimitiveIndex++;
    giPAIndex++;
}


function parseMultiPrimitive(asLineToken, iTextLineIdx)
{
    // Port: I1
    // Start time: 3.633.641.753 (s)
    // FIS Type................................27(H)
    // Link Data ........
    //                   __Initiator_______________________________RD__   __Target__________________________________RD__
    //                     SATA_X_RDY                              +--+     XXXX                                    ++--
    //                     SATA_X_RDY                              -++-     XXXX                                    --+-
    //                     SATA_CONT                               +--+     XXXX                                    --++
    //                     XXXX  (x15)                             -+--     XXXX  (x15)                             +-+-
    //                     XXXX                                    +-+-     SATA_R_RDY                              -+--
    //                     XXXX                                    -+++     SATA_R_RDY                              -+--
    //                     XXXX                                    -+--     SATA_CONT                               -++-
    //                     XXXX  (x32)                             +-++     XXXX  (x32)                             -++-
    //                     SATA_SOF                                -++-     XXXX                                    -++-
    //                     Payload                                 +++-                                          ++++
    //                     8C92760B                                --++     XXXX                                    ++++
    //                     SATA_EOF                                -+++     XXXX                                    ++--
    //                     SATA_WTRM                               +--+     XXXX                                    ++--
    //                     SATA_WTRM                               -++-     XXXX                                    ++++
    //                     SATA_CONT                               +--+     XXXX                                    --++
    //                     XXXX  (x6)                              -++-     XXXX  (x6)                              +-+-
    //                     XXXX                                    -+--     SATA_R_IP                               -+++
    //                     XXXX                                    -+--     SATA_R_IP                               +---
    //                     XXXX                                    +---     SATA_CONT                               -++-
    //                     XXXX  (x6)                              -++-     XXXX  (x6)                              ++-+
    //                     XXXX                                    --++     SATA_R_OK                               -+++
    //                     XXXX                                    -++-     SATA_R_OK                               +---
    //                     XXXX                                    ---+     SATA_CONT                               -++-
    //                     XXXX  (x31)                             ++-+     XXXX  (x31)                             -+-+
    //                     SATA_SYNC                               +-++     XXXX                                    +++-
    //                     SATA_SYNC                               +-++     XXXX                                    ++-+
    //                     SATA_CONT                               +--+     XXXX                                    ++--
    //                     XXXX  (x14)                             ++-+     XXXX  (x14)                             ++--
    //                     XXXX                                    ++-+     SATA_SYNC                               +-++
    // Duration Time: 3.493 (us)

    initPA(giPAIndex, TYPE_MULTI_PRIMITIVE, giMultiPrimitiveIndex, asLineToken[iTextLineIdx]);
    initMultiPrimitive(giMultiPrimitiveIndex);

    log("No." + giPAIndex + " PA - " + "NO." + giMultiPrimitiveIndex + " MultiPrimitive");
                
    var iLength = asLineToken.length;
    var bStartParseMulti = false;
    var iFirstLineIdx = 0;
    var iLastLineIdx = 0;
    var iFSMIdx = 0;
    
    var bSOF = false;
    var bPayload = false;
    var bCRC = false;
    var bEOF = false;

    for (var j = iTextLineIdx + 2; j < iLength; j++)
    {     
        var bField = false;
        var asTemp = asLineToken[j].split(/\./);

        for (var k = 0; k < IDX_MULTI_PRIMITIVE_AMOUNT; k++)
        {
            if (asTemp[0].indexOf(TAG_MULTI_PRIMITIVE[k][0]) == 0)
            {
                gaasMultiPrimitiveSeq[giMultiPrimitiveIndex][TAG_MULTI_PRIMITIVE[k][1]] = asTemp[1].trim();
                bField = true;
            }
        }

        var bInfo = false;
        asTemp = asLineToken[j].split(/:/);
        
        for (var k = 0; k < IDX_INFO_AMOUNT; k++)
        {
            if (asTemp[0].indexOf(TAG_INFO[k][0]) == 0)
            {
                var iAdditionIdx = IDX_MULTI_PRIMITIVE_AMOUNT + TAG_INFO[k][1];
                gaasMultiPrimitiveSeq[giMultiPrimitiveIndex][iAdditionIdx] = asTemp[1];
                
                log("match " + TAG_INFO[k][0] + " : " + iAdditionIdx + "," + 
                    gaasMultiPrimitiveSeq[giMultiPrimitiveIndex][iAdditionIdx]);
                bInfo = true;
            }
        }
        
        if (asTemp[0].indexOf(S_MULTI_PRIMITIVE_FIRST_LINE) == 0 ||
            asTemp[0].indexOf(S_MULTI_PRIMITIVE_FIRST_LINE2) == 0)
        {
            bStartParseMulti = true;
            iFirstLineIdx = j;
            
            continue; // start to parse from the next line
        }
        else if ((bInfo && asTemp[0].indexOf(TAG_INFO[IDX_INFO_DURATION][0]) == 0) ||
                 (asTemp[0].indexOf("_____________________________________________________________") == 0))
        {
            iLastLineIdx = j;
            
            if (iFSMIdx != (iLastLineIdx - iFirstLineIdx - 1))
            {
                setParseError(giPAIndex, " 解析出 " + iFSMIdx + 
                    " 個 MultiPrimitive , 但實際上有 " + (iLastLineIdx - iFirstLineIdx - 1) + " 行");
            }
            
            if (bSOF || bPayload || bCRC)
            {
                setParseError(giPAIndex, "前面有 SATA_SOF 或 PAYLOAD 或 CRC , 但最後沒有 SATA_EOF");
            }
            
            break; // the last line for this MultiPrimitive
        }
        
        if (!bInfo && !bField && bStartParseMulti)
        {
            //log("->" + asLineToken[j]);
            var asTemp2 = asLineToken[j].split(/[\+\-]/);
            var iTagIdx = 0;
            
            gaasMultiPrimitiveSeq[giMultiPrimitiveIndex][IDX_MULTI_PRIMITIVE_QUEUE][iFSMIdx] = [];
            
            for (var k = 0; k < asTemp2.length; k++)
            {
                // log(k + "[" + asTemp2[k] + "]");
                if (asTemp2[k])
                {
                    iTagIdx = (k == 0) ? I_HOST : I_DEVICE;
                    
                    var sPrimitive = asTemp2[k].replace("<<", "").replace(">>", "").trim();
                    
                    // # format rule
                    //                     
                    
                    /*
                    // Rule 1: replace SATA_CONT or XXXX or "" with the previous Primitive
                    if (sPrimitive == CONT || sPrimitive.indexOf(XXXX) == 0 || sPrimitive == "")
                    {
                        if (iFSMIdx == 0 && giMultiPrimitiveIndex != 0)
                        {
                            var iPrevLastFSMIdx = gaasMultiPrimitiveSeq[giMultiPrimitiveIndex - 1][IDX_MULTI_PRIMITIVE_QUEUE].length - 1;
                            var sPrevLastPrimtivie = gaasMultiPrimitiveSeq[giMultiPrimitiveIndex - 1][IDX_MULTI_PRIMITIVE_QUEUE][iPrevLastFSMIdx][iTagIdx];
                            
                            sPrimitive = sPrevLastPrimtivie;
                        }
                    }
                    */
                    // Rule 2: replace CRC value with "CRC" (previous Primitive is "Payload")
                    if ((sPrimitive && sPrimitive.length == 8 && sPrimitive.indexOf("_") < 0) && // ex. 23C60350
                        (iFSMIdx != 0 && gaasMultiPrimitiveSeq[giMultiPrimitiveIndex][IDX_MULTI_PRIMITIVE_QUEUE][iFSMIdx - 1][iTagIdx] == PAYLOAD))
                    {
                        sPrimitive = CRC;
                    }

                    gaasMultiPrimitiveSeq[giMultiPrimitiveIndex][IDX_MULTI_PRIMITIVE_QUEUE][iFSMIdx][iTagIdx] = sPrimitive;
                    
                    
                    if (sPrimitive == SOF)
                    {
                        bSOF = true;
                        bEOF = false;
                        bPayload = false;
                        bCRC = false;
                    }
                    else if (sPrimitive == PAYLOAD)
                    {
                        bPayload = true;
                    }
                    else if (sPrimitive == CRC)
                    {
                        bCRC = true;
                    }
                    else if (sPrimitive == EOF)
                    {
                        bEOF = true;
                        
                        if (!bPayload || !bCRC || !bSOF)
                        {
                            setParseError(giPAIndex, "第 " + iFSMIdx + 
                                " 行是 SATA_EOF , 但前面缺少 SATA_SOF 或 PAYLOAD 或 CRC");
                        }
                        
                        bPayload = false;
                        bCRC = false;
                        bSOF = false;
                    }
                    
                    if (iTagIdx == I_DEVICE)
                    {
                        break; // parse done
                    }
                }
            }
            
            if (iTagIdx != 0)
            {
                log(giPAIndex + ":" + giMultiPrimitiveIndex + ":" + iFSMIdx);
                log(" H:" + gaasMultiPrimitiveSeq[giMultiPrimitiveIndex][IDX_MULTI_PRIMITIVE_QUEUE][iFSMIdx][I_HOST] +
                    " D:" + gaasMultiPrimitiveSeq[giMultiPrimitiveIndex][IDX_MULTI_PRIMITIVE_QUEUE][iFSMIdx][I_DEVICE]);
            
                if (!gaasMultiPrimitiveSeq[giMultiPrimitiveIndex][IDX_MULTI_PRIMITIVE_QUEUE][iFSMIdx][I_HOST] ||
                    !gaasMultiPrimitiveSeq[giMultiPrimitiveIndex][IDX_MULTI_PRIMITIVE_QUEUE][iFSMIdx][I_DEVICE])
                {
                    //setParseError(giPAIndex, " 的第 " + iFSMIdx  + " 行沒有解析到 Host/Device Primitive");
                }
            
                iFSMIdx++;
            }
        }

    }
    
    log(giPAIndex + ":" + giMultiPrimitiveIndex + "共有" + iFSMIdx + "行 Primitive")

    giMultiPrimitiveIndex++;
    giPAIndex++;
}

function parseCmd(asLineToken, iTextLineIdx)
{
    // Port: I1
    // Start time: 13.670.007.046 (s)
    // Command.................................EF(H)
    // Input...................................EF 90 02 00 00 00 E0 (H)
    // Normal Output...........................00 02 00 00 00 E0 50 (H)
    // PM Port.................................0(H)
    // Protocol................................00(H)
    // Status..................................01(H)
    // Duration Time: 1.306 (us)

    initPA(giPAIndex, TYPE_CMD, giCmdIndex, asLineToken[iTextLineIdx]);
    initCmd(giCmdIndex);
    
    log("No." + giPAIndex + " PA - " + "NO." + giCmdIndex + " ATA cmd");
                
    giCmdIndex++;
    giPAIndex++;
}

function setParseError(iPAIdx, sErrMsg)
{
    err(sErrMsg);
    gbParseError = true;
    
    addErrorCSV(iPAIdx, S_TYPE_PARSE, sErrMsg, "");
}

function setFormatError(iPAIdx, sErrMsg)
{
    //err(sErrMsg);
    //gbParseError = true;
    
    addErrorCSV(iPAIdx, S_TYPE_PARSE, sErrMsg, "");
}

function parseSequence()
{
    var S_ATA_CMD = "_ATA Cmd.";
    var S_TRANSPORT = "_Transport";
    var S_LINK = "_Link";
    var S_OOB_TYPE = "OOB Type";
    var S_HOST = "__Host_";
    var S_DEVICE = "__Device_";

    var asToken = gsText.split(/\n/);
    
    for (var i = 0; i < asToken.length; i++)
    {
        giSeqOffset = 0;
    
        if (asToken[i].indexOf(S_TRANSPORT) == 0)
        {
            parseFIS(asToken, i);
        }
        else if (asToken[i].indexOf(S_LINK) == 0)
        {            
            if (asToken[i + 4].indexOf(S_OOB_TYPE) == 0)
            {
                parseOOB(asToken, i);
            }
            else if (isPrimitiveType(asToken[i + 4]))
            {
                parsePrimitive(asToken, i);
            }
            else if (isMultiPrimitiveType(asToken, i))
            {
                parseMultiPrimitive(asToken, i);
            }
        }
        else if (asToken[i].indexOf(S_ATA_CMD) == 0) // ATA cmd
        {
            parseCmd(asToken, i);
        }
        
        i += giSeqOffset;
    }
    
    log("all " + giPAIndex + " PA parse done ");
    
    printParsedData();
}

function printParsedData()
{
    err("共有 " + giPAIndex + " 組資料:\r\n------------------------\r\n"
    + giCmdIndex + " 組 ATA cmd\r\n"
    + giOOBIndex + " 組 OOB\r\n"
    + giFISIndex + " 組 FIS\r\n"
    + giPrimitiveIndex + " 組 Primitive\r\n"
    + giMultiPrimitiveIndex + " 組 MultiPrimitive\r\n------------------------\r\n");
}

function setDrawError(iPAIdx, sMessage)
{
    err(iPAIdx + " " +getClaim(iPAIdx) + ":" + sMessage);
    
    addErrorCSV(iPAIdx, S_TYPE_STAT, sMessage, "");
}

function setCheckInfo(iTraceType, iCheckIdx, iPAIdx)
{
    gaaFISCheck[iTraceType][iCheckIdx] += getClaim(iPAIdx) + "_";
 
    if (iTraceType == CHECK_TOTAL_TRACE)
    {
        gaaFISCheck[CHECK_TOTAL_CNT][iCheckIdx]++;
    }
    else if (iTraceType == CHECK_PASS_TRACE)
    {
        gaaFISCheck[CHECK_PASS_CNT][iCheckIdx]++;
    }
}

function buildCSV()
{
    log("build CSV");
    
    var bPIORead = false;
    var bNonNCQ = false;
    var iNonNCQIdx = 0;
    var bNCQ = false;
    var iUndoneNCQIdx = [];
    var iUndoneNCQTag = [];
    var iUndoneNCQCnt = 0;
    var iNCQIdx = [];
    var bCRST = false;
    var iCRSTIdx = 0;
    var bPartial = false;
    var bSlumber = false;
    var bCominit = false;
    var iTempDuration = 0;
    
    var iProtocolError = 0;
    var iProtocolErrorIdx = 0;
    var bDataLengthErr = false;
    
    var bDMACmd = false;
    var bPIOCmd = false;
    var bNonDataCmd = false;
    
    var bWrite = false;
    var bRead = false;
    
    var iTotalBytes = 0;
    var iExpectBytes = 0;
    
    var iPartialIdx = 0;
    var iSlumberIdx = 0;
    
    var iSDBFISIdx = 0;
    var iD2HFISIdx = 0;
    var iHostComwakeIdx = 0;
    
    var sCheckClaim = "";

    var iHostPrimitiveGen = 0;
    var iPrevPartialGen = 0;
    var iPrevSlumberGen = 0;
    
    for (var i = 0; i < 32; i++)
    {
        iNCQIdx[i] = -1;
    }

    for (var i = 0; i < giPAIndex; i++)
    {
        sCheckClaim = getClaim(i) + "_";
        
        if (isHostOOB(i))
        {
            if (bPIORead) // ex. IDFY -> COMRESET
            {
                addDrawCSV(IDX_CSV_CMD_DURATION, iNonNCQIdx, getDurationUS(iNonNCQIdx, iDataFISIdx));
                
                bPIORead = false;
                bNonNCQ = false;
            }
            
            if (isComreset(i))
            {
                iCRSTIdx = i;
                
                iPrevPartialGen = 0; // init
                iPrevSlumberGen = 0; // init

                setCheckInfo(CHECK_TOTAL_TRACE, CHECK_D2H_FIS_IDX_0, i);
                setCheckInfo(CHECK_TOTAL_TRACE, CHECK_OOB_IDX_0, i);
                
                if (isDeviceOOB(i+1) && isCominit(i+1))
                {
                    var iTempDuration = getDurationUS(i, i+1);
                    
                    // COMRESET response time 1: between COMRESET and COMINIT
                    addDrawCSV(IDX_CSV_COMRESET_RESPONSE, i, iTempDuration);
                    
                    if (iTempDuration < (10 * 1000))
                    {
                        setCheckInfo(CHECK_PASS_TRACE, CHECK_OOB_IDX_0, iCRSTIdx);
                    }
                    else
                    {
                        setCheckInfo(CHECK_FAIL_TRACE, CHECK_OOB_IDX_0, iCRSTIdx);
                    }
                }
                else if ((i+1) < giPAIndex)
                {
                    setDrawError(i+1, "Host 發 COMRSET 之後 , 不是 Device 回 COMINIT");
                }
                
                bCRST = true;
                
                if (bNCQ)
                {
                    var sTempStr = "";
                    var iTempCount = 0;
                    for (var j = 0; j < 32; j++)
                    {
                        if (iTempCount % 5 == 0)
                        {
                            sTempStr += "\r\n";
                        }
                        
                        if (iNCQIdx[j] >= 0)
                        {
                            sTempStr += getClaim(iNCQIdx[j]) + "(Tag:" + getNCQTag(iNCQIdx[j]) + "),";
                            iTempCount ++;
                        }
                    }
                    
                    setDrawError(i, iUndoneNCQCnt + " 個未完成 NCQ cmd: " + sTempStr);
                    setDrawError(i, "之前有未完成的 NCQ cmd 被 COMRESET打斷");
                    bNCQ = false;
                }
                if (bNonNCQ)
                {
                    setDrawError(i, " 之前有未完成的 NCQ cmd(" + getClaim(iNonNCQIdx) + ") 被 COMRESET打斷");
                    bNonNCQ = false;
                }
            }
            else if (isComwake(i))
            {
                iHostComwakeIdx = i;
                
                if (bPartial)
                {
                    setCheckInfo(CHECK_TOTAL_TRACE, CHECK_LPM_IDX_4, i);
                }
                else if (bSlumber)
                {
                    setCheckInfo(CHECK_TOTAL_TRACE, CHECK_LPM_IDX_5, i);
                }
                
                if (isDeviceOOB(i+1) && isComwake(i+1))
                {
                    iTempDuration = getDurationUS(i, i+1);
                    
                    //log("COMWAKE:" + getClaim(i) + " -> " + getClaim(i+1));
                    //log(getDurationUS(i, i+1) + " = " + getStartTime(i+1) + " - " + getEndTime(i));
                    addDrawCSV(IDX_CSV_COMWAKE_RESPONSE, i, iTempDuration);
                    
                    if (bCominit || bPartial || bSlumber)
                    {
                        if (bPartial)
                        {
                            if (iTempDuration < 10)
                            {
                                setCheckInfo(CHECK_PASS_TRACE, CHECK_LPM_IDX_4, iHostComwakeIdx);
                            }
                            else
                            {
                                setCheckInfo(CHECK_FAIL_TRACE, CHECK_LPM_IDX_4, iHostComwakeIdx);
                            }
                        }
                        else if (bSlumber)
                        {
                            if (iTempDuration < (10 * 1000))
                            {
                                setCheckInfo(CHECK_PASS_TRACE, CHECK_LPM_IDX_5, iHostComwakeIdx);
                            }
                            else
                            {
                                setCheckInfo(CHECK_FAIL_TRACE, CHECK_LPM_IDX_5, iHostComwakeIdx);
                            }
                        }
                        
                    }
                    else
                    {
                        setDrawError(i, "Host 發 COMWAKE 之前 , 並沒有 COMINIT/Partial/Slumber");
                    }
                    
                    setComwakeType(i, bCominit, bPartial, bSlumber);
                }
                else if ((i+1) < giPAIndex)
                {
                    setDrawError(i+1, "Host 發 COMWAKE 之後 , 不是 Device 回 COMWAKE");
                }
                
                bPartial = false;
                bSlumber = false;
                bCominit = false;
            }
        }
        else if (isCominit(i)) // only Device issues COMINIT
        {
            bPartial = false;
            bSlumber = false;
            bCominit = true;
            
            iPrevPartialGen = 0; // init
            iPrevSlumberGen = 0; // init
            
            // TODO: CHECK_OOB_IDX_1
            if (i >= 0 && isCominit(i-1))
            {
                setCheckInfo(CHECK_TOTAL_TRACE, CHECK_OOB_IDX_1, i);
                
                if (getDurationUS(i-1, i) < (10 * 1000))
                {
                    setCheckInfo(CHECK_FAIL_TRACE, CHECK_OOB_IDX_1, i);
                }
                else
                {
                    setCheckInfo(CHECK_PASS_TRACE, CHECK_OOB_IDX_1, i);   
                }
            }
        }
        else if (isHostPrimitive(i))
        {
            iHostPrimitiveGen = getPrimitiveGen(i);
            
            var iPrevGen = iPrevPartialGen > 0 ? iPrevPartialGen : iPrevSlumberGen;
                    
            if (iPrevGen > 0 && isPMREQ(i))
            {
                setCheckInfo(CHECK_TOTAL_TRACE, CHECK_LPM_IDX_6, i);
                
                if (iPrevGen == iHostPrimitiveGen)
                {
                    setCheckInfo(CHECK_PASS_TRACE, CHECK_LPM_IDX_6, i);
                }
                else
                {
                    setCheckInfo(CHECK_FAIL_TRACE, CHECK_LPM_IDX_6, i);
                }
                
                iPrevPartialGen = 0;
                iPrevSlumberGen = 0;
            }
            
            if (bPIORead) // ex. IDFY -> Partial/Slumber
            {
                addDrawCSV(IDX_CSV_CMD_DURATION, iNonNCQIdx, getDurationUS(iNonNCQIdx, iDataFISIdx));
                
                bPIORead = false;
                bNonNCQ = false;
            }
            
            if (isPartial(i))
            {
                var bContinueHostPartial = isHostPrimitive(i+1) && isPartial(i+1);
                
                var bTempFail = false;
                var bValidPartial = false;
                var bResponseInTime = false;

                if (bContinueHostPartial == false)
                {
                    iPrevPartialGen = getPrimitiveGen(i);

                    // Device would response PMACK/PMNAK for >=2 PM_REQ
                    if (getPrimitiveCnt(i) > 1)
                    {
                        bTempFail = true;
                        bValidPartial = true;
                        setCheckInfo(CHECK_TOTAL_TRACE, CHECK_LPM_IDX_7, i);
                        setCheckInfo(CHECK_TOTAL_TRACE, CHECK_LPM_IDX_0, i);
                    }
                }
                
                iPartialIdx = i;
                
                if (isDevicePrimitive(i+1) && (isPMACK(i+1) || isPMNAK(i+1)))
                {
                    iTempDuration = getDurationUS(i, i+1);
                    
                    addDrawCSV(IDX_CSV_PARTIAL_RESPONSE, i, iTempDuration);
                    
                    setPartialType(i, isPMACK(i+1), isPMNAK(i+1));
                    
                    if (iTempDuration < 100)
                    {
                        bResponseInTime = true;
                    }

                    if (isPMACK(i+1))
                    {
                        if (getPrimitiveCnt(i+1) >= 4)
                        {
                            bTempFail = false;
                        }
                        else if (isPMACK(i+2))
                        {
                            if (getPrimitiveCnt(i+2) >= 4)
                            {
                                bTempFail = false;
                            }
                        }
                    }
                    else if (isPMNAK(i+1))
                    {
                        // cannot see SYNC...
                        if (isHostFIS(i+2) || isHostOOB(i+2) || isHostPrimitive(i+2))
                        {
                            bTempFail = false;
                        }
                    }
                }
                else 
                {
                    if (isPMACK(i-1) || isPMNAK(i-1))
                    {
                        var iRequestStartTime = getStartTime(i);
                        var iResponseEndTime = getEndTime(i-1);
                        
                        log("BBB:" +getClaim(i) + ":" + iResponseEndTime + ":" + iRequestStartTime);
                        
                        // ex. Order Primitive  StartTime  EndTime
                        //         1    PM_REQ          0       10
                        //         2     PMACK         15       40
                        //         3    PM_REQ         30       40 
                        if (iResponseEndTime >= iRequestStartTime)
                        {
                            bTempFail = false;
                            bResponseInTime = true;
                        }
                    }
                    
                    if ((i+1) < giPAIndex)
                    {
                        if (isPartial(i+1) && (getDuration(i, i+1) < gbPartialResponseThreshold))
                        {
                            // allow Device responses ACK/NAK whthin gbPartialResponseThreshold (ns)
                        }
                        else
                        {
                            setDrawError(i+1, "Host 打 Partial 之後過了 " + gbPartialResponseThreshold + "ns , Device 並沒有接著回 ACK/NAK");
                        }
                    }
                }
              
                if (bValidPartial)
                {
                    if (bTempFail)
                    {
                        setCheckInfo(CHECK_FAIL_TRACE, CHECK_LPM_IDX_7, iPartialIdx);
                    }
                    else
                    {
                        setCheckInfo(CHECK_PASS_TRACE, CHECK_LPM_IDX_7, iPartialIdx);
                    }
                    
                    if (bResponseInTime)
                    {
                        setCheckInfo(CHECK_PASS_TRACE, CHECK_LPM_IDX_0, iPartialIdx);
                    }
                    else
                    {
                        setCheckInfo(CHECK_FAIL_TRACE, CHECK_LPM_IDX_0, iPartialIdx);
                    }
                }
                
                bPartial = true;
                bSlumber = false;
            }
            else if (isSlumber(i))
            {
                var bContinueHostSlumber = isHostPrimitive(i+1) && isSlumber(i+1);
                
                var bTempFail = false;
                var bValidSlumber = false;

                if (bContinueHostSlumber == false)
                {
                    setCheckInfo(CHECK_TOTAL_TRACE, CHECK_LPM_IDX_1, i);

                    iPrevSlumberGen = iHostPrimitiveGen; 
                    
                    // Device would response PMACK/PMNAK for >=2 PM_REQ
                    if (getPrimitiveCnt(i) > 1)
                    {
                        setCheckInfo(CHECK_TOTAL_TRACE, CHECK_LPM_IDX_8, i);
                        bTempFail = true;
                        bValidSlumber = true;
                    }
                }

                iSlumberIdx = i;
                
                if (isDevicePrimitive(i+1) && (isPMACK(i+1) || isPMNAK(i+1)))
                {
                    addDrawCSV(IDX_CSV_SLUMBER_RESPONSE, i, getDurationUS(i, i+1));
                    
                    setSlumberType(i, isPMACK(i+1), isPMNAK(i+1));
                    
                    if (iTempDuration < 100)
                    {
                        setCheckInfo(CHECK_PASS_TRACE, CHECK_LPM_IDX_1, iSlumberIdx);
                    }
                    else
                    {
                        setCheckInfo(CHECK_FAIL_TRACE, CHECK_LPM_IDX_1, iSlumberIdx);
                    }

                    if (isPMACK(i+1))
                    {
                        if (getPrimitiveCnt(i+1) >= 4)
                        {
                            bTempFail = false;
                        }
                        else if (isPMACK(i+2))
                        {
                            if (getPrimitiveCnt(i+2) >= 4)
                            {
                                bTempFail = false;
                            }
                        }
                    }
                    else if (isPMNAK(i+1))
                    {
                        // cannot see SYNC...
                        if (isHostFIS(i+2) || isHostOOB(i+2) || isHostPrimitive(i+2))
                        {
                            bTempFail = false;
                        }
                    }
                }
                else 
                {
                    if (isPMACK(i-1) || isPMNAK(i-1))
                    {
                        var iRequestStartTime = getStartTime(i);
                        var iResponseEndTime = getEndTime(i-1);
                        
                        log("BBB:" +getClaim(i) + ":" + iResponseEndTime + ":" + iRequestStartTime);
                        
                        // ex. Order Primitive  StartTime  EndTime
                        //         1    PM_REQ          0       10
                        //         2     PMACK         15       40
                        //         3    PM_REQ         30       40 
                        if (iResponseEndTime >= iRequestStartTime)
                        {
                            bTempFail = false;
                        }
                    }
                    
                    if ((i+1) < giPAIndex)
                    {
                        if (isSlumber(i+1) && (getDuration(i, i+1) < gbSlumberResponseThreshold))
                        {
                            // allow Device responses ACK/NAK whthin gbSlumberResponseThreshold (ns)
                        }
                        else
                        {
                            setDrawError(i+1, "Host 打 Slumber 之後過了 " + gbSlumberResponseThreshold + "ns , Device 並沒有接著回 ACK/NAK");
                        }
                    }
                }

                if (bValidSlumber)
                {
                    if (bTempFail)
                    {
                        setCheckInfo(CHECK_FAIL_TRACE, CHECK_LPM_IDX_8, iSlumberIdx);
                        
                        log("AAAA:" + getClaim(iSlumberIdx) + ":" + getClaim(i));
                    }
                    else
                    {
                        setCheckInfo(CHECK_PASS_TRACE, CHECK_LPM_IDX_8, iSlumberIdx);
                    }
                }
                    
                bPartial = false;
                bSlumber = true;
            }
        }
        else if (isDevicePrimitive(i))
        {
            if (isPartial(i))
            {
                bPartial = true;
                bSlumber = false;
            }
            else if (isSlumber(i))
            {
                bPartial = false;
                bSlumber = true;
            }
        }
        else if (isNCQ(i))
        {
            bNCQ = true;
            
            bDMACmd = true;
            bPIOCmd = false;
            bNonDataCmd = false;
            
            if (isDataOutCmd(i))
            {
                bWrite = true;
                bRead = false;
            }
            else if (isDataInCmd(i))
            {
                bWrite = false;
                bRead = true;
            }
            
            iExpectBytes = getTransferSectors(i) * 512;
            iTotalBytes = 0;
            
            if (bPIORead) // ex. IDFY -> NCQ read/write
            {
                addDrawCSV(IDX_CSV_CMD_DURATION, iNonNCQIdx, getDurationUS(iNonNCQIdx, iDataFISIdx));
                
                bPIORead = false;
                bNonNCQ = false;
            }
            
            if (bCRST)
            {
                setDrawError(i, ": COMRESET 之後還沒收到 D2H FIS , 就先送出 NCQ cmd");
            }
            
            var iTag = getNCQTag(i);
            
            if (iNCQIdx[iTag] == -1)
            {
                iNCQIdx[iTag] = i;
                iUndoneNCQCnt++;
                log(getClaim(i) + " issued tag" + iTag + "(UndoneNCQ:" + iUndoneNCQCnt+ ")");
            }
            else
            {
                setDrawError(i, "Tag" + iTag + " 尚未完成還來新的 NCQ cmd");
            }
            
            if (isCBit0(i))
            {
                setCheckInfo(CHECK_TOTAL_TRACE, CHECK_NCQ_ERR_HANDLE_IDX_5, i);
                
                if (!isD2HFIS(i+1))
                {
                    setCheckInfo(CHECK_PASS_TRACE, CHECK_NCQ_ERR_HANDLE_IDX_5, i);
                }
                else
                {
                    setCheckInfo(CHECK_FAIL_TRACE, CHECK_NCQ_ERR_HANDLE_IDX_5, i);
                }
            }
            
            setCmdType(i);
        }
        else if (isSDBFIS(i))
        {
            var sSActiveBin = getSActiveBin(i);
            
            iSDBFISIdx = i;
            
            log(getClaim(i) + " SACTIVE:" + sSActiveBin + "(" + getSActiveHex(i) + ")");

            for (var j = 0; j < 32; j++)
            {
                //log("->" + (1 << j).toString(2));
                if (sSActiveBin == Math.abs((1 << j)).toString(2))
                {
                    if (iNCQIdx[j] == -1)
                    {
                        setDrawError(i, "TAG" + j + " 存在於 SACTIVE , 但之前沒有這個未完成 NCQ cmd");
                    }
                    else
                    {
                        addDrawCSV(IDX_CSV_CMD_DURATION, iNCQIdx[j], getDurationUS(iNCQIdx[j], i));
                        
                        iUndoneNCQCnt--;
                        
                        log("Match tag:" + j + "(idx:" + iNCQIdx[j] + ") , UndoneNCQ:" + iUndoneNCQCnt);
                        
                        iNCQIdx[j] = -1;
                    }
                }
            }
            
            log("iUndoneNCQCnt:" + iUndoneNCQCnt);
            
            if (iUndoneNCQCnt == 0)
            {
                bNCQ = false;
            }
            
            if (iProtocolError != 0)
            {
                if (iProtocolError == I_FRAME_LENGTH_ERR)
                {
                    if (isErrorResponse(i))
                    {
                        setCheckInfo(CHECK_PASS_TRACE, CHECK_NCQ_ERR_HANDLE_IDX_2, iSDBFISIdx);
                    }
                    else
                    {
                        setCheckInfo(CHECK_FAIL_TRACE, CHECK_NCQ_ERR_HANDLE_IDX_2, iSDBFISIdx);
                    }
                }
                else if (iProtocolError == I_CRC_ERR)
                {
                    if (isErrorResponse(i))
                    {
                        setCheckInfo(CHECK_PASS_TRACE, CHECK_NCQ_ERR_HANDLE_IDX_3, iSDBFISIdx);
                    }
                    else
                    {
                        setCheckInfo(CHECK_FAIL_TRACE, CHECK_NCQ_ERR_HANDLE_IDX_3, iSDBFISIdx);
                    }
                }
                
                iProtocolError = 0; // init for next parse
            }
            
            if (bDataLengthErr)
            {
                if (bWrite)
                {
                    if (isErrorResponse(i))
                    {
                        setCheckInfo(CHECK_PASS_TRACE, CHECK_NCQ_ERR_HANDLE_IDX_1, iSDBFISIdx);
                    }
                    else
                    {
                        setCheckInfo(CHECK_FAIL_TRACE, CHECK_NCQ_ERR_HANDLE_IDX_1, iSDBFISIdx);
                    }
                }
                else
                {
                    if (isErrorResponse(i))
                    {
                        setCheckInfo(CHECK_PASS_TRACE, CHECK_NCQ_ERR_HANDLE_IDX_0, iSDBFISIdx);
                    }
                    else
                    {
                        setCheckInfo(CHECK_FAIL_TRACE, CHECK_NCQ_ERR_HANDLE_IDX_0, iSDBFISIdx);
                    }
                }
                    
                bDataLengthErr = 0; // init for next parse
            }
        }
        else if (isNonNCQ(i))
        {
            if (isDMACmd(i))
            {
                bDMACmd = true;
                bPIOCmd = false;
                bNonDataCmd = false;
            }
            else if (isPIORead(i))
            {
                bDMACmd = false;
                bPIOCmd = true;
                bNonDataCmd = false;
            }
            else
            {
                bDMACmd = false;
                bPIOCmd = false;
                bNonDataCmd = true;
            }
            
            if (isDataOutCmd(i))
            {
                bWrite = true;
                bRead = false;
            }
            else if (isDataInCmd(i))
            {
                bWrite = false;
                bRead = true;
            }
            
            iExpectBytes = getTransferSectors(i) * 512;
            iTotalBytes = 0;
            
            if (bNonNCQ && !bPIORead)
            {
                setDrawError(i, "在此之前 , " + getClaim(iNonNCQIdx) + " 還沒有送出 D2H FIS");
            }
            
            if (bCRST)
            {
                setDrawError(i, ": COMRESET 之後還沒收到 D2H FIS , 就先送出 non-NCQ cmd");
            }
            
            if (bPIORead) // ex. IDFY -> read/write
            {
                addDrawCSV(IDX_CSV_CMD_DURATION, iNonNCQIdx, getDurationUS(iNonNCQIdx, iDataFISIdx));
                
                bPIORead = false;
                bNonNCQ = false;
            }
            
            if (bNCQ)
            {
                setCheckInfo(CHECK_TOTAL_TRACE, CHECK_NCQ_ERR_HANDLE_IDX_6, i);
                for (var j = 0; j < 32; j++)
                {
                    if (iNCQIdx[j] >= 0)
                    {
                        addDrawCSV(IDX_CSV_CMD_DURATION, iNCQIdx[j], -1000);
                        
                        setDrawError(i, "在此之前 , " + getClaim(iNCQIdx[j]) + " 沒有相對應的 SDB FIS");
                    }
                }
                bNCQ = false;
                
                var bPass = false;
                
                // step 1. check Error D2H FIS
                if (isDeviceFIS(i+1) && isD2HFIS(i+1) && (getError(i) == 0x4 && getStatus(i) == 0x51))
                {
                    for (var j = i+2; j < (i+10) && j < giPAIndex; j++)
                    {
                        // step 2. check Finished SDB FIS
                        if (isDeviceFIS(j) && isSDBFIS(j) && (getError(j) == 0x0 && getSActiveHex(j) == "FFFFFFFF"))
                        {
                            bPass = false;
                            break;
                        }
                    }
                }
                
                if (bPass)
                {
                    setCheckInfo(CHECK_PASS_TRACE, CHECK_NCQ_ERR_HANDLE_IDX_6, i);
                }
                else
                {
                    setCheckInfo(CHECK_FAIL_TRACE, CHECK_NCQ_ERR_HANDLE_IDX_6, i);
                }
            }
            
            if (isNOP(i))
            {
                addDrawCSV(IDX_CSV_CMD_DURATION, i, (getEndTime(i) - getStartTime(i)) / 1000);
            }
            else if (isCBit0(i))
            {
                setDrawError(i, " is illegal cause C bit is 0");
                
                setCheckInfo(CHECK_TOTAL_TRACE, CHECK_NON_NCQ_ERR_HANDLE_IDX_5, i);
                
                //err("sCheckClaim:" + gaaFISCheck[CHECK_TOTAL_TRACE][CHECK_NON_NCQ_ERR_HANDLE_IDX_5]);
                
                if (!isD2HFIS(i+1))
                {
                    setCheckInfo(CHECK_PASS_TRACE, CHECK_NON_NCQ_ERR_HANDLE_IDX_5, i);
                }
                else
                {
                    setCheckInfo(CHECK_FAIL_TRACE, CHECK_NON_NCQ_ERR_HANDLE_IDX_5, i);
                }
            }
            else
            {
                bNonNCQ = true;
                iNonNCQIdx = i;
                
                bPIORead = isPIORead(i);
            }
            
            setCmdType(i);
        }
        else if (isPIOSetupFIS(i))
        {
        }
        else if (isDataFIS(i))
        {
            iDataFISIdx = i;
            
            var iDataLength = getDataFISLength(i);
            
            iTotalBytes += iDataLength;
            
            //err(getClaim(i) + ":" + iDataLength + "+" + iTotalBytes + " <<<<<<<<< " + iExpectBytes);
            
            if ((iTotalBytes != iExpectBytes) &&
                ((bPIOCmd && (iDataLength % 512) != 0) ||            // ex. expected receive 1KB , but actual received 900 Bytes
                 (bDMACmd && (iDataLength % 8192) != 0) ||           // ex. expected receive 8KB , but actual received 4KB
                 (iExpectBytes != 0 && iTotalBytes > iExpectBytes))) // ex. expected receive 1KB , but actual received 8KB
            {
                bDataLengthErr = true;
                
                //err(getClaim(i) + "_iDataLength:" + iDataLength);
                
                if (bNCQ)
                {
                    if (bWrite)
                    {
                        setCheckInfo(CHECK_TOTAL_TRACE, CHECK_NCQ_ERR_HANDLE_IDX_1, iDataFISIdx);
                    }
                    else 
                    {
                        setCheckInfo(CHECK_TOTAL_TRACE, CHECK_NCQ_ERR_HANDLE_IDX_0, iDataFISIdx);
                    }
                }
                else
                {
                    if (bWrite)
                    {
                        setCheckInfo(CHECK_TOTAL_TRACE, CHECK_NON_NCQ_ERR_HANDLE_IDX_1, iDataFISIdx);
                    }
                    else 
                    {
                        setCheckInfo(CHECK_TOTAL_TRACE, CHECK_NON_NCQ_ERR_HANDLE_IDX_0, iDataFISIdx);
                    }
                }
            }
        }
        else if (isD2HFIS(i))
        {
            iD2HFISIdx = i;
            
            if (bNonNCQ)
            {
                //log("CMD:" + getClaim(iNonNCQIdx) + " -> " + getClaim(i));
                //log(getDurationUS(iNonNCQIdx, i) + " = " + getStartTime(i) + " - " + getEndTime(iNonNCQIdx));
                addDrawCSV(IDX_CSV_CMD_DURATION, iNonNCQIdx, getDurationUS(iNonNCQIdx, i));
            
                bNonNCQ = false;

                if (iProtocolError != 0)
                {
                    if (iProtocolError == I_FRAME_LENGTH_ERR)
                    {
                        if (isErrorResponse(i))
                        {
                            setCheckInfo(CHECK_PASS_TRACE, CHECK_NON_NCQ_ERR_HANDLE_IDX_2, iD2HFISIdx);
                        }
                        else
                        {
                            setCheckInfo(CHECK_FAIL_TRACE, CHECK_NON_NCQ_ERR_HANDLE_IDX_2, iD2HFISIdx);
                        }
                    }
                    else if (iProtocolError == I_CRC_ERR)
                    {
                        if (isErrorResponse(i))
                        {
                            setCheckInfo(CHECK_PASS_TRACE, CHECK_NON_NCQ_ERR_HANDLE_IDX_3, iD2HFISIdx);
                        }
                        else
                        {
                            setCheckInfo(CHECK_FAIL_TRACE, CHECK_NON_NCQ_ERR_HANDLE_IDX_3, iD2HFISIdx);
                        }
                    }

                    iProtocolError = 0; // init for next parse
                }
                
                if (bDataLengthErr)
                {
                    if (bWrite)
                    {
                        if (isErrorResponse(i))
                        {
                            setCheckInfo(CHECK_PASS_TRACE, CHECK_NON_NCQ_ERR_HANDLE_IDX_1, iD2HFISIdx);
                        }
                        else{
                            setCheckInfo(CHECK_FAIL_TRACE, CHECK_NON_NCQ_ERR_HANDLE_IDX_1, iD2HFISIdx);
                        }
                    }
                    else
                    {
                        if (isErrorResponse(i))
                        {
                            setCheckInfo(CHECK_PASS_TRACE, CHECK_NON_NCQ_ERR_HANDLE_IDX_0, iD2HFISIdx);
                        }
                        else
                        {
                            setCheckInfo(CHECK_FAIL_TRACE, CHECK_NON_NCQ_ERR_HANDLE_IDX_0, iD2HFISIdx);
                        }
                    }
                    bDataLengthErr = 0; // init for next parse
                }
            }
            else if (bCRST)
            {
                // D2H FIS for COMRESET
                bCRST = false;
                
                iTempDuration = getDurationUS(iCRSTIdx, i);
                
                log(getClaim(iCRSTIdx) + " -> " + getClaim(i));
                log(getStartTime(iCRSTIdx) + " -> " + getStartTime(i));
                
                // COMRESET response time 2: between COMRESET and D2H FIS
                //addDrawCSV(IDX_CSV_COMRESET_RESPONSE, iCRSTIdx, iTempDuration);
                
                if (iTempDuration < (100 * 1000))
                {
                    setCheckInfo(CHECK_PASS_TRACE, CHECK_D2H_FIS_IDX_0, iCRSTIdx);
                }
                else
                {
                    setCheckInfo(CHECK_FAIL_TRACE, CHECK_D2H_FIS_IDX_0, iCRSTIdx);
                }
            }
            else if (bNCQ)
            {
                // D2H FIS for NCQ cmd
            }
            else
            {
                setDrawError(i, " 這個 D2H FIS 之前沒有 non-NCQ cmd 也沒有 COMRESET");
            }
        }
        
        //if (isHostFIS(i))
        {
            // check error
            if (existProtoclError(i))
            {
                iProtocolError = getProtocolError(i);
                iProtocolErrorIdx = i;
                
                if (iProtocolError == I_FRAME_TYPE_ERR)
                {
                    setCheckInfo(CHECK_TOTAL_TRACE, CHECK_NON_NCQ_ERR_HANDLE_IDX_6, iProtocolErrorIdx);

                    if (!isDeviceFIS(i+1))
                    {
                        setCheckInfo(CHECK_PASS_TRACE, CHECK_NON_NCQ_ERR_HANDLE_IDX_6, iProtocolErrorIdx);
                    }
                    else
                    {
                        setCheckInfo(CHECK_FAIL_TRACE, CHECK_NON_NCQ_ERR_HANDLE_IDX_6, iProtocolErrorIdx);
                    }
                }
                else if (isCmdFIS(i))
                {
                    var pass = !isDeviceFIS(i+1);
                    
                    if (bNCQ)
                    {
                        setCheckInfo(CHECK_TOTAL_TRACE, CHECK_NCQ_ERR_HANDLE_IDX_4, iProtocolErrorIdx);
                        
                        if (pass)
                        {
                            setCheckInfo(CHECK_PASS_TRACE, CHECK_NCQ_ERR_HANDLE_IDX_4, iProtocolErrorIdx);
                        }
                        else
                        {
                            setCheckInfo(CHECK_FAIL_TRACE, CHECK_NCQ_ERR_HANDLE_IDX_4, iProtocolErrorIdx);
                        }
                    }
                    else if (bNonNCQ)
                    {
                        setCheckInfo(CHECK_TOTAL_TRACE, CHECK_NON_NCQ_ERR_HANDLE_IDX_4, iProtocolErrorIdx);
                        
                        if (pass)
                        {
                            setCheckInfo(CHECK_PASS_TRACE, CHECK_NON_NCQ_ERR_HANDLE_IDX_4, iProtocolErrorIdx);
                        }
                        else
                        {
                            setCheckInfo(CHECK_FAIL_TRACE, CHECK_NON_NCQ_ERR_HANDLE_IDX_4, iProtocolErrorIdx);
                        }
                    }
                }
                else if (isDataFIS(i))
                {
                    if (iProtocolError == I_FRAME_LENGTH_ERR)
                    {
                        if (bNCQ)
                        {
                            setCheckInfo(CHECK_TOTAL_TRACE, CHECK_NCQ_ERR_HANDLE_IDX_2, iProtocolErrorIdx);
                        }
                        else if (bNonNCQ)
                        {
                            setCheckInfo(CHECK_TOTAL_TRACE, CHECK_NON_NCQ_ERR_HANDLE_IDX_2, iProtocolErrorIdx);
                        }
                    }
                    else if (iProtocolError == I_CRC_ERR)
                    {
                        if (bNCQ)
                        {
                            setCheckInfo(CHECK_TOTAL_TRACE, CHECK_NCQ_ERR_HANDLE_IDX_3, iProtocolErrorIdx);
                        }
                        else if (bNonNCQ)
                        {
                            setCheckInfo(CHECK_TOTAL_TRACE, CHECK_NON_NCQ_ERR_HANDLE_IDX_3, iProtocolErrorIdx);
                        }
                    }
                }
            }
        }
        
    }
}

// SActive|61\(H|Sector Count\.|60\(H