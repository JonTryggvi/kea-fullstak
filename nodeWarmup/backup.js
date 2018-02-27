var cronJob = require('cron').CronJob;
new cronJob('00 24 12 * * * ', function() {
  console.log('Midnight')
}, null, true, 'Europe/Copenhagen') 