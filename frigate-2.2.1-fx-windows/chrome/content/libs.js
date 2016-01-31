/*
 * Drew (C)2013-2014
 * https://fri-gate.org
 */

nl.drew.fg.lib = function () {
    var lib = {};
    lib.f = {};
    lib.pref = {};
    var smStrings = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService).createBundle("chrome://frigate2/locale/frigate.properties");

    //============================================
    lib.dumpError = function (msg) {
        if (nl.drew.fg.lib.pref.get_bool('debug', false)) {
            Application.console.log(msg);
        }
        return true;
    }


    lib.f.re = [];
    lib.f.re[0] = /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    lib.f.re[1] = /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    lib.f.re[2] = /^169\.254\.\d{1,3}\.\d{1,3}$/;
    lib.f.re[3] = /^192\.168\.\d{1,3}\.\d{1,3}$/;
    lib.f.re[4] = /^172\.16\.\d{1,3}\.\d{1,3}$/;
    lib.f.relen = lib.f.re.length;

    //============================================
    lib.f.isScheme = function (inscheme) {
        return ['http', 'https'].some(
            function (scheme) {
                return inscheme == scheme;
            });
    };

    //============================================
    lib.f.isLocal = function (host) {
        for (var i = 0; i < lib.f.relen; i++) {
            if (lib.f.re[i].test(host)) {
                return true
            }
        }
    };

    //============================================
    lib.f.defTestFile = function (sheme, host) {
        return sheme + host + nl.drew.fg.config.nameDefTestFile + host + ".js";
    };


    lib.f.generateUUID = function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    };


    lib.f.bits = function (i, val, bitnumber) {
        //
        if (val != null) {
            if (val) {
                nl.drew.fg.hostList[i].fl = nl.drew.fg.hostList[i].fl | (1 << bitnumber)
            } else {
                nl.drew.fg.hostList[i].fl = nl.drew.fg.hostList[i].fl & ~(1 << bitnumber)
            }
        }
        return (nl.drew.fg.hostList[i].fl & (1 << bitnumber)) != 0
    };

    lib.f.clone = function (obj) {
        if (obj == null || typeof(obj) != 'object') {
            return obj;
        }
        var temp = {};
        for (var key in obj) {
            temp[key] = nl.drew.fg.lib.f.clone(obj[key]);
        }
        return temp;
    }

    lib.f.getLStr = function (sName) {
        return smStrings.GetStringFromName(sName);
    }


    //-----------------------------------------------------------------------------------
    lib.pref.get_bool = function (preff, default_value) {
        return nl.drew.fg.nsPreferences.getBoolPref(preff, default_value);
    }
    //==============================================================================
    lib.pref.set_bool = function (preff, value) {
        nl.drew.fg.nsPreferences.setBoolPref(preff, value);
    }
    //-----------------------------------------------------------------------------------
    lib.pref.get_int = function (preff, default_value) {
        return nl.drew.fg.nsPreferences.getIntPref(preff, default_value);
    }
    //==============================================================================
    lib.pref.set_int = function (preff, value) {
        nl.drew.fg.nsPreferences.setIntPref(preff, value);
    }
    //==============================================================================
    lib.pref.get_string = function (preff, default_value) {
        return nl.drew.fg.nsPreferences.copyUnicharPref(preff, default_value || '');
    }
    //==============================================================================
    lib.pref.set_string = function (preff, value) {

        return nl.drew.fg.nsPreferences.setUnicharPref(preff, value);
    }
    //==============================================================================


    //============================================
    lib.time = function () {
        return parseInt(new Date().getTime() / 1000)
    }
    lib.timems = function () {
        return parseInt(new Date().getTime())
    }


    lib.updateTabs = function (fl, host, newhost) {
        var gBrowser = window.getBrowser();
        var tabs = gBrowser.browsers;
        var count = 0;
        var isInList;
        var currentURIhost;
        var currentURIspec;


        if (typeof(tabs) == "undefined") {
            return;
        }


        nl.drew.fg.mutexHostList.run(function () {
            //
            if (tabs.length > 0) {
                //
                for (var i = 0; i < tabs.length; i++) {
                    if (typeof(tabs[i]) != "undefined") {
                        if (fl == "url") {
                            currentURIhost = '';
                            try {
                                currentURIhost = tabs[i].webNavigation.currentURI.host;
                            } catch (e) {
                            }

                            if (currentURIhost == host) {
                                count++;
                            } else {
                                if (host[0] == "*") {
                                    var lenHost = -1 * (host.length - 2);
                                    if (host.substr(lenHost) == currentURIhost.substr(lenHost)) {
                                        count++;
                                    }
                                }
                            }
                        } else if (fl == "list") {
                            currentURIspec = '';
                            try {
                                currentURIspec = tabs[i].webNavigation.currentURI.spec;
                            } catch (e) {
                            }
                            isInList = lib.isUriInList(currentURIspec);
                            if (isInList && !nl.drew.fg.hostList[isInList.i].tmpdel) {
                                count++;
                            }
                        } else {
                            count++;
                        }
                    }
                }
                if ((!nl.drew.fg.lib.pref.get_bool("updatemanytab", true) || count < 4)) {
                    for (var i = 0; i < tabs.length; i++) {
                        if (typeof(tabs[i]) != "undefined") {
                            if (fl == "url") {
                                currentURIhost = '';
                                try {
                                    currentURIhost = tabs[i].webNavigation.currentURI.host;
                                } catch (e) {
                                }
                                if (currentURIhost == host) {
                                    if (newhost) {
                                        tabs[i].webNavigation.loadURI(newhost, 256 | 512, null, null, null)
                                    } else {
                                        tabs[i].webNavigation.reload(256 | 512);
                                    }
                                } else {
                                    if (host[0] == "*") {
                                        var lenHost = -1 * (host.length - 2);
                                        if (host.substr(lenHost) == tabs[i].webNavigation.currentURI.host.substr(lenHost)) {
                                            tabs[i].webNavigation.reload(256 | 512)
                                        }
                                    }
                                }
                            } else if (fl == "list") {
                                currentURIspec = '';
                                try {
                                    currentURIspec = tabs[i].webNavigation.currentURI.spec;
                                } catch (e) {
                                }
                                isInList = lib.isUriInList(currentURIspec);
                                if (isInList && !nl.drew.fg.hostList[isInList.i].tmpdel) {
                                    tabs[i].webNavigation.reload(256 | 512)
                                }
                            } else {
                                tabs[i].webNavigation.reload(256 | 512)
                            }
                        }
                    }
                }
            }
            nl.drew.fg.mutexHostList.done();
        });
    }


    lib.proxyforeverinvert = function (i) {
        //
        if (i > -1) {
            //
            nl.drew.fg.hostList[i].fl = nl.drew.fg.hostList[i].fl ^ (1 << 1)
        }
    }


    lib.ReqJson = function (url, timeout, onSuccess, onError, onTimeout, type, data) {

        if (!type) {
            type = "GET"
        }
        if (!data) {
            data = null
        }

        //=====================
        //nl.drew.fg.lib.dumpError("ReqJson=" + JSON.stringify(url));
        //=====================

        var xhr = new XMLHttpRequest();
        //xhr.responseType = 'json';
        xhr.onabort = function () {
            //=====================
            //nl.drew.fg.lib.dumpError("onabort");
            //=====================
            onError("abort");
        };
        xhr.ontimeout = function () {
            //=====================
            //nl.drew.fg.lib.dumpError("onTimeout");
            //=====================
            onTimeout("onTimeout");
        };
        xhr.onerror = function () {
            //=====================
            //nl.drew.fg.lib.dumpError("onError");
            //=====================
            onError(xhr.status + ' ' + xhr.statusText);
        };
        xhr.onload = function () {
            //=====================
            //nl.drew.fg.lib.dumpError("onload");
            //=====================
            if (xhr.readyState === 4) {
                //=====================
                //nl.drew.fg.lib.dumpError(xhr.status + "===" + xhr.response);
                //=====================
                if (xhr.status === 200) {
                    onSuccess(xhr.response);
                } else {
                    onError(xhr.status);
                }
            }
        };
        xhr.open(type, url, true);
        if (type == "POST") {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        }

        xhr.timeout = timeout;
        try {
            xhr.send(data);
        } catch (e) {
            nl.drew.fg.lib.dumpError("err=xhr.send");
        }
    }


    lib.newSerial = function (response) {
        //=====================
        //nl.drew.fg.lib.dumpError(response);
        //=====================
        var responseJSON = {};
        try {
            responseJSON = JSON.parse(response)
        } catch (e) {
        }

        if (typeof responseJSON.ok != "undefined" && responseJSON.ok > 0) {
            nl.drew.fg.serial = parseInt(responseJSON.ok);
            nl.drew.fg.lastLoadConfig = 0;
            nl.drew.fg.lib.pref.set_int("serial", nl.drew.fg.serial);
            return true;
        }
        return false;
    }

    lib.setFl = function (id, nosave, type, oldCo) {
        //
        var setCoObj

        if (!nl.drew.fg.config.host && nosave) {
            return false;
        }

        var i = nl.drew.fg.lib.isIdInList(id);
        if (i == -1) {
            if (!nosave)
                nl.drew.fg.mutexHostList.done();
            nl.drew.fg.toserver.delFromArrToServerById(id);
            return false;
        }

        if (!nosave) {
            setCoObj = {act: type, id: id, val: nl.drew.fg.hostList[i].fl, co: nl.drew.fg.hostList[i].co, oldCo: oldCo};
            nl.drew.fg.mutexHostList.done()
            nl.drew.fg.toserver.delFromArrToServer(setCoObj);
            nl.drew.fg.toserver.addToArrToServer(setCoObj);
        }


        if (nl.drew.fg.config.host) {
            //nl.drew.fg.lib.dumpError("send =" + setCoObj.val);
            nl.drew.fg.lib.ReqJson(
                nl.drew.fg.config.host + "s",
                10000,
                function (response) {
                    //
                    if (nl.drew.fg.lib.newSerial(response))
                        nl.drew.fg.toserver.delFromArrToServerById(id);
                    //nl.drew.fg.toserver.delFromArrToServer(setCoObj);
                }, nl.drew.fg.emptyF, nl.drew.fg.emptyF,
                "POST",
                "id=" + encodeURIComponent(nl.drew.fg.id) + "&pas=" + encodeURIComponent(nl.drew.fg.pas) + "&host=" + id + "&fl=" + nl.drew.fg.hostList[i].fl + "&co=" + (nl.drew.fg.hostList[i].co == "" ? "-1" : nl.drew.fg.hostList[i].co)
            );
        }
    };


    lib.testHost1 = function (url1, index1, nextStep2, proxyNeedOn, proxyNeedOff) {
        var queryOk1 = function (response) {
            //nl.drew.fg.lib.dumpError("index1=" + index1);
            //nl.drew.fg.lib.dumpError("response=" + response.length);
            nextStep2(index1, response);
        }
        var queryFail1 = function (status) {
            if (status > 400) {
                //nl.drew.fg.lib.dumpError("======404=======");
                proxyNeedOff(index1);
            } else {
                proxyNeedOn(index1);
            }
        }
        this.ReqJson(url1 + "?frigatetestquery&r" + Math.random(), nl.drew.fg.config.processingTimeWait, queryOk1, queryFail1, queryFail1);
    }

    lib.testHost2 = function (url2, index2, response1, nextStep3, proxyNeedOn, proxyNeedOff) {
        var queryOk2 = function (response2) {
            //nl.drew.fg.lib.dumpError("index2=" + index2);

            nextStep3(index2, response1, response2);
        }
        var queryFail2 = function (status) {
            proxyNeedOn(index2)
        }
        this.ReqJson(url2 + "?frigatetestquery&r" + Math.random(), nl.drew.fg.config.processingTimeWait, queryOk2, queryFail2, queryFail2);
    }

    lib.testJsonFile = function (file, index, isFile, noFile) {
        //nl.drew.fg.lib.dumpError(index);
        var isFileLocal = function (response) {

            var responseJSON = {};
            try {
                responseJSON = JSON.parse(response)
            } catch (e) {
            }

            if (typeof responseJSON.res != "undefined") {
                //=====================
                //nl.drew.fg.lib.dumpError(responseJSON.res);
                //=====================
                isFile(index)
            } else {
                //=====================
                //nl.drew.fg.lib.dumpError("err+" + index);
                //=====================
                noFile(index)
            }
        }
        var noFileLocal = function () {
            //=====================
            //nl.drew.fg.lib.dumpError("err+" + index);
            //=====================
            noFile(index)
        }
        this.ReqJson(file + "?r=" + Math.random(), nl.drew.fg.config.processingTimeWait, isFileLocal, noFileLocal, noFileLocal);
    }


    lib.testFile = function (index, proxyNeedOn, proxyNeedOff) {
        //nl.drew.fg.lib.dumpError(index);
        var queryOk = function (response) {
            var l = response.length;
            var delta = (l * 100) / nl.drew.fg.hostList[index].fs;
            //nl.drew.fg.lib.dumpError("l=" + l);
            //nl.drew.fg.lib.dumpError("delta=" + delta);
            if (delta > 90 && delta < 110) {
                proxyNeedOff(index);
                return;
            }
            if (response.indexOf(nl.drew.fg.hostList[index].W) > -1) {
                proxyNeedOff(index);
                return;
            }
            proxyNeedOn(index);
        }
        var queryFail = function () {
            proxyNeedOn(index);
        }
        this.ReqJson(nl.drew.fg.hostList[index].url + "?" + Math.random(), nl.drew.fg.config.processingTimeWait, queryOk, queryFail, queryFail);
    }


    lib.calcH = function (t) {
        var ret = new Object();
        var tlen = t.length;

        for (var i = 0, chr; i < tlen; i++) {

            chr = t.charCodeAt(i)

            if (!ret.hasOwnProperty(chr)) {
                ret[chr] = 0;
            }
            ret[chr]++;
        }
        //nl.drew.fg.lib.dumpError("================================");
        //nl.drew.fg.lib.dumpError(JSON.stringify(ret));
        //nl.drew.fg.lib.dumpError("================================");
        return ret;
    }

    compare = function (h1, h2) {
        var ret = new Object();
        var i;
        var sum = 0;
        var alllen = 0;
        var alllen1 = 0;
        var alllen2 = 0;


        for (i in h1) {
            if (!h1.hasOwnProperty(i))
                continue;

            if (!ret.hasOwnProperty(i)) {
                ret[i] = 0;
            }

            if (h2.hasOwnProperty(i)) {
                ret[i] = Math.abs(h1[i] - h2[i]);
            } else {
                ret[i] = h1[i];
            }
            alllen1 = alllen1 + h1[i];
        }

        for (i in h2) {
            if (!h2.hasOwnProperty(i))
                continue;

            if (!h1.hasOwnProperty(i)) {
                ret[i] = h2[i];
            }
            alllen2 = alllen2 + h2[i];
        }

        for (i in ret) {
            if (!ret.hasOwnProperty(i))
                continue;
            sum = sum + ret[i];
        }


        alllen = alllen1 + alllen2;

//        nl.drew.fg.lib.dumpError("sum=" + sum);
//        nl.drew.fg.lib.dumpError("alllen=" + alllen);
//        nl.drew.fg.lib.dumpError("alllen1=" + alllen1);
//        nl.drew.fg.lib.dumpError("alllen2=" + alllen2);
        //nl.drew.fg.lib.dumpError(Math.round((sum * 100) / alllen));
        return Math.round((sum * 100) / alllen);

    }
    lib.compare = function (t1, t2) {
        return compare(this.calcH(t1), this.calcH(t2));
    }

    lib.addHostList = function (val) {
        nl.drew.fg.hostList.push(
            {
                id: val.id,
                H: val.host,
                fl: val.fl,
                proxy: val.proxy,
                proxyBl: false,
                timeCheck: 0,
                type: val.type,
                url: (typeof(val.url) == "undefined" ? "" : val.url),
                fs: (typeof(val.fsize) == "undefined" ? 0 : val.fsize),
                W: (typeof(val.word) == "undefined" ? "" : val.word),
                processingFrom: 0,
                reqArr: [],
                co: (typeof(val.co) == "undefined" ? "" : val.co),
                nodel: (typeof(val.nodel) == "undefined" ? false : val.nodel),
                tmpdel: false
            }
        )
    }


    lib.cutQuery = function (url) {
        var urlSplit = url.split(/\?/g);
        return urlSplit[0];
    }

    lib.schemeHost = function (url) {

        var ret = {}
        var urlSplit = url.split(/:/g);

        ret.cutsheme = urlSplit[0];
        ret.sheme = urlSplit[0] + "://";

        if (!lib.f.isScheme(urlSplit[0])) {
            return null
        }

        urlSplit = url.split(/\/+/g);

        if (typeof urlSplit[1] == "undefined") {
            return null;
        }

        ret.host = urlSplit[1];

        return ret
    }


    lib.isUriInAnyList = function (url, info, list) {
        //
        if (!list) {
            return -1;
        }

        var listLength = list.length;

        //=====================
        //nl.drew.fg.lib.dumpError("listLength="+list);
        //=====================
        if (listLength < 1)
            return null;

        if (!info) {
            info = this.schemeHost(url)
        }
        if (info == null) {
            return null
        }

        for (var i = 0; i < listLength; i++) {
            //nl.drew.fg.lib.dumpError(nl.drew.fg.hostList[i].H + "==" + info.host);
            if (list[i].H == info.host) {
                //nl.drew.fg.lib.dumpError(nl.drew.fg.hostList[i].H + "==" + info.host);
                return {i: i, sheme: info.sheme, host: info.host}
            } else {
                if (list[i].H[0] == "*") {
                    //
                    var lenHost = -1 * (list[i].H.length - 2);

                    if (list[i].H.substr(lenHost) == info.host.substr(lenHost)) {
                        return {i: i, sheme: info.sheme, host: info.host}
                    }
                }
            }
        }

        return null;
    };


    lib.isIdInAnyList = function (id, list) {

        if (!list) {
            return -1;
        }

        var listLength = list.length;
        if (listLength < 1)
            return -1;
        for (var i = 0; i < listLength; i++) {
            if (list[i].id == id) {
                return i
            }
        }
        return -1;
    };

    lib.isIdInList = function (id) {
        return nl.drew.fg.lib.isIdInAnyList(id, nl.drew.fg.hostList);
    };

    lib.isUriInRedirList = function (url, info) {
        //
        return lib.isUriInAnyList(url, info, nl.drew.fg.hostRedirList)
    }


    lib.isUriInList = function (url, info) {
        return lib.isUriInAnyList(url, info, nl.drew.fg.hostList);
    };

    lib.inBlList = function (urlto, info) {
        var ret = null;

        if (!info)
            info = lib.schemeHost(urlto)
        if (info == null) {
            return ret
        }

        var blHostslength = nl.drew.fg.hostBlList.length;
        if (blHostslength > 0)
            for (var i = 0; i < blHostslength; i++) {
                //
                if (urlto.indexOf(nl.drew.fg.hostBlList[i].H) != -1) {
                    //
                    return info;
                }
            }
        return ret
    }

    lib.isUriInBlList = function (urlto, info, urlfrom) {
        //
        var isInList

        info = lib.inBlList(urlto, info)
        if (info == null) {
            return null
        }

        var infofrom = lib.schemeHost(urlfrom)
        if (infofrom == null) {
            return null
        }

        isInList = nl.drew.fg.lib.isUriInList(urlfrom, infofrom);

        if (isInList != null) {
            return
        }

        nl.drew.fg.notifi.notificationShow([" " + nl.drew.fg.lib.f.getLStr("maybesite"), infofrom.host, nl.drew.fg.lib.f.getLStr("isblocked")],
            {l: nl.drew.fg.lib.f.getLStr("addsite"), act: function () {
                nl.drew.fg.hosts.addSite(1, infofrom.host, info.host, urlfrom);
            }},
//            {l: nl.drew.fg.lib.f.getLStr("addsitetime"), act: function () {
//                nl.drew.fg.hosts.addSite(0, infofrom.host, info.host, urlfrom);
//            }}
            {l: nl.drew.fg.lib.f.getLStr("addsiteproxy"), act: function () {
                nl.drew.fg.hosts.addSite3(infofrom.host, info.host, urlfrom);
            }}
        );

    }

    lib.proxyforever = function (i, val) {
        //
        if (i > -1) {
            //
            return lib.f.bits(i, val, 1)
        }
        return false;
    }


    lib.unockReq = function (index) {

        var reqLength = nl.drew.fg.hostList[index].reqArr.length;

        if (reqLength < 1)
            return null;

        for (var i = 0; i < reqLength; i++) {
            //=====================
            //nl.drew.fg.lib.dumpError("UrlUpdate=" + nl.drew.fg.hostList[index].reqArr[i][1]);
            //=====================
            nl.drew.fg.hostList[index].reqArr[i][0].loadURI(nl.drew.fg.hostList[index].reqArr[i][1]);
        }
        nl.drew.fg.hostList[index].reqArr = [];
        return i;
    };


    lib.saveList = function (callback) {
        var forsave = [];
        var listLength = nl.drew.fg.hostList.length;
        if (listLength > 0) {
            for (var j = 0; j < listLength; j++) {
                //nl.drew.fg.lib.dumpError(nl.drew.fg.hostList[j].H);
                if (nl.drew.fg.hostList[j].nodel) {
                    continue;
                }
                forsave.push({
                    i: nl.drew.fg.hostList[j].id,
                    h: nl.drew.fg.hostList[j].H,
                    f: nl.drew.fg.hostList[j].fl,
                    p: nl.drew.fg.hostList[j].proxy,
                    co: nl.drew.fg.hostList[j].co,
                    t: nl.drew.fg.hostList[j].type,
                    u: nl.drew.fg.hostList[j].url,
                    fs: nl.drew.fg.hostList[j].fs,
                    w: nl.drew.fg.hostList[j].W
                    //n: nl.drew.fg.hostList[j].nodel
                })
            }

            nl.drew.fg.stor.setItem("list", forsave, function () {
                if (callback != null)
                    callback();
            });
        } else {
            if (callback != null)
                callback();
        }
    };


    lib.ishide = function (i, val) {
        //
        if (i > -1) {
            //
            return lib.f.bits(i, val, 3)
        }
        return false;
    };
    lib.ishideinvert = function (i) {
        //
        if (i > -1) {
            //
            nl.drew.fg.hostList[i].fl = nl.drew.fg.hostList[i].fl ^ (1 << 3)
        }
    }
    lib.isspdyoff = function (i, val) {
        //
        if (i > -1) {
            //
            return lib.f.bits(i, val, 4)
        }
        return false;
    };
    lib.isspdyoffinvert = function (i) {
        //
        if (i > -1) {
            //
            nl.drew.fg.hostList[i].fl = nl.drew.fg.hostList[i].fl ^ (1 << 4)
        }
    }
    lib.generatePW = function (c) {
        var i,
            s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            pw = "";

        if (!c)
            c = 16;
        for (i = 0; i < c; i++) {
            pw += s.charAt(Math.random() * 61);
        }
        return(pw);
    }
    lib.isipv4 = function (addr) {
        var ipSplit = addr.split(/\:/g);
        if (typeof ipSplit[1] != 'undefined') {
            if (ipSplit[1] < 65535 && ipSplit[1] > 0) {

                if (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipSplit[0])) {

                    return true;
                }
            }
        }
        return false;
    }
    lib.parseUserProxy = function () {
        var userproxy = nl.drew.fg.lib.pref.get_string('userproxy', "");
        if (userproxy) {
            var urlSplit2 = userproxy.split(/\s+/g);
            var urlSplit1 = urlSplit2[1].split(/:/g);

            nl.drew.fg.userproxy = {type: urlSplit2[0].toUpperCase(), ip: urlSplit1[0], port: urlSplit1[1]};
        } else {
            nl.drew.fg.userproxy = null;
        }
    }
    lib.isipv6 = function (addr) {
        var ipSplit = addr.split(/\]:/g);
        if (typeof ipSplit[1] != 'undefined') {

            if (ipSplit[1] < 65535 && ipSplit[1] > 0) {
                ipSplit = ipSplit[0].split(/\[/g);
                //alert(ipSplit[1]);
                if (typeof ipSplit[1] != 'undefined') {
                    return /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i.test(ipSplit[1]);
                }
            }
        }
        return false;
    }
    return lib;
}();
