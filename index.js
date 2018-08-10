const Hapi = require('hapi');
const CronJob = require('cron').CronJob;
const config = require('config');
const mailgun = require('mailgun-js')({ apiKey: config.get('mailgun.api_key'), domain: config.get('mailgun.domain') });
const TankController = require('./controllers/tank');

const server = Hapi.server({
    host: 'localhost',
    port: 3000
});

console.log('Loading Models and Connecting to Database');
const models = require('./models');
console.log('Loading Tank Controller');
const tankController = new TankController(server, models, mailgun);
tankController.initialize();

async function start() {
    try {
        console.log('Sync Database');
        await models.sequelize.sync();
        console.log('Start Server');
        await server.start();
        console.log('Start CronJob')
        const monitor = new CronJob('* * * * *', async () => {
            console.log('check reports and send mails if needed');
            const offlineTanks = await tankController.getOfflineTanks();
            if (!offlineTanks) {
                console.log('No Offline Tanks');
            }
            for (const tank of offlineTanks) {
                tankController.sendTankOfflineMail(tank.tank_id);
            }
        }, null, true, 'America/Lima');
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
    console.log('Server running at:', server.info.uri);
};
start();