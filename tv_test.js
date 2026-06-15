require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const lgtv = require('lgtv2');
const { RingApi } = require('ring-client-api');

const app = express();
app.use(bodyParser.json());

const TV_IP = 'XXX.XXX.X.XX'; // Locked into your verified Wi-Fi IP

// ─── 1. LEGACY EMBEDDED HANDSHAKE ENGINE UPGRADED with RAZZLE DAZZLE ARCHITECTURE FOR WEBOS 3.0 ──────────────────
function pushNotificationToTV(messageText) {
  console.log(`📡 Initializing legacy handshake to TV (${TV_IP})...`);
  
  const tv = lgtv({
    url: `ws://${TV_IP}:3000`,
    timeout: 4000,
    reconnect: false
  });

  tv.on('connect', () => {
    console.log('🔌 Connected to TV! Sending customized payload...');
    
    // Premium UI Styling configurations for webOS 3.0 display engine
    const customizedPayload = { 
      message: `${messageText}`,
      iconExtension: 'png',
      // Uses the TV's native system security graphic assets
      iconPath: 'usr/share/webos/assets/sys_apps/vsm/icon_vsm.png' 
    };

    tv.request('ssap://system.notifications/createToast', customizedPayload, (err, res) => {
      if (err) console.log('❌ TV rejected the payload:', err);
      else console.log('✅ Customized toast successfully splashed to glass.');
      tv.disconnect();
    });
  });

  tv.on('error', (err) => {
    console.log('📺 TV connection error.');
  });
}

// ─── 2. LOCAL SIMULATION ROUTE ──────────────────────────────────────────────
app.post('/webhook/sensor-trigger', (req, res) => {
  pushNotificationToTV(req.body.message);
  res.status(200).send({ status: 'Command routed to legacy driver' });
});

// ─── 3. LIVE RING AUTOMATION ENGINE ──────────────────────────────────────────
async function bootSystem() {
  if (!process.env.RING_REFRESH_TOKEN) {
    console.log('❌ Missing token in .env file.');
    return;
  }

  console.log('🔄 Connecting to Ring Cloud API...');
  const ringApi = new RingApi({ refreshToken: process.env.RING_REFRESH_TOKEN });

  try {
    const cameras = await ringApi.getCameras();
    console.log(`📸 Successfully mapped ${cameras.length} active units.`);

    cameras.forEach((camera) => {
      console.log(`🔒 Sensor Armed: [${camera.name}]`);

      camera.onNewNotification.subscribe((notification) => {
        console.log(`🚨 Event detected on [${camera.name}]:`, notification.title);
        const alertMessage = notification.body || `Activity on your ${camera.name}`;
        pushNotificationToTV(alertMessage);
      });
    });

  } catch (error) {
    console.error('❌ Ring Cloud Link Failure:', error);
  }
}

bootSystem();

app.listen(3000, () => {
  console.log('🤖 Legacy Security Bridge listening on port 3000.');
});
