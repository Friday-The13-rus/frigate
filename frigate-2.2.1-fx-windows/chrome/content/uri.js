/*
 * Drew (C)2013-2014
 * https://fri-gate.org
 */

nl.drew.fg.uri = function () {
    var uri = {};


    uri.testUriContinue = function (gBrowserIn, aRequest, url, info, isRedir) {

        //nl.drew.fg.lib.dumpError("======== CONT test=" + url + "==" + isRedir);

        var isInList = nl.drew.fg.lib.isUriInRedirList(url, info);

        if (isInList != null) {

            if (aRequest != null) {
                aRequest.cancel(1);
            }
            var newUrl = url.replace(nl.drew.fg.hostRedirList[isInList.i].H, nl.drew.fg.hostRedirList[isInList.i].T);
            gBrowserIn.loadURI(newUrl);
        }

        if (isRedir != null) {
            nl.drew.fg.lib.isUriInBlList(url, info, isRedir);
        }

        var now = Date.now();

        isInList = nl.drew.fg.lib.isUriInList(url, info);

        if (isInList == null) {
            //
            nl.drew.fg.interf.icoUpdate();
            //requestResume(aRequest);
            return;
        } else {
            //
            nl.drew.fg.interf.icoUpdate(url);
            var i = isInList.i;

            if (nl.drew.fg.hostList[i].tmpdel) {
                return;
            }
        }



        //nl.drew.fg.lib.dumpError("CONT nl.drew.fg.lib.proxyforever(i)=" + nl.drew.fg.lib.proxyforever(i));
        // if proxy ON
        if (nl.drew.fg.hostList[i].type == 37 || nl.drew.fg.lib.proxyforever(i)) {
            //
            nl.drew.fg.hostList[i].proxy = true;
            //requestResume(aRequest);
            //nl.drew.fg.interf.icoUpdate();
            return
        }

        var urlWithoutQuery = nl.drew.fg.lib.cutQuery(url);
        if (nl.drew.fg.lib.f.defTestFile(isInList.sheme, isInList.host) == urlWithoutQuery) {
            //
            //nl.drew.fg.lib.dumpError("no test URL");
            return
        }
        if (url.indexOf('?frigatetestquery&r') != -1) {
            //nl.drew.fg.lib.dumpError("no test URL");
            return;
        }
        if (nl.drew.fg.hostList[isInList.i].url != "" &&
            nl.drew.fg.hostList[isInList.i].url == urlWithoutQuery) {
            //nl.drew.fg.lib.dumpError("no test URL");
            return;
        }


        if (nl.drew.fg.hostList[i].timeCheck > now) {
            return
        }


        var processing = false;
        if (nl.drew.fg.hostList[i].processingFrom > now) {
            processing = true;
        } else {
            //
            if (!nl.drew.fg.hostList[i].proxy) {
                nl.drew.fg.hostList[i].proxyBl = true;
            }
            nl.drew.fg.hostList[i].processingFrom = now + nl.drew.fg.config.processingTimeWait;
        }

        //=====================
        //nl.drew.fg.lib.dumpError("======== test=" + url + "==" + nl.drew.fg.hostList[i].proxy);
        //=====================

        if (!nl.drew.fg.hostList[i].proxy) {
            //
            if (aRequest != null) {
                //
                aRequest.cancel(1);

                nl.drew.fg.hostList[i].reqArr.push([gBrowserIn, url]);
            }
            if (processing) {
                return
            }
        }


        //=====================
        //nl.drew.fg.lib.dumpError("(nl.drew.fg.hostList[i].type=" + nl.drew.fg.hostList[i].type);
        //=====================

        var proxyOn = function (index) {
            //=====================
            //nl.drew.fg.lib.dumpError("proxy ON=" + index);
            //=====================
            nl.drew.fg.hostList[index].proxy = true;
            nl.drew.fg.hostList[index].processingFrom = 0;
            nl.drew.fg.hostList[index].proxyBl = false;
            nl.drew.fg.hostList[index].timeCheck = now + nl.drew.fg.config.timeCheckTimewaitIfOn;
            //nl.drew.fg.lib.dumpError("proxy ON=" + nl.drew.fg.hostList[index].proxy + "=" + nl.drew.fg.hostList[index].reqArr);
            nl.drew.fg.interf.icoUpdate(isInList.sheme + isInList.host);
            nl.drew.fg.lib.unockReq(index)
            //requestResume(aRequest);
        }
        var proxyOff = function (index) {
            nl.drew.fg.hostList[index].processingFrom = 0;
            nl.drew.fg.hostList[index].proxyBl = false;
            nl.drew.fg.hostList[index].proxy = false;
            nl.drew.fg.hostList[index].timeCheck = now + nl.drew.fg.config.timeCheckTimewait;
            //nl.drew.fg.lib.dumpError("proxy OFF=" + nl.drew.fg.hostList[index].proxy + "==" + nl.drew.fg.hostList[index].reqArr.length);
            nl.drew.fg.interf.icoUpdate(isInList.sheme + isInList.host);
            nl.drew.fg.lib.unockReq(index);
            //requestResume(aRequest);
        }


        if (nl.drew.fg.hostList[i].type == 1) {
            nl.drew.fg.lib.testJsonFile(
                nl.drew.fg.lib.f.defTestFile(isInList.sheme, isInList.host), i, proxyOff, proxyOn);
        } else if (nl.drew.fg.hostList[i].type == 5) {
            nl.drew.fg.lib.testFile(i, proxyOn, proxyOff);
        } else if (nl.drew.fg.hostList[i].type == 7) {
            //nl.drew.fg.lib.dumpError("type3");
            nl.drew.fg.lib.testHost1(
                isInList.sheme + isInList.host + "/" + nl.drew.fg.lib.generatePW(),
                i,
                function (index, response) {
                    nl.drew.fg.lib.testHost2(
                        isInList.sheme + isInList.host + "/",
                        index,
                        response,
                        function (ind, resp1, resp2) {
                            //nl.drew.fg.lib.dumpError(ind);

                            //nl.drew.fg.lib.dumpError("response1=" + resp1.length);
                            //nl.drew.fg.lib.dumpError("response2=" + resp2.length);

                            if (resp1.length == resp2.length) {
                                proxyOn(ind)
                                return;
                            }

                            if (nl.drew.fg.lib.compare(resp1, resp2) < 20) {
                                proxyOn(ind)
                                return;
                            }
                            proxyOff(i);
                            return;
                        },
                        proxyOn,
                        proxyOff
                    );
                },
                proxyOn,
                proxyOff
            );
        }
    }


    uri.testUri = function (gBrowserIn, aRequest, url, isRedir) {

        if (!nl.drew.fg.on) {
            return
        }

        //nl.drew.fg.lib.dumpError("======== pre test=" + url + " isRedir=" + isRedir);

        nl.drew.fg.proxyonforlist = nl.drew.fg.lib.pref.get_bool('proxyonforlist', false);
        nl.drew.fg.proxyonforall = nl.drew.fg.lib.pref.get_bool('proxyonforall', false);

        if (nl.drew.fg.proxyonforlist || nl.drew.fg.proxyonforall) {
            nl.drew.fg.interf.icoUpdate();
            return
        }
        var info = nl.drew.fg.lib.schemeHost(url)
        //nl.drew.fg.lib.dumpError("info=" + info.cutsheme);
        if (info == null) {
            return
        }
        if (!nl.drew.fg.lib.f.isScheme(info.cutsheme)) {
            return
        }

        var now = Date.now();

//        if (aRequest != null) {
//            aRequest.suspend();
//        }

        var callback = function () {
            nl.drew.fg.uri.testUriContinue(gBrowserIn, aRequest, url, info, isRedir);
        };

        if (nl.drew.fg.lastLoadConfig < now) {
            //
            nl.drew.fg.loadConfigOk = false;
            nl.drew.fg.mutexHostList.run(function () {
                nl.drew.fg.conf.loadConfigFromServer(callback);
            });
        } else {
            callback();
        }
    }

    return uri;
}()