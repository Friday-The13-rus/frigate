/*
 * Drew (C)2013-2014
 * https://fri-gate.org
 */

nl.drew.fg.proxy = function () {
    var proxy = {};
    proxy.Service = Components.classes["@mozilla.org/network/protocol-proxy-service;1"].getService(Components.interfaces.nsIProtocolProxyService);


//    proxy.name = function (host) {
//        var hostSplit = host.split(/\./g);
//        return hostSplit[0] + ".friGate.org";
//    }


    proxy.setProxysCh = function (proxys) {
        for (var i in proxys) {
            if (!proxys.hasOwnProperty(i))
                continue;
            //
            if (typeof nl.drew.fg.proxyArr[i] != "undefined") {
                nl.drew.fg.proxyArr[i].chanel = proxys[i]
            }
        }
        //nl.drew.fg.lib.dumpError(JSON.stringify(nl.drew.fg.proxyArr));
    };
    //================================
    proxy.fromServerParser = function (proxys) {

        var key, i;
        var is;

        for (i in proxys) {
            if (!proxys.hasOwnProperty(i))
                continue;

            key = proxys[i].Id;


            if (typeof nl.drew.fg.proxyArr[key] == "undefined") {
                //
                nl.drew.fg.proxyArr[key] = {};
                nl.drew.fg.proxyArr[key].id = proxys[i].Id;
                nl.drew.fg.proxyArr[key].ip = proxys[i].Ip;
                nl.drew.fg.proxyArr[key].port = proxys[i].Port;
                nl.drew.fg.proxyArr[key].sport = proxys[i].Sport;
                nl.drew.fg.proxyArr[key].chanel = proxys[i].Ch;
                nl.drew.fg.proxyArr[key].co = proxys[i].Co;
                nl.drew.fg.proxyArr[key].name = proxys[i].Na + ".friGate.org";
                nl.drew.fg.proxyArr[key].ssl = proxys[i].Ssl;
            } else {
                if (proxys[i].Ch != nl.drew.fg.proxyArr[key].chanel) {
                    nl.drew.fg.proxyArr[key].chanel = proxys[i].Ch;
                }
                if (proxys[i].Port != nl.drew.fg.proxyArr[key].port ||
                    proxys[i].Sport != nl.drew.fg.proxyArr[key].sport ||
                    proxys[i].Ssl != nl.drew.fg.proxyArr[key].ssl) {
                    if (typeof nl.drew.fg.proxyArr[key].socket != "undefined") {
                        nl.drew.fg.proxyArr[key].socket.shutdown();
                        delete nl.drew.fg.proxyArr[key].socket;
                    }
                    if (typeof nl.drew.fg.proxyArr[key].proxyInfo != "undefined") {
                        delete nl.drew.fg.proxyArr[key].proxyInfo;
                    }
                    nl.drew.fg.proxyArr[key].port = proxys[i].Port;
                    nl.drew.fg.proxyArr[key].sport = proxys[i].Sport;
                    nl.drew.fg.proxyArr[key].ssl = proxys[i].Ssl;
                }

            }
            nl.drew.fg.proxyArr[key].d = proxys[i].D + nl.drew.fg.lib.time();

        }
        for (key in nl.drew.fg.proxyArr) {
            if (!nl.drew.fg.proxyArr.hasOwnProperty(key))
                continue;
            //
            is = false;
            for (i in proxys) {
                if (!proxys.hasOwnProperty(i))
                    continue;

                if (key == proxys[i].Id) {
                    is = true;
                }
            }
            if (!is) {
                if (typeof nl.drew.fg.proxyArr[key].socket != "undefined") {
                    nl.drew.fg.proxyArr[key].socket.shutdown();
                }
                delete nl.drew.fg.proxyArr[key];
            }
        }

        //nl.drew.fg.lib.dumpError(JSON.stringify(nl.drew.fg.proxyArr));

        var saveProxyArr = {};

        for (key in nl.drew.fg.proxyArr) {
            saveProxyArr[key] = {
                id: nl.drew.fg.proxyArr[key].id,
                ip: nl.drew.fg.proxyArr[key].ip,
                port: nl.drew.fg.proxyArr[key].port,
                sport: nl.drew.fg.proxyArr[key].sport,
                chanel: nl.drew.fg.proxyArr[key].chanel,
                co: nl.drew.fg.proxyArr[key].co,
                name: nl.drew.fg.proxyArr[key].name,
                ssl: nl.drew.fg.proxyArr[key].ssl,
                d: nl.drew.fg.proxyArr[key].d
            };
        }

        nl.drew.fg.stor.setItem("proxy", saveProxyArr, function () {
            // save
        });
    }


    //================================
    proxy.connect = function () {

        for (var key in nl.drew.fg.proxyArr) {
            if (!nl.drew.fg.proxyArr.hasOwnProperty(key))
                continue;

            if (typeof nl.drew.fg.proxyArr[key].proxyInfo == "undefined") {
                //
                //nl.drew.fg.lib.dumpError("nl.drew.fg.proxyArr[key] == " + JSON.stringify(nl.drew.fg.proxyArr[key]));

                if (nl.drew.fg.proxyArr[key].ssl) {
                    nl.drew.fg.proxyArr[key].socket = nl.drew.fg.socket();
                    nl.drew.fg.proxyArr[key].socket.createServerSocket(nl.drew.fg.proxyArr[key].ip, nl.drew.fg.proxyArr[key].port);
                    nl.drew.fg.proxyArr[key].proxyInfo = nl.drew.fg.proxyArr[key].socket.proxyInfo();
                } else {
                    nl.drew.fg.proxyArr[key].proxyInfo = nl.drew.fg.proxy.Service.newProxyInfo("http", nl.drew.fg.proxyArr[key].ip, nl.drew.fg.proxyArr[key].port, 3, 30, null);
                }
                nl.drew.fg.proxyArr[key].proxyInfoSocks = nl.drew.fg.proxy.Service.newProxyInfo("socks", nl.drew.fg.proxyArr[key].ip, nl.drew.fg.proxyArr[key].sport, 3, 30, null)
            }
        }
        //nl.drew.fg.lib.dumpError(JSON.stringify(nl.drew.fg.proxyArr));
    }


    proxy.disconnect = function () {
        var proxyArrKeys = Object.keys(nl.drew.fg.proxyArr);
        var proxyArrLength = proxyArrKeys.length;
        var key;

        if (proxyArrLength < 1) {
            return
        }

        for (var j = 0; j < proxyArrLength; j++) {
            key = proxyArrKeys[j];
            nl.drew.fg.proxyArr[key].socket.shutdown();
            delete nl.drew.fg.proxyArr[key].socket;
            delete nl.drew.fg.proxyArr[key].proxyInfo;
        }
    }

    proxy.setMainProxys = function () {

        var key, i;
        var now = Date.now();

        nl.drew.fg.contrys = nl.drew.fg.proxy.contrys();

        var contrys = nl.drew.fg.contrys.slice();
        contrys.push("main");

        for (i in contrys) {
            if (!contrys.hasOwnProperty(i))
                continue;

            key = contrys[i];

            if ((typeof nl.drew.fg.proxyMain[key] == "undefined") ||
                (nl.drew.fg.proxyMain[key] == null) ||
                (nl.drew.fg.proxyMainT[key] < now) ||
                (typeof nl.drew.fg.proxyMainInd[key] == "undefined") ||
                (typeof nl.drew.fg.proxyArr[nl.drew.fg.proxyMain[key][nl.drew.fg.proxyMainInd[key]]] == "undefined")) {
                //
                nl.drew.fg.proxyMain[key] = nl.drew.fg.proxy.choice(key);
                nl.drew.fg.proxyMainT[key] = now + nl.drew.fg.config.proxyUpdT;
                nl.drew.fg.proxyMainInd[key] = 0;
            }
        }
    }


    proxy.choice = function (co) {

        var tmpArr = [];
        var ret = [];
        var tmpArrLen;
        var key;

        for (key in nl.drew.fg.proxyArr) {
            if (!nl.drew.fg.proxyArr.hasOwnProperty(key))
                continue;

            if (typeof nl.drew.fg.proxyArr[key].proxyInfo != "undefined") {
                if (co == null || co == "main" || co == nl.drew.fg.proxyArr[key].co) {
                    tmpArr.push(nl.drew.fg.proxyArr[key]);
                }
            }
        }

        tmpArr.sort(function (proxy1, proxy2) {
            return proxy1.chanel - proxy2.chanel;
        });

        tmpArrLen = tmpArr.length;
        if (tmpArrLen > 0) {
            for (var j = 0; j < tmpArrLen; j++) {
                ret.push(tmpArr[j].id)
            }
        }

        return ret;
    }
    proxy.contrys = function () {

        var key;
        var ret = [];

        for (key in nl.drew.fg.proxyArr) {
            if (!nl.drew.fg.proxyArr.hasOwnProperty(key))
                continue;

            if (ret.indexOf(nl.drew.fg.proxyArr[key].co) == -1) {
                ret.push(nl.drew.fg.proxyArr[key].co);
            }
        }

        return ret;
    }
    proxy.makeURI = function (aURL, aOriginCharset, aBaseURI) {
        var ioService = Components.classes["@mozilla.org/network/io-service;1"]
            .getService(Components.interfaces.nsIIOService);
        return ioService.newURI(aURL, aOriginCharset, aBaseURI);
    }
    return proxy;
}()

nl.drew.fg.proxy.filter = {
    on: function () {
        var prServ = nl.drew.fg.proxy.Service;
        prServ.unregisterFilter(this);

        //this.bid = bid;
        //var filter = this;


        try {
            prServ.registerFilter(this, 1);
        } catch (e) {
            nl.drew.fg.lib.dumpError("proxy.filter ON error");
        }

        //nl.drew.fg.lib.dumpError("proxy.filter ON");

//                    }
//                }
//            }
//        );
    },
    off: function () {
        var prServ = nl.drew.fg.proxy.Service;
        try {
            prServ.unregisterFilter(this);
        } catch (e) {
            nl.drew.fg.lib.dumpError("proxy.filter OFF error");
        }
        //nl.drew.fg.lib.dumpError("proxy.filter OFF");
    },
    direct: nl.drew.fg.proxy.Service.newProxyInfo('direct', '', -1, 3, 0, null),
    //test: nl.drew.fg.proxy.Service.newProxyInfo('http', '127.0.0.1', 77, 0, 0, null),

    QueryInterface: XPCOMUtils.generateQI(["nsIProtocolProxyFilter"]),
    applyFilter: function (aProxyService, aURI, aProxy) {

        if (aProxy && aProxy.flags == 3)
            return aProxy;

        var co;
        var userproxytype;

        if (!nl.drew.fg.on)
            return aProxy;
        if (!aURI.host || !nl.drew.fg.lib.f.isScheme(aURI.scheme) || nl.drew.fg.lib.f.isLocal(aURI.host)) {
            //
            return aProxy;
        }

        for (var urli in nl.drew.fg.allApiUrls) {
            //
            if ((nl.drew.fg.allApiUrls[urli]+"api") == aURI.spec) {
                //
                return this.direct;
            }
        }

        var isInList = nl.drew.fg.lib.isUriInList(aURI.spec);

        //nl.drew.fg.lib.dumpError("isInList ===============" + JSON.stringify(isInList));

        if (isInList != null && isInList.i > -1 && !nl.drew.fg.hostList[isInList.i].tmpdel) {
            //
            //var now = Date.now();

            //nl.drew.fg.lib.dumpError("proxy.filter ===============" + nl.drew.fg.on + aURI.host);

            var i = isInList.i;

            if (nl.drew.fg.hostList[i].proxyBl) {
                //
                return aProxy;
            }

            var urlWithoutQuery = nl.drew.fg.lib.cutQuery(aURI.spec);

            //nl.drew.fg.lib.dumpError("urlWithoutQuery= " + urlWithoutQuery);

            if (nl.drew.fg.lib.f.defTestFile(isInList.sheme, isInList.host) == urlWithoutQuery) {
                //nl.drew.fg.lib.dumpError("no PROXY0= " + urlWithoutQuery);
                return aProxy;
            }

            if (aURI.spec.indexOf('?frigatetestquery&r') != -1) {
                //nl.drew.fg.lib.dumpError("no PROXY=" + aURI.spec);
                return aProxy;
            }
            if (nl.drew.fg.hostList[isInList.i].url != "" &&
                nl.drew.fg.hostList[isInList.i].url == urlWithoutQuery) {
                //nl.drew.fg.lib.dumpError("no PROXY2= " + urlWithoutQuery);
                return aProxy;
            }


            if (!nl.drew.fg.hostList[isInList.i].proxy && !nl.drew.fg.proxyonforall && !nl.drew.fg.proxyonforlist) {
                return aProxy;
            }

        } else {
            if (!nl.drew.fg.proxyonforall)
                return aProxy;
        }

        if (nl.drew.fg.userproxy) {
//            nl.drew.fg.lib.dumpError(nl.drew.fg.userproxy.type);
//            nl.drew.fg.lib.dumpError(nl.drew.fg.userproxy.ip);
//            nl.drew.fg.lib.dumpError(nl.drew.fg.userproxy.port);
            userproxytype = nl.drew.fg.userproxy.type;
            if (nl.drew.fg.userproxy.type=="SOCKS5") {
                userproxytype = "SOCKS";
            }
            return aProxyService.newProxyInfo(userproxytype, nl.drew.fg.userproxy.ip, nl.drew.fg.userproxy.port, 3, 20, null);
        }

        co = "main";
        if (isInList != null && nl.drew.fg.hostList[isInList.i].proxy &&
            nl.drew.fg.hostList[isInList.i].co &&
            typeof(nl.drew.fg.proxyMainInd[nl.drew.fg.hostList[isInList.i].co]) != "undefined" &&
            typeof(nl.drew.fg.proxyMain[nl.drew.fg.hostList[isInList.i].co][nl.drew.fg.proxyMainInd[nl.drew.fg.hostList[isInList.i].co]]) != "undefined" &&
            typeof(nl.drew.fg.proxyArr[nl.drew.fg.proxyMain[nl.drew.fg.hostList[isInList.i].co][nl.drew.fg.proxyMainInd[nl.drew.fg.hostList[isInList.i].co]]]) != "undefined") {
            //
            co = nl.drew.fg.hostList[isInList.i].co;
        } else {
            //
            if (nl.drew.fg.contryCh &&
                typeof(nl.drew.fg.proxyMainInd[nl.drew.fg.contryCh]) != "undefined" &&
                typeof(nl.drew.fg.proxyMain[nl.drew.fg.contryCh][nl.drew.fg.proxyMainInd[nl.drew.fg.contryCh]]) != "undefined" &&
                typeof(nl.drew.fg.proxyArr[nl.drew.fg.proxyMain[nl.drew.fg.contryCh][nl.drew.fg.proxyMainInd[nl.drew.fg.contryCh]]]) != "undefined") {
                //
                co = nl.drew.fg.contryCh;
            }
        }


        if (co != "main" || ( typeof(nl.drew.fg.proxyMainInd[co] != "undefined" ) &&
            typeof(nl.drew.fg.proxyMain[co][nl.drew.fg.proxyMainInd[co]]) != "undefined" &&
            typeof(nl.drew.fg.proxyArr[nl.drew.fg.proxyMain[co][nl.drew.fg.proxyMainInd[co]]]) != "undefined")) {
            //
            if (aURI.scheme == "https") {
                return nl.drew.fg.proxyArr[nl.drew.fg.proxyMain[co][nl.drew.fg.proxyMainInd[co]]].proxyInfoSocks;
            } else {
                return nl.drew.fg.proxyArr[nl.drew.fg.proxyMain[co][nl.drew.fg.proxyMainInd[co]]].proxyInfo;
            }
        }

        return aProxy;
    }
}
