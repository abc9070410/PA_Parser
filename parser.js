

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

    var iLength = asLineToken.length;
                
    for (var j = iTextLineIdx + 2; j < iLength; j++)
    {
        var asTemp = asLineToken[j].split(/\./);

        for (var k = 0; k < IDX_FIS_AMOUNT; k++)
        {
            if (asTemp[0].indexOf(TAG_FIS[k][0]) == 0)
            {
                var sBefore = gaasFISSeq[giFISIndex][TAG_FIS[k][1]];
                gaasFISSeq[giFISIndex][TAG_FIS[k][1]] = asTemp[1];
                
                if (sBefore && sBefore != "")
                {
                    gaasFISSeq[giFISIndex][TAG_FIS[k][1]] += sBefore;
                }

                log("match " + TAG_FIS[k][0] + " : " + TAG_FIS[k][1] + "," + gaasFISSeq[giFISIndex][TAG_FIS[k][1]]);
            }
        }
        
        asTemp = asLineToken[j].split(/:/);
        
        for (var k = 0; k < IDX_INFO_AMOUNT; k++)
        {
            if (asTemp[0].indexOf(TAG_INFO[k][0]) == 0)
            {
                var iAdditionIdx = IDX_FIS_AMOUNT + TAG_INFO[k][1];
                gaasFISSeq[giFISIndex][iAdditionIdx] = asTemp[1];
                
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
        else if (asLineToken[j].indexOf(TAG_PRIMITIVE[IDX_PRIMITIVE_TYPE][0]) == 0)
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
        }
        else if (asToken[i].indexOf(S_ATA_CMD) == 0) // ATA cmd
        {
            parseCmd(asToken, i);
        }
        
        i += giSeqOffset;
    }
    
    log("all " + giPAIndex + " PA parse done ");
}

function errCSV(iPAIdx, sMessage)
{
    err(getClaim(iPAIdx) + ":" + sMessage);
}

function buildCSV()
{
    log("build CSV");
    
    var bPIO = false;
    var bNonNCQ = false;
    var bNonNCQIdx = 0;

    for (var i = 0; i < giPAIndex; i++)
    {
        if (isHostOOB(i))
        {
            if (isComreset(i))
            {
                if (isDeviceOOB(i+1) && isCominit(i+1))
                {
                    addCSV(IDX_CSV_COMRESET_RESPONSE, i, getDurationUS(i, i+1));
                }
                else
                {
                    errCSV(i+1, "Host 發 COMRSET 之後 , 不是 Device 回 COMINIT");
                }
            }
            else if (isComwake(i))
            {
                if (isDeviceOOB(i+1) && isComwake(i+1))
                {
                    //log("COMWAKE:" + getClaim(i) + " -> " + getClaim(i+1));
                    //log(getDurationUS(i, i+1) + " = " + getStartTime(i+1) + " - " + getEndTime(i));
                    addCSV(IDX_CSV_COMWAKE_RESPONSE, i, getDurationUS(i, i+1));
                }
                else
                {
                    errCSV(i+1, "Host 發 COMWAKE 之後 , 不是 Device 回 COMWAKE");
                }
            }
        }
        else if (isHostPrimitive(i))
        {
            if (isPartial(i))
            {
                if (isDevicePrimitive(i+1) && (isPMACK(i+1) || isPMNAK(i+1)))
                {
                    addCSV(IDX_CSV_PARTIAL_RESPONSE, i, getDurationUS(i, i+1));
                }
                else
                {
                    errCSV(i+1, "Host 打 Partial 之後 , Device 並沒有接著回 ACK/NAK");
                }
            }
            else if (isSlumber(i))
            {
                if (isDevicePrimitive(i+1) && (isPMACK(i+1) || isPMNAK(i+1)))
                {
                    addCSV(IDX_CSV_SLUMBER_RESPONSE, i, getDurationUS(i, i+1));
                }
                else
                {
                    errCSV(i+1, "Host 打 Slumber 之後 , Device 並沒有接著回 ACK/NAK");
                }
            }
        }
        else if (isNonNCQ(i))
        {
            bPIO = false; // init
            
            bNonNCQ = true;
            bNonNCQIdx = i;
        }
        else if (isPIOSetupFIS(i))
        {
            bPIO = true;
        }
        else if (bPIO && isDeviceFIS(i) && isDataFIS(i))
        {
            // do not get the duration for PIO read cause it is no D2H FIS
            bNonNCQ = false;
        }
        else if (bNonNCQ && isD2HFIS(i))
        {
            //log("CMD:" + getClaim(bNonNCQIdx) + " -> " + getClaim(i));
            //log(getDurationUS(bNonNCQIdx, i) + " = " + getStartTime(i) + " - " + getEndTime(bNonNCQIdx));
            addCSV(IDX_CSV_CMD_DURATION, bNonNCQIdx, getDurationUS(bNonNCQIdx, i));
            
            bNonNCQ = false;
        }
    }
}