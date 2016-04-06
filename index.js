const SimpleApi = require('github-api-simple');
const github = new SimpleApi();

const irc = require('irc');
const config = require('./config.js');

const client = new irc.Client(config.irc.server, config.irc.nick, {
    userName: config.irc.userName,
    channels: config.irc.channels,
    port: config.irc.port,
    debug: config.irc.debug,
    secure: config.irc.secure,
});

config.irc.channels.map(c => {
  client.join(`${c}`, () => {
    client.say(`${c}`, "Heya Peeeps!! GHIA is in Da HOUSE!!")
  })

  client.addListener(`message${c}`, (from, message) => {
    const issue = /\#(\d+)/g;
    const matches = message.match(issue)
    if (matches) {
      matches.map(s => s.substring(1))
      .forEach(issueNumber => {

        const number = parseInt(issueNumber,10)
        github.Issues.getIssue(config.github.user, config.github.repo, number)
        .then(issue => {
          client.say(`${c}`,
            `#${number}: ${irc.colors.wrap("orange", irc.colors.wrap("white", issue.title))} ${issue.html_url}`)
          console.log(issue.title);

        });
      })


    }
  })

})


client.addListener('error', (error) => {
    console.log(error);
});
