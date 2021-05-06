import { Sonos } from 'sonos';
import { Group, Track } from "../models";

//let debug = require('debug');
//debug.enable('sonos:main'); // sonos-listener');

export class SonosService {
  public static async ring(ip: string, port: string | number, device: Group, debug: boolean = false) {
    const sonos = new Sonos(device.host, device.port, null);

    return new Promise(function (resolve, reject) {
      sonos.playNotification({
        uri: `http://${ip}:${port}/clips/doorbell.mp3`,
        onlyWhenPlaying: false,
        volume: 40
      }).then(result => {
        // It will wait until the notification is played until getting here.
        if (debug) {
          console.log(`${device.Name}: Rang doorbell`);
	}
        resolve(result);
      }).catch(err => { console.log('Error occurred %j', err); reject(err); })
    });
  }
}
