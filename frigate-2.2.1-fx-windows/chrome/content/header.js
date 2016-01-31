/*
 * Drew (C)2013-2014
 * https://fri-gate.org
 */

nl.drew.fg.header = function () {

    var header = {
        QueryInterface: function (aIID) {
            if (aIID.equals(Components.interfaces.nsISupports) ||
                aIID.equals(Components.interfaces.nsIObserver))
                return this;
            throw Components.results.NS_NOINTERFACE;
        }
    };

    header.observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);


    header.observe = function (subject, topic, data) {

        var httpChannel;

        if (topic == "http-on-examine-response") {
            httpChannel = subject.QueryInterface(Components.interfaces.nsIHttpChannel);

            var responseStatus = httpChannel.responseStatus;

            if (responseStatus == 407) {
                //nl.drew.fg.lib.dumpError("responseStatus=" + responseStatus);
                nl.drew.fg.md5 = "";
                nl.drew.fg.loadConfigOk = false;
                nl.drew.fg.lastLoadConfig = 0;
                nl.drew.fg.mutexHostList.run(function () {
                    nl.drew.fg.conf.loadConfigFromServer(function () {
                        //

                    });
                });
                nl.drew.fg.proxy.disconnect();
                nl.drew.fg.proxy.connect();
            }
        } else if (topic == "http-on-modify-request") {

            httpChannel = subject.QueryInterface(Components.interfaces.nsIHttpChannel);

            //httpChannel.setRequestHeader("User-Agent", httpChannel.getRequestHeader('User-Agent')+" "+"FriGate/2.2.0", false);

            httpChannel.setRequestHeader("X-Compress", 1, false);

            if (nl.drew.fg.userproxy) {
                return;
            }


            var header = nl.drew.fg.authHeader[0];

            var requestURL = subject.URI.spec;

            var requestURLInfo = nl.drew.fg.lib.schemeHost(requestURL);

            if (!requestURLInfo) {
                return;
            }

            //nl.drew.fg.mutexHostList.run(function () {
            var isInList = nl.drew.fg.lib.isUriInAnyList(requestURL, requestURLInfo, nl.drew.fg.hostList);


            if (isInList != null && !nl.drew.fg.hostList[isInList.i].tmpdel) {

                if (nl.drew.fg.hideall || nl.drew.fg.lib.ishide(isInList.i)) {
                    if (nl.drew.fg.spdyall && !nl.drew.fg.lib.isspdyoff(isInList.i)) {
                        header = nl.drew.fg.authHeader[1]; // hide spdy
                    } else {
                        header = nl.drew.fg.authHeader[2]; // hide
                    }
                } else {
                    if (nl.drew.fg.spdyall && !nl.drew.fg.lib.isspdyoff(isInList.i)) {
                        header = nl.drew.fg.authHeader[3]; // spdy
                    }
                }
            } else {
                if (nl.drew.fg.hideall) {
                    if (nl.drew.fg.spdyall) {
                        header = nl.drew.fg.authHeader[1]; // hide spdy
                    } else {
                        header = nl.drew.fg.authHeader[2]; // hide
                    }
                } else {
                    if (nl.drew.fg.spdyall) {
                        header = nl.drew.fg.authHeader[3]; // spdy
                    }
                }
            }
            //nl.drew.fg.mutexHostList.done();
            //});
            //nl.drew.fg.lib.dumpError(header);
            httpChannel.setRequestHeader("Proxy-Authorization", header, false);
        }
    };


    header.register = function () {
        try {
            this.observerService.addObserver(this, "http-on-modify-request", false);
        }
        catch (e) {
        }
        try {
            this.observerService.addObserver(this, "http-on-examine-response", false);
        }
        catch (e) {
        }
    };


    header.unregister = function () {
        try {
            this.observerService.removeObserver(this, "http-on-modify-request");
        }
        catch (e) {
        }
        try {
            this.observerService.removeObserver(this, "http-on-examine-response");
        }
        catch (e) {
        }
    };

    return header;
}();