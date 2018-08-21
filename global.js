
// ---------------------------      Constant       ---------------------------

var I_NOT_FOUND = -1;
var S_CODE_UART = "ERRMSG";
var S_NOT_FOUND = " Not Found ";

var AS_ATA_CMD_LIST = [
"CFA ERASE SECTORS - C0h, non-data",
"CFA TRANSLATE SECTOR - 87h, PIO data-in",
"CHECK MEDIA CARD TYPE - D1h, Non-data",
"CHECK POWER MODE - E5h, Non-data",
"CONFIGURE STREAM - 51h, Non-data",
"DEVICE RESET - 08h, Device reset",
"DOWNLOAD MICROCODE - 92h, PIO Data-out",
"FLUSH CACHE - E7h, Non-data",
"FLUSH CACHE EXT - EAh, Non-data",
"IDENTIFY DEVICE - ECh, PIO Data-in",
"IDLE - E3h, Non-data",
"IDLE IMMEDIATE - E1h, Non-data",
"NOP - 00h, Non-data",
"FLUSH NV CACHE - B6h/14h, Non-data",
"QUERY NV CACHE MISSES - B6h/13h, DMA",
"PACKET - A0h, Packet",
"READ BUFFER - E4, PIO data-in",
"READ DMA - C8h, DMA",
"READ DMA EXT - 25h, DMA",
"READ DMA QUEUED - C7h, DMA Queued",
"READ DMA QUEUED EXT- 26h, DMA Queued",
"READ LOG EXT - 2Fh, PIO data-in",
"READ LOG DMA EXT - 47h, DMA",
"READ MULTIPLE - C4h, PIO data-in",
"READ MULTIPLE EXT - 29h, PIO data-in",
"READ SECTOR(S) - 20h, PIO data-in",
"READ SECTOR(S) EXT - 24h, PIO data-in",
"READ STREAM DMA EXT - 2Ah, DMA",
"READ STREAM EXT - 2Bh, PIO data-in",
"READ VERIFY SECTOR(S) - 40h, Non-data",
"SECURITY ERASE PREPARE - F3h, Non-data",
"SECURITY FREEZE LOCK - F5h, Non-data",
"SECURITY UNLOCK - F2h, PIO data-out",
"SERVICE - A2h, Packet or DMA Queued",
"SET FEATURES - EFh, Non-data",
"SET MAX ADDRESS - F9h",
"SET MAX LOCK - F9h/02h, Non-data",
"SET MAX ADDRESS EXT - 37h, Non-data",
"SET MULTIPLE MODE - C6h, Non-data",
"SLEEP - E6h, Non-data",
"SMART READ LOG - B0h/D5h",
"SMART WRITE LOG - D6h, PIO data-out",
"STANDBY - E2h, Non-data",
"STANDBY IMMEDIATE - E0h, Non-data",
"TRUSTED RECEIVE – 5Ch",
"TRUSTED RECEIVE DMA – 5Dh",
"TRUSTED SEND – 5Eh",
"TRUSTED SEND DMA – 5Fh",
"WRITE BUFFER - E8h, PIO data-out",
"WRITE DMA - CAh, DMA",
"WRITE DMA EXT - 35h, DMA",
"WRITE DMA FUA EXT - 3Dh, DMA",
"WRITE DMA QUEUED - CCh, DMA Queued",
"WRITE DMA QUEUED EXT - 36h, DMA Queued",
"WRITE LOG EXT - 3Fh, PIO data-out",
"WRITE LOG DMA EXT - 57h, DMA",
"WRITE MULTIPLE - C5h, PIO data-out",
"WRITE MULTIPLE EXT - 39h, PIO data-out",
"WRITE SECTOR(S) - 30h, PIO data-out",
"WRITE STREAM DMA EXT - 3Ah, DMA",
"WRITE STREAM EXT - 3Bh, PIO data-out",
"READ FPDMA QUEUED - 60H, DMA",
"WRITE FPDMA QUEUED - 61H, DMA"
];



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
var IDX_FIS_SACTIVE = 9;
//var IDX_FIS_C = 9;
//var IDX_FIS_I = 10;
var IDX_FIS_AMOUNT = 10;

var TAG_FIS = [
    ["FIS Type", IDX_FIS_TYPE],
    ["Command", IDX_FIS_COMMAND],
    ["Features", IDX_FIS_FEATURE],
    ["Status", IDX_FIS_STATUS],
    ["LBA", IDX_FIS_LBA],
    ["Sector Count", IDX_FIS_SECTORS],
    ["Control", IDX_FIS_CONTROL],
    ["Device", IDX_FIS_DEVICE],
    ["Error", IDX_FIS_ERROR],
	["SActive", IDX_FIS_SACTIVE]
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
var gasCSVType = [];
var gaaiCSVPAIdx = [];