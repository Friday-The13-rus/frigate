/*
 * Drew (C)2013-2014
 * https://fri-gate.org
 */

nl.drew.fg.mutex = function () {
    var mutex = {
        isRunning: 0,
        queue: [],
        queueTimer: null,
        id: ""
    };

    mutex.done = function () {
        this.isRunning--;
        if (this.id)
            nl.drew.fg.lib.dumpError("===========done=" + this.id);
        this.call();
    }
    mutex.call = function () {
        if (this.queue.length > 0) {
            if (this.id)
                nl.drew.fg.lib.dumpError("===========call=" + this.id);
            this.queue.shift().call();
        } else {
            this.isRunning = 0;
            if (this.queueTimer)
                clearTimeout(this.queueTimer);
        }
    }
    mutex.run = function (method) {
        var thiss = this;
        if (method) {
            thiss.isRunning++;
            thiss.queue.push(method);
            if (thiss.id)
                nl.drew.fg.lib.dumpError("===========push=" + thiss.id);
        }

        if (thiss.isRunning < 2) {
            thiss.call()
        } else {
            if (thiss.queueTimer)
                clearTimeout(thiss.queueTimer);
            thiss.queueTimer = setTimeout(function(){thiss.run()}, 1000);
            if (thiss.id)
                nl.drew.fg.lib.dumpError("===========setTimeout=" + thiss.id + " = " + thiss.isRunning);
        }
    }

    return mutex;
}
;

nl.drew.fg.mutexHostList = nl.drew.fg.mutex();
//nl.drew.fg.mutexHostList.id = "host";