
// ---------------------------      Macro       ---------------------------

var I_NOT_FOUND = -1;
var S_CODE_UART = "ERRMSG";

// --------------------------- Global Veriables ---------------------------

var gabRegErr = [];
var gasErrLog = [];

var gsTempLog = "";
var gsTempErrLog = "";
var gsResult = "";

var gbFail;
var giFailIdx;

var gaoRead = [];                     // for read file
var giReadDoneCnt = 0;
var giFileCnt = 0;

var gsText = "";                // the current PA text


var gbHIPMEnable = 1;           // enable HIPM or not
var gbDIPMEnable = 1;           // enable DIPM or not
var gbAutoP2S = 0;              // auto partial to slumber
var gbDIPMAutoWakeupP2S = 0;    // DIPM auto wakeup partial to slumber

var giMaxDIPMIdleTime = 0;


var IDX_INFO_PORT = 0;
var IDX_INFO_START = 1;
var IDX_INFO_DURATION = 2;
var IDX_INFO_ERROR = 3;
var IDX_INFO_AMOUNT = 4;

var TAG_INFO = [
    ["Port", IDX_INFO_PORT],
    ["Start time", IDX_INFO_START],
    ["Duration Time", IDX_INFO_DURATION],
    ["Protocol Errors", IDX_INFO_ERROR]
];

var IDX_CMD_AMOUNT = 0;
    
var IDX_FIS_TYPE = 0;
var IDX_FIS_COMMAND = 1;
var IDX_FIS_FEATURE = 2;
var IDX_FIS_STATUS = 3;
var IDX_FIS_LBA = 4;
var IDX_FIS_SECTORS = 5;
var IDX_FIS_CONTROL = 6;
var IDX_FIS_DEVICE = 7;
var IDX_FIS_ERROR = 8;
//var IDX_FIS_C = 9;
//var IDX_FIS_I = 10;
var IDX_FIS_AMOUNT = 9;

var TAG_FIS = [
    ["FIS Type", IDX_FIS_TYPE],
    ["Command", IDX_FIS_COMMAND],
    ["Features", IDX_FIS_FEATURE],
    ["Status", IDX_FIS_STATUS],
    ["LBA", IDX_FIS_LBA],
    ["Sector Count", IDX_FIS_SECTORS],
    ["Control", IDX_FIS_CONTROL],
    ["Device", IDX_FIS_DEVICE],
    ["Error", IDX_FIS_ERROR]
    //["C", IDX_FIS_C],
    //["I", IDX_FIS_I]
];

var giFISIndex = 0;
var gaasFISSeq = [];             // sequence of FIS

var IDX_OOB_TYPE = 0;
var IDX_OOB_AMOUNT = 1;

var TAG_OOB = [
    ["OOB Type", IDX_OOB_TYPE]
];

var giOOBIndex = 0;
var gaasOOBSeq = [];                // sequence of OOB


var IDX_PRIMITIVE_SENDER = 0;
var IDX_PRIMITIVE_TYPE = 1;
var IDX_PRIMITIVE_AMOUNT = 2;

var TAG_PRIMITIVE = [
    ["__RD_", IDX_PRIMITIVE_SENDER],
    ["SATA_", IDX_PRIMITIVE_TYPE]
];

var giPrimitiveIndex = 0;
var gaasPrimitiveSeq = [];       // sequence of Primitive

var giCmdIndex = 0;
var gaasCmdSeq = [];

var TYPE_CMD = 1;
var TYPE_FIS = 2;
var TYPE_PRIMITIVE = 3;
var TYPE_OOB = 4;

var IDX_PA_TYPE = 0;    // include TYPE_CMD, TYPE_FIS, TYPE_PRIMITIVE and TYPE_OOB
var IDX_PA_NO = 1;      // order no in specific sequence
var IDX_PA_CLAIM_TYPE = 2;
var IDX_PA_CLAIM_NO = 3;
var IDX_PA_AMOUNT = 4;

var giPAIndex = 0;
var gaasPASeq = [];


var giSeqOffset = 0;

// check HIPM
var HIPM_NO_PMREQ = 0;
var HIPM_ALL_ACK = 1;
var HIPM_ALL_NAK = 2;
var HIPM_ACK_NAK = 3;
var HIPM_NOT_ACK_NAK_AFTER_PMREQ = 4;
var giHIPMCheckResult = HIPM_NO_PMREQ;

// check auto wakeup partial to slumber
var AWP2S_NO_PMREQ = 0;
var AWP2S_NOT_ALL_AUTO_WAKE_UP = 1;
var AWP2S_ALL_AUTO_WAKE_UP = 2;
var AWP2S_NO_AUTO_WAKE_UP = 3;
var giAWP2SCheckResult = AWP2S_NO_PMREQ;

var giStatusWidth;


var IDX_CSV_CMD_DURATION = 0;
var IDX_CSV_PARTIAL_RESPONSE = 1;
var IDX_CSV_SLUMBER_RESPONSE = 2;
var IDX_CSV_COMWAKE_RESPONSE = 3;
var IDX_CSV_COMRESET_RESPONSE = 4;
var IDX_CSV_AMOUNT = 5;
var gasCSV = [];
