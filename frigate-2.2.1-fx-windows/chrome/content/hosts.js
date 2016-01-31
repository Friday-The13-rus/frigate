/*
 * Drew (C)2013-2014
 * https://fri-gate.org
 */

nl.drew.fg.hosts = function () {
    var hosts = {};

    var noadd = nl.drew.fg.lib.f.getLStr("noadd");
    var nodel = nl.drew.fg.lib.f.getLStr("nodel");
    var plwait = nl.drew.fg.lib.f.getLStr("plwait");

    hosts.addSiteLocalSave = function (addHost) {

    }

    hosts.delSiteSave = function (setObj) {

        nl.drew.fg.lib.ReqJson(
            nl.drew.fg.config.host + "dh",
            10000,
            function (response) {
                if (nl.drew.fg.lib.newSerial(response))
                    nl.drew.fg.toserver.delFromArrToServer(setObj);
            },
            function () {
            },
            function () {
            },
            "POST",
            "id=" + encodeURIComponent(nl.drew.fg.id) + "&pas=" + encodeURIComponent(nl.drew.fg.pas) + "&host=" + setObj.id + "&r=" + Math.random()
        );
    }


    hosts.delSite = function (isSave, id) {
        if (id < 0) {
            nl.drew.fg.mutexHostList.done();
            return
        }
        var i = nl.drew.fg.lib.isIdInList(id);
        if (i == -1) {
            //
            nl.drew.fg.mutexHostList.done();
            return false;
        }

        var host = nl.drew.fg.hostList[i].H;

        if (isSave) {
            //
            nl.drew.fg.lib.pref.set_int("delhost1", -1);
            var setObj = {act: 'delsite', id: id, val: host};
            nl.drew.fg.hostList.splice(i, 1);
            nl.drew.fg.lib.updateTabs("url", host);
            nl.drew.fg.lib.pref.set_int("delhost1", id);


            nl.drew.fg.toserver.delFromArrToServer(setObj);
            nl.drew.fg.toserver.addToArrToServer(setObj);

            nl.drew.fg.lib.saveList(
                function () {
                    hosts.delSiteSave(setObj);
                }
            );
        } else {
            nl.drew.fg.lib.pref.set_int("deltmp", -1);
            nl.drew.fg.hostList[i].tmpdel = true
            nl.drew.fg.lib.pref.set_int("deltmp", id);
            //nl.drew.fg.lib.pref.set_string("updatetabs", host);
        }
        nl.drew.fg.mutexHostList.done();

        //nl.drew.fg.notifi.notificationShow(nodel + " " + addhost + ". " + plwait + " ");
    }
    hosts.addSite3 = function (host, hostUpd, hostTo) {
        host.toLowerCase();

        if (!hostUpd) {
            hostUpd = host;
        }

        var addHost = {
            id: Number.MAX_VALUE - nl.drew.fg.tmpListIndDelta,
            host: "*." + host,
            fl: 2,
            proxy: true,
            type: 2,
            nodel: true,
            hostUpd: hostUpd,
            hostTo: hostTo
        };

        nl.drew.fg.tmpListIndDelta++;

        nl.drew.fg.lib.pref.set_string("addhost1", "");
        nl.drew.fg.lib.pref.set_string("addhost1", JSON.stringify(addHost));
    }
    hosts.addSite2 = function (id) {
        //
        if (id < 1) {
            nl.drew.fg.mutexHostList.done();
            return
        }
        var i = nl.drew.fg.lib.isIdInList(id);
        if (i == -1) {
            //
            nl.drew.fg.mutexHostList.done();
            return false;
        }

        nl.drew.fg.hostList[i].tmpdel = false;
        nl.drew.fg.lib.pref.set_int("addtmp", -1);
        nl.drew.fg.lib.pref.set_int("addtmp", id);
        nl.drew.fg.mutexHostList.done();
    }

    hosts.addSite = function (isSave, host, hostUpd, hostTo) {
        //
        var addhost
        host.toLowerCase();
        nl.drew.fg.lib.pref.set_string("addhost1", "");
        //nl.drew.fg.lib.pref.set_string("updatetabs", "");
        addhost = host;

        var notAdd = function () {
            nl.drew.fg.notifi.notificationShow([" " + nl.drew.fg.lib.f.getLStr("noadd")],
                {l: nl.drew.fg.lib.f.getLStr("addsiteproxy"), act: function () {
                    nl.drew.fg.hosts.addSite3(addhost);
                }}
            );
        };

        nl.drew.fg.lib.ReqJson(
            nl.drew.fg.config.host + "sh",
            10000,
            function (response) {
                //=====================
                //nl.drew.fg.lib.dumpError(response);
                //=====================
                var responseJSON = {};
                try {
                    responseJSON = JSON.parse(response)
                } catch (e) {
                }

                if (typeof responseJSON.Id != "undefined") {

                    if (!hostUpd) {
                        hostUpd = responseJSON.H;
                    }
                    if (!hostTo) {
                        hostTo = null;
                    }

                    var addHost = {
                        id: responseJSON.Id,
                        host: responseJSON.H,
                        fl: responseJSON.F,
                        proxy: (responseJSON.F & (1 << 1)) != 0,
                        type: responseJSON.T,
                        hostUpd: hostUpd,
                        hostTo: hostTo
                    };
                    nl.drew.fg.lib.addHostList(addHost);
                    nl.drew.fg.lib.pref.set_string("addhost1", JSON.stringify(addHost));

                    nl.drew.fg.lib.saveList(
                        function () {
                            if (typeof responseJSON.S != "undefined") {
                                nl.drew.fg.serial = responseJSON.S
                                nl.drew.fg.lib.pref.set_int("serial", nl.drew.fg.serial);
                                nl.drew.fg.lastLoadConfig = 0;
                            }
                            nl.drew.fg.lib.updateTabs("url", hostUpd, hostTo);
                        }
                    );

                } else {
                    notAdd()
                }
            },
            notAdd,
            notAdd,
            "POST",
            "id=" + encodeURIComponent(nl.drew.fg.id) + "&pas=" + encodeURIComponent(nl.drew.fg.pas) + "&host=" + addhost + "&save=" + isSave + "&r=" + Math.random()
        );

    };

    return hosts;
}();