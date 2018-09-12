
// ---------------------------      Constant       ---------------------------

var I_NONE_IDX = -1;
var I_NOT_FOUND = -1;
var S_CODE_UART = "ERRMSG";
var S_NOT_FOUND = " Not Found ";

var I_DMA_DATA_FIS = 0;
var I_PIO_DATA_FIS = 1;

var I_HOST = 0;
var I_DEVICE = 1;

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
"READ FPDMA QUEUED - 60h, DMA",
"WRITE FPDMA QUEUED - 61h, DMA"
];



// for FSM of Primitive

var X_RDY = "SATA_X_RDY";
var R_RDY = "SATA_R_RDY";
var ALIGN = "ALIGN 0";
var SYNC = "SATA_SYNC";
var WTRM = "SATA_WTRM";
var CONT = "SATA_CONT";
var R_IP = "SATA_R_IP";
var R_OK = "SATA_R_OK";
var R_ERR = "SATA_R_ERR";
var XXXX = "XXXX";
var SOF = "SATA_SOF";
var EOF = "SATA_EOF";
var PAYLOAD = "Payload";
var HOLDA = "SATA_HOLDA";
var HOLD = "SATA_HOLD";
var PMREQ_P = "SATA_PMREQ_P";
var PMREQ_S = "SATA_PMREQ_S";
var PMACK = "SATA_PMACK";
var PMNAK = "SATA_PMNAK";

var XXXX = "XXXX";
var CRC = "CRC";



var L_IDLE = "L_IDLE"; // L1 Transmit SYNC
var L_SyncEscape = "L_SyncEscape"; // L2 Transmit SYNC.

var L_NoCommErr = "L_NoCommErr"; // LS1 osthy not ready error to Transport layer. 
var L_NoComm = "L_NoComm"; // LS2 Transmit ALIGN
var L_SendAlign = "L_SendAlign"; // LS3 Transmit ALIGN .
var L_RESET = "L_RESET"; // LS4 Reset Link state to initial conditions. 

var HL_SendChkRdy = "HL_SendChkRdy"; // LT1 Transmit XRDY .
var DL_SendChkRdy = "DL_SendChkRdy"; // LT2 Transmit XRDY .
var L_SendSOF = "L_SendSOF"; // LT3 Transmit SOF
var L_SendData = "L_SendData"; // LT4 Transmit data Dword 
var L_RcvrHold = "L_RcvrHold"; // LT5 Transmit HOLDA .
var L_SendHold = "L_SendHold"; // LT6 Transmit HOLD .
var L_SendCRC = "L_SendCRC"; // LT7 Transmit CRC. 
var L_SendEOF = "L_SendEOF"; // LT8 Transmit EOF .
var L_Wait = "L_Wait"; // LT9 Transmit WTRM .

var L_RcvChkRdy = "L_RcvChkRdy"; // LR1 Transmit RRDY .
var L_RcvWaitFifo = "L_RcvWaitFifo"; // LR2 Transmit SYNC .
var L_RcvData = "L_RcvData"; // LR3 Transmit RIP or DMAT
var L_Hold = "L_Hold"; // LR4 Transmit HOLD .
var L_RcvHold = "L_RcvHold"; // LR5 Transmit HOLDA or DMAT
var L_RcvEOF = "L_RcvEOF"; // LR6 Transmit RIP .
var L_GoodCRC = "L_GoodCRC"; // LR7 Transmit RIP .
var L_GoodEnd = "L_GoodEnd"; // LR8 Transmit ROK .
var L_BadEnd = "L_BadEnd"; // LR9 Transmit RERR .

var L_TPMPartial = "L_TPMPartial"; // LPM1 TransmitMREQP .
var L_TPMSlumber = "L_TPMSlumber"; // LPM2 TransmitMREQS .
var L_PMOff = "L_PMOff"; // LPM3 Transmit PMACK
var L_PMDeny = "L_PMDeny"; // LPM4 Transmit PMNAK .
var L_ChkPhyRdy = "L_ChkPhyRdy"; // LPM5 Assert artial/Slumber to phy layer (as appropriate). 
var L_NoCommPower = "L_NoCommPower"; // LPM6 Maintain artial/Slumber assertion (as appropriate).
var L_WakeUp1 = "L_WakeUp1"; // LPM7 Negate both artial and Slumber. 
var L_WakeUp2 = "L_WakeUp2"; // LPM8 Transmit ALIGN .
var L_NoPmnak = "L_NoPmnak"; // LPM9 Transmit SYNC .

var S_TYPE_PARSE = "解析階段";
var S_TYPE_VERIFY = "驗證階段";
var S_TYPE_DETECT = "檢查階段";
var S_TYPE_STAT = "統計階段";

var S_Y_AXIS_TIME_US = "Time (us)";
var S_X_AXIS_NO = "NO"; // x axis is sequence of NO (ex. Link1, Link2, .... Link100)
var S_X_AXIS_TIME_MS = "Time (MS)"; // x axis is sequence of time (ex. 10.00s, 10.01s, ... 60.00s)

// ---------------------------    SVG Option    ---------------------------

var gsAxisXType = S_X_AXIS_NO;

// --------------------------- Global Veriables ---------------------------

var gabRegErr = [];
var gasErrLog = [];

var gsTempLog = "";
var gsTempErrLog = "";
var gsTempFailLog = "";

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
var IDX_FIS_CBIT = 10;
var IDX_FIS_DATA = 11;
var IDX_FIS_CRC = 12;
//var IDX_FIS_I = 10;
var IDX_FIS_AMOUNT = 13;

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
	["SActive", IDX_FIS_SACTIVE],
    ["C_BIT", IDX_FIS_CBIT],
    ["Data", IDX_FIS_DATA],
    ["CRC", IDX_FIS_CRC]
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


var S_MULTI_PRIMITIVE_FIRST_LINE = "__Initiator_______________________________RD__   __Target__________________________________RD__";
var S_MULTI_PRIMITIVE_FIRST_LINE2 = "__Host____________________________________RD__   __Device__________________________________RD__";

var IDX_MULTI_PRIMITIVE_FIS_TYPE = 0;
var IDX_MULTI_PRIMITIVE_ATA_COMMAND = 1;
var IDX_MULTI_PRIMITIVE_SEC_COUNT = 2;
var IDX_MULTI_PRIMITIVE_AMOUNT = 2;

var IDX_MULTI_PRIMITIVE_QUEUE = IDX_INFO_AMOUNT + IDX_MULTI_PRIMITIVE_AMOUNT;
var IDX_HOST_PRIMITIVE = 0;
var IDX_DEVICE_PRIMITIVE = 1;

var TAG_MULTI_PRIMITIVE = [
    ["FIS Type", IDX_MULTI_PRIMITIVE_FIS_TYPE],
    ["ATA Command", IDX_MULTI_PRIMITIVE_ATA_COMMAND],
    ["SecCount", IDX_MULTI_PRIMITIVE_SEC_COUNT]
];

var giMultiPrimitiveIndex = 0;
var gaasMultiPrimitiveSeq = [];       // sequence of Multi Primitive

var giCmdIndex = 0;
var gaasCmdSeq = [];

var TYPE_CMD = 1;
var TYPE_FIS = 2;
var TYPE_PRIMITIVE = 3;
var TYPE_MULTI_PRIMITIVE = 4;
var TYPE_OOB = 5;

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

var I_CMD_TYPE_OTHER = 0;
var I_CMD_TYPE_NCQ_WRITE = 1;
var I_CMD_TYPE_NCQ_READ = 2;
var I_CMD_TYPE_NON_NCQ_WRITE = 3;
var I_CMD_TYPE_NON_NCQ_READ = 4;
var I_CMD_TYPE_AMOUNT = 5;
var gaiCmdDrawQueue = [];
var gaiCmdDrawCnt = [];
var gaaCmdColorQueue = [
    ["Ohter Cmd", I_CMD_TYPE_OTHER, "Khaki"], 
    ["NCQ Write", I_CMD_TYPE_NCQ_WRITE, "YellowGreen"],
    ["NCQ Read", I_CMD_TYPE_NCQ_READ, "RoyalBlue"], 
    ["non-NCQ Write", I_CMD_TYPE_NON_NCQ_WRITE, "Coral"], 
    ["non-NCQ Read", I_CMD_TYPE_NON_NCQ_READ, "DarkOrchid"]];

var I_PARTIAL_TYPE_OTHER = 0;
var I_PARTIAL_TYPE_ACK = 1;
var I_PARTIAL_TYPE_NAK = 2;
var I_PARTIAL_TYPE_AMOUNT = 3;
var gaiPartialDrawQueue = [];
var gaiPartialDrawCnt = [];
var gaaPartialColorQueue = [
    ["reply other for Partial", I_PARTIAL_TYPE_OTHER, "Khaki"], 
    ["reply ACK for Partial", I_PARTIAL_TYPE_ACK, "YellowGreen"],
    ["reply NAK for Partial", I_PARTIAL_TYPE_NAK, "RoyalBlue"]
    ];
    
var I_SLUMBER_TYPE_OTHER = 0;
var I_SLUMBER_TYPE_ACK = 1;
var I_SLUMBER_TYPE_NAK = 2;
var I_SLUMBER_TYPE_AMOUNT = 3;
var gaiSlumberDrawQueue = [];
var gaiSlumberDrawCnt = [];
var gaaSlumberColorQueue = [
    ["reply other for Slumber", I_SLUMBER_TYPE_OTHER, "Khaki"], 
    ["reply ACK for Slumber", I_SLUMBER_TYPE_ACK, "YellowGreen"],
    ["reply NAK for Slumber", I_SLUMBER_TYPE_NAK, "RoyalBlue"]
    ];
    
var I_COMWAKE_TYPE_OTHER = 0;
var I_COMWAKE_TYPE_PARTIAL = 1;
var I_COMWAKE_TYPE_SLUMBER = 2;
var I_COMWAKE_TYPE_COMINIT = 3;
var I_COMWAKE_TYPE_AMOUNT = 4;
var gaiComwakeDrawQueue = [];
var gaiComwakeDrawCnt = [];
var gaaComwakeColorQueue = [
    ["COMWAKE for other cases", I_COMWAKE_TYPE_OTHER, "Khaki"], 
    ["COMWAKE for Partial", I_COMWAKE_TYPE_PARTIAL, "YellowGreen"], 
    ["COMWAKE for Slumber", I_COMWAKE_TYPE_SLUMBER, "RoyalBlue"], 
    ["COMWAKE for COMINIT", I_COMWAKE_TYPE_COMINIT, "Coral"]];
    
var gbEnableLog = false;

var gsNowFileName = "";

//
// Error flag
//
var gbParseError = false; // skip verify if there exists parse error
var gbVerifyError = false;
var gbDetectError = false;
var gbStatisticError = false;

//
// output CSV file (recommend CSVFileView : https://www.nirsoft.net/utils/csv_file_view.html )
//
var giErrorCSVIdx = 0;
var gsErrorCSV = "錯誤編號,錯誤地點,錯誤類別,錯誤原因,錯誤描述\n";
var gsTempError = "";
var gsVerifyCSV = "";


//
// Policy
//
var gbSkipParseError = true; // true : still do verify & detect even if there exists parse error
                             // false: do nothing if there exists parse error
var gbAllowR_RDYtoR_OK = true; // true: allow R_RDY -> R_OK
var gbAllowR_RDYtoR_ERR = true; // true: allow R_RDY -> R_ERR
var gbAllowALIGNtoCONT = true; // true: allow ALIGN -> CONT

var gbPartialResponseThreshold = 300 // allow device responses PMACK/PMNAK delay for Partial (unit: ns)
var gbSlumberResponseThreshold = 300 // allow device responses PMACK/PMNAK delay for Slumber (unit: ns)