/*
 * Drew (C)2013-2014
 * https://fri-gate.org
 */

//toJavaScriptConsole();

if (!nl)
    var nl = {};
if (!nl.drew)
    nl.drew = {};

nl.drew.fg = {
    config: {

        host: "",
        api: "api",
        port: 8087,
        //loadConfigUpdT: 1E3 * 60 * 15,
        loadConfigUpdT: 1E3 * 60 * 3,
        loadFirstConfigT: 1E3 * 3,
        nameDefTestFile: "/frigate.",
        updateConfigTimeWait: 1E3 * 60 * 1,
        processingTimeWait: 1E3 * 30,
        timeCheckTimewait: 1E3 * 60,
        timeCheckTimewaitIfOn: 1E3 * 60 * 3,
        timeSentToServer: 1E3 * 30,
        //proxyUpdT: 1E3 * 60 * 60 * 1
        proxyUpdT: 1E3 * 60 * 8,
        apiurl: ["friproxy", "fri-gate"],
        apiext: ["org", "biz"],
        apiind: ["", "0"],
        apidop: []
    },
    id: "",
    bid: "",
    md5: "",
    serial: 0,
    on: true,
    emptyF: function () {
    },
    userproxy: null,
    windowname: "",
    contrys: [],
    contryCh: "",
    proxyMain: {},
    proxyMainT: {},
    proxyMainInd: {},
    proxyArr: {},
    authHeader: [],
    authHeaderEnd: 0,
    loadConfigUpdTimer: null,
    lastLoadConfig: 0,
    hostList: [],
    hostBlList: [],
    hostRedirList: [],
    proxyonforlist: false,
    proxyonforall: false,
    hideall: false,
    hideonlist: false,
    spdyall: false,
    //noSpdyList: [],
    genUidi: 0,
    allApiUrls: [],
    allApiUrlsWork: [],
    loadConfigFailCount: 0,
    loadConfigOk: false,
    loadFirstConfigTimer: null,
    lastSetResp:0,
    sentToServerTimer:null,
    mutexHostList: null,
    tmpListIndDelta: 0
};