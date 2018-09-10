
// the idle time between i and j
function getIdleTime(i, j)
{
    //log("" + getStartTime(j) + " - " + getEndTime(i) + " = " + (getStartTime(j) - getEndTime(i)));
    return getStartTime(j) - getEndTime(i);
}

function formatPATime(str)
{
    var iExpectPart = 0;
    var iFirstPart;
    var asTemp = str.split(/\./);

    if (str.indexOf("(min)") > 0) // ex. 1.07.507.748.866 (min)
    {
        iExpectPart = 5;
        iFirstPart = parseInt(asTemp[0]) * 60;
    }
    else if (str.indexOf("(s)") > 0) // ex. 10.350.990.220 (s)
    {
        iExpectPart = 4;
        iFirstPart = parseInt(asTemp[0]);
    }
    else if (str.indexOf("(ms)") > 0) // ex. 1.007.706 (ms)
    {
        iExpectPart = 3;
        iFirstPart = parseInt(asTemp[0]);
    }
    else if (str.indexOf("(us)") > 0) // ex. 2.060 (us)
    {
        iExpectPart = 2;
        iFirstPart = parseInt(asTemp[0]);
    }
    else
    {
        return str.replace(/\./g, ""); // Duration time, not Start/End time
    }

    str = str.trim().split(" ")[0];
    asTemp = str.split(/\./);

    var newStr = "" + iFirstPart;    

    for (var i = 1; i < asTemp.length; i++)
    {
        newStr += asTemp[i];
    }

    for (var i = asTemp.length; i < iExpectPart; i++)
    {
        newStr += "000";
    }

    //err(str + "->" +newStr);

    return newStr;
}

function getStartTime(i)
{
    if (gaasPASeq[i][IDX_PA_TYPE] == TYPE_PRIMITIVE)
    {
        return getNumber(formatPATime(gaasPrimitiveSeq[gaasPASeq[i][IDX_PA_NO]][IDX_PRIMITIVE_AMOUNT + IDX_INFO_START]), 10);
    }
    else if (gaasPASeq[i][IDX_PA_TYPE] == TYPE_FIS)
    {
        return getNumber(formatPATime(gaasFISSeq[gaasPASeq[i][IDX_PA_NO]][IDX_FIS_AMOUNT + IDX_INFO_START]), 10);
    }
    else if (gaasPASeq[i][IDX_PA_TYPE] == TYPE_OOB)
    {
        return getNumber(formatPATime(gaasOOBSeq[gaasPASeq[i][IDX_PA_NO]][IDX_OOB_AMOUNT + IDX_INFO_START]), 10);
    }
    else
    {
        return 0;
    }
}

function getStartMS(i)
{
    var iNS = getStartTime(i);
    
    //err("NS:" + iNS + " US:" + (iNS / 1000) + " MS:" + (iNS / 1000000));
    
    return iNS / 1000000;
}

function getEndTime(i)
{
    if (gaasPASeq[i][IDX_PA_TYPE] == TYPE_PRIMITIVE)
    {
        return getNumber(formatPATime(gaasPrimitiveSeq[gaasPASeq[i][IDX_PA_NO]][IDX_PRIMITIVE_AMOUNT + IDX_INFO_START]), 10) + 
               getNumber(formatPATime(gaasPrimitiveSeq[gaasPASeq[i][IDX_PA_NO]][IDX_PRIMITIVE_AMOUNT + IDX_INFO_DURATION]), 10);
    }
    else if (gaasPASeq[i][IDX_PA_TYPE] == TYPE_FIS)
    {
        return getNumber(formatPATime(gaasFISSeq[gaasPASeq[i][IDX_PA_NO]][IDX_FIS_AMOUNT + IDX_INFO_START]), 10) + 
               getNumber(formatPATime(gaasFISSeq[gaasPASeq[i][IDX_PA_NO]][IDX_FIS_AMOUNT + IDX_INFO_DURATION]), 10);
    }
    else if (gaasPASeq[i][IDX_PA_TYPE] == TYPE_OOB)
    {
        return getNumber(formatPATime(gaasOOBSeq[gaasPASeq[i][IDX_PA_NO]][IDX_OOB_AMOUNT + IDX_INFO_START]), 10) + 
               getNumber(formatPATime(gaasOOBSeq[gaasPASeq[i][IDX_PA_NO]][IDX_OOB_AMOUNT + IDX_INFO_DURATION]), 10);
    }
    else
    {
        return 0;
    }
}

// time unit: us
function getDurationUS(i, j)
{
    var iDuration = getDuration(i, j);

    if (iDuration < 1000)
        return iDuration / 1000;
    else
        return Math.floor(iDuration / 1000);
}

// get the duration time from i to j (time unit: ns) (j must bigger than i)
function getDuration(i, j)
{
    if (isOOB(i) || isPrimitive(i))
    {
        return getStartTime(j) - getStartTime(i);
    }
    else
    {
        //log("getD:" + getStartTime(j) + " - " + getEndTime(i));
        return getStartTime(j) - getEndTime(i);
    }
}

function isEnableDIPM(i)
{
    if (gaasPASeq[i][IDX_PA_TYPE] != TYPE_FIS)
    {
        return false;
    }

    var j = gaasPASeq[i][IDX_PA_NO];
    
    //log(gaasFISSeq[j][IDX_FIS_COMMAND]+"_" + gaasFISSeq[j][IDX_FIS_FEATURE]+"_" +getNumber(gaasFISSeq[j][IDX_FIS_SECTORS], 16));
    
    return (gaasFISSeq[j][IDX_FIS_COMMAND].indexOf("EF") == 0 &&
            gaasFISSeq[j][IDX_FIS_FEATURE].indexOf("10") >= 0 &&
            getNumber(gaasFISSeq[j][IDX_FIS_SECTORS], 16) == 3);
}

function isDisableDIPM(i)
{
    if (gaasPASeq[i][IDX_PA_TYPE] != TYPE_FIS)
    {
        return false;
    }

    var j = gaasPASeq[i][IDX_PA_NO];
    
    return (gaasFISSeq[j][IDX_FIS_COMMAND].indexOf("EF") == 0 &&
            gaasFISSeq[j][IDX_FIS_FEATURE].indexOf("90") >= 0 &&
            getNumber(gaasFISSeq[j][IDX_FIS_SECTORS], 16) == 3);
}

function isEnableAP2S(i)
{
    if (gaasPASeq[i][IDX_PA_TYPE] != TYPE_FIS)
    {
        return false;
    }

    var j = gaasPASeq[i][IDX_PA_NO];
    
    return (gaasFISSeq[j][IDX_FIS_COMMAND].indexOf("EF") == 0 &&
            gaasFISSeq[j][IDX_FIS_FEATURE].indexOf("10") >= 0 &&
            getNumber(gaasFISSeq[j][IDX_FIS_SECTORS], 16) == 7);
}

function isDisableAP2S(i)
{
    if (gaasPASeq[i][IDX_PA_TYPE] != TYPE_FIS)
    {
        return false;
    }

    var j = gaasPASeq[i][IDX_PA_NO];
    
    return (gaasFISSeq[j][IDX_FIS_COMMAND].indexOf("EF") == 0 &&
            gaasFISSeq[j][IDX_FIS_FEATURE].indexOf("90") >= 0 &&
            getNumber(gaasFISSeq[j][IDX_FIS_SECTORS], 16) == 7);
}

function isEnableAutoActivate(i)
{
    if (gaasPASeq[i][IDX_PA_TYPE] != TYPE_FIS)
    {
        return false;
    }

    var j = gaasPASeq[i][IDX_PA_NO];
    
    return (gaasFISSeq[j][IDX_FIS_COMMAND].indexOf("EF") == 0 &&
            gaasFISSeq[j][IDX_FIS_FEATURE].indexOf("10") >= 0 &&
            getNumber(gaasFISSeq[j][IDX_FIS_SECTORS], 16) == 2);
}

function isDisableAutoActivate(i)
{
    if (gaasPASeq[i][IDX_PA_TYPE] != TYPE_FIS)
    {
        return false;
    }

    var j = gaasPASeq[i][IDX_PA_NO];
    
    return (gaasFISSeq[j][IDX_FIS_COMMAND].indexOf("EF") == 0 &&
            gaasFISSeq[j][IDX_FIS_FEATURE].indexOf("90") >= 0 &&
            getNumber(gaasFISSeq[j][IDX_FIS_SECTORS], 16) == 2);
}

function isDMACmd(i)
{
    if (gaasPASeq[i][IDX_PA_TYPE] != TYPE_FIS)
    {
        return false;
    }

    return getCmdInfo(i).indexOf("DMA") >= 0;
}

function isNonDataCmd(i)
{
    if (gaasPASeq[i][IDX_PA_TYPE] != TYPE_FIS)
    {
        return false;
    }

    return getCmdInfo(i).indexOf("non-data") >= 0;
}

function isNCQ(i)
{
    return isH2DFIS(i) &&
           (gaasFISSeq[gaasPASeq[i][IDX_PA_NO]][IDX_FIS_COMMAND].indexOf("60") == 0 || // READ FPDMA QUEUED
            gaasFISSeq[gaasPASeq[i][IDX_PA_NO]][IDX_FIS_COMMAND].indexOf("61") == 0);  // WRITE FPDMA QUEUED
}

function isNonNCQ(i)
{
    return isH2DFIS(i) && !isNCQ(i); 
}

// get sector count of NCQ or non-NCQ cmd
function getTransferKB(i)
{
    var iSectorCnt = 0;
    
    if (isNCQ(i))
    {
        iSectorCnt = getFeature(i);
    }
    else if (isNonNCQ(i))
    {
        iSectorCnt = getSectorCnt(i);
    }
    else
    {
        err(getClaim(i) + " 不是 NCQ cmd 也不是 non-NCQ cmd");
    }
    
    if (iSectorCnt == 0)
    {
        return 0;
    }
    
    return iSectorCnt / 2;
}

// ex. sectors=0x38(56) -> tag=56/8 = 7
function getNCQTag(i)
{
    if (!isNCQ(i))
    {
        err(i + " is not a NCQ cmd FIS");
        return 0;
    }
    
    var iSectors = getSectorCnt(i);
    
    return (iSectors % 0xFF) / 8;
}

function isFIS(i)
{
    return gaasPASeq[i][IDX_PA_TYPE] == TYPE_FIS;
}

function isDataFIS(i)
{
    return gaasPASeq[i][IDX_PA_TYPE] == TYPE_FIS &&
           gaasFISSeq[gaasPASeq[i][IDX_PA_NO]][IDX_FIS_TYPE].indexOf("46") == 0;
}

function isHostFIS(i)
{
    return gaasPASeq[i][IDX_PA_TYPE] == TYPE_FIS &&
           gaasFISSeq[gaasPASeq[i][IDX_PA_NO]][IDX_FIS_AMOUNT + IDX_INFO_PORT].indexOf("I1") == 0;
}

function isDeviceFIS(i)
{
    return gaasPASeq[i][IDX_PA_TYPE] == TYPE_FIS &&
           gaasFISSeq[gaasPASeq[i][IDX_PA_NO]][IDX_FIS_AMOUNT + IDX_INFO_PORT].indexOf("T1") == 0;
}

function isSDBFIS(i)
{
    return gaasPASeq[i][IDX_PA_TYPE] == TYPE_FIS &&
           gaasFISSeq[gaasPASeq[i][IDX_PA_NO]][IDX_FIS_TYPE].indexOf("A1") == 0;
}

// device would ignore the illegal cmd fis which C bit is 0
function isCBit0(i)
{
    return gaasPASeq[i][IDX_PA_TYPE] == TYPE_FIS &&
           gaasFISSeq[gaasPASeq[i][IDX_PA_NO]][IDX_FIS_CBIT] == "0";
}

function getSActiveHex(i)
{
    if (!isSDBFIS(i))
    {
        err(i + " not a SDB FIS");
        return 0;
    }
    
    return gaasFISSeq[gaasPASeq[i][IDX_PA_NO]][IDX_FIS_SACTIVE];
}

function getSActiveBin(i)
{
    var sSActiveHex = getSActiveHex(i);
    
    if (sSActiveHex == 0)
    {
        return 0;
    }
    
    //err("HEX:[" +sSActiveHex + "] ");
    
    return "" + parseInt(sSActiveHex, 16).toString(2);
}

function isTagDone(sSActive, iTag)
{
    return sSActive.substring(iTag, iTag+1).indexOf("1") == 0;
}

function isNCQRead(sOP)
{
    return sOP.indexOf("60") == 0;
}

function isNCQWrite(sOP)
{
    return sOP.indexOf("61") == 0;
}

function isNonNCQRead(sOP)
{
    var asQueue = ["E4", "C8", "25", "C7", "26", "2F", "47", "C4", "29", "20", "24", "2A", "2B", "40"];
    
    for (var i = 0; i < asQueue.length; i++)
    {
        if (sOP.indexOf(asQueue[i]) == 0)
        {
            return true;
        }
    }
    
    return false;
}

function isNonNCQWrite(sOP)
{
    var asQueue = ["E8", "CA", "35", "3D", "CC", "36", "3F", "57", "C5", "39", "30", "3A", "3B"];
    
    for (var i = 0; i < asQueue.length; i++)
    {
        if (sOP.indexOf(asQueue[i]) == 0)
        {
            return true;
        }
    }
    
    return false;
}

function setCmdType(i)
{
    var sOP = getCmdOP(i);
    var iClaimNo = getClaimNo(i);

    var iCmdType = I_CMD_TYPE_OTHER;
    
    if (isNCQWrite(sOP))
    {
        iCmdType = I_CMD_TYPE_NCQ_WRITE;
    }
    else if (isNCQRead(sOP))
    {
        iCmdType = I_CMD_TYPE_NCQ_READ;
    }
    else if (isNonNCQWrite(sOP))
    {
        iCmdType = I_CMD_TYPE_NON_NCQ_WRITE;
    }
    else if (isNonNCQRead(sOP))
    {
        iCmdType = I_CMD_TYPE_NON_NCQ_READ;
    }

    gaiCmdDrawQueue[iClaimNo] = iCmdType;
    gaiCmdDrawCnt[iCmdType]++; 
    
    //log("record " + sOP + ":" + iClaimNo + ":" + gaiCmdDrawQueue[iClaimNo]);
}

function getCmdType(iClaimNo)
{
    return gaiCmdDrawQueue[iClaimNo];
}

function getCmdColor(iClaimNo)
{
    return gaaCmdColorQueue[getCmdType(iClaimNo)][2];
}

function setComwakeType(i, bCominit, bPartial, bSlumber)
{
    var iClaimNo = getClaimNo(i);
    
    var iComwakeType = I_COMWAKE_TYPE_OTHER;
    
    if (bCominit)
    {
        iComwakeType = I_COMWAKE_TYPE_COMINIT;
    }
    else if (bPartial)
    {
        iComwakeType = I_COMWAKE_TYPE_PARTIAL;
    }
    else if (bSlumber)
    {
        iComwakeType = I_COMWAKE_TYPE_SLUMBER;
    }
    
    gaiComwakeDrawQueue[iClaimNo] = iComwakeType;
    gaiComwakeDrawCnt[iComwakeType]++;
    
    log("record " + iClaimNo + ":" + gaiComwakeDrawQueue[iClaimNo]);
}

function getComwakeType(iClaimNo)
{
    return gaiComwakeDrawQueue[iClaimNo];
}

function getComwakeColor(iClaimNo)
{
    log(iClaimNo + ":" + getComwakeType(iClaimNo));
    return gaaComwakeColorQueue[getComwakeType(iClaimNo)][2];
}

function setPartialType(i, bACK, bNAK)
{
    var iClaimNo = getClaimNo(i);
    
    var iPartialType = I_PARTIAL_TYPE_OTHER;
    
    if (bACK)
    {
        iPartialType = I_PARTIAL_TYPE_ACK;
    }
    else if (bNAK)
    {
        iPartialType = I_PARTIAL_TYPE_NAK;
    }
    
    gaiPartialDrawQueue[iClaimNo] = iPartialType;
    gaiPartialDrawCnt[iPartialType]++;
    
    log("record " + iClaimNo + ":" + gaiPartialDrawQueue[iClaimNo]);
}

function getPartialType(iClaimNo)
{
    return gaiPartialDrawQueue[iClaimNo];
}

function getPartialColor(iClaimNo)
{
    log(iClaimNo + ":" + getPartialType(iClaimNo));
    return gaaPartialColorQueue[getPartialType(iClaimNo)][2];
}


function setSlumberType(i, bACK, bNAK)
{
    var iClaimNo = getClaimNo(i);
    
    var iSlumberType = I_SLUMBER_TYPE_OTHER;
    
    if (bACK)
    {
        iSlumberType = I_SLUMBER_TYPE_ACK;
    }
    else if (bNAK)
    {
        iSlumberType = I_SLUMBER_TYPE_NAK;
    }
    
    gaiSlumberDrawQueue[iClaimNo] = iSlumberType;
    gaiSlumberDrawCnt[iSlumberType]++;
    
    log("record " + iClaimNo + ":" + gaiSlumberDrawQueue[iClaimNo]);
}

function getSlumberType(iClaimNo)
{
    return gaiSlumberDrawQueue[iClaimNo];
}

function getSlumberColor(iClaimNo)
{
    log(iClaimNo + ":" + getSlumberType(iClaimNo));
    return gaaSlumberColorQueue[getSlumberType(iClaimNo)][2];
}


function isNOP(i)
{
    if (gaasPASeq[i][IDX_PA_TYPE] != TYPE_FIS)
    {
        return false;
    }
    
    var sCmd = gaasFISSeq[gaasPASeq[i][IDX_PA_NO]][IDX_FIS_COMMAND];
    
    return sCmd.indexOf("00") == 0;
}

function isPIORead(i)
{
    if (gaasPASeq[i][IDX_PA_TYPE] != TYPE_FIS)
    {
        return false;
    }
    
    var sCmd = gaasFISSeq[gaasPASeq[i][IDX_PA_NO]][IDX_FIS_COMMAND];

    return sCmd.indexOf("87") == 0 ||    // "CFA TRANSLATE SECTOR - 87h, PIO data-in",
           sCmd.indexOf("EC") == 0 ||    // "IDENTIFY DEVICE - ECh, PIO Data-in",
           sCmd.indexOf("E4") == 0 ||    // "READ BUFFER - E4, PIO data-in",
           sCmd.indexOf("2F") == 0 ||    // "READ LOG EXT - 2Fh, PIO data-in",
           sCmd.indexOf("C4") == 0 ||    // "READ MULTIPLE - C4h, PIO data-in",
           sCmd.indexOf("29") == 0 ||    // "READ MULTIPLE EXT - 29h, PIO data-in",
           sCmd.indexOf("20") == 0 ||    // "READ SECTOR(S) - 20h, PIO data-in",
           sCmd.indexOf("24") == 0 ||    // "READ SECTOR(S) EXT - 24h, PIO data-in",
           sCmd.indexOf("2B") == 0;      // "READ STREAM EXT - 2Bh, PIO data-in",    
}

function isPIOSetupFIS(i)
{
    return gaasPASeq[i][IDX_PA_TYPE] == TYPE_FIS &&
           gaasFISSeq[gaasPASeq[i][IDX_PA_NO]][IDX_FIS_TYPE].indexOf("5F") == 0;
}

function isDMAActivateFIS(i)
{
    return gaasPASeq[i][IDX_PA_TYPE] == TYPE_FIS &&
           gaasFISSeq[gaasPASeq[i][IDX_PA_NO]][IDX_FIS_TYPE].indexOf("39") == 0;
}

function isDMASetupFIS(i)
{
    return gaasPASeq[i][IDX_PA_TYPE] == TYPE_FIS &&
           gaasFISSeq[gaasPASeq[i][IDX_PA_NO]][IDX_FIS_TYPE].indexOf("41") == 0;
}


function isD2HFIS(i)
{
    return gaasPASeq[i][IDX_PA_TYPE] == TYPE_FIS &&
           gaasFISSeq[gaasPASeq[i][IDX_PA_NO]][IDX_FIS_TYPE].indexOf("34") == 0;
}

function isH2DFIS(i)
{
    return gaasPASeq[i][IDX_PA_TYPE] == TYPE_FIS &&
           gaasFISSeq[gaasPASeq[i][IDX_PA_NO]][IDX_FIS_TYPE].indexOf("27") == 0;
}


function isReadWriteMultiple(i)
{
    if (gaasPASeq[i][IDX_PA_TYPE] != TYPE_FIS)
    {
        return false;
    }

    var j = gaasPASeq[i][IDX_PA_NO];
    
    return (gaasFISSeq[j][IDX_FIS_COMMAND].indexOf("29") == 0 ||
            gaasFISSeq[j][IDX_FIS_COMMAND].indexOf("39") == 0 ||
            gaasFISSeq[j][IDX_FIS_COMMAND].indexOf("C4") == 0 ||
            gaasFISSeq[j][IDX_FIS_COMMAND].indexOf("C5") == 0);
}

// decOrHex: insert number 10 or 16
function getNumber(str, decOrHex)
{
    //log(str);

    str = "" + str;
    str = str.trim().split(" ")[0]; // ex. " 12345 (s) " -> "12345"

    var i = 0;
    
    if (str.indexOf("0.") == 0)
    {
        // ex. 0.123

        return parseFloat(str);
    }
    else
    {
        // ex. 00123
        for (i = 0; i <= str.length; i++)
        {
            if (str.substring(i, i+1).indexOf("0") != 0)
            {
                break;
            }
        }
    }
    
    //log(i + ":" + str + "->" + str.substring(i, str.length) + "->" +  parseInt(str.substring(i, str.length), decOrHex));
    return parseInt(str.substring(i, str.length), decOrHex);
}

function isString(myVar)
{
    return (typeof myVar === 'string' || myVar instanceof String)
}

// about parse

function getClaimType(i)
{
    return gaasPASeq[i][IDX_PA_CLAIM_TYPE];
}

function getPAInfo(i)
{
    if (gaasPASeq[i][IDX_PA_TYPE] == TYPE_FIS)
    {
        return getCmdInfo(i) + " (" + getTransferKB(i) + "KB)";
    }
    else if (gaasPASeq[i][IDX_PA_TYPE] == TYPE_PRIMITIVE)
    {
        return getPrimitiveType(i);
    }
    else if (gaasPASeq[i][IDX_PA_TYPE] == TYPE_OOB)
    {
        return getOOBType(i).trim().split(" ")[0];
    }
}

function getCmdInfo(i)
{
    var sCmdOP = "" + getCmdOP(i);

    for (var j = 0; j < AS_ATA_CMD_LIST.length; j++)
    {
        if (AS_ATA_CMD_LIST[j].indexOf(sCmdOP + "h") > 0)
        {
            return AS_ATA_CMD_LIST[j];
        }
    }

    return S_NOT_FOUND + ":" + sCmdOP;
}

function getDataBitCnt(i)
{
    if (gaasPASeq[i][IDX_PA_TYPE] != TYPE_FIS)   
    {
        err(i + " is not a FIS");
        return 0;
    }
    
    var j = gaasPASeq[i][IDX_PA_NO];
    
    
}

// get CMD OP from CMD FIS
function getCmdOP(i)
{
    if (gaasPASeq[i][IDX_PA_TYPE] != TYPE_FIS)   
    {
        err(i + " is not a FIS");
        return "";
    }
    
    var j = gaasPASeq[i][IDX_PA_NO];
    return gaasFISSeq[j][IDX_FIS_COMMAND].trim();
}

function getDataFISLength(i)
{
    if (gaasPASeq[i][IDX_PA_TYPE] != TYPE_FIS)   
    {
        err(i + " is not a FIS");
        return 0;
    }
    
    var j = gaasPASeq[i][IDX_PA_NO];

    return gaasFISSeq[j][IDX_FIS_DATA].length;
}

// get sectorCnt from CMD FIS
function getSectorCnt(i)
{
    if (gaasPASeq[i][IDX_PA_TYPE] != TYPE_FIS)   
    {
        err(i + " is not a FIS");
        return 0;
    }
    
    var j = gaasPASeq[i][IDX_PA_NO];
    
    if (parseInt(gaasFISSeq[j][IDX_FIS_SECTORS], 16) == 0)
    {
        return 0;
    }
    
    return getNumber(gaasFISSeq[j][IDX_FIS_SECTORS], 16);
}

function getFeature(i)
{
    if (gaasPASeq[i][IDX_PA_TYPE] != TYPE_FIS)   
    {
        err(i + " is not a FIS");
        return 0;
    }
    
    var j = gaasPASeq[i][IDX_PA_NO];
    return getNumber(gaasFISSeq[j][IDX_FIS_FEATURE], 16);
}

function isSetMultiple(i)
{
    if (gaasPASeq[i][IDX_PA_TYPE] != TYPE_FIS)
    {
        return false;
    }

    var j = gaasPASeq[i][IDX_PA_NO];
    
    return (gaasFISSeq[j][IDX_FIS_COMMAND].indexOf("C6") == 0);
}


// i: device responses COMWAKE
function isWakeupFromPartial(i)
{
    //log("D:" + getDuration(i - 1, i));
    return (getDuration(i - 1, i) < 10000);
}

// i: device responses COMWAKE
function isWakeupFromSlumber(i)
{
    var iDuration = getDuration(i - 1, i);
    log("iDuration:" + iDuration);
    return (iDuration > 10000) && (iDuration < 1000000);
}

function isPrimitiveType(str)
{
    return (str.indexOf("Host") >= 0 ||
            str.indexOf("Device") >= 0 ||
            str.indexOf("Initiator") >= 0 ||
            str.indexOf("Target") >= 0);
}

function isMultiPrimitiveType(asToken, index)
{
    for (var i = index + 4; i < index + 10; i++)
    {
        if (!asToken[i])
        {
            break;
        }
        
        if (asToken[i].indexOf(S_MULTI_PRIMITIVE_FIRST_LINE) == 0 ||
            asToken[i].indexOf(S_MULTI_PRIMITIVE_FIRST_LINE2) == 0)
        {
            return true;
        }
    }
    
    return false;
}


function isLegalPAIdx(i)
{
    return (i >= 0 && i < giPAIndex);
}

function isOOB(i)
{
    return isLegalPAIdx(i) && gaasPASeq[i][IDX_PA_TYPE] == TYPE_OOB;
}

function isHostOOB(i)
{
    return isOOB(i) &&
           gaasOOBSeq[gaasPASeq[i][IDX_PA_NO]][IDX_OOB_AMOUNT + IDX_INFO_PORT].indexOf("I1") >= 0;
}

function isDeviceOOB(i)
{
    return isOOB(i) &&
           gaasOOBSeq[gaasPASeq[i][IDX_PA_NO]][IDX_OOB_AMOUNT + IDX_INFO_PORT].indexOf("T1") >= 0;
}

function isPrimitive(i)
{
    return isLegalPAIdx(i) && gaasPASeq[i][IDX_PA_TYPE] == TYPE_PRIMITIVE;
}

function isHostPrimitive(i)
{
    return isPrimitive(i) &&
            (gaasPrimitiveSeq[gaasPASeq[i][IDX_PA_NO]][IDX_PRIMITIVE_SENDER].indexOf("Host") >= 0 || 
             gaasPrimitiveSeq[gaasPASeq[i][IDX_PA_NO]][IDX_PRIMITIVE_SENDER].indexOf("Initiator") >= 0);
}

function isDevicePrimitive(i)
{
    return isPrimitive(i) &&
            (gaasPrimitiveSeq[gaasPASeq[i][IDX_PA_NO]][IDX_PRIMITIVE_SENDER].indexOf("Device") >= 0 || 
             gaasPrimitiveSeq[gaasPASeq[i][IDX_PA_NO]][IDX_PRIMITIVE_SENDER].indexOf("Target") >= 0);
}

function getPrimitiveType(i)
{
    if (gaasPASeq[i][IDX_PA_TYPE] != TYPE_PRIMITIVE)
    {
        err(i + " is not a primitive");
        return "";
    }
    
    return gaasPrimitiveSeq[gaasPASeq[i][IDX_PA_NO]][IDX_PRIMITIVE_TYPE];
}

function isPartial(i)
{
    return isLegalPAIdx(i) && 
            gaasPASeq[i][IDX_PA_TYPE] == TYPE_PRIMITIVE &&
            gaasPrimitiveSeq[gaasPASeq[i][IDX_PA_NO]][IDX_PRIMITIVE_TYPE].indexOf("PMREQ_P") >= 0;
}

function isSlumber(i)
{
    return isLegalPAIdx(i) && 
            gaasPASeq[i][IDX_PA_TYPE] == TYPE_PRIMITIVE &&
            gaasPrimitiveSeq[gaasPASeq[i][IDX_PA_NO]][IDX_PRIMITIVE_TYPE].indexOf("PMREQ_S") >= 0;
}

function isPMACK(i)
{
    return isLegalPAIdx(i) && 
            gaasPASeq[i][IDX_PA_TYPE] == TYPE_PRIMITIVE &&
            gaasPrimitiveSeq[gaasPASeq[i][IDX_PA_NO]][IDX_PRIMITIVE_TYPE].indexOf("PMACK") >= 0;
}

function isPMNAK(i)
{
    return isLegalPAIdx(i) && 
            gaasPASeq[i][IDX_PA_TYPE] == TYPE_PRIMITIVE &&
            gaasPrimitiveSeq[gaasPASeq[i][IDX_PA_NO]][IDX_PRIMITIVE_TYPE].indexOf("PMNAK") >= 0;
}

function isPMREQ(i)
{
    return isLegalPAIdx(i) && 
            gaasPASeq[i][IDX_PA_TYPE] == TYPE_PRIMITIVE &&
            gaasPrimitiveSeq[gaasPASeq[i][IDX_PA_NO]][IDX_PRIMITIVE_TYPE].indexOf("PMREQ_") >= 0;
}

function getOOBType(i)
{
    if (gaasPASeq[i][IDX_PA_TYPE] != TYPE_OOB)
    {
        err(i + " is not a OOB");
        return "";
    }
    
    return gaasOOBSeq[gaasPASeq[i][IDX_PA_NO]][IDX_OOB_TYPE];
}

function isCominit(i)
{
    return isLegalPAIdx(i) && 
            gaasPASeq[i][IDX_PA_TYPE] == TYPE_OOB &&
            gaasOOBSeq[gaasPASeq[i][IDX_PA_NO]][IDX_OOB_TYPE].indexOf("COMINIT") >= 0;
}

function isComwake(i)
{
    return isLegalPAIdx(i) && 
            gaasPASeq[i][IDX_PA_TYPE] == TYPE_OOB &&
            gaasOOBSeq[gaasPASeq[i][IDX_PA_NO]][IDX_OOB_TYPE].indexOf("COMWAKE") >= 0;
}

function isComreset(i)
{
    return isLegalPAIdx(i) && 
            gaasPASeq[i][IDX_PA_TYPE] == TYPE_OOB &&
            gaasOOBSeq[gaasPASeq[i][IDX_PA_NO]][IDX_OOB_TYPE].indexOf("COMRESET") >= 0;
}


function getClaimNo(i)
{
    return getNumber(gaasPASeq[i][IDX_PA_CLAIM_NO]);
}

function getClaim(i)
{
    return "" + getClaimType(i) + getClaimNo(i);
}

// about Multiple Primitive

function isMultiPrimitive(i)
{
    return isLegalPAIdx(i) && (gaasPASeq[i][IDX_PA_TYPE] == TYPE_MULTI_PRIMITIVE);
}

function getPrimitiveFSM(i)
{
    if (!isMultiPrimitive(i))
    {
        return S_NOT_FOUND;
    }
    
    var j = gaasPASeq[i][IDX_PA_NO];

    return gaasMultiPrimitiveSeq[j][IDX_MULTI_PRIMITIVE_QUEUE];
}

function getHostPrimitive(aasFSM, iFSMIdx)
{
    return aasFSM[iFSMIdx][IDX_HOST_PRIMITIVE];
}

function getDevicePrimitive(aasFSM, iFSMIdx)
{
    return aasFSM[iFSMIdx][IDX_DEVICE_PRIMITIVE];
}

function getNowPrimitiveFSM(i, iDirection, iFSMIdx)
{
    var aasFSM = getPrimitiveFSM(i);
    
    if (aasFSM == S_NOT_FOUND)
    {
        return S_NOT_FOUND;
    }
    
    var iDirectionIdx = (iDirection == I_HOST) ? IDX_HOST_PRIMITIVE : IDX_DEVICE_PRIMITIVE;
    
    err("###" + aasFSM[iFSMIdx]);
    
    return aasFSM[iFSMIdx][iDirectionIdx];
}

function getNowState()
{   
}

function getPrimitiveState(sPrimitive, iDirection)
{
    if (sPrimitive == SYNC)
    {
        return [L_IDLE, L_SyncEscape, L_RcvWaitFifo, L_NoPmnak];
    }
    else if (sPrimitive == ALIGN)
    {
        return [L_NoComm, L_SendAlign, L_WakeUp2];
    }
    else if (sPrimitive == X_RDY)
    {
        return (iDirection == I_HOST) ? [HL_SendChkRdy] : [DL_SendChkRdy];
    }
    else if (sPrimitive == SOF)
    {
        return [L_SendSOF];
    }
    else if (sPrimitive == PAYLOAD)
    {
        return [L_SendData];
    }
    else if (sPrimitive == HOLDA)
    {
        return [L_RcvrHold, L_RcvHold];
    }
    else if (sPrimitive == HOLD)
    {
        return [L_SendHold];
    }
    else if (sPrimitive == EOF)
    {
        return [L_SendEOF];
    }
    else if (sPrimitive == WTRM)
    {
        return [L_Wait];
    }
    else if (sPrimitive == R_RDY)
    {
        return [L_RcvChkRdy];
    }
    else if (sPrimitive == R_IP)
    {
        return [L_RcvData, L_RcvEOF, L_GoodCRC];
    }
    else if (sPrimitive == R_OK)
    {
        return [L_GoodEnd];
    }
    else if (sPrimitive == R_ERR)
    {
        return [L_BadEnd];
    }
    else if (sPrimitive == PMREQ_P)
    {
        return [L_TPMPartial];
    }
    else if (sPrimitive == PMREQ_S)
    {
        return [L_TPMSlumber];
    }
    else if (sPrimitive == PMACK)
    {
        return [L_PMOff];
    }
    else if (sPrimitive == PMNAK)
    {
        return [L_PMDeny];
    }
    else if (sPrimitive == CRC)
    {
        return [L_SendCRC];
    }
    else
    {
        return [S_NOT_FOUND];
    }
}

function showErrorPrimitiveInfo(sNowState, sNextState, asExpectNextState)
{
    err("Now state:" + sNowState);
    err("Expected:" + asExpectNextState);
    err("Actual:" + sNextState);
}

function getDirectionText(iDirection)
{
    return (iDirection == I_HOST) ? "Host " : "Device ";
}

function getExpectedNextPrimitiveState(sNowState, iDirection)
{
    var asExpectedState = [];
    
    if (sNowState == L_IDLE)
    {
        var sSendChkRdy = (iDirection == I_HOST) ? HL_SendChkRdy : DL_SendChkRdy;
        
        asExpectedState = [sSendChkRdy, L_TPMPartial, L_TPMSlumber, 
                L_RcvWaitFifo, L_PMOff, L_PMDeny, L_IDLE, L_NoComm];
    }
    else if (sNowState == L_SyncEscape)
    {
        asExpectedState = [L_SyncEscape, L_IDLE, L_NoComm];
    }
    else if (sNowState == L_NoComm)
    {
        asExpectedState = [L_NoComm, L_SendAlign];
    }
    else if (sNowState == L_SendAlign)
    {
        asExpectedState = [L_IDLE, L_NoComm];
    }
    else if (sNowState == HL_SendChkRdy)
    {
        asExpectedState = [L_SendSOF, L_RcvWaitFifo, HL_SendChkRdy, L_NoComm];
    }
    else if (sNowState == DL_SendChkRdy)
    {
        asExpectedState = [L_SendSOF, DL_SendChkRdy, L_NoComm];
    }
    else if (sNowState == L_SendSOF)
    {
        asExpectedState = [L_SendData, L_IDLE, L_NoComm];
    }
    else if (sNowState == L_SendData)
    {
        asExpectedState = [L_SendData, L_RcvHold, L_SendHold, L_SendCRC, 
                L_IDLE, L_SyncEscape, L_NoComm];
    }
    else if (sNowState == L_SendHold)
    {
        asExpectedState = [L_SendData, L_RcvHold, L_SendHold, 
                L_SendCRC, L_IDLE, L_SyncEscape, L_NoComm] ;
    }
    else if (sNowState == L_SendCRC)
    {
        asExpectedState = [L_SendEOF, L_IDLE, L_NoComm];
    }
    else if (sNowState == L_SendEOF)
    {
        asExpectedState = [L_Wait, L_IDLE, L_NoComm];
    }
    else if (sNowState == L_Wait)
    {
        asExpectedState = [L_IDLE, L_Wait, L_NoComm];
    }
    else if (sNowState == L_RcvChkRdy)
    {
        asExpectedState = [L_RcvChkRdy, L_RcvData, L_IDLE, L_NoComm];
        
        if (gbAllowR_RDYtoR_OK)
        {
            asExpectedState[asExpectedState.length] = L_GoodEnd;
        }
    }
    else if (sNowState == L_RcvWaitFifo)
    {
        asExpectedState = [L_RcvChkRdy, L_RcvWaitFifo, L_IDLE, L_NoComm];
    }
    else if (sNowState == L_RcvData)
    {
        asExpectedState = [L_RcvData, L_Hold, L_RcvHold, L_RcvEOF, 
                L_BadEnd, L_IDLE, L_RcvData, L_SyncEscape, L_NoComm];
    }
    else if (sNowState == L_Hold)
    {
        asExpectedState = [L_RcvData, L_RcvHold, L_Hold, 
                L_IDLE, L_SyncEscape, L_NoComm];
    }
    else if (sNowState == L_RcvHold)
    {
        asExpectedState = [L_RcvData, L_RcvHold, L_RcvEOF, L_IDLE,
                L_SyncEscape, L_NoComm];
    }
    else if (sNowState == L_RcvEOF)
    {
        asExpectedState = [L_RcvEOF, L_GoodCRC, L_BadEnd, L_NoComm];
    }
    else if (sNowState == L_GoodCRC)
    {
        asExpectedState = [L_GoodEnd, L_BadEnd, L_GoodCRC, L_IDLE, L_NoComm];
    }
    else if (sNowState == L_GoodEnd)
    {
        asExpectedState = [L_IDLE, L_GoodEnd, L_NoComm];
    }
    else if (sNowState == L_BadEnd)
    {
        asExpectedState = [L_IDLE, L_BadEnd, L_NoComm];
    }
    else if (sNowState == L_TPMPartial)
    {
        asExpectedState = [L_ChkPhyRdy, L_RcvWaitFifo, L_TPMPartial, 
                L_IDLE, L_NoPmnak, L_NoComm];
    }
    else if (sNowState == L_TPMSlumber)
    {
        asExpectedState = [L_ChkPhyRdy, L_RcvWaitFifo, L_TPMSlumber,
                L_IDLE, L_NoPmnak, L_NoComm];
    }
    else if (sNowState == L_PMOff)
    {
        asExpectedState = [L_ChkPhyRdy, L_PMOff];
    }
    else if (sNowState == L_PMDeny)
    {
        asExpectedState = [L_PMDeny, L_IDLE, L_NoComm];
    }
    else if (sNowState == L_ChkPhyRdy)
    {
        asExpectedState = [L_ChkPhyRdy, L_NoComm];
    }
    else if (sNowState == L_NoComm)
    {
        asExpectedState = [];
    }
    else if (sNowState == L_WakeUp2)
    {
        asExpectedState = [L_IDLE, L_NoComm];
    }
    else if (sNowState == L_NoPmnak)
    {
        asExpectedState = [L_NoPmnak, L_IDLE];
    }
    else
    {
        asExpectedState = [S_NOT_FOUND];
    }
    
    return asExpectedState;
}



function isIllegalNextPrimitiveState(sNowState, sNextState, iDirection)
{
    var asExpectNextState = getExpectedNextPrimitiveState(sNowState, iDirection);
        
    for (var i = 0; i < asExpectNextState.length; i++)
    {
        if (sNextState == asExpectNextState[i])
        {
            return false;
        }
    }

    showErrorPrimitiveInfo(sNowState, sNextState, asExpectNextState);
    return true;
}










function initFailInfo()
{
    gbFail = false;
    giFailIdx = 0;
    gsTempFailLog = "";
}

function setFailInfo(i, sMessage)
{
    failLog(sMessage);
    gbFail = true;
    giFailIdx = i;
}

// about veriables init

function initPrimitive(i)
{
    gaasPrimitiveSeq[i] = [];
    
    for (var j = 0; j < IDX_INFO_AMOUNT + IDX_PRIMITIVE_AMOUNT; j++)
    {
        gaasPrimitiveSeq[i][j] = "";
    }
}

function initMultiPrimitive(i)
{
    gaasMultiPrimitiveSeq[i] = [];
    
    for (var j = 0; j < IDX_INFO_AMOUNT + IDX_MULTI_PRIMITIVE_AMOUNT; j++)
    {
        gaasMultiPrimitiveSeq[i][j] = "";
    }
    
    gaasMultiPrimitiveSeq[i][IDX_MULTI_PRIMITIVE_QUEUE] = [];
}

function initOOB(i)
{
    gaasOOBSeq[i] = [];
    
    for (var j = 0; j < IDX_INFO_AMOUNT + IDX_OOB_AMOUNT; j++)
    {
        gaasOOBSeq[i][j] = "";
    }
}

function initFIS(i)
{
    gaasFISSeq[i] = [];
    
    for (var j = 0; j < IDX_INFO_AMOUNT + IDX_FIS_AMOUNT; j++)
    {
        gaasFISSeq[i][j] = "";
    }
}

function initCmd(i)
{
    gaasCmdSeq[i] = [];
    
    for (var j = 0; j < IDX_INFO_AMOUNT + IDX_CMD_AMOUNT; j++)
    {
        gaasCmdSeq[i][j] = "";
    }
}

function initPA(i, iSpecificType, iSpecificIdx, sLine)
{
    gaasPASeq[i] = [];
    
    for (var j = 0; j < IDX_INFO_AMOUNT + IDX_PA_AMOUNT; j++)
    {
        gaasPASeq[i][j] = "";
    }
    
    var sClaimType;
    
    if (iSpecificType == TYPE_CMD)
        sClaimType = "ATA Cmd.";
    else if (iSpecificType == TYPE_FIS)
        sClaimType = "Transport";
    else if (iSpecificType == TYPE_PRIMITIVE || iSpecificType == TYPE_MULTI_PRIMITIVE || iSpecificType == TYPE_OOB)
        sClaimType = "Link";
    else 
        sClaimType = "NONE";
    
    gaasPASeq[i][IDX_PA_TYPE] = iSpecificType;
    gaasPASeq[i][IDX_PA_NO] = iSpecificIdx;
    gaasPASeq[i][IDX_PA_CLAIM_TYPE] = sClaimType;
    gaasPASeq[i][IDX_PA_CLAIM_NO] = sLine.split(sClaimType)[1].replace(/_/g, "");
}



// about CSV

function initCSV()
{
    for (var i = 0; i < IDX_CSV_AMOUNT; i++)
    {
        gasCSV[i] = "";     // store the parsed CSV string
        gasCSVType[i] = ""; // store the CSV type(Link, Transport or ATA Cmd)
        gaaiCSVPAIdx[i] = []; // store the original PA index 
    }
    
    log("init CSV done");
}

function addDrawCSV(iCSVIdx, iNo, iValue)
{
    var i;

    if (gsAxisXType == S_X_AXIS_NO)
    {
        i = getClaimNo(iNo);
    }
    else if (gsAxisXType == S_X_AXIS_TIME_MS)
    {
        i = getStartMS(iNo) 
    }
    else
    {
        err("gsAxisXType is wrong: " + gsAxisXType);
    }
    
    if (gasCSVType[iCSVIdx] == "")
    {
        gasCSVType[iCSVIdx] = getClaim(iNo).split("" + i)[0];

        log("Parsed Type:" + gasCSVType[iCSVIdx]);
    }

    gasCSV[iCSVIdx] += "" + i + "," + iValue + "\n";
    gaaiCSVPAIdx[iCSVIdx][i] = iNo; // store the original PA idx
}

function getNowTimeStr()
{
    var today=new Date();
    return today.getFullYear() + "_" + 
            (today.getMonth()+1) + "_" + 
            today.getDate() + "_" + 
            today.getHours() + "_" + 
            today.getMinutes() + "_" + 
            today.getSeconds();
}

// about error csv

function formatTextInCSV(sText)
{
    return sText.replace(/\s,\s/g, "，").replace(/,/g, "/");
}

function addErrorCSV(i, sType, sReason, sDescription)
{
    gsErrorCSV += giErrorCSVIdx + "," + getClaim(i) + "," + sType + "," + 
                  formatTextInCSV(sReason) + "," + formatTextInCSV(sDescription) + "\n";
    
    giErrorCSVIdx++;
}

// about log

function failLog(sText)
{
    console.log("fail : " + sText);
    gsTempFailLog += "\r\n" + sText;
}

function err(sText)
{
    console.log("Err : " + sText);
    
    gsTempErrLog += "\r\n" + sText;
    //console.trace();
}

function log(sText)
{
    gsTempLog += "\r\n" + sText;
    if (gbEnableLog)
    {
        console.log(sText);
    }
    //document.getElementById("idLog").innerHTML += "<p></p>" + sText;
}

