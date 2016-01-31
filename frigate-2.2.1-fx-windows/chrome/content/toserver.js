/*
 * Drew (C)2013-2014
 * https://fri-gate.org
 */

nl.drew.fg.toserver = function () {
    var toserver = {};
    var mutex = nl.drew.fg.mutex();
    //mutex.id = "tosever";

    toserver.addToArrToServer = function (val) {
        mutex.run(function () {
            nl.drew.fg.stor.getItem("toserver", function (toserver) {
                if (!toserver) {
                    toserver = [];
                }
                toserver.push(val);
                nl.drew.fg.stor.setItem("toserver", toserver, function () {
                    //nl.drew.fg.lib.dumpError("add=======" + JSON.stringify(toserver));
                    mutex.done();
                });
            });
        });
    };
    toserver.delFromArrToServer = function (val) {
        mutex.run(function () {
            nl.drew.fg.stor.getItem("toserver", function (toserver) {
                if (toserver) {
                    var toserverLen = toserver.length;
                    var newtoserver = [];

                    if (toserverLen > 0) {
                        //
                        for (var i = 0; i < toserverLen; i++) {
                            if (toserver[i].act != val.act || toserver[i].id != val.id) {
                                newtoserver.push(toserver[i]);
                            }
                        }
                    }
                }
                nl.drew.fg.stor.setItem("toserver", newtoserver, function () {
                    //nl.drew.fg.lib.dumpError("del=======" + JSON.stringify(newtoserver));
                    mutex.done();
                });
            });
        });
    };
    toserver.delFromArrToServerById = function (id) {
        mutex.run(function () {
            nl.drew.fg.stor.getItem("toserver", function (toserver) {
                if (toserver) {
                    var toserverLen = toserver.length;
                    var newtoserver = [];

                    if (toserverLen > 0) {
                        //
                        for (var i = 0; i < toserverLen; i++) {
                            if (toserver[i].id != id) {
                                newtoserver.push(toserver[i]);
                            }
                        }
                    }
                }
                nl.drew.fg.stor.setItem("toserver", newtoserver, function () {
                    //nl.drew.fg.lib.dumpError("delByid=======" + JSON.stringify(newtoserver));
                    mutex.done();
                });
            });
        });
    };

    return toserver;
}();