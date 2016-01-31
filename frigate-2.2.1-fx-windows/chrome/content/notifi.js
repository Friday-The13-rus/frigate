/*
 * Drew (C)2013-2014
 * https://fri-gate.org
 */

nl.drew.fg.notifi = function () {
    var notifi = {};
    var closebut = nl.drew.fg.lib.f.getLStr("close");

    getNotificationBox = function () {

        var gb = getBrowser();
        if (!(gb && gb.getNotificationBox))
            return null;

        var browser = gb.selectedBrowser;

        var nb = gb.getNotificationBox(browser);

        return nb;
    };
    notifi.onCloseNotification = function () {

        var element = document.getElementById("frigate2_notif");

        if (!element) return;

        while (element.hasChildNodes()) {
            element.removeChild(element.lastChild);
        }
        element.parentNode.removeChild(element);

        //nl.drew.fg.interf.notificationShow("222",{l:"label1",c:""},{l:"label22",c:""});
    };
    notifi.notificationShow = function (labels, b1, b2) {

        //nl.drew.fg.lib.dumpError("notificationShow");

        var container = document.getElementById("frigate2_notif");

        if (!container) {
            var nb = getNotificationBox();
            if (!nb)
                return false;

            container = document.createElement('bbox');
            container.setAttribute("class", "notif");
            container.setAttribute("id", "frigate2_notif");
            nb.appendChild(container);
        }

        var labelsLen = labels.length;
        var lb;
        if (labelsLen > 0)
            for (var i = 0; i < labelsLen; i++) {
                lb = document.createElement('description');
                lb.setAttribute('value', " " + labels[i]);
                if (i % 2) {
                    lb.setAttribute('style', "font-weight:bold");
                }
                container.appendChild(lb);
            }
        else
            return;

        if (b1) {
            var but1 = document.createElement('button');
            but1.setAttribute('label', b1.l);

            but1.addEventListener('command', function(){
                notifi.onCloseNotification();
                b1.act()
            });

            container.appendChild(but1);
        }

        if (b2) {
            var but2 = document.createElement('button');
            but2.setAttribute('label', b2.l);

            but2.addEventListener('command', function(){
                notifi.onCloseNotification();
                b2.act()
            });

            container.appendChild(but2);
        }

        var but3 = document.createElement('button');
        but3.setAttribute('label', closebut);

        but3.addEventListener('command', notifi.onCloseNotification);

        //but3.setAttribute('oncommand', "nl.drew.fg.interf.onCloseNotification();");

        container.appendChild(but3);

        return true;
    };

    return notifi;
}();