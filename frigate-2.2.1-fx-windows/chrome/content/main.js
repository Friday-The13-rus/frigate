/*
 * Drew (C)2013-2014
 * https://fri-gate.org
 */

//toJavaScriptConsole();

nl.drew.fg.main = function () {
    var main = {}

    main.noReady = function () {
        //=====================
        nl.drew.fg.lib.dumpError("no api");
        //=====================
    }

    //============================================
    main.setFilters = function () {
        if (nl.drew.fg.on) {
            nl.drew.fg.conf.preLoadConfigFromServer(
                function () {
                    //
                    nl.drew.fg.conf.preSendToServer();

                    nl.drew.fg.ActTab.init(nl.drew.fg.uri.testUri);
                    nl.drew.fg.TabList.init(nl.drew.fg.uri.testUri);
                    nl.drew.fg.header.register();

                    nl.drew.fg.proxy.filter.on();
                });
        }
        //nl.drew.fg.interf.icoUpdate();
    }
    main.setFilters2 = function () {

        if (nl.drew.fg.on) {
            //
            nl.drew.fg.conf.preSendToServer();
            nl.drew.fg.ActTab.init(nl.drew.fg.uri.testUri);
            nl.drew.fg.TabList.init(nl.drew.fg.uri.testUri);
            nl.drew.fg.header.register();
            nl.drew.fg.proxy.filter.on();

            nl.drew.fg.conf.preLoadConfigFromServer(function () {

            });
        }
        nl.drew.fg.interf.icoUpdate();
    }

    //============================================
    main.unsetFilters = function () {
        nl.drew.fg.conf.clearConfigTimer();

        if (nl.drew.fg.loadFirstConfigTimer) {
            clearTimeout(nl.drew.fg.loadFirstConfigTimer);
            nl.drew.fg.loadFirstConfigTimer = null;
        }
        nl.drew.fg.proxy.filter.off();
        nl.drew.fg.proxy.disconnect();
        nl.drew.fg.header.unregister();
        nl.drew.fg.ActTab.uninit();
        nl.drew.fg.TabList.uninit();
    }

    //============================================
    main.Start = function () {
        //
        //nl.drew.fg.notifi.notificationShow("222",{l:"label1",c:""},{l:"label22",c:""});
//        var mutex = nl.drew.fg.mutex();
//        mutex.id = "111";
//        var mutex3 = nl.drew.fg.mutex();
//
//        mutex.run(function () {
//            nl.drew.fg.lib.dumpError("s1");
//            setTimeout(function () {
//                nl.drew.fg.lib.dumpError("e1");
//                mutex.done();
//            }, 5000);
//        });
//
//        mutex.run(function () {
//            nl.drew.fg.lib.dumpError("s2");
//            setTimeout(function () {
//                nl.drew.fg.lib.dumpError("e2");
//                mutex.done();
//            }, 10000);
//        });
//        mutex.run(function () {
//            nl.drew.fg.lib.dumpError("s3");
//            setTimeout(function () {
//                nl.drew.fg.lib.dumpError("e3");
//                mutex.done();
//            }, 3000);
//        });
//        return;

        nl.drew.fg.conf.getApiUrl(
            function () {
                nl.drew.fg.bid = nl.drew.fg.lib.f.generateUUID();
                //nl.drew.fg.lib.dumpError(nl.drew.fg.bid);
                nl.drew.fg.conf.genUid(function () {
                        //
                        nl.drew.fg.conf.loadConfig();
                    }
                )
            }
        );

    }
    return main
}()


window.addEventListener("load", function load(event) {
    window.removeEventListener("load", load, false);
    setTimeout(nl.drew.fg.main.Start, 100);

    //nl.drew.fg.lib.pref.set_bool('debug', true);

    if (nl.drew.fg.lib.pref.get_bool('debug', false)) {
        try {
            toJavaScriptConsole();
        } catch (e) {
        }
    }

    nl.drew.fg.uninst.register();

}, false);
window.addEventListener("close", function load(event) {
    nl.drew.fg.main.unsetFilters();
    nl.drew.fg.pref.unregister();
}, false);