const Hapi = require('hapi');
const CronJob = require('cron');

const api_key = 'key-9e8c8e8c579f3c0443a85ff24e7914e5';
const domain = 'mail.gogodr.xyz';
const mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });

const server = Hapi.server({
    host: '168.235.98.114',
    port: 3000
});

console.log('Loading Models and Connecting to Database');
const models = require('./models');
console.log('Loading Tank Controller');
const tankController = require('./controllers/tank')(server, models);

async function start() {
    try {
        console.log('Sync Database');
        await models.sequelize.sync();
        console.log('Start Server');
        await server.start();
        console.log('Start CronJob')
        const monitor = new CronJob('*/15 * * * *', async () => {
            console.log('check reports and send mails if needed');
        }, null, true, 'America/Lima');
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
    console.log('Server running at:', server.info.uri);
};
start();