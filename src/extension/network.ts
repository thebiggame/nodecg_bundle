import { BandwidthData, Configschema } from '@thebiggame/types/schemas';
import { OID, Session } from 'snmp-native';
import { get as nodecg } from './util/nodecg';
import { repNetworkWANBandwidth } from './util/replicants';

nodecg().log.trace('Extension network loaded.');

// Access the bundle configuration with types.
const config = nodecg().bundleConfig as Configschema;

interface SnmpBwData {
  value: number
  rate: number
  average: number
  max: number
  counter: number
}

interface SnmpResults {
  down: SnmpBwData
  up: SnmpBwData
}

function stringToOid(oStr: string): OID {
  return oStr
    .split('.')
    .filter((s) => s.length > 0)
    .map((s) => parseInt(s, 10));
}

function oidToString(oid: number[]): string {
  return oid.join('.');
}

if (config.network.snmp.enabled) {
  const session = new Session({
    host: config.network.snmp.host,
    community: config.network.snmp.community,
  });

  const oids: OID[] = [
    stringToOid(config.network.snmp.oids.down),
    stringToOid(config.network.snmp.oids.up),
  ];

  // PFSense OIDs
  // var oids = ["1.3.6.1.2.1.2.2.1.10.29",
  //            "1.3.6.1.2.1.2.2.1.16.29"];

  // The results variable will be used to store the outputs from the requests to
  // work out the byte per interval.
  const results = <SnmpResults>{
    up: <SnmpBwData>{
      value: 0,
      rate: 0,
      average: 0,
      max: 0,
      counter: 0,
    },
    down: <SnmpBwData>{
      value: 0,
      rate: 0,
      average: 0,
      max: 0,
      counter: 0,
    },
  };

  function update() {
    session.getAll({ oids }, (error, varbinds) => {
      if (error) {
        console.error(error);
      } else {
        for (let i = 0; i < varbinds.length; i += 1) {
          if (varbinds[i].value === 'noSuchInstance') {
            nodecg().log.warn(
              `No such OID ${varbinds[i].oid.toString()} found.`,
            );
          }
          // if (snmp.isVarbindError(varbinds[i])) {
          //   console.error(varbindError(varbinds[i]));
          //   continue
          // }
          // nodecg().log.trace(varbinds[i].oid + " = " + varbinds[i].value);

          let result: SnmpBwData;
          const targetOid = oidToString(varbinds[i].oid);
          if (targetOid === config.network.snmp.oids.down) {
            // Working with the Down bandwidth dataset.
            result = results.down;
          } else if (targetOid === config.network.snmp.oids.up) {
            // Working with the Up bandwidth dataset.
            result = results.up;
          } else {
            // ???
            nodecg().log.error(
              `encountered unexpected oid ${targetOid.toString()}`,
            );
            // eslint-disable-next-line no-continue
            continue;
          }

          result.counter += 1;
          const oldValue = result.value !== null ? result.value : 0;
          result.value = varbinds[i].value;
          if (result.value > varbinds[i].value) {
            // Integer number has wrapped for 32bit number
            nodecg().log.debug('Wrapped');
            result.rate = (4294967295 - oldValue + result.value) / 1024;
          } else {
            result.rate = Math.round((result.value - oldValue) / 1024);
          }
          // Set the high-water mark.
          if (result.rate > result.max || result.counter > 3600) {
            result.max = result.rate;
            result.counter = 0;
          }
          // Now take an average
          result.average = Math.round((result.average + result.rate) / 2);
        }
      }
      // session.close (); ?
    });

    const newRepValue: BandwidthData = {
      up: results.up.rate,
      down: results.down.rate,
    };
    repNetworkWANBandwidth.value = newRepValue;
  }

  // Setup Interval Timer to trigger the reading of the SNMP information
  setInterval(update, config.network.snmp.interval);
}
