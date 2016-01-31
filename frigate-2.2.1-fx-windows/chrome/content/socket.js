/*
 * Drew (C)2013-2014
 * https://fri-gate.org
 */

nl.drew.fg.socket = function () {
    var socket = {};

    socket.serverSocket = Components.classes["@mozilla.org/network/server-socket;1"].createInstance(Components.interfaces.nsIServerSocket);
    socket.proxyHost = null;
    socket.proxyPort = null;

    //================================
    socket.shutdown = function () {
        this.serverSocket.close();
    };

    //================================
    socket.createServerSocket = function (host, port) {
        this.proxyHost = host;
        this.proxyPort = port;
        this.serverSocket.init(-1, true, -1);
        this.serverSocket.asyncListen(this);

    };

    //================================
    socket.proxyInfo = function (type, ip, port) {
        if (type && ip && port) {
            return nl.drew.fg.proxy.Service.newProxyInfo(type, ip, port, 3, 30, null);
        } else {
            return nl.drew.fg.proxy.Service.newProxyInfo("http", "localhost", this.serverSocket.port, 3, 30, null);
        }
    };

    //================================
    socket.connectToRemoteProxy = function () {
        //nl.drew.fg.lib.dumpError(this.proxyHost + ":" + this.proxyPort);
        var transportService = Components.classes["@mozilla.org/network/socket-transport-service;1"].getService(Components.interfaces.nsISocketTransportService);
        return transportService.createTransport(['ssl'], 1, this.proxyHost, this.proxyPort, null);
    };

    //================================
    socket.onSocketAccepted = function (serverSocket, clientTransport) {
        var serverTransport = this.connectToRemoteProxy();
        var dataShuffler = nl.drew.fg.snuffler();
        dataShuffler.dataShuffler(clientTransport, serverTransport);
        dataShuffler.shuffle();
    };

    //================================
    socket.onStopListening = function (serverSocket, status) {
        // dead
    };

    return socket
}