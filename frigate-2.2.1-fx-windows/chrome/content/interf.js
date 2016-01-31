/*
 * Drew (C)2013-2014
 * https://fri-gate.org
 */

nl.drew.fg.interf = function () {
    var interf = {};
    var XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    var smStrings = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService).createBundle("chrome://frigate2/locale/frigate.properties");
    nl.drew.fg.lib.f.getLStr = function (sName) {
        return smStrings.GetStringFromName(sName);
    }


    var strOn = nl.drew.fg.lib.f.getLStr("on");
    var strOff = nl.drew.fg.lib.f.getLStr("off");
    var site = nl.drew.fg.lib.f.getLStr("site");
    var support = nl.drew.fg.lib.f.getLStr("support");
    var proxyall = nl.drew.fg.lib.f.getLStr("proxyall");
    var proxylist = nl.drew.fg.lib.f.getLStr("proxylist");
    var proxysite = nl.drew.fg.lib.f.getLStr("proxysite");
    var proxysite21 = nl.drew.fg.lib.f.getLStr("proxysite21");
    var proxysite22 = nl.drew.fg.lib.f.getLStr("proxysite22");
    var hideall = nl.drew.fg.lib.f.getLStr("hideall");
    var hidesite = nl.drew.fg.lib.f.getLStr("hidesite");
    var hidesite21 = nl.drew.fg.lib.f.getLStr("hidesite21");
    var hidesite22 = nl.drew.fg.lib.f.getLStr("hidesite22");
    var spdyall = nl.drew.fg.lib.f.getLStr("spdyall");
    var spdysiteoff = nl.drew.fg.lib.f.getLStr("spdysiteoff");
    var spdysiteoff21 = nl.drew.fg.lib.f.getLStr("spdysiteoff21");
    var spdysiteoff22 = nl.drew.fg.lib.f.getLStr("spdysiteoff22");

    var fromlist = nl.drew.fg.lib.f.getLStr("fromlist");
    var fromlisttmp = nl.drew.fg.lib.f.getLStr("fromlisttmp");
    var proxyon = nl.drew.fg.lib.f.getLStr("proxyon");
    var auto = nl.drew.fg.lib.f.getLStr("auto");
    var manual = nl.drew.fg.lib.f.getLStr("manual");
    var notfromlist = nl.drew.fg.lib.f.getLStr("notfromlist");
    var only = nl.drew.fg.lib.f.getLStr("only");
    var onlysite = nl.drew.fg.lib.f.getLStr("onlysite");
    var onlysite21 = nl.drew.fg.lib.f.getLStr("onlysite21");
    var onlysite22 = nl.drew.fg.lib.f.getLStr("onlysite22");
    var siteavail = nl.drew.fg.lib.f.getLStr("siteavail");
    var change = nl.drew.fg.lib.f.getLStr("change");
    var rand = nl.drew.fg.lib.f.getLStr("rand");

    var addsite = nl.drew.fg.lib.f.getLStr("addsite");
    var delsite = nl.drew.fg.lib.f.getLStr("delsite");
    var delsite21 = nl.drew.fg.lib.f.getLStr("delsite21");
    var addsitetime = nl.drew.fg.lib.f.getLStr("addsitetime");
    var addsiteproxy = nl.drew.fg.lib.f.getLStr("addsiteproxy");
    var delsitetime = nl.drew.fg.lib.f.getLStr("delsitetime");

    var noapi = nl.drew.fg.lib.f.getLStr("noapi");

    var nosendto = nl.drew.fg.lib.f.getLStr("nosendto");


    var miSupport = document.createElementNS(XUL_NS, "menuitem");
    miSupport.setAttribute("label", " " + support);
    miSupport.setAttribute("tooltiptext", "");
    miSupport.setAttribute("image", "chrome://frigate2/content/im/com.png");
    miSupport.setAttribute("class", "menuitem-iconic");
    miSupport.addEventListener("command", function () {
        nl.drew.fg.interf.support();
    });


    var miSite = document.createElementNS(XUL_NS, "menuitem");
    miSite.setAttribute("label", " " + site);
    miSite.setAttribute("tooltiptext", "");
    miSite.setAttribute("image", "chrome://frigate2/content/im/38.png");
    miSite.setAttribute("class", "menuitem-iconic");
    miSite.addEventListener("command", function () {
        nl.drew.fg.interf.site();
    });


    var miOnOff = document.createElementNS(XUL_NS, "menuitem");
    miOnOff.setAttribute("tooltiptext", "select for Disable friGate");
    miOnOff.setAttribute("class", "menuitem-iconic");
    miOnOff.addEventListener("command", function () {
        nl.drew.fg.interf.Off();
    });


    var miProxyall = document.createElementNS(XUL_NS, "menuitem");
    miProxyall.setAttribute("label", " " + proxyall);
    miProxyall.setAttribute("tooltiptext", "");
    miProxyall.setAttribute("type", "checkbox");
    miProxyall.setAttribute("image", "chrome://frigate2/content/im/38p.png");
    miProxyall.setAttribute("class", "menuitem-iconic");
    miProxyall.addEventListener("command", function () {
        nl.drew.fg.interf.proxyonforall();
    });


    var miProxylist = document.createElementNS(XUL_NS, "menuitem");
    miProxylist.setAttribute("label", " " + proxylist);
    miProxylist.setAttribute("tooltiptext", "");
    miProxylist.setAttribute("type", "checkbox");
    miProxylist.setAttribute("image", "chrome://frigate2/content/im/38p.png");
    miProxylist.setAttribute("class", "menuitem-iconic");
    miProxylist.addEventListener("command", function () {
        nl.drew.fg.interf.proxyforever()
    });


    var miProxysite = document.createElementNS(XUL_NS, "menuitem");
    miProxysite.setAttribute("label", " " + proxysite);
    miProxysite.setAttribute("tooltiptext", "");
    miProxysite.setAttribute("type", "checkbox");
    miProxysite.setAttribute("image", "chrome://frigate2/content/im/38p.png");
    miProxysite.setAttribute("class", "menuitem-iconic");
    miProxysite.addEventListener("command", function () {
        nl.drew.fg.loadConfigOk = true;
        var hostId = this.ref;
        nl.drew.fg.mutexHostList.run(function () {
            nl.drew.fg.interf.proxyforever(hostId);
        });
    });

    var miHidesite = document.createElementNS(XUL_NS, "menuitem");
    miHidesite.setAttribute("label", " " + hidesite);
    miHidesite.setAttribute("tooltiptext", "");
    miHidesite.setAttribute("type", "checkbox");
    miHidesite.setAttribute("image", "chrome://frigate2/content/im/38an.png");
    miHidesite.setAttribute("class", "menuitem-iconic");
    miHidesite.addEventListener("command", function () {
        nl.drew.fg.loadConfigOk = true;
        var hostId = this.ref;
        nl.drew.fg.mutexHostList.run(function () {
            nl.drew.fg.interf.hideip(hostId);
        });
    });


    var miHideall = document.createElementNS(XUL_NS, "menuitem");
    miHideall.setAttribute("label", " " + hideall);
    miHideall.setAttribute("tooltiptext", "");
    miHideall.setAttribute("type", "checkbox");
    miHideall.setAttribute("image", "chrome://frigate2/content/im/38an.png");
    miHideall.setAttribute("class", "menuitem-iconic");
    miHideall.addEventListener("command", function () {
        nl.drew.fg.interf.hideip()
    });


    var miSpdysiteoff = document.createElementNS(XUL_NS, "menuitem");
    miSpdysiteoff.setAttribute("label", " " + spdysiteoff);
    miSpdysiteoff.setAttribute("tooltiptext", "");
    miSpdysiteoff.setAttribute("type", "checkbox");
    miSpdysiteoff.setAttribute("image", "chrome://frigate2/content/im/38pspdy.png");
    miSpdysiteoff.setAttribute("class", "menuitem-iconic");
    miSpdysiteoff.addEventListener("command", function () {
        nl.drew.fg.loadConfigOk = true;
        var hostId = this.ref;
        nl.drew.fg.mutexHostList.run(function () {
            nl.drew.fg.interf.spdysiteoff(hostId)
        });
    });


    var miSpdyall = document.createElementNS(XUL_NS, "menuitem");
    miSpdyall.setAttribute("label", " " + spdyall);
    miSpdyall.setAttribute("tooltiptext", "");
    miSpdyall.setAttribute("type", "checkbox");
    miSpdyall.setAttribute("image", "chrome://frigate2/content/im/38pspdy.png");
    miSpdyall.setAttribute("class", "menuitem-iconic");
    miSpdyall.addEventListener("command", function () {
        nl.drew.fg.interf.spdy()
    });

    var miAddSiteTmp = document.createElementNS(XUL_NS, "menuitem");
    miAddSiteTmp.setAttribute("label", addsite);
    miAddSiteTmp.setAttribute("tooltiptext", "");
    miAddSiteTmp.setAttribute("image", "chrome://frigate2/content/im/plus.png");
    miAddSiteTmp.setAttribute("class", "menuitem-iconic");
    miAddSiteTmp.addEventListener("command", function () {
        nl.drew.fg.loadConfigOk = true;
        var hostId = this.ref;
        nl.drew.fg.mutexHostList.run(function () {
            nl.drew.fg.hosts.addSite2(hostId);
        });
    });

    var miAddSite = document.createElementNS(XUL_NS, "menuitem");
    miAddSite.setAttribute("label", addsite);
    miAddSite.setAttribute("tooltiptext", "");
    miAddSite.setAttribute("image", "chrome://frigate2/content/im/plus.png");
    miAddSite.setAttribute("class", "menuitem-iconic");
    miAddSite.addEventListener("command", function () {
        nl.drew.fg.hosts.addSite(1, this.ref);
    });


    var miAddSiteTime = document.createElementNS(XUL_NS, "menuitem");
    miAddSiteTime.setAttribute("label", addsitetime);
    miAddSiteTime.setAttribute("tooltiptext", "");
    miAddSiteTime.setAttribute("image", "chrome://frigate2/content/im/plus.png");
    miAddSiteTime.setAttribute("class", "menuitem-iconic");
    miAddSiteTime.addEventListener("command", function () {
        nl.drew.fg.hosts.addSite(0, this.ref);
    });

    var miAddSiteProxy = document.createElementNS(XUL_NS, "menuitem");
    miAddSiteProxy.setAttribute("label", addsiteproxy);
    miAddSiteProxy.setAttribute("tooltiptext", "");
    miAddSiteProxy.setAttribute("image", "chrome://frigate2/content/im/plus.png");
    miAddSiteProxy.setAttribute("class", "menuitem-iconic");
    miAddSiteProxy.addEventListener("command", function () {
        nl.drew.fg.hosts.addSite3(this.ref);
    });


    var miDellSite = document.createElementNS(XUL_NS, "menuitem");
    miDellSite.setAttribute("label", delsite);
    miDellSite.setAttribute("tooltiptext", "");
    miDellSite.setAttribute("image", "chrome://frigate2/content/im/minus.png");
    miDellSite.setAttribute("class", "menuitem-iconic");
    miDellSite.addEventListener("command", function () {
        nl.drew.fg.loadConfigOk = true;
        var hostId = this.ref;
        nl.drew.fg.mutexHostList.run(function () {
            nl.drew.fg.hosts.delSite(1, hostId);
        });
    });


    var miDellSiteTime = document.createElementNS(XUL_NS, "menuitem");
    miDellSiteTime.setAttribute("label", delsitetime);
    miDellSiteTime.setAttribute("tooltiptext", "");
    miDellSiteTime.setAttribute("image", "chrome://frigate2/content/im/minus.png");
    miDellSiteTime.setAttribute("class", "menuitem-iconic");
    miDellSiteTime.addEventListener("command", function () {
        nl.drew.fg.loadConfigOk = true;
        var hostId = this.ref;
        nl.drew.fg.mutexHostList.run(function () {
            nl.drew.fg.hosts.delSite(0, hostId);
        });
    });


    interf.SubMenu3 = function (toserver) {

        var tempMenuIteam;
        var i;

        var container = document.getElementById("frigate2SubMenu3");
        if (container == null) {
            return;
        }
        for (var j = container.childNodes.length; j > 0; j--) {
            container.removeChild(container.childNodes[0]);
        }

        if (toserver) {
            return
        }

        var toserverLen = toserver.length
        if (toserverLen < 1) {
            return;
        }

        for (var j = 0; j < toserverLen; j++) {
            tempMenuIteam = document.createElementNS(XUL_NS, "menuitem");
            i = nl.drew.fg.lib.isIdInList(toserver[j].id);
            if (i > 0 || toserver[j].act == 'delsite')
                switch (toserver[j].act) {
                    case 'setco':
                        tempMenuIteam.setAttribute("label", nl.drew.fg.hostList[i].H + " - " + (toserver[j].co == "" ? onlysite22 + " " + toserver[j].oldCo.toUpperCase() : onlysite21 + " " + toserver[j].co.toUpperCase()));
                        break;
                    case 'hideip':
                        tempMenuIteam.setAttribute("label", (nl.drew.fg.lib.ishide(i) ? hidesite21 : hidesite22) + " " + nl.drew.fg.hostList[i].H);
                        break;
                    case 'spdysiteoff':
                        tempMenuIteam.setAttribute("label", (nl.drew.fg.lib.ishide(i) ? spdysiteoff21 : spdysiteoff22) + " " + nl.drew.fg.hostList[i].H);
                        break;
                    case 'proxyforever':
                        tempMenuIteam.setAttribute("label", (nl.drew.fg.lib.proxyforever(i) ? proxysite21 : proxysite22) + " " + nl.drew.fg.hostList[i].H);
                        break;
                    case 'delsite':
                        tempMenuIteam.setAttribute("label", delsite21 + " " + toserver[j].val);
                        break;
                }
            tempMenuIteam.setAttribute("tooltiptext", "");
            container.appendChild(tempMenuIteam);
        }
    }

    interf.SubMenu2 = function (isInList, requestURL, requestURLInfo, tmpdel) {
        //
        var addHost = requestURLInfo.host;
        var addHost2;
        var tempMenuIteam;

        var container = document.getElementById("frigate2SubMenu2");
        if (container == null) {
            return;
        }
        for (var i = container.childNodes.length; i > 0; i--) {
            container.removeChild(container.childNodes[0]);
        }

        var inBl = nl.drew.fg.lib.inBlList(requestURL, requestURLInfo)

        if (inBl == null && (nl.drew.fg.config.host || (isInList != null))) {
            //
            if (isInList != null) {
                //
                tempMenuIteam = document.createElementNS(XUL_NS, "menuitem");
                tempMenuIteam.setAttribute("label", nl.drew.fg.hostList[isInList.i].H);
                tempMenuIteam.setAttribute("tooltiptext", "");
                container.appendChild(tempMenuIteam);
                container.appendChild(document.createElementNS(XUL_NS, "menuseparator"));

                if (nl.drew.fg.hostList[isInList.i].type != 2) {

                    if (nl.drew.fg.lib.proxyforever(isInList.i)) {
                        miProxysite.setAttribute("checked", true);
                    } else {
                        miProxysite.setAttribute("checked", false);
                    }
                    miProxysite.ref = nl.drew.fg.hostList[isInList.i].id;
                    container.appendChild(miProxysite);
                }

                if (!nl.drew.fg.userproxy) {

                    if (nl.drew.fg.lib.ishide(isInList.i)) {
                        miHidesite.setAttribute("checked", true);
                    } else {
                        miHidesite.setAttribute("checked", false);
                    }
                    miHidesite.ref = nl.drew.fg.hostList[isInList.i].id

                    container.appendChild(miHidesite);

                    //var isUriInAnyList = nl.drew.fg.lib.isUriInAnyList("", requestURLInfo, nl.drew.fg.noSpdyList);
                    //if (nl.drew.fg.spdyall || (isUriInAnyList != null)) {
                    //

                    if (nl.drew.fg.lib.isspdyoff(isInList.i)) {
                        miSpdysiteoff.setAttribute("checked", true);
                    } else {
                        miSpdysiteoff.setAttribute("checked", false);
                    }
                    miSpdysiteoff.ref = nl.drew.fg.hostList[isInList.i].id;
                    container.appendChild(miSpdysiteoff);
                    //}
                }

                if (!nl.drew.fg.hostList[isInList.i].nodel) {
                    miDellSite.ref = nl.drew.fg.hostList[isInList.i].id;
                    container.appendChild(miDellSite);
                    miDellSiteTime.ref = nl.drew.fg.hostList[isInList.i].id;
                    container.appendChild(miDellSiteTime);
                }

            } else {
                //
                addHostStart = addHost.substr(0, 4);
                if (addHostStart == "www.") {
                    addHost2 = "*" + addHost.substr(3);
                } else {
                    addHost2 = "*." + addHost;
                }

                tempMenuIteam = document.createElementNS(XUL_NS, "menuitem");
                tempMenuIteam.setAttribute("label", addHost2);
                tempMenuIteam.setAttribute("tooltiptext", "");
                container.appendChild(tempMenuIteam);

                if (tmpdel > -1) {
                    //
                    miAddSiteTmp.ref = tmpdel;
                    container.appendChild(miAddSiteTmp);
                } else {
                    //
                    miAddSite.ref = addHost;
                    container.appendChild(miAddSite);
                    //miAddSiteTime.ref = addHost;
                    //container.appendChild(miAddSiteTime);
                    miAddSiteProxy.ref = addHost;
                    container.appendChild(miAddSiteProxy);
                }
            }
        } else {
            tempMenuIteam = document.createElementNS(XUL_NS, "menuitem");
            tempMenuIteam.setAttribute("label", noapi);
            tempMenuIteam.setAttribute("tooltiptext", "");
            tempMenuIteam.setAttribute("image", "chrome://frigate2/content/im/cl.png");
            tempMenuIteam.setAttribute("class", "menuitem-iconic");
            container.appendChild(tempMenuIteam);
        }
    };

    interf.SubMenu = function (isInList, co) {

        var tempMenuIteam;

        var container = document.getElementById("frigate2SubMenu1");
        if (container == null) {
            return;
        }
        for (var i = container.childNodes.length; i > 0; i--) {
            container.removeChild(container.childNodes[0]);
        }

        //if (nl.drew.fg.config.host) {

        tempMenuIteam = document.createElementNS(XUL_NS, "menuitem");
        tempMenuIteam.setAttribute("label", change);
        tempMenuIteam.setAttribute("tooltiptext", rand);
        tempMenuIteam.setAttribute("image", "chrome://frigate2/content/im/refr.png");
        tempMenuIteam.setAttribute("class", "menuitem-iconic");
        tempMenuIteam.addEventListener("command", function () {
            nl.drew.fg.interf.chIp(co);
        });
        container.appendChild(tempMenuIteam);

        container.appendChild(document.createElementNS(XUL_NS, "menuseparator"));

        var coLen = nl.drew.fg.contrys.length;
        if (coLen > 0) {

            for (var i = 0; i < coLen; i++) {
                //
                if (nl.drew.fg.contrys[i] == "main") {
                    continue;
                }

                tempMenuIteam = document.createElementNS(XUL_NS, "menuitem");
                tempMenuIteam.setAttribute("type", "checkbox");
                tempMenuIteam.setAttribute("label", only + " " + nl.drew.fg.contrys[i].toUpperCase());
                tempMenuIteam.setAttribute("tooltiptext", "");
                if (nl.drew.fg.contryCh == nl.drew.fg.contrys[i]) {
                    tempMenuIteam.setAttribute("checked", true);
                }
                tempMenuIteam.setAttribute("ref", nl.drew.fg.contrys[i]);
                tempMenuIteam.addEventListener("command", function (event) {
                    event.stopPropagation();
                    nl.drew.fg.interf.contryCh(this.ref);
                    return false;
                });

                tempMenuIteam.setAttribute("image", "chrome://frigate2/content/im/co/" + nl.drew.fg.contrys[i] + ".png");
                tempMenuIteam.setAttribute("class", "menuitem-iconic");
                container.appendChild(tempMenuIteam);
            }

            if (isInList) {
                container.appendChild(document.createElementNS(XUL_NS, "menuseparator"));

                var listIndex = isInList.i;
                var listIid = nl.drew.fg.hostList[listIndex].id;


                for (var i = 0; i < coLen; i++) {
                    //
                    if (nl.drew.fg.contrys[i] == "main") {
                        continue;
                    }

                    tempMenuIteam = document.createElementNS(XUL_NS, "menuitem");
                    tempMenuIteam.setAttribute("type", "checkbox");
                    tempMenuIteam.setAttribute("label", onlysite + " " + nl.drew.fg.contrys[i].toUpperCase());
                    tempMenuIteam.setAttribute("tooltiptext", "");
                    if (nl.drew.fg.hostList[listIndex].co && nl.drew.fg.hostList[listIndex].co == nl.drew.fg.contrys[i]) {
                        tempMenuIteam.setAttribute("checked", true);
                    }
                    tempMenuIteam.setAttribute("ref", nl.drew.fg.contrys[i]);

                    tempMenuIteam.addEventListener("command", function (event) {
                        event.stopPropagation();
                        nl.drew.fg.loadConfigOk = true;
                        var hostId = this.ref;
                        nl.drew.fg.mutexHostList.run(function () {
                            nl.drew.fg.interf.contrySiteCh(hostId, listIid);
                        });
                        return false;
                    });

                    tempMenuIteam.setAttribute("image", "chrome://frigate2/content/im/co/" + nl.drew.fg.contrys[i] + ".png");
                    tempMenuIteam.setAttribute("class", "menuitem-iconic");
                    container.appendChild(tempMenuIteam);
                }
            }
        }
//        } else {
//            tempMenuIteam = document.createElementNS(XUL_NS, "menuitem");
//            tempMenuIteam.setAttribute("label", noapi);
//            tempMenuIteam.setAttribute("tooltiptext", "");
//            tempMenuIteam.setAttribute("image", "chrome://frigate2/content/im/cl.png");
//            tempMenuIteam.setAttribute("class", "menuitem-iconic");
//            container.appendChild(tempMenuIteam);
//        }
    }

    interf.MenuHide = function () {
//        var container = document.getElementById("frigate2MainMenuGen");
//        if (container == null) {
//            return;
//        }
//        for (var i = container.childNodes.length; i > 0; i--) {
//            container.removeChild(container.childNodes[0]);
//        }
    }
    interf.Menu = function () {
        //
        var container = document.getElementById("frigate2MainMenuGen");
        if (container == null) {
            return;
        }
        for (var i = container.childNodes.length; i > 0; i--) {
            container.removeChild(container.childNodes[0]);
        }

        var gBrowser = window.getBrowser();
        var isInList = null;
        var requestURL = gBrowser.currentURI.spec;
        var requestURLInfo = nl.drew.fg.lib.schemeHost(requestURL);
        var tmpdel = -1;

        if (requestURLInfo) {
            isInList = nl.drew.fg.lib.isUriInAnyList(requestURL, requestURLInfo, nl.drew.fg.hostList);
            if (isInList != null && nl.drew.fg.hostList[isInList.i].tmpdel) {
                //
                tmpdel = nl.drew.fg.hostList[isInList.i].id;
                isInList = null;
            }
        }

        var tempMenuIteam;
        var tempMenuPopup;
        var thisProxy, key, co;
        var dopInfo = "";
        var proxyOn = false;

        nl.drew.fg.stor.getItem("toserver", function (toserver) {

            if (nl.drew.fg.on) {
                //
                nl.drew.fg.proxyonforlist = nl.drew.fg.lib.pref.get_bool('proxyonforlist', false);
                nl.drew.fg.spdyall = nl.drew.fg.lib.pref.get_bool('spdyall', false);
                nl.drew.fg.proxyonforall = nl.drew.fg.lib.pref.get_bool('proxyonforall', false);

                if (Object.keys(nl.drew.fg.proxyMain).length > 0) {
                    co = "main";
                    if (isInList != null &&
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

                    if (co != "main" || ( typeof(nl.drew.fg.proxyMainInd[co] != "undefined") &&
                        typeof(nl.drew.fg.proxyMain[co][nl.drew.fg.proxyMainInd[co]]) != "undefined" &&
                        typeof(nl.drew.fg.proxyArr[nl.drew.fg.proxyMain[co][nl.drew.fg.proxyMainInd[co]]]) != "undefined")) {
                        //
                        key = nl.drew.fg.proxyMain[co][nl.drew.fg.proxyMainInd[co]];

                        thisProxy = nl.drew.fg.proxyArr[key];


                        if (isInList != null) {
                            if (nl.drew.fg.hostList[isInList.i].nodel) {
                                dopInfo = fromlisttmp;
                            } else {
                                dopInfo = fromlist;
                            }
                            if (nl.drew.fg.hostList[isInList.i].proxy || nl.drew.fg.proxyonforlist) {
                                proxyOn = true;
                                dopInfo = dopInfo + proxyon;
                                if (nl.drew.fg.hostList[isInList.i].fl & 2 || nl.drew.fg.proxyonforlist) {
                                    //
                                    dopInfo = dopInfo + " " + manual;
                                } else {
                                    dopInfo = dopInfo + " " + auto;
                                }
                            } else {
                                dopInfo = dopInfo + "" + siteavail;
                            }
                        } else {
                            if (requestURLInfo)
                                dopInfo = notfromlist;
                        }

                        if (nl.drew.fg.proxyonforall) {
                            proxyOn = true;
                        }


                        if (dopInfo) {
                            tempMenuIteam = document.createElementNS(XUL_NS, "menu");
                            tempMenuIteam.setAttribute("label", " " + dopInfo);
                            tempMenuIteam.setAttribute("tooltiptext", "");
                            if (proxyOn) {
                                tempMenuIteam.setAttribute("image", "chrome://frigate2/content/im/on.png");
                            } else {
                                tempMenuIteam.setAttribute("image", "chrome://frigate2/content/im/off.png");
                                //tempMenuIteam.setAttribute("disabled", true);
                            }
                            tempMenuIteam.setAttribute("class", "menu-iconic");

                            tempMenuPopup = document.createElementNS(XUL_NS, "menupopup");
                            tempMenuPopup.setAttribute("id", "frigate2SubMenu2");

                            tempMenuPopup.addEventListener("popupshowing", function (event) {
                                event.stopPropagation();
                                nl.drew.fg.interf.SubMenu2(isInList, requestURL, requestURLInfo, tmpdel);
                            });
                            tempMenuIteam.appendChild(tempMenuPopup);

                            container.appendChild(tempMenuIteam);
                            container.appendChild(document.createElementNS(XUL_NS, "menuseparator"));
                        }


                        if (nl.drew.fg.userproxy) {

                            tempMenuIteam = document.createElementNS(XUL_NS, "menuitem");
                            tempMenuIteam.setAttribute("label", nl.drew.fg.userproxy.type + " " + nl.drew.fg.userproxy.ip + ":" + nl.drew.fg.userproxy.port);
                            tempMenuIteam.setAttribute("tooltiptext", "");
                            tempMenuIteam.setAttribute("image", "chrome://frigate2/content/im/38up.png");
                            tempMenuIteam.setAttribute("class", "menuitem-iconic");
                            container.appendChild(tempMenuIteam);
                            container.appendChild(document.createElementNS(XUL_NS, "menuseparator"));

                        } else {


                            tempMenuIteam = document.createElementNS(XUL_NS, "menu");
                            tempMenuIteam.setAttribute("label", " " + thisProxy.name + ", " + thisProxy.chanel + "%");
                            tempMenuIteam.setAttribute("tooltiptext", "");
                            tempMenuIteam.setAttribute("image", "chrome://frigate2/content/im/co/" + thisProxy.co + ".png");
                            tempMenuIteam.setAttribute("class", "menu-iconic");

                            tempMenuPopup = document.createElementNS(XUL_NS, "menupopup");
                            tempMenuPopup.setAttribute("id", "frigate2SubMenu1");

                            tempMenuPopup.addEventListener("popupshowing", function (event) {
                                event.stopPropagation();
                                nl.drew.fg.interf.SubMenu(isInList, co);
                            });
                            tempMenuIteam.appendChild(tempMenuPopup);

                            container.appendChild(tempMenuIteam);
                            container.appendChild(document.createElementNS(XUL_NS, "menuseparator"));


                            //if (proxyOn) {
                            if (nl.drew.fg.spdyall) {
                                miSpdyall.setAttribute("checked", true);
                            } else {
                                miSpdyall.setAttribute("checked", false);
                            }
                            container.appendChild(miSpdyall);

//                            if (requestURLInfo) {
//                                var isUriInAnyList = nl.drew.fg.lib.isUriInAnyList(requestURL, requestURLInfo, nl.drew.fg.noSpdyList);
//                                if (nl.drew.fg.spdyall || (isUriInAnyList != null)) {
//                                    //
//                                    if (isUriInAnyList == null) {
//                                        miSpdysiteoff.setAttribute("checked", false);
//                                    } else {
//                                        miSpdysiteoff.setAttribute("checked", true);
//                                    }
//                                    miSpdysiteoff.ref = requestURLInfo.host;
//                                    container.appendChild(miSpdysiteoff);
//                                }
//                            }

                            container.appendChild(document.createElementNS(XUL_NS, "menuseparator"));
                            //}

                            if (nl.drew.fg.hideall) {
                                miHideall.setAttribute("checked", true);
                            } else {
                                miHideall.setAttribute("checked", false);
                            }
                            container.appendChild(miHideall);

//                        if (isInList != null) {
//
//                            if (nl.drew.fg.lib.ishide(isInList.i)) {
//                                miHidesite.setAttribute("checked", true);
//                            } else {
//                                miHidesite.setAttribute("checked", false);
//                            }
//                            miHidesite.ref = isInList.i
//                            container.appendChild(miHidesite);
//                        }

                            container.appendChild(document.createElementNS(XUL_NS, "menuseparator"));
                        }


//                    if (isInList != null && nl.drew.fg.hostList[isInList.i].type != 2) {
//
//                        if (nl.drew.fg.hostList[isInList.i].fl & 2) {
//                            miProxysite.setAttribute("checked", true);
//                        }
//                        miProxysite.ref = isInList.i;
//                        container.appendChild(miProxysite);
//                    }


                        if (nl.drew.fg.proxyonforall) {
                            miProxyall.setAttribute("checked", true);
                        } else {
                            miProxyall.setAttribute("checked", false);
                        }
                        container.appendChild(miProxyall);


                        if (nl.drew.fg.proxyonforlist) {
                            miProxylist.setAttribute("checked", true);
                        } else {
                            miProxylist.setAttribute("checked", false);
                        }
                        container.appendChild(miProxylist);

                    }
                }
            }

            if (toserver) {
                var toserverLen = toserver.length;
                if (toserverLen > 0) {
                    container.appendChild(document.createElementNS(XUL_NS, "menuseparator"));
                    tempMenuIteam = document.createElementNS(XUL_NS, "menu");
                    tempMenuIteam.setAttribute("label", " " + nosendto + " " + toserverLen);
                    tempMenuIteam.setAttribute("tooltiptext", "");

                    tempMenuIteam.setAttribute("image", "chrome://frigate2/content/im/refr.png");

                    tempMenuIteam.setAttribute("class", "menu-iconic");

                    tempMenuPopup = document.createElementNS(XUL_NS, "menupopup");
                    tempMenuPopup.setAttribute("id", "frigate2SubMenu3");

                    tempMenuPopup.addEventListener("popupshowing", function (event) {
                        event.stopPropagation();
                        nl.drew.fg.interf.SubMenu3(toserver);
                    });
                    tempMenuIteam.appendChild(tempMenuPopup);

                    container.appendChild(tempMenuIteam);
                }
            }
            container.appendChild(document.createElementNS(XUL_NS, "menuseparator"));

            if (nl.drew.fg.on) {
                miOnOff.setAttribute("label", " " + strOff);
                miOnOff.setAttribute("image", "chrome://frigate2/content/im/off.png");
            } else {
                miOnOff.setAttribute("label", " " + strOn);
                miOnOff.setAttribute("image", "chrome://frigate2/content/im/on.png");
            }

            container.appendChild(miOnOff);
            container.appendChild(miSite);
            container.appendChild(miSupport);
        });

    }

    interf.support = function () {
        var gBrowser = window.getBrowser();
        gBrowser.selectedTab = gBrowser.addTab("http://forum.fri-gate.org");
    }

    interf.site = function () {
        var gBrowser = window.getBrowser();
        gBrowser.selectedTab = gBrowser.addTab("http://fri-gate.org/");
    }


    interf.proxyforever = function (id) {
        //
        nl.drew.fg.lib.pref.set_string("updatetabs", "");
        if (id > 0) {
            //
            var i = nl.drew.fg.lib.isIdInList(id);
            if (i == -1) {
                nl.drew.fg.mutexHostList.done()
                return false;
            }

            nl.drew.fg.lastLoadConfig = Date.now() + nl.drew.fg.config.updateConfigTimeWait;

            if (nl.drew.fg.hostList[i].type != 2) {
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
                nl.drew.fg.lib.pref.set_string("fl", "");
                nl.drew.fg.lib.pref.set_string("fl", JSON.stringify({id: id, t: 'proxy', bid: nl.drew.fg.bid, val: nl.drew.fg.hostList[i].fl, co: nl.drew.fg.hostList[i].co}));

                nl.drew.fg.lib.updateTabs("url", nl.drew.fg.hostList[i].H);

                nl.drew.fg.lib.saveList(function () {
                    nl.drew.fg.lib.setFl(id, false, "proxyforever");
                    //nl.drew.fg.lib.pref.set_string("updatetabs", nl.drew.fg.hostList[i].H);
                });
            }
            return true;
        } else {

            nl.drew.fg.proxyonforlist = nl.drew.fg.lib.pref.get_bool('proxyonforlist', false);
            nl.drew.fg.proxyonforlist = !nl.drew.fg.proxyonforlist;
            nl.drew.fg.lib.pref.set_bool("proxyonforlist", nl.drew.fg.proxyonforlist);

            if (nl.drew.fg.lib.pref.get_bool("updatetab", false))
                nl.drew.fg.lib.pref.set_string("updatetabs", "all");

        }
        return true;
    };
    interf.hideip = function (id) {
        //
        nl.drew.fg.lib.pref.set_string("updatetabs", "");
        if (id > 0) {
            //
            var i = nl.drew.fg.lib.isIdInList(id);
            if (i == -1) {
                nl.drew.fg.mutexHostList.done()
                return false;
            }


            nl.drew.fg.lastLoadConfig = Date.now() + nl.drew.fg.config.updateConfigTimeWait;
            nl.drew.fg.lib.pref.set_string("fl", "");

            nl.drew.fg.lib.ishideinvert(i);

            //nl.drew.fg.lib.pref.set_string("fl", JSON.stringify({id: id, t: 'hideip', bid: nl.drew.fg.bid, val: nl.drew.fg.hostList[i].fl, co: nl.drew.fg.hostList[i].co}));

            nl.drew.fg.lib.updateTabs("url", nl.drew.fg.hostList[i].H);

            if (!nl.drew.fg.hostList[i].nodel) {
                //
                nl.drew.fg.lib.saveList(function () {
                    //
                    nl.drew.fg.lib.setFl(id, false, "hideip");
                });
            } else {
                //
                nl.drew.fg.mutexHostList.done();
            }

            return true;
        }

        nl.drew.fg.hideall = !nl.drew.fg.hideall;
        nl.drew.fg.lib.pref.set_bool("hideall", nl.drew.fg.hideall);

        if (nl.drew.fg.lib.pref.get_bool("updatetab", false))
            nl.drew.fg.lib.pref.set_string("updatetabs", "all");
        return true;
    };
    interf.spdy = function () {
        //
        nl.drew.fg.lib.pref.set_string("updatetabs", "");
        nl.drew.fg.spdyall = nl.drew.fg.lib.pref.get_bool('spdyall', false);
        nl.drew.fg.spdyall = !nl.drew.fg.spdyall;
        nl.drew.fg.lib.pref.set_bool("spdyall", nl.drew.fg.spdyall);
        if (nl.drew.fg.lib.pref.get_bool("updatetab", false))
            nl.drew.fg.lib.pref.set_string("updatetabs", "all");
    };

    interf.spdysiteoff = function (id) {

        nl.drew.fg.lib.pref.set_string("updatetabs", "");
        if (id > 0) {
            var i = nl.drew.fg.lib.isIdInList(id);
            if (i == -1) {
                return false;
            }

            nl.drew.fg.lastLoadConfig = Date.now() + nl.drew.fg.config.updateConfigTimeWait;
            nl.drew.fg.lib.pref.set_string("fl", "");

            nl.drew.fg.lib.isspdyoffinvert(i);
            //nl.drew.fg.lib.pref.set_string("ssoffsite", JSON.stringify({id: id, val: nl.drew.fg.lib.isspdyoff(i)}));
            nl.drew.fg.lib.pref.set_string("fl", JSON.stringify({id: id, t: 'spdy', bid: nl.drew.fg.bid, val: nl.drew.fg.hostList[i].fl, co: nl.drew.fg.hostList[i].co }));

            nl.drew.fg.lib.updateTabs("url", nl.drew.fg.hostList[i].H);

            if (!nl.drew.fg.hostList[i].nodel) {
                //
                nl.drew.fg.lib.saveList(function () {
                    nl.drew.fg.lib.setFl(id, false, "spdysiteoff");
                    //nl.drew.fg.lib.pref.set_string("updatetabs", nl.drew.fg.hostList[i].H);
                });
            } else {
                //
                nl.drew.fg.mutexHostList.done();
            }
            return true;
        }

    }
    interf.proxyonforall = function () {
        //
        nl.drew.fg.lib.pref.set_string("updatetabs", "");

        nl.drew.fg.proxyonforall = nl.drew.fg.lib.pref.get_bool('proxyonforall', false);
        nl.drew.fg.proxyonforall = !nl.drew.fg.proxyonforall;
        nl.drew.fg.lib.pref.set_bool("proxyonforall", nl.drew.fg.proxyonforall);
        if (nl.drew.fg.lib.pref.get_bool("updatetab", false))
            nl.drew.fg.lib.pref.set_string("updatetabs", "all");
    };

    interf.Off = function (noSave) {
        nl.drew.fg.on = !nl.drew.fg.on
        nl.drew.fg.interf.icoUpdate();
        if (nl.drew.fg.on) {
            if (!nl.drew.fg.authHeader || nl.drew.fg.authHeaderEnd < nl.drew.fg.lib.time()) {

                nl.drew.fg.main.setFilters();
            } else {

                nl.drew.fg.proxy.connect();
                nl.drew.fg.proxy.setMainProxys();
                nl.drew.fg.main.setFilters2();
            }
        } else {
            nl.drew.fg.main.unsetFilters();

            nl.drew.fg.lastLoadConfig = 0;
            nl.drew.fg.serial = 0;
            nl.drew.fg.md5 = "";
        }
        if (!noSave)
            nl.drew.fg.lib.pref.set_bool("on", nl.drew.fg.on);
        nl.drew.fg.interf.icoUpdate();
    }


    interf.contryCh = function (co) {
        nl.drew.fg.lib.pref.set_string('chcontry', "");
        nl.drew.fg.lib.pref.set_string('chcontry', co);
    }

    interf.contryChAct = function (co) {
        var isNew = false;
        var newCo;

        if (co == nl.drew.fg.contryCh) {
            newCo = "";
        } else {
            newCo = co;
            isNew = true;
        }

        nl.drew.fg.contryCh = newCo;
        if (isNew) {
            //
        }
    };


    interf.contrySiteCh = function (co, id) {

        if (id < 1 || id == null) {
            return
        }

        var i = nl.drew.fg.lib.isIdInList(id);
        if (i == -1) {
            return false;
        }

        nl.drew.fg.lastLoadConfig = Date.now() + nl.drew.fg.config.updateConfigTimeWait;
        nl.drew.fg.lib.pref.set_string('fl', "");
        var oldCo = nl.drew.fg.hostList[i].co;

        if (nl.drew.fg.hostList[i].co == co) {
            nl.drew.fg.hostList[i].co = "";
        } else {
            nl.drew.fg.hostList[i].co = co;
        }

        //nl.drew.fg.lib.pref.set_string('contrySite', JSON.stringify({id: id, val: nl.drew.fg.hostList[i].co}));
        nl.drew.fg.lib.pref.set_string("fl", JSON.stringify({id: id, t: 'co', bid: nl.drew.fg.bid, val: nl.drew.fg.hostList[i].fl, co: nl.drew.fg.hostList[i].co}));

        nl.drew.fg.lib.updateTabs("url", nl.drew.fg.hostList[i].H);

        if (!nl.drew.fg.hostList[i].nodel) {
            //
            nl.drew.fg.lib.saveList(function () {
                //
                nl.drew.fg.lib.setFl(id, false, "setco", oldCo);
                //nl.drew.fg.lib.updateTabs("url", nl.drew.fg.hostList[i].H);
            });
        } else {
            //
            nl.drew.fg.mutexHostList.done();
        }
    };

    interf.chIp = function (co) {
        nl.drew.fg.lib.pref.set_string('chip', "");
        nl.drew.fg.lib.pref.set_string('chip', co);
    };
    interf.chIpAct = function (co) {
        var proxyMainIndLen;
        nl.drew.fg.lib.pref.set_string("updatetabs", "");
        //nl.drew.fg.lib.dumpError(JSON.stringify(nl.drew.fg.proxyMainInd));
        //nl.drew.fg.lib.dumpError(JSON.stringify(nl.drew.fg.proxyMainInd[co]));
        if (typeof(nl.drew.fg.proxyMainInd[co]) != "undefined") {
            proxyMainIndLen = nl.drew.fg.proxyMain[co].length;
            if (proxyMainIndLen > 0) {
                nl.drew.fg.proxyMainInd[co]++;
                if (nl.drew.fg.proxyMainInd[co] >= proxyMainIndLen) {
                    nl.drew.fg.proxyMainInd[co] = 0;
                }
                //alert(nl.drew.fg.proxyMainInd[co]);
                if (nl.drew.fg.lib.pref.get_bool("updatetab", false))
                    nl.drew.fg.lib.pref.set_string("updatetabs", "all");
            }
        }
    };

    interf.icoUpdate = function (url) {

        var statusBarIco = document.getElementById("frigate2StatusBarIcon");

        if (statusBarIco == null)
            return false;

        if (Object.keys(nl.drew.fg.proxyArr).length < 1) {
            statusBarIco.setAttribute("value", "e");
            return;
        }
        if (nl.drew.fg.on) {
            //

            if (!url) {
                var gBrowser = window.getBrowser();
                url = gBrowser.currentURI.spec
            }

            //=====================
            //nl.drew.fg.lib.dumpError("urllll=" + url);
            //=====================
            var isInList = null;

            var info = nl.drew.fg.lib.schemeHost(url);

            if (info != null) {
                isInList = nl.drew.fg.lib.isUriInAnyList(url, info, nl.drew.fg.hostList);
                if (isInList != null && nl.drew.fg.hostList[isInList.i].tmpdel) {
                    isInList = null;
                }
            }
            var style = "inactive";
            //nl.drew.fg.lib.dumpError(JSON.stringify(nl.drew.fg.hostList[isInList.i]));

            nl.drew.fg.proxyonforlist = nl.drew.fg.lib.pref.get_bool('proxyonforlist', false);
            nl.drew.fg.spdyall = nl.drew.fg.lib.pref.get_bool('spdyall', false);
            nl.drew.fg.proxyonforall = nl.drew.fg.lib.pref.get_bool('proxyonforall', false);

            if (isInList != null || nl.drew.fg.proxyonforall) {
//
                if (nl.drew.fg.proxyonforall || (isInList != null && (nl.drew.fg.proxyonforlist || nl.drew.fg.hostList[isInList.i].proxy))) {
//
                    if (nl.drew.fg.userproxy) {
                        style = "up";
                    } else {
                        if (nl.drew.fg.hideall || (isInList != null && (nl.drew.fg.hideonlist || nl.drew.fg.lib.ishide(isInList.i)))) {
                            //nl.drew.fg.lib.dumpError(nl.drew.fg.hostList[isInList.i].fl + "!=" + nl.drew.fg.lib.ishide(isInList.i) + "==" + isInList.i + "==" + nl.drew.fg.hostList[isInList.i].id);
                            style = "pan";
                        } else {
                            style = "p";
                        }
                        if (nl.drew.fg.spdyall) {
                            if (isInList == null || !nl.drew.fg.lib.isspdyoff(isInList.i)) {
                                style = style + "spdy";
                            }
                        }
                    }
                } else {
//
                    if (nl.drew.fg.hideonlist || (isInList != null && nl.drew.fg.lib.ishide(isInList.i))) {
                        style = "lan";
                    } else {
                        style = "l";
                    }
                }

            } else {
//
                if (nl.drew.fg.hideonlist) {
                    style = "activean";
                } else {
                    style = "active";
                }
            }
        } else {
//
            style = "inactive";
        }

        statusBarIco.setAttribute("value", style);

        return true;
    };


    return interf;
}()