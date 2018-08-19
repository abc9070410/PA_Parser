
// the idle time between i and j
function getIdleTime(i, j)
{
    //log("" + getStartTime(j) + " - " + getEndTime(i) + " = " + (getStartTime(j) - getEndTime(i)));
    return getStartTime(j) - getEndTime(i);
}

function getStartTime(i)
{
    if (gaasPASeq[i][IDX_PA_TYPE] == TYPE_PRIMITIVE)
    {
        return getNumber(gaasPrimitiveSeq[gaasPASeq[i][IDX_PA_NO]][IDX_PRIMITIVE_AMOUNT + IDX_INFO_START].replace(/\./g, ""), 10);
    }
    else if (gaasPASeq[i][IDX_PA_TYPE] == TYPE_FIS)
    {
        return getNumber(gaasFISSeq[gaasPASeq[i][IDX_PA_NO]][IDX_FIS_AMOUNT + IDX_INFO_START].replace(/\./g, ""), 10);
    }
    else if (gaasPASeq[i][IDX_PA_TYPE] == TYPE_OOB)
    {
        return getNumber(gaasOOBSeq[gaasPASeq[i][IDX_PA_NO]][IDX_OOB_AMOUNT + IDX_INFO_START].replace(/\./g, ""), 10);
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
        return getNumber(gaasPrimitiveSeq[gaasPASeq[i][IDX_PA_NO]][IDX_PRIMITIVE_AMOUNT + IDX_INFO_START].replace(/\./g, ""), 10) + 
               getNumber(gaasPrimitiveSeq[gaasPASeq[i][IDX_PA_NO]][IDX_PRIMITIVE_AMOUNT + IDX_INFO_DURATION].replace(/\./g, ""), 10);
    }
    else if (gaasPASeq[i][IDX_PA_TYPE] == TYPE_FIS)
    {
        return getNumber(gaasFISSeq[gaasPASeq[i][IDX_PA_NO]][IDX_FIS_AMOUNT + IDX_INFO_START].replace(/\./g, ""), 10) + 
               getNumber(gaasFISSeq[gaasPASeq[i][IDX_PA_NO]][IDX_FIS_AMOUNT + IDX_INFO_DURATION].replace(/\./g, ""), 10);
    }
    else if (gaasPASeq[i][IDX_PA_TYPE] == TYPE_OOB)
    {
        return getNumber(gaasOOBSeq[gaasPASeq[i][IDX_PA_NO]][IDX_OOB_AMOUNT + IDX_INFO_START].replace(/\./g, ""), 10) + 
               getNumber(gaasOOBSeq[gaasPASeq[i][IDX_PA_NO]][IDX_OOB_AMOUNT + IDX_INFO_DURATION].replace(/\./g, ""), 10);
    }
    else
    {
        return 0;
    }
}

// time unit: us
function getDurationUS(i, j)
{
    return Math.floor(getDuration(i, j) / 1000);
}

// get the duration time from i to j (time unit: ns) (j must bigger than i)
function getDuration(i, j)
{
    //log("getD:" + getStartTime(j) + " - " + getEndTime(i));
    return getStartTime(j) - getEndTime(i);
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
           (gaasFISSeq[gaasPASeq[i][IDX_PA_NO]][IDX_FIS_TYPE].indexOf("60") == 0 || // READ FPDMA QUEUED
            gaasFISSeq[gaasPASeq[i][IDX_PA_NO]][IDX_FIS_TYPE].indexOf("61") == 0);  // WRITE FPDMA QUEUED
}

function isNonNCQ(i)
{
    return isH2DFIS(i) && !isNCQ(i); 
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

    var i;
    for (i = 0; i <= str.length; i++)
    {
        if (str.substring(i, i+1).indexOf("0") != 0)
        {
            break;
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
        return getCmdInfo(i);
    }
    else if (gaasPASeq[i][IDX_PA_TYPE] == TYPE_PRIMITIVE)
    {
        return getPrimitiveType(i);
    }
    else if (gaasPASeq[i][IDX_PA_TYPE] == TYPE_OOB)
    {
        return getOOBType(i);
    }
}

function getCmdInfo(i)
{
    var sCmdOP = "" + getCmdOP(i);

    for (var i = 0; i < AS_ATA_CMD_LIST.length; i++)
    {
        if (AS_ATA_CMD_LIST[i].indexOf(sCmdOP) > 0)
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
    return getNumber(gaasFISSeq[j][IDX_FIS_SECTORS], 16);
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

function isHostOOB(i)
{
    return isLegalPAIdx(i) && 
           gaasPASeq[i][IDX_PA_TYPE] == TYPE_OOB &&
           gaasOOBSeq[gaasPASeq[i][IDX_PA_NO]][IDX_OOB_AMOUNT + IDX_INFO_PORT].indexOf("I1") >= 0;
}

function isDeviceOOB(i)
{
    return isLegalPAIdx(i) && 
            gaasPASeq[i][IDX_PA_TYPE] == TYPE_OOB &&
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
    
    return gaasOOBSeq[gaasPASeq[i][IDX_PA_NO]][IDX_PRIMITIVE_TYPE];
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
    console.trace();
}

function log(sText)
{
    gsTempLog += "\r\n" + sText;

    console.log(sText);
    
    //document.getElementById("idLog").innerHTML += "<p></p>" + sText;
}

