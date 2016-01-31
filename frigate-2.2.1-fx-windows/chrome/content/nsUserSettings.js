nl.drew.fg.nsPreferences = {
    get mPrefService() {
        var prefs
        try {
            prefs = Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Components.interfaces.nsIPrefBranch).getBranch("extensions.frigate2.");
        }
        catch (e) {
            prefs = Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Components.interfaces.nsIPrefService).getBranch("extensions.frigate2.");
        }
        return prefs;
    },

    del: function () {
        try {
            Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Components.interfaces.nsIPrefBranch).deleteBranch("extensions.frigate2.");
        }
        catch (e) {
        }
    },

    setBoolPref: function (aPrefName, aPrefValue) {
        try {
            this.mPrefService.setBoolPref(aPrefName, aPrefValue);
        }
        catch (e) {
        }
    },

    getBoolPref: function (aPrefName, aDefVal) {
        try {
            return this.mPrefService.getBoolPref(aPrefName);
        }
        catch (e) {
            return aDefVal != undefined ? aDefVal : null;
        }
        return null;        // quiet warnings
    },

    setUnicharPref: function (aPrefName, aPrefValue) {
        try {
            var str = Components.classes["@mozilla.org/supports-string;1"]
                .createInstance(Components.interfaces.nsISupportsString);
            str.data = aPrefValue;
            this.mPrefService.setComplexValue(aPrefName,
                Components.interfaces.nsISupportsString, str);
        }
        catch (e) {
        }
    },

    copyUnicharPref: function (aPrefName, aDefVal) {
        try {
            return this.mPrefService.getComplexValue(aPrefName,
                Components.interfaces.nsISupportsString).data;
        }
        catch (e) {
            return aDefVal != undefined ? aDefVal : null;
        }
        return null;        // quiet warnings
    },

    setIntPref: function (aPrefName, aPrefValue) {
        try {
            this.mPrefService.setIntPref(aPrefName, aPrefValue);
        }
        catch (e) {
        }
    },

    getIntPref: function (aPrefName, aDefVal) {
        try {
            return this.mPrefService.getIntPref(aPrefName);
        }
        catch (e) {
            return aDefVal != undefined ? aDefVal : null;
        }
        return null;        // quiet warnings
    },

    getLocalizedUnicharPref: function (aPrefName, aDefVal) {
        try {
            return this.mPrefService.getComplexValue(aPrefName,
                Components.interfaces.nsIPrefLocalizedString).data;
        }
        catch (e) {
            return aDefVal != undefined ? aDefVal : null;
        }
        return null;        // quiet warnings
    }
};

