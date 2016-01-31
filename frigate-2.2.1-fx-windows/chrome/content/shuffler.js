/*
 * Drew (C)2013-2014
 * https://fri-gate.org
 */

nl.drew.fg.snuffler = function () {
    var snuffler = {};

    snuffler.clientInputStream     = Components.classes["@mozilla.org/binaryinputstream;1"].createInstance(Components.interfaces.nsIBinaryInputStream);
    snuffler.serverInputStream     = Components.classes["@mozilla.org/binaryinputstream;1"].createInstance(Components.interfaces.nsIBinaryInputStream);

    snuffler.clientOutputStream    = Components.classes["@mozilla.org/binaryoutputstream;1"].createInstance(Components.interfaces.nsIBinaryOutputStream);
    snuffler.serverOutputStream    = Components.classes["@mozilla.org/binaryoutputstream;1"].createInstance(Components.interfaces.nsIBinaryOutputStream);


    snuffler.dataShuffler = function(clientTransport, serverTransport) {
        this.rawClientOutputStream = clientTransport.openOutputStream(0,0,0);
        this.rawServerOutputStream = serverTransport.openOutputStream(0,0,0);

        this.rawClientInputStream  = clientTransport.openInputStream(0,0,0);
        this.rawServerInputStream  = serverTransport.openInputStream(0,0,0);

        this.clientInputStream.setInputStream(this.rawClientInputStream);
        this.serverInputStream.setInputStream(this.rawServerInputStream);

        this.clientOutputStream.setOutputStream(this.rawClientOutputStream);
        this.serverOutputStream.setOutputStream(this.rawServerOutputStream);
    }


    snuffler.onStartRequest = function(request, context){};

    snuffler.onStopRequest = function(request, context, status){
        this.serverInputStream.close();
        this.serverOutputStream.close();
        this.clientInputStream.close();
        this.clientOutputStream.close();
    };

    snuffler.onDataAvailable = function(request, context, inputStream, offset, count) {
        var data;
        if (inputStream == this.rawClientInputStream) {
            data = this.clientInputStream.readByteArray(count);
            this.serverOutputStream.writeByteArray(data, count);
        } else {
            data = this.serverInputStream.readByteArray(count);
            this.clientOutputStream.writeByteArray(data, count);
        }
    };

    snuffler.pumpData = function(inputStream) {
        var dataPump = Components.classes["@mozilla.org/network/input-stream-pump;1"].createInstance(Components.interfaces.nsIInputStreamPump);
        dataPump.init(inputStream, -1, -1, 0, 0, false);
        dataPump.asyncRead(this, null);
    }

    snuffler.shuffle = function() {
        this.pumpData(this.rawClientInputStream);
        this.pumpData(this.rawServerInputStream);
    };

    return snuffler;
}