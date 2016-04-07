const SimpleApi = require('github-api-simple');
const github = new SimpleApi();
const argv = require('yargs').argv;

const irc = require('irc');
const config = require('./config.js');

const client = new irc.Client(config.irc.server, config.irc.nick, {
    userName: config.irc.userName,
    channels: config.irc.channels,
    port: config.irc.port,
    debug: config.irc.debug,
    secure: config.irc.secure,
});

var whitelist = config.whitelist
var blacklist = config.blacklist

if (argv["whitelist"] && typeof argv["whitelist"] === 'string') {
  argsWhitelist = argv["whitelist"].split(',')
  whitelist = Array.prototype.concat(whitelist, argsWhitelist)
}
if (argv["blacklist"] && typeof argv["blacklist"] === 'string') {
  argsBlacklist = argv["blacklist"].split(',')
  blacklist = Array.prototype.concat(blacklist, argsBlacklist)
}

function isAllowedToAskForIssue(sender) {
  if (whitelist.length === 0) {
    if (blacklist.length > 0 && blacklist.indexOf(sender) >= 0) {
      return false;
    }
  } else {
    if (whitelist.indexOf(sender) === -1) {
      return false
    }
  }
  return true
}

config.irc.channels.map(channel => {
  client.join(`${channel}`, () => {
    client.say(`${channel}`, "Heya Peeeps!! GHIA is in Da HOUSE!!")
  })

  client.addListener(`message${channel}`, (from, message) => {
    if (config.admins.indexOf(from) >= 0 && message.startsWith(config.irc.nick)) {
      handleAdminCommand(message)
    }

    if (!isAllowedToAskForIssue(from)) {
      return
    }

    const issue = /\#(\d+)/g;
    const matches = message.match(issue)
    if (matches) {
      matches.map(s => s.substring(1))
      .forEach((i) => printIssue(channel, i))
    }
  })
})

const handleAdminCommand = (command) => {
  args = command.toLowerCase().split(' ').slice(1)
  switch (args[0].toLowerCase()) {
    case 'whitelist':
      doActionOnList(whitelist, args[1], args[2])
      break;
    case 'blacklist':
      doActionOnList(blacklist, args[1], args[2])
      break;
    default:
      console.log("unknown command");
  }
}

const doActionOnList = (array, action, obj) => {
  console.log(`${array}, ${action}, ${obj}`);
  if (action === 'add') {
    console.log("is add");
    if (array.indexOf(obj) === -1) {
      array.push(obj)
      console.log("wat");
    }
  } else if (action === 'remove') {
      console.log("is remove");
      const index = array.indexOf(obj)
      if (index !== -1) {
        array.splice(index, 1)
        console.log("wat2");
      }
    }
}

const printIssue = (channel, issueNumber) => {
  const number = parseInt(issueNumber,10)
  github.Issues.getIssue(config.github.user, config.github.repo, number)
  .then(issue => {
    const state = irc.colors.wrap(issue.state === 'open' ? "dark_green" : "dark_red", issue.state)
    const title = irc.colors.wrap("orange", issue.title)
    const url = irc.colors.wrap("dark_blue", issue.html_url)
    console.log(channel);
    client.say(`${channel}`, `#${number}: [${state}] ${title} ${url}`)
  });
}

client.addListener('error', (error) => {
    console.log(error);
});
