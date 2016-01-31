/*
 * Drew (C)2013-2014
 * https://fri-gate.org
 */
nl.drew.fg.uninst = {
    _id: "e67f8350-7edf-11e3-baa7-0800200c9a66@fri-gate.org",
    _uninstall: false,

    onUninstalling: function (addon) {
        if (addon.id == this._id) {
            //nl.drew.fg.lib.dumpError("onUninstalling");
            this._uninstall = true;
        }
    },
    onOperationCancelled: function (addon) {
        if (addon.id == this._id) {
            //nl.drew.fg.lib.dumpError("onOperationCancelled");
            this._uninstall = (addon.pendingOperations & AddonManager.PENDING_UNINSTALL) != 0;
        }
    },

    observe: function (subject, topic, data) {
        if (topic == "quit-application-granted") {
            if (this._uninstall) {
                //
//                nl.drew.fg.lib.pref.set_string("uid", "");
//                nl.drew.fg.lib.pref.set_string("pas", "");
//                nl.drew.fg.lib.pref.set_bool('debug', false);
//                nl.drew.fg.lib.pref.set_bool('is_first_run', true);
//                nl.drew.fg.lib.pref.set_string("authHeader", "");
//                nl.drew.fg.lib.pref.set_int("authHeaderEnd", 0);
//                nl.drew.fg.lib.pref.set_bool('on', true);
//                nl.drew.fg.lib.pref.set_bool('hideico', false);
//                nl.drew.fg.lib.pref.set_bool('updatetab', true);
//                nl.drew.fg.lib.pref.set_bool('updatemanytab', true);
//                nl.drew.fg.lib.pref.set_bool('cluidbutton', false);
//                nl.drew.fg.lib.pref.set_bool('proxyonforlist', false);
//                nl.drew.fg.lib.pref.set_bool('proxyonforall', false);
//                nl.drew.fg.lib.pref.set_bool('spdyall', false);
//                nl.drew.fg.lib.pref.set_bool('hideall', false);
//
//                nl.drew.fg.lib.pref.set_string("hidesite", "");
//                nl.drew.fg.lib.pref.set_string("userproxy", "");
//                nl.drew.fg.lib.pref.set_int("resptime", 0);
//
//                nl.drew.fg.lib.pref.set_string("addhost1", "");
//                nl.drew.fg.lib.pref.set_int("delhost1", -1);
//                nl.drew.fg.lib.pref.set_int("deltmp", -1);
//                nl.drew.fg.lib.pref.set_string("ssoffadd", "");
//                nl.drew.fg.lib.pref.set_string("ssoffdel", "");
//                nl.drew.fg.lib.pref.set_int("serial", 0);
//                nl.drew.fg.lib.pref.set_string("updatetabs", "");
//                nl.drew.fg.lib.pref.set_string("chip", "");
//                nl.drew.fg.lib.pref.set_string("contrySite", "");
//                nl.drew.fg.lib.pref.set_string("sendto", "");
//                nl.drew.fg.lib.pref.set_string("lastSendTo", "0");

                nl.drew.fg.nsPreferences.del();

                nl.drew.fg.stor.clear(function(){
                    //nl.drew.fg.lib.dumpError("cl");
                    nl.drew.fg.stor.del();
                    //nl.drew.fg.lib.dumpError("del");
                });

//                nl.drew.fg.stor.removeItem("list", function () {
//                });
//                nl.drew.fg.stor.removeItem("toserver", function () {
//                });
//                nl.drew.fg.stor.removeItem("conf", function () {
//                });
//                nl.drew.fg.stor.removeItem("proxy", function () {
//                });
//                nl.drew.fg.stor.removeItem("response", function () {
//                });
                //nl.drew.fg.stor.removeItem("list", function () {});
                //nl.drew.fg.stor.removeItem("list", function () {});
                //nl.drew.fg.stor.removeItem("list", function () {});

            }
            this.unregister();
        }
    },

    register: function () {
        //nl.drew.fg.lib.dumpError("===");
        var observerService =
            Components.classes["@mozilla.org/observer-service;1"].
                getService(Components.interfaces.nsIObserverService);

        try {
            Components.utils.import("resource://gre/modules/AddonManager.jsm");
            AddonManager.addAddonListener(this);
        } catch (ex) {
        }
        try {
            observerService.addObserver(this, "quit-application-granted", false);
        } catch (ex) {
        }
    },

    unregister: function () {
        var observerService =
            Components.classes["@mozilla.org/observer-service;1"].
                getService(Components.interfaces.nsIObserverService);
        try {
            Components.utils.import("resource://gre/modules/AddonManager.jsm");
            AddonManager.removeAddonListener(this);
        } catch (ex) {
        }
        try {
            observerService.removeObserver(this, "quit-application-granted");
        } catch (ex) {
        }
    }
};
