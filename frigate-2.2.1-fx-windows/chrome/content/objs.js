/*
 * Drew (C)2013-2014
 * https://fri-gate.org
 */

nl.drew.fg.ActTab = {
    onTabChange: null,
    init: function (onTabChangeHandler) {
        this.onTabChange = onTabChangeHandler;
        var gBrowser = window.getBrowser();
        gBrowser.addProgressListener(this);
    },
    uninit: function () {
        var gBrowser = window.getBrowser();
        gBrowser.removeProgressListener(this);
    },
    // nsIWebProgressListener
    QueryInterface: XPCOMUtils.generateQI(["nsIWebProgressListener", "nsISupportsWeakReference"]),
    onLocationChange: function (aProgress, aRequest, aURI, aStateFlags) {
        if (aRequest == null) {
            var gBrowser = window.getBrowser();
            if (nl.drew.fg.lib.f.isScheme(aURI.scheme)) {
                this.onTabChange(gBrowser, aRequest, aURI.asciiSpec);
            } else {
                nl.drew.fg.interf.icoUpdate(aURI.asciiSpec);
            }
        }
    },
    onStateChange: function (aWebProgress, aRequest, aStateFlags, aStatus) {
        //
    },
    onProgressChange: function () {
    },
    onStatusChange: function () {
    },
    onSecurityChange: function () {
    }
};

nl.drew.fg.TabList = {
    tabUrl: [],
    onTabChange: null,
    init: function (onTabChangeHandler) {
        this.onTabChange = onTabChangeHandler;
        var gBrowser = window.getBrowser();
        gBrowser.addTabsProgressListener(this);
    },
    uninit: function () {
        var gBrowser = window.getBrowser();
        gBrowser.removeTabsProgressListener(this);
    },
    // nsIWebProgressListener
    QueryInterface: XPCOMUtils.generateQI(["nsIWebProgressListener", "nsISupportsWeakReference"]),
    onLocationChange: function (aBrowser, aWebProgress, aRequest, aLocation, aFlags) {
        var gBrowser = window.getBrowser();
        var tabId = gBrowser.getBrowserIndexForDocument(aBrowser.contentDocument);
        if (typeof this.tabUrl[tabId] != "undefined") {
            if (this.tabUrl[tabId] != aLocation.spec) {
                this.onTabChange.call(nl.drew.fg, aBrowser, aRequest, aLocation.spec, this.tabUrl[tabId]);
                this.tabUrl[tabId] = aLocation.spec
            }
        }
    },
    onStateChange: function (aBrowser, aWebProgress, aRequest, aStateFlags, aStatus) {
        var gBrowser = window.getBrowser();
        var tabId = gBrowser.getBrowserIndexForDocument(aBrowser.contentDocument);

        if (aRequest != null) {
            if ((aStateFlags & Components.interfaces.nsIWebProgressListener.STATE_START)) {
                this.tabUrl[tabId] = aRequest.name;
                this.onTabChange.call(nl.drew.fg, aBrowser, aRequest, aRequest.name, null);
                return
            }

            if ((aStateFlags & Components.interfaces.nsIWebProgressListener.STATE_STOP)) {
                this.tabUrl.splice(tabId, 1);
                nl.drew.fg.interf.icoUpdate();
            }
        }

    },
    onProgressChange: function () {
    },
    onStatusChange: function () {
    },
    onSecurityChange: function () {
    }
};