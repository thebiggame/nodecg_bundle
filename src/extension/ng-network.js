'use strict';

module.exports = function (nodecg) {
    const netWANBwUp = nodecg.Replicant("network:wan:bandwidth:up", {
        defaultValue: -1,
        persistent: false
    });
    const netWANBwDown = nodecg.Replicant("network:wan:bandwidth:down", {
        defaultValue: -1,
        persistent: false
    });

    if (nodecg.bundleConfig.network.snmp.enabled) {
        var snmp = require ("net-snmp");

        var session = snmp.createSession (nodecg.bundleConfig.network.snmp.host, nodecg.bundleConfig.network.snmp.community);
    
        
        var oids = [];
        for (let [key, value] of Object.entries(nodecg.bundleConfig.network.snmp.oids)) {
            oids.push(value.toString());
        }

        // PFSense OIDs
        // var oids = ["1.3.6.1.2.1.2.2.1.10.29",
        //            "1.3.6.1.2.1.2.2.1.16.29"];
    
        //The results variable will be used to store the outputs from the requests to
        //work out the byte per interval.
        var results=[];
    
        function update(){
    
        session.get (oids, function (error, varbinds) {
            if (error) {
                console.error (error);
            } else {
                for (var i = 0; i < varbinds.length; i++)
                    if (snmp.isVarbindError (varbinds[i])){
                        console.error (snmp.varbindError (varbinds[i]))
                    } else {
                        // console.log (varbinds[i].oid + " = " + varbinds[i].value);
    
                        var result = results.find(result => result.oid == varbinds[i].oid);
                        if (result == undefined){
    
                            //name = oidNames.find(name => name.id == varbinds[i].oid);
    
                            if (varbinds[i].oid == nodecg.bundleConfig.network.snmp.oids['down']){
                                var name = "Inbound";
                            } else {
                                var name = "Outbound";
                            }
    
                            result = new Object();
                            result.oid = varbinds[i].oid;
                            result.name = name;
                            result.value = varbinds[i].value;
                            result.rate = 0;
                            result.average = 0;
                            result.max = 0;
                            result.counter=0;
                            results.push(result);
    
                        } else {
    
                            result.counter++;
                            var oldValue = result.value;
                            result.value = varbinds[i].value;
                            if (result.value > varbinds[i].value){
                                //Integer number has wrapped for 32bit number
                                console.log("Wrapped");
                                result.rate = (((4294967295-oldValue)+result.value)/1024);
                            } else {
                                result.rate = (Math.round((result.value - oldValue)/1024));
                            }
                            //Set the high water mark.
                            if (result.rate > result.max || result.counter > 3600){
                                result.max = result.rate;
                                result.counter=0;
                            }
                            //Now take an average
                            result.average = Math.round((result.average + result.rate)/2);
    
                        }
    
                    }
            }
            //session.close ();
        });
    
        session.trap (snmp.TrapType.LinkDown, function (error) {
            if (error)
                console.error (error);
        });
    
        results.forEach(function(item){
            if (item.name == "Inbound") {
                // console.log("Inbound: " + item.rate);
                netWANBwDown.value = item.rate;
            }
            if (item.name == "Outbound") {
                // console.log("Outbound: " + item.rate);
                netWANBwUp.value = item.rate;
            }
        });
    
        }
    
        //Setup Interval Timer to trigger the reading of the SNMP information
        setInterval(update, nodecg.bundleConfig.network.snmp.interval);
    }
    
};
