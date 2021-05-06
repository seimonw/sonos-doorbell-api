import express from 'express';
import { Group } from './models';
import { SonosService, IpService, DeviceService } from './services';

const listener = require('sonos').Listener;

// Settings
const PORT = process.env.PORT || 5050;
const DEBUG = process.env.DEBUG ? process.env.DEBUG == "true" : false;

// Variables
let localIp: string[] = null;
let devices: Group[] = [];

// Server configuration
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// APIs
app.get('/devices', (req, res) => res.send(devices));

app.get('/ring', async (req, res) => {
  //Grab the Sonos library Listener singleton here
  //and start listening, otherwise the first PlayNotification()
  //to complete will cancel all other listeners
  const listener = require('sonos').Listener;
  listener.startListener();

  const ringAll = devices.map(async dev => {
    await SonosService.ring(localIp[0], PORT, dev, DEBUG);
  })

  Promise.all(ringAll).then(function (responses) {
    //Clean up the listeners now
    listener.stopListener();
  });

  res.send({});
});

// Start the server
app.listen(PORT, async () => {
  localIp = IpService.get();
  devices = await DeviceService.getAll();
  console.log(`Sonos Doorbell API available on: http://${localIp[0]}:${PORT}`);
});