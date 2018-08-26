
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
    if (isOOB(i))
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

    for (var i = 0; i < AS_ATA_CMD_LIST.length; i++)
    {
        if (AS_ATA_CMD_LIST[i].indexOf(sCmdOP + "h") > 0)
        {
            return AS_ATA_CMD_LIST[i];
        }
    }

    return S_NOT_FOUND + ":" + sCmdOP;
}

// get CMD OP from CMD FIS
function getCmdOP(i)
{
    if (gaasPASeq[i][IDX_PA_TYPE] != TYPE_FIS)   
    {
        err(i + " is not a CMD FIS");
        return "";
    }
    
    var j = gaasPASeq[i][IDX_PA_NO];
    return gaasFISSeq[j][IDX_FIS_COMMAND].trim();
}

// get sectorCnt from CMD FIS
function getSectorCnt(i)
{
    if (gaasPASeq[i][IDX_PA_TYPE] != TYPE_FIS)   
    {
        err(i + " is not a CMD FIS");
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
        err(i + " is not a CMD FIS");
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

function isHostPrimitive(i)
{
    return isLegalPAIdx(i) && 
            gaasPASeq[i][IDX_PA_TYPE] == TYPE_PRIMITIVE &&
            (gaasPrimitiveSeq[gaasPASeq[i][IDX_PA_NO]][IDX_PRIMITIVE_SENDER].indexOf("Host") >= 0 || 
             gaasPrimitiveSeq[gaasPASeq[i][IDX_PA_NO]][IDX_PRIMITIVE_SENDER].indexOf("Initiator") >= 0);
}

function isDevicePrimitive(i)
{
    return isLegalPAIdx(i) && 
            gaasPASeq[i][IDX_PA_TYPE] == TYPE_PRIMITIVE &&
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


function initFailInfo()
{
    gbFail = false;
    giFailIdx = 0;
}

function setFailInfo(i, sMessage)
{
    err(sMessage);
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
    else if (iSpecificType == TYPE_PRIMITIVE || iSpecificType == TYPE_OOB)
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

function addCSV(iCSVIdx, iNo, iValue)
{
    var i = getClaimNo(iNo);

    if (gasCSVType[iCSVIdx] == "")
    {
        gasCSVType[iCSVIdx] = getClaim(iNo).split("" + i)[0];

        log("Parsed Type:" + gasCSVType[iCSVIdx]);
    }

    gasCSV[iCSVIdx] += "" + i + "," + iValue + "\n";
    gaaiCSVPAIdx[iCSVIdx][i] = iNo; // store the original PA idx
}

// about log

function err(sText)
{
    gsTempErrLog = sText;
    console.log("Err : " + gsTempErrLog);
    //console.trace();
}

function log(sText)
{
    //gsTempLog += "\r\n" + sText;
    if (gbEnableLog)
    {
        console.log(sText);
    }
    //document.getElementById("idLog").innerHTML += "<p></p>" + sText;
}

