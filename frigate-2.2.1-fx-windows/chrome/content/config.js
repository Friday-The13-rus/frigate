/*
 * Drew (C)2013-2014
 * https://fri-gate.org
 */

nl.drew.fg.conf = function () {
    var conf = {};

    conf.getApiUrl = function (callback) {
        nl.drew.fg.stor.getItem("conf", function (conf) {
            //=====================
            //nl.drew.fg.lib.dumpError("conf" + JSON.stringify(conf));
            //=====================
            if (conf) {
                //
                if (typeof conf.Apiurl != 'undefined' && conf.Apiurl.length > 0) {
                    nl.drew.fg.config.apiurl = conf.Apiurl;
                }
                if (typeof conf.Apiext != 'undefined' && conf.Apiext.length > 0) {
                    nl.drew.fg.config.apiext = conf.Apiext;
                }
                if (typeof conf.Apiind != 'undefined' && conf.Apiind.length > 0) {
                    nl.drew.fg.config.apiind = conf.Apiind;
                }
                if (typeof conf.Apidop != 'undefined' && conf.Apidop.length > 0) {
                    nl.drew.fg.config.apidop = conf.Apidop;
                }
            }

            var ret = new Array();
            var uriapi;

            for (var i in nl.drew.fg.config.apiurl) {
                for (var j in nl.drew.fg.config.apiext) {
                    for (var k in nl.drew.fg.config.apiind) {
                        uriapi = nl.drew.fg.config.apiurl[i] +
                            nl.drew.fg.config.apiind[k] +
                            "." +
                            nl.drew.fg.config.apiext[j];
                        if (uriapi == 'fri-gate.biz' || uriapi == 'fri-gate.org') {
                            //
                        } else {
                            ret.push("https://" + uriapi + "/");
                        }
                    }
                }
            }

            nl.drew.fg.allApiUrls = ret;
            nl.drew.fg.allApiUrls = nl.drew.fg.allApiUrls.concat(nl.drew.fg.config.apidop);

            if (callback != null)
                callback();
        });

    }

    conf.loadConfig = function (callback) {

        var listLength;

        nl.drew.fg.on = nl.drew.fg.lib.pref.get_bool('on', true);
        nl.drew.fg.proxyonforall = nl.drew.fg.lib.pref.get_bool('proxyonforall', false);
        nl.drew.fg.proxyonforlist = nl.drew.fg.lib.pref.get_bool('proxyonforlist', false);
        nl.drew.fg.spdyall = nl.drew.fg.lib.pref.get_bool('spdyall', false);
        nl.drew.fg.lib.parseUserProxy();

        nl.drew.fg.stor.getItem("list", function (list) {
            if (list) {
                listLength = list.length
                if (listLength > 0) {
                    //=====================
                    //nl.drew.fg.lib.dumpError(JSON.stringify(list));
                    //=====================
                    for (var j = 0; j < listLength; j++) {
                        if (typeof list[j].i != "undefined") {
                            nl.drew.fg.lib.addHostList(
                                {
                                    id: list[j].i,
                                    host: list[j].h,
                                    fl: list[j].f,
                                    proxy: list[j].p,
                                    type: list[j].t,
                                    co: list[j].co,
                                    url: list[j].u,
                                    fsize: list[j].fs,
                                    word: list[j].w
                                    //nodel: list[j].nodel
                                }
                            );
                        }
                    }
                    //=====================
                    //nl.drew.fg.lib.dumpError("from mem == " + JSON.stringify(nl.drew.fg.hostList));
                    //=====================
                }
            }


            nl.drew.fg.stor.getItem("proxy", function (proxy) {
                if (proxy && Object.keys(proxy).length > 0) {
                    nl.drew.fg.proxyArr = nl.drew.fg.lib.f.clone(proxy);
                    //nl.drew.fg.lib.dumpError("nl.drew.fg.proxyArr == " + JSON.stringify(proxy));
                    var authHeaderStr = nl.drew.fg.lib.pref.get_string('authHeader', "");

                    if (typeof authHeaderStr == "string" && authHeaderStr) {
                        nl.drew.fg.authHeader = authHeaderStr.split(',');
                    }

                    nl.drew.fg.authHeaderEnd = nl.drew.fg.lib.pref.get_int('authHeaderEnd', 0);

                    //nl.drew.fg.lib.dumpError("nl.drew.fg.authHeader == " + nl.drew.fg.authHeader);

                    if (!nl.drew.fg.authHeader || nl.drew.fg.authHeaderEnd < nl.drew.fg.lib.time()) {
                        //nl.drew.fg.lib.dumpError("setFilters");
                        nl.drew.fg.main.setFilters();
                    } else {
                        //nl.drew.fg.lib.dumpError("setFilters2");
                        nl.drew.fg.proxy.connect();
                        nl.drew.fg.proxy.setMainProxys();
                        nl.drew.fg.main.setFilters2();
                    }
                } else {
                    nl.drew.fg.main.setFilters();
                }
            });

        });

    }


    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    conf.preLoadConfigFromServer = function (callback) {
        if (!nl.drew.fg.on) {
            if (callback != null)
                callback();
            return;
        }

        //nl.drew.fg.lib.dumpError("preLoadConfigFromServer");

        if (nl.drew.fg.loadFirstConfigTimer) {
            clearTimeout(nl.drew.fg.loadFirstConfigTimer);
            nl.drew.fg.loadFirstConfigTimer = null;
        }

        var statusBarIco = document.getElementById("frigate2StatusBarIcon");

        if (statusBarIco != null && (nl.drew.fg.authHeaderEnd < nl.drew.fg.lib.time())) {
            statusBarIco.setAttribute("value", "wait");
        }

        if (nl.drew.fg.allApiUrlsWork.length < 1) {
            nl.drew.fg.allApiUrlsWork = nl.drew.fg.allApiUrls.slice();
        }

        nl.drew.fg.loadConfigOk = false;
        nl.drew.fg.loadConfigFailCount = 0;
        var allapiurlsLen;
        var ind;
        if (nl.drew.fg.config.host) {
            conf.loadConfigFromServer(callback, nl.drew.fg.config.host);
            nl.drew.fg.config.host = "";
        } else {
            for (var i = 0; i < 3; i++) {

                allapiurlsLen = nl.drew.fg.allApiUrlsWork.length;

                ind = Math.random() * allapiurlsLen;
                ind = ind ^ 0;
                //nl.drew.fg.lib.dumpError(ind);

                conf.loadConfigFromServer(callback, nl.drew.fg.allApiUrlsWork[ind]);
                nl.drew.fg.allApiUrlsWork.splice(ind, 1);
                //nl.drew.fg.lib.dumpError(JSON.stringify(nl.drew.fg.allApiUrlsWork));
                if (allapiurlsLen < 2) {
                    nl.drew.fg.allApiUrlsWork = nl.drew.fg.allApiUrls.slice();
                }

            }
        }


        nl.drew.fg.loadFirstConfigTimer = setTimeout(function () {
            nl.drew.fg.conf.preLoadConfigFromServer(callback);
        }, nl.drew.fg.config.loadFirstConfigT);

    }

    conf.clearConfigTimer = function () {
        if (nl.drew.fg.loadConfigUpdTimer) {
            clearTimeout(nl.drew.fg.loadConfigUpdTimer);
            nl.drew.fg.loadConfigUpdTimer = null;
        }
    }

    conf.startConfigTimer = function () {
        nl.drew.fg.loadConfigUpdTimer = setTimeout(function () {
            nl.drew.fg.loadConfigOk = false;
            nl.drew.fg.mutexHostList.run(function () {
                nl.drew.fg.conf.loadConfigFromServer();
            });
        }, nl.drew.fg.config.loadConfigUpdT);
    }

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    conf.configOk = function (apiUrl) {

        if (apiUrl) {
            nl.drew.fg.loadConfigOk = true;

            if (nl.drew.fg.loadFirstConfigTimer) {
                clearTimeout(nl.drew.fg.loadFirstConfigTimer);
                nl.drew.fg.loadFirstConfigTimer = null;
            }

            nl.drew.fg.conf.startConfigTimer();

            nl.drew.fg.config.host = apiUrl;

            var statusBarIco = document.getElementById("frigate2StatusBarIcon");

            if (statusBarIco != null) {
                statusBarIco.setAttribute("value", "active");
            }
        }
    }


    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    conf.loadConfigFromServer = function (callback, apiUrl) {

        if (!nl.drew.fg.on) {
            if (!apiUrl)
                nl.drew.fg.mutexHostList.done();
            return;
        }


        var now = Date.now();
        var noUrl = !apiUrl;

        if (!noUrl || nl.drew.fg.lastLoadConfig < now) {

            nl.drew.fg.conf.clearConfigTimer();

            nl.drew.fg.lastLoadConfig = now + nl.drew.fg.config.updateConfigTimeWait;

            if (noUrl) {
                apiUrl = nl.drew.fg.config.host;
            }


            var onFail = function () {
                //
                if (noUrl) {
                    nl.drew.fg.mutexHostList.done();
                    nl.drew.fg.main.noReady();
                    nl.drew.fg.proxy.setMainProxys();
                    if (callback != null)
                        callback();
                } else {
                    nl.drew.fg.loadConfigFailCount++;

                    if (!nl.drew.fg.loadConfigOk && nl.drew.fg.loadConfigFailCount > nl.drew.fg.allApiUrls.length) {
                        nl.drew.fg.loadConfigFailCount = 0;
                        nl.drew.fg.config.loadFirstConfigT = nl.drew.fg.config.loadFirstConfigT * 3;
                    }
                }
            };



            nl.drew.fg.lib.ReqJson(
                apiUrl + nl.drew.fg.config.api,
                10000, function (response) {
                    //=====================
                    //nl.drew.fg.lib.dumpError("loadConfigFromServer");
                    //=====================
                    nl.drew.fg.conf.serverRespParse(response, apiUrl, !noUrl, callback, true)
                }, onFail, onFail,
                "POST",
                "id=" + encodeURIComponent(nl.drew.fg.id) + "&s=" + encodeURIComponent(nl.drew.fg.serial) + "&md5=" + encodeURIComponent(nl.drew.fg.md5)
            );

        } else {
            if (noUrl) {
                nl.drew.fg.mutexHostList.done()
            }
        }

        nl.drew.fg.conf.clearConfigTimer();

        if (noUrl) {
            nl.drew.fg.conf.startConfigTimer();
        }

    }


    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    conf.serverRespParse = function (response, apiUrl, needStartOk, callback, saveresponse) {

        if (nl.drew.fg.loadConfigOk) {
            if (!needStartOk)
                nl.drew.fg.mutexHostList.done()
            return;
        }

        //=====================
        //nl.drew.fg.lib.dumpError(response);
        //=====================

        var responseJSON = {};
        try {
            responseJSON = JSON.parse(response)
        } catch (e) {
            nl.drew.fg.lib.dumpError("can't parse response");
            nl.drew.fg.lib.dumpError(apiUrl);
            //nl.drew.fg.lib.dumpError(response);
            nl.drew.fg.mutexHostList.done()
            return
        }
        //nl.drew.fg.lib.dumpError(apiUrl);

//                if (typeof responseJSON.err != "undefined" && responseJSON.err == 2) {
//                    nl.drew.fg.lib.clStorUid(function () {
//                        nl.drew.fg.main.ifFirstStart(callback)
//                    });
//                    return;
//                }

        //nl.drew.fg.lib.dumpError("serverRespParse");

        //=====================
        //nl.drew.fg.lib.dumpError("responseJSON" + JSON.stringify(responseJSON));
        //=====================

        nl.drew.fg.stor.getItem("toserver", function (toserver) {

            if (typeof responseJSON.Key != "undefined" && typeof responseJSON.KeyD != "undefined" && typeof responseJSON.Now != "undefined") {

                if (needStartOk)
                    nl.drew.fg.conf.configOk(apiUrl);

                //nl.drew.fg.lib.dumpError("responseJSON.Key");

                if (saveresponse) {
                    nl.drew.fg.lastSetResp = nl.drew.fg.lib.time();
                    nl.drew.fg.stor.setItem("response", response, function () {
                        nl.drew.fg.lib.pref.set_int("resptime", nl.drew.fg.lastSetResp);
                    });
                }

                nl.drew.fg.authHeader = responseJSON.Key;
                nl.drew.fg.authHeaderEnd = responseJSON.KeyD + (nl.drew.fg.lib.time() - responseJSON.Now);
                nl.drew.fg.lib.pref.set_string('authHeader', nl.drew.fg.authHeader);
                nl.drew.fg.lib.pref.set_int('authHeaderEnd', nl.drew.fg.authHeaderEnd);
                //=====================
                //nl.drew.fg.lib.dumpError(nl.drew.fg.authHeader);
                //=====================
            }
            if (typeof responseJSON.Proxy != "undefined" && Object.prototype.toString.call(responseJSON.Proxy) === "[object Array]") {
                nl.drew.fg.proxy.fromServerParser(responseJSON.Proxy);
                nl.drew.fg.proxy.connect();
                nl.drew.fg.proxy.setMainProxys();
            }
            if (typeof responseJSON.Conf != "undefined") {
                nl.drew.fg.stor.setItem("conf", responseJSON.Conf, nl.drew.fg.emptyF);
            }
            if (typeof responseJSON.ListB != "undefined") {
                nl.drew.fg.hostBlList = responseJSON.ListB;
            }

            if (typeof responseJSON.ListR != "undefined") {
                nl.drew.fg.hostRedirList = responseJSON.ListR;
            }

            if (typeof responseJSON.List != "undefined") {
                nl.drew.fg.loadConfigOk = true;
                var newListLength = responseJSON.List.length
                if (newListLength > 0) {


                    var listLength = nl.drew.fg.hostList.length;

                    for (var i = 0; i < newListLength; i++) {
                        var isInList = false;
                        if (listLength > 0) {

                            list: for (var j = 0; j < listLength; j++) {
                                if (nl.drew.fg.hostList[j].id == responseJSON.List[i].Id) {
                                    isInList = true;
                                    break list;
                                }
                            }
                        }
                        if (!isInList) {
                            //nl.drew.fg.lib.dumpError("add = " + responseJSON.List[i].H);
                            if (nl.drew.fg.lib.isIdInAnyList(responseJSON.List[i].Id, toserver) == -1) {
                                nl.drew.fg.lib.addHostList(
                                    {
                                        id: responseJSON.List[i].Id,
                                        host: responseJSON.List[i].H,
                                        fl: responseJSON.List[i].F,
                                        proxy: (responseJSON.List[i].F & (1 << 1)) != 0,
                                        type: responseJSON.List[i].T,
                                        co: responseJSON.List[i].C,
                                        url: responseJSON.List[i].U,
                                        fsize: responseJSON.List[i].Fs,
                                        word: responseJSON.List[i].W
                                    }
                                )
                            }
                        } else {
                            if (nl.drew.fg.hostList[j].processingFrom == 0) {
                                //nl.drew.fg.lib.dumpError(responseJSON.List[i].H);
                                if (nl.drew.fg.lib.isIdInAnyList(responseJSON.List[i].Id, toserver) == -1) {
                                    if (nl.drew.fg.hostList[j].H != responseJSON.List[i].H)
                                        nl.drew.fg.hostList[j].H = responseJSON.List[i].H;
                                    if (nl.drew.fg.hostList[j].fl != responseJSON.List[i].F)
                                        nl.drew.fg.hostList[j].fl = responseJSON.List[i].F;
                                    if (nl.drew.fg.hostList[j].type != responseJSON.List[i].T)
                                        nl.drew.fg.hostList[j].type = responseJSON.List[i].T;
                                    if (nl.drew.fg.hostList[j].url != responseJSON.List[i].U)
                                        nl.drew.fg.hostList[j].url = responseJSON.List[i].U;
                                    if (nl.drew.fg.hostList[j].fs != responseJSON.List[i].Fs)
                                        nl.drew.fg.hostList[j].fs = responseJSON.List[i].Fs;
                                    if (nl.drew.fg.hostList[j].W != responseJSON.List[i].W)
                                        nl.drew.fg.hostList[j].W = responseJSON.List[i].W;
                                    if (nl.drew.fg.hostList[j].co != responseJSON.List[i].C)
                                        nl.drew.fg.hostList[j].co = responseJSON.List[i].C;
                                }
                            }
                        }
                    }
                    //nl.drew.fg.lib.dumpError(JSON.stringify(nl.drew.fg.hostList));
                    listLength = nl.drew.fg.hostList.length;
                    for (var j = 0; j < listLength; j++) {
                        isInList = false;
                        list2: for (var i = 0; i < newListLength; i++) {
                            if (typeof nl.drew.fg.hostList[j].id != 'undefined')
                                if (nl.drew.fg.hostList[j].id == responseJSON.List[i].Id) {
                                    //nl.drew.fg.lib.dumpError(responseJSON.List[i].Id)
                                    isInList = true;
                                    break list2;
                                }
                        }
                        if (!isInList && !nl.drew.fg.hostList[j].nodel) {
                            //nl.drew.fg.lib.dumpError("del = " + nl.drew.fg.hostList[j].H);
                            if (nl.drew.fg.lib.isIdInAnyList(nl.drew.fg.hostList[j].id, toserver) != -1) {
                                nl.drew.fg.tosever.delFromArrToServerById(nl.drew.fg.hostList[j].id);
                            }
                            nl.drew.fg.hostList.splice(j, 1)
                        }
                    }

                    nl.drew.fg.lib.saveList();

                    //=====================
                    //nl.drew.fg.lib.dumpError(JSON.stringify(nl.drew.fg.hostList));
                    //nl.drew.fg.lib.dumpError(JSON.stringify(nl.drew.fg.hostBlList));
                    //=====================

                }
            }

            if (typeof responseJSON.Md5 != "undefined") {
                nl.drew.fg.md5 = responseJSON.Md5
            }
            if (typeof responseJSON.S != "undefined") {
                nl.drew.fg.serial = responseJSON.S
            }
            if (typeof responseJSON.no != "undefined" || typeof responseJSON.ProxyStat != "undefined") {
                //nl.drew.fg.lib.dumpError("no");
                if (needStartOk)
                    nl.drew.fg.conf.configOk(apiUrl);

                if (saveresponse) {
                    nl.drew.fg.lastSetResp = nl.drew.fg.lib.time();
                    nl.drew.fg.stor.setItem("response", response, function () {
                        nl.drew.fg.lib.pref.set_int("resptime", nl.drew.fg.lastSetResp);
                    });
                }
                if (typeof responseJSON.ProxyStat != "undefined") {
                    nl.drew.fg.proxy.setProxysCh(responseJSON.ProxyStat);
                }
                nl.drew.fg.proxy.setMainProxys();
            }
            nl.drew.fg.interf.icoUpdate();

            if (!needStartOk)
                nl.drew.fg.mutexHostList.done()

            if (callback != null)
                callback();

        });

    };

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    conf.genUid = function (callback) {

        var apihost;

        if (nl.drew.fg.loadFirstConfigTimer) {
            clearTimeout(nl.drew.fg.loadFirstConfigTimer);
            nl.drew.fg.loadFirstConfigTimer = null;
        }

        if (nl.drew.fg.loadConfigOk) {
            return;
        }

        nl.drew.fg.id = nl.drew.fg.lib.pref.get_string("uid", "");
        nl.drew.fg.pas = nl.drew.fg.lib.pref.get_string("pas", "");

        if (nl.drew.fg.id && nl.drew.fg.pas) {
            nl.drew.fg.lib.dumpError("uid alr ok");
            if (callback != null)
                callback();
            return;
        }


        if (nl.drew.fg.config.host) {
            apihost = nl.drew.fg.config.host;
            nl.drew.fg.config.host = "";
        } else {
            if (nl.drew.fg.allApiUrlsWork.length < 1) {
                nl.drew.fg.allApiUrlsWork = nl.drew.fg.allApiUrls.slice();
            }
            allapiurlsLen = nl.drew.fg.allApiUrlsWork.length;

            ind = Math.random() * allapiurlsLen;
            ind = ind ^ 0;


            //nl.drew.fg.lib.dumpError(ind);


            apihost = nl.drew.fg.allApiUrlsWork[ind];
            nl.drew.fg.allApiUrlsWork.splice(ind, 1);
        }

        var errFu = function (err) {
            nl.drew.fg.lib.dumpError("uid err= " + err + " =" + apihost);

            nl.drew.fg.loadConfigFailCount++;

            if (!nl.drew.fg.loadConfigOk && nl.drew.fg.loadConfigFailCount > nl.drew.fg.allApiUrls.length) {
                nl.drew.fg.loadConfigFailCount = 0;
                nl.drew.fg.config.loadFirstConfigT = nl.drew.fg.config.loadFirstConfigT * 1.5;

            }
        };

        var nl_drew_fg_id = nl.drew.fg.lib.f.generateUUID();
        //nl.drew.fg.stor.setItem("id", nl.drew.fg.id, emptyF);

        //nl.drew.fg.lib.dumpError(nl_drew_fg_id);
        nl.drew.fg.lib.dumpError(apihost);

        nl.drew.fg.lib.ReqJson(
            apihost + "u",
            30000,
            function (response) {
                if (nl.drew.fg.loadConfigOk) {
                    return;
                }
                //=====================
                //nl.drew.fg.lib.dumpError(apihost);
                nl.drew.fg.lib.dumpError(response);
                //=====================
                try {
                    var responseJSON = JSON.parse(response)
                } catch (e) {
                    errFu("json parse");
                    nl.drew.fg.lib.dumpError(response);
                    return
                }
                //nl.drew.fg.lib.dumpError(response);
                if (typeof responseJSON.pas != "undefined" && responseJSON.pas) {
                    nl.drew.fg.lib.dumpError("uid ok");
                    nl.drew.fg.loadConfigOk = true;

                    nl.drew.fg.config.host = apihost
                    nl.drew.fg.pas = responseJSON.pas;

                    nl.drew.fg.id = nl_drew_fg_id;

                    nl.drew.fg.lib.pref.set_string("uid", nl.drew.fg.id);
                    nl.drew.fg.lib.pref.set_string("pas", nl.drew.fg.pas);

                    if (callback != null)
                        callback();
                } else {
                    errFu("no pas");
                    nl.drew.fg.lib.dumpError(response);
                }
            },
            function (e) {
                errFu(e);
            },
            function (e) {
                errFu(e);
            },
            "POST",
            "id=" + encodeURIComponent(nl_drew_fg_id)
        );

        nl.drew.fg.loadFirstConfigTimer = setTimeout(function () {
            nl.drew.fg.conf.genUid(callback);
        }, nl.drew.fg.config.loadFirstConfigT);

    };

    conf.preSendToServer = function () {
        if (!nl.drew.fg.sentToServerTimer) {
            nl.drew.fg.sentToServerTimer = setInterval(nl.drew.fg.conf.preSendToServer, nl.drew.fg.config.timeSentToServer);
        }
        nl.drew.fg.lib.pref.set_string("sendto", "");
        nl.drew.fg.lib.pref.set_string("sendto", nl.drew.fg.bid);
    };

    conf.sendToServer = function () {
        nl.drew.fg.stor.getItem("toserver", function (toserver) {
            if (!toserver) {
                return;
            }
            if (Object.prototype.toString.call(toserver) !== '[object Array]') {
                return;
            }

            var toserverLen = toserver.length
            if (toserverLen < 1) {
                clearInterval(nl.drew.fg.sentToServerTimer);
                nl.drew.fg.config.timeSentToServer = 1E3 * 30;
                nl.drew.fg.sentToServerTimer = setInterval(nl.drew.fg.conf.preSendToServer, nl.drew.fg.config.timeSentToServer);
                return;
            }

            clearInterval(nl.drew.fg.sentToServerTimer);
            nl.drew.fg.config.timeSentToServer = 1E3 * 5;
            nl.drew.fg.sentToServerTimer = setInterval(nl.drew.fg.conf.preSendToServer, nl.drew.fg.config.timeSentToServer);

            for (var i = 0; i < toserverLen; i++) {
                switch (toserver[i].act) {
                    case 'setco':
                        nl.drew.fg.lib.setFl(toserver[i].id, true, "setco");
                        break;
                    case 'hideip':
                        nl.drew.fg.lib.setFl(toserver[i].id, true, 'hideip');
                        break;
                    case 'spdysiteoff':
                        nl.drew.fg.lib.setFl(toserver[i].id, true, 'spdysiteoff');
                        break;
                    case 'proxyforever':
                        nl.drew.fg.lib.setFl(toserver[i].id, true, 'proxyforever');
                        break;
                    case 'delsite':
                        nl.drew.fg.hosts.delSiteSave(toserver[i]);
                        break;
                }
            }

        });
    };

    return conf
}();
