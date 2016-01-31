/*
 * Drew (C)2013-2014
 * https://fri-gate.org
 */
nl.drew.fg.pref = function () {
    var pref = {
        extension_prefix: "extensions.frigate2.",
        prefBranch: null
    };

    //==============================================================================
    pref.observe = function (aSubject, aTopic, aData) {
        //
        switch (aData) {
            case 'userproxy':
                nl.drew.fg.lib.parseUserProxy();
                break;
            case 'hideico':
                nl.drew.fg.pref.observeHideShow();
                break;
            case 'cluidbutton':
                nl.drew.fg.pref.observeClUid();
                break;
            case 'on':
                var newonoff = nl.drew.fg.lib.pref.get_bool('on', true);
                if (newonoff != nl.drew.fg.on) {
                    nl.drew.fg.interf.Off(true);
                }
                break;
            case 'recOfff':
                var recOfff = nl.drew.fg.lib.pref.get_bool('recOfff', false);

                break;
            case 'proxyonforlist':
                nl.drew.fg.proxyonforlist = nl.drew.fg.lib.pref.get_bool('proxyonforlist', false);
                break;
            case 'spdyall':
                nl.drew.fg.spdyall = nl.drew.fg.lib.pref.get_bool('spdyall', false);
                break;
            case 'proxyonforall':
                nl.drew.fg.proxyonforall = nl.drew.fg.lib.pref.get_bool('proxyonforall', false);
                break;
            case 'hideall':
                nl.drew.fg.hideall = nl.drew.fg.lib.pref.get_bool('hideall', false);
                break;

            case 'resptime':
                var lastTimeResponse = nl.drew.fg.lib.pref.get_int('resptime', 0);

                if (nl.drew.fg.config.host && lastTimeResponse > nl.drew.fg.lastSetResp) {
                    nl.drew.fg.lastSetResp = lastTimeResponse;
                    nl.drew.fg.lastLoadConfig = Date.now() + nl.drew.fg.config.updateConfigTimeWait;

                    nl.drew.fg.conf.clearConfigTimer();

                    nl.drew.fg.mutexHostList.run(function () {
                        nl.drew.fg.stor.getItem("response", function (response) {
                            nl.drew.fg.loadConfigOk = false;
                            nl.drew.fg.conf.serverRespParse(response, null, false, null, false);
                            nl.drew.fg.conf.startConfigTimer();
                        });
                    });
                }
                break;
            case 'addhost1':
                var addHost = nl.drew.fg.lib.pref.get_string('addhost1', "");
                if (addHost) {
                    //nl.drew.fg.lib.dumpError("===========add");
                    try {
                        var addHostObj = JSON.parse(addHost);
                    } catch (e) {
                    }
                    if (addHostObj && typeof(addHostObj.id) != "undefined" && nl.drew.fg.lib.isIdInList(addHostObj.id) == -1) {
                        //nl.drew.fg.lib.dumpError("add=" + addHostObj.id);
                        nl.drew.fg.lib.addHostList(addHostObj);
                        nl.drew.fg.lib.updateTabs("url", addHostObj.hostUpd, addHostObj.hostTo);
                    }
                }
                break;
            case 'delhost1':
                var updHost;
                var delHostId = nl.drew.fg.lib.pref.get_int('delhost1', -1);

                if (delHostId < 1) {
                    return;
                }
                nl.drew.fg.mutexHostList.run(function () {
                    //nl.drew.fg.lib.dumpError("===========del");
                    var isId = nl.drew.fg.lib.isIdInList(delHostId);
                    if (isId > -1) {
                        //nl.drew.fg.lib.dumpError("del=" + delHostId + "=" + isId);
                        updHost = nl.drew.fg.hostList[isId].H;
                        nl.drew.fg.hostList.splice(isId, 1);
                        nl.drew.fg.lib.updateTabs("url", updHost);
                    }
                    nl.drew.fg.mutexHostList.done();
                });

                break;
            case 'deltmp':
                var delHostId = nl.drew.fg.lib.pref.get_int('deltmp', -1);
                if (delHostId < 1) {
                    return;
                }
                nl.drew.fg.mutexHostList.run(function () {
                    //nl.drew.fg.lib.dumpError("===========delTmp");
                    var isId = nl.drew.fg.lib.isIdInList(delHostId);
                    if (isId > -1) {
                        nl.drew.fg.hostList[isId].tmpdel = true;
                        nl.drew.fg.lib.updateTabs("url", nl.drew.fg.hostList[isId].H);
                    }
                    nl.drew.fg.mutexHostList.done();
                });
                break;
            case 'addtmp':
                var addHostId = nl.drew.fg.lib.pref.get_int('addtmp', -1);
                if (addHostId < 1) {
                    return;
                }
                nl.drew.fg.mutexHostList.run(function () {
                    //nl.drew.fg.lib.dumpError("===========addtmp");
                    var isId = nl.drew.fg.lib.isIdInList(addHostId);
                    if (isId > -1) {
                        nl.drew.fg.hostList[isId].tmpdel = false;

                        nl.drew.fg.lib.updateTabs("url", nl.drew.fg.hostList[isId].H);
                    }
                    nl.drew.fg.mutexHostList.done();
                });
                break;
            case 'chcontry':
                var co = nl.drew.fg.lib.pref.get_string('chcontry', "");
                if (co)
                    nl.drew.fg.interf.contryChAct(co);
                break;
            case 'chip':
                var co = nl.drew.fg.lib.pref.get_string('chip', "");
                if (co)
                    nl.drew.fg.interf.chIpAct(co);
                break;

            case 'fl':
                var needUpdTab = false;
                var fl = nl.drew.fg.lib.pref.get_string('fl', "");
                if (fl) {
                    //
                    try {
                        var flObj = JSON.parse(fl);
                    } catch (e) {
                    }
                    if (!flObj) {
                        return
                    }
                    if (!typeof(flObj.id) == "undefined" || typeof(flObj.bid) == "undefined") {
                        return
                    }
                    if (flObj.bid == nl.drew.fg.bid) {
                        return
                    }
                    if (flObj.id < 0) {
                        return
                    }
                    //
                    nl.drew.fg.lastLoadConfig = Date.now() + nl.drew.fg.config.updateConfigTimeWait;
                    //nl.drew.fg.lib.dumpError("==========observer FL");
                    nl.drew.fg.mutexHostList.run(function () {
                        //
                        var i = nl.drew.fg.lib.isIdInList(flObj.id);
                        if (i == -1) {
                            nl.drew.fg.mutexHostList.done();
                            return false;
                        }

                        if (flObj.t == 'proxy') {
                            if (nl.drew.fg.lib.proxyforever(i)) {
                                //
                                nl.drew.fg.hostList[i].processingFrom = 0;
                                nl.drew.fg.hostList[i].proxyBl = false;
                                nl.drew.fg.hostList[i].proxy = false;
                                nl.drew.fg.hostList[i].timeCheck = 0;
                            } else {
                                //
                                nl.drew.fg.hostList[i].proxy = true;
                            }
                            nl.drew.fg.lib.proxyforeverinvert(i);
                        }

                        if (nl.drew.fg.hostList[i].co != flObj.co) {
                            nl.drew.fg.hostList[i].co = flObj.co;
                            needUpdTab = true;
                        }
                        if (nl.drew.fg.hostList[i].fl != flObj.val) {
                            nl.drew.fg.hostList[i].fl = flObj.val;
                            needUpdTab = true;
                        }

                        if (needUpdTab) {
                            nl.drew.fg.lib.updateTabs("url", nl.drew.fg.hostList[i].H);
                        }

                        nl.drew.fg.mutexHostList.done();
                    });
                }
                break;

            case 'serial':
                //nl.drew.fg.lib.dumpError("==========serial");
                nl.drew.fg.serial = nl.drew.fg.lib.pref.get_int('serial', 0);
                break;
            case 'updatetabs':
                var host = nl.drew.fg.lib.pref.get_string('updatetabs', "");
                //nl.drew.fg.lib.dumpError("===========updatetabs=" + host);
                if (host) {
                    //nl.drew.fg.lib.dumpError("===========updatetabs");
                    if (host == "all") {
                        nl.drew.fg.lib.updateTabs();
                    } else if (host == "list") {
                        nl.drew.fg.lib.updateTabs("list");
                    } else {
                        nl.drew.fg.lib.updateTabs("url", host);
                    }
                }
                break;
            case 'sendto':

                var sendto = nl.drew.fg.lib.pref.get_string('sendto', "");
                if (sendto == "") {
                    return;
                }
                //nl.drew.fg.lib.dumpError("==========sendto= " + sendto + "==" + nl.drew.fg.bid);
                if (sendto != nl.drew.fg.bid) {
                    return;
                }

                if ((Date.now() - nl.drew.fg.lib.pref.get_string('lastSendTo', "0") ) < nl.drew.fg.config.timeSentToServer) {
                    //nl.drew.fg.lib.dumpError("==========lastSendTo= " + sendto + "==" + (Date.now() - nl.drew.fg.lib.pref.get_string('lastSendTo', "0")));
                    //nl.drew.fg.lib.dumpError(nl.drew.fg.config.timeSentToServer);
                    return;
                }
                nl.drew.fg.lib.pref.set_string('lastSendTo', Date.now());
                //nl.drew.fg.lib.dumpError("==========sendto====ok");
                nl.drew.fg.conf.sendToServer();
                break;
        }
    };
//==============================================================================
    pref.register = function () {
        var prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
        nl.drew.fg.pref.prefBranch = prefService.getBranch(nl.drew.fg.pref.extension_prefix);
        if (!("addObserver" in nl.drew.fg.pref.prefBranch)) {
            nl.drew.fg.pref.prefBranch.QueryInterface(Components.interfaces.nsIPrefBranch2);
        }
        nl.drew.fg.pref.prefBranch.addObserver("", nl.drew.fg.pref, false);
    }
//==============================================================================
    pref.unregister = function () {
        if (!nl.drew.fg.pref.prefBranch) {
            return;
        }
        try {
            nl.drew.fg.pref.prefBranch.removeObserver("", nl.drew.fg.pref);
        }
        catch (e) {
        }
    }


//==============================================================================
    pref.configuratePrefs = function () {
        nl.drew.fg.pref.register();

        if (nl.drew.fg.lib.pref.get_bool('is_first_run', true)) {
            //
            nl.drew.fg.pref.buttonShow('top');
        } else {
            //
            nl.drew.fg.lib.pref.set_bool('is_first_run', false);
        }

    };

    pref.observeHideShow = function () {
        if (nl.drew.fg.lib.pref.get_bool('hideico', false)) {
            this.buttonHide()
        } else {
            this.buttonShow()
        }
    };

//    pref.observeUserProxy = function () {
//        var userproxy = nl.drew.fg.lib.pref.get_string('userproxy', "");
//        if (userproxy) {
//            nl.drew.fg.userproxy = nl.drew.fg.lib.parseUserProxy;
//        } else {
//            nl.drew.fg.userproxy = null;
//        }
//    };

//==============================================================================
    pref.buttonHide = function () {

        var bar = document.getElementById("nav-bar");
        if (bar) {
            var curSet = bar.currentSet.split(",");
            var index = curSet.indexOf("frigateMainMenu");
            if (index >= 0) {
                curSet.splice(index, 1);
            }
            bar.setAttribute("currentset", curSet.join(","));
            bar.currentSet = curSet.join(",");
            document.persist(bar.id, "currentset");
            try {
                BrowserToolboxCustomizeDone(true);
            }
            catch (e) {
            }

        }
    }
//==============================================================================
    pref.buttonShow = function () {
        var bar = document.getElementById("nav-bar");
        if (bar) {
            var curSet = bar.currentSet.split(",");
            var index = curSet.indexOf("frigateMainMenu");
            if (index == -1) {
                curSet.push("frigateMainMenu");
            }
            bar.setAttribute("currentset", curSet.join(","));
            bar.currentSet = curSet.join(",");
            document.persist(bar.id, "currentset");
            try {
                BrowserToolboxCustomizeDone(true);
            }
            catch (e) {
            }
        }
    }


//==============================================================================
    pref.start = function () {
        nl.drew.fg.lib.pref.set_bool('cluidbutton', false);
        nl.drew.fg.pref.configuratePrefs();
        nl.drew.fg.pref.observeHideShow();
    };

//==============================================================================

    var saveUserList = function (list) {
        var forsave = [];
        var rowsCount = list.itemCount;
        var thisVal;
        for (var i = 0; i < rowsCount; i++) {
            thisVal = list.getItemAtIndex(i);
            forsave.push({ip: thisVal.value, sel: thisVal.selected});
            if (thisVal.selected) {
                if (i) {

                    nl.drew.fg.lib.pref.set_string('userproxy', thisVal.value);

                } else {
                    nl.drew.fg.lib.pref.set_string('userproxy', "");
                }
            }
        }
        nl.drew.fg.stor.setItem("listownproxy", forsave, function () {

        });
    };

    pref.addProxy = function () {
        var list = document.getElementById("frigate2ProxyList");
        var ipbox = document.getElementById("frigate2_add_proxy");
        var ptype = document.getElementById("fg2_proxy_type");

        if (list && ipbox && ptype && ipbox.value) {
            var ip = ipbox.value;
            if (nl.drew.fg.lib.isipv4(ip) || nl.drew.fg.lib.isipv6(ip)) {
                var ptypeval = ptype.selectedItem.value;
                var newiteam = list.appendItem(ptypeval + " " + ip, ptypeval + " " + ip);
                newiteam.setAttribute("class", "listitem-iconic");
                newiteam.setAttribute("image", "chrome://frigate2/content/im/bl.png");
                ipbox.value = "";
                saveUserList(list);
            } else {
                alert("proxy ip format");
            }
        }
    };
    pref.delProxy = function () {
        var list = document.getElementById("frigate2ProxyList");
        if (!list) {
            return
        }
        var selIteam = list.getSelectedItem(0);

        if (selIteam && selIteam.value != "friGate proxys") {
            selIteamIndex = list.getIndexOfItem(selIteam)
            if (selIteamIndex == 0)
                return
            list.selectItem(list.getItemAtIndex(selIteamIndex - 1));
            list.removeItemAt(selIteamIndex);
            saveUserList(list);
        }

    };
    pref.onShowProxy = function () {
        var list = document.getElementById("frigate2ProxyList");
        if (!list) {
            return
        }

        nl.drew.fg.stor.getItem("listownproxy", function (listownproxy) {
            var userListLen;

            if (listownproxy) {
                userListLen = listownproxy.length;
            } else {
                userListLen = 0
            }

            if (userListLen < 2) {
                var rows = list.getRowCount();
                if (rows == 1) {
                    list.selectItem(list.getItemAtIndex(0));
                    return
                }
            }

            var rowsCount = list.itemCount;
            var newiteam;
            for (var i = 0; i < rowsCount; i++) {
                list.removeItemAt(0);
            }

            for (var i = 0; i < userListLen; i++) {
                newiteam = list.appendItem(listownproxy[i].ip, listownproxy[i].ip);
                newiteam.setAttribute("class", "listitem-iconic");
                newiteam.setAttribute("image", "chrome://frigate2/content/im/bl.png");
                if (listownproxy[i].sel) {
                    list.selectItem(newiteam);
                }
            }
            //nl.drew.fg.pref.onSelProxy();
        });
    };
    pref.onSelProxy = function () {
        var list = document.getElementById("frigate2ProxyList");
        if (!list) {
            return
        }
        var rowsCount = list.getRowCount();
        for (var i = 0; i < rowsCount; i++) {
            list.getItemAtIndex(i).setAttribute("image", "chrome://frigate2/content/im/bl.png");
        }
        var selIteam = list.getSelectedItem(0);
        selIteam.setAttribute("image", "chrome://frigate2/content/im/save3.png");
        saveUserList(list);
    };


    pref.observeClUid = function () {
        var state = nl.drew.fg.lib.pref.get_bool('cluidbutton');

        if (state) {

            if (nl.drew.fg.on) {
                nl.drew.fg.interf.Off(true);
            }
            nl.drew.fg.stor.removeItem("list", function () {

                nl.drew.fg.lib.pref.set_bool('on', true);
                nl.drew.fg.lib.pref.set_string('uid', "");
                nl.drew.fg.lib.pref.set_string('pas', "");

                nl.drew.fg.id = null;
                nl.drew.fg.pas = null;
                nl.drew.fg.contry = [];
                nl.drew.fg.contryCh = "";
                nl.drew.fg.on = true;
                nl.drew.fg.proxyMain = {};
                nl.drew.fg.proxyMainT = {};
                nl.drew.fg.proxyMainInd = {};
                nl.drew.fg.proxyArr = {};
                nl.drew.fg.authHeader = [];
                nl.drew.fg.loadConfigUpdTimer = null;
                nl.drew.fg.lastLoadConfig = 0;
                nl.drew.fg.hostList = [];
                nl.drew.fg.hostBlList = [];
                nl.drew.fg.hostRedirList = [];
                nl.drew.fg.proxyonforlist = false;
                nl.drew.fg.lib.pref.set_bool("proxyonforlist", nl.drew.fg.proxyonforlist);
                nl.drew.fg.proxyonforall = false;
                nl.drew.fg.lib.pref.set_bool("proxyonforall", nl.drew.fg.proxyonforall);
                nl.drew.fg.hideall = false;
                nl.drew.fg.hideonlist = false;
                nl.drew.fg.spdyall = false;
                nl.drew.fg.lib.pref.set_bool("spdyall", nl.drew.fg.spdyall);
                //nl.drew.fg.noSpdyList = [];
                nl.drew.fg.genUidi = 0;
                //nl.drew.fg.allApiUrls = [];
                nl.drew.fg.allApiUrlsWork = [];
                nl.drew.fg.loadConfigFailCount = 0;
                nl.drew.fg.loadConfigOk = false;
                nl.drew.fg.loadFirstConfigTimer = null;

                nl.drew.fg.conf.genUid(function () {
                        nl.drew.fg.on = true;
                        nl.drew.fg.lib.pref.set_bool('cluidbutton', false);
                        nl.drew.fg.main.setFilters();
                    }
                );
            });
        }
    };


//==============================================================================
    pref.clUidButton = function () {
        var clUidButton = document.getElementById("fg2_but_clUidButton");
        if (!clUidButton)
            return;
        clUidButton.setAttribute("disabled", true);
        nl.drew.fg.lib.pref.set_bool('cluidbutton', true);
        var uidUpdate = function () {
            var state = nl.drew.fg.lib.pref.get_bool('cluidbutton');

            if (!state) {
                //nl.drew.fg.pref.onShow();
                clUidButton.setAttribute("disabled", false);
            } else {
                setTimeout(function () {
                    uidUpdate()
                }, 1000);
            }
        }
        setTimeout(function () {
            uidUpdate()
        }, 1500);
    }

    pref.onShow = function () {

        nl.drew.fg.pref.onShowProxy();
    };
    return pref;
}();

if (nl.drew.fg.windowname != 'frigate2-options-dialog') {
    window.removeEventListener("load", nl.drew.fg.pref.start, false);
    window.addEventListener("load", nl.drew.fg.pref.start, false);
} else {
    window.removeEventListener("load", nl.drew.fg.pref.onShow, false);
    window.addEventListener("load", nl.drew.fg.pref.onShow, false);
}