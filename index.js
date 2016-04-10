const SimpleApi = require('github-api-simple');
const github = new SimpleApi();
const argv = require('yargs').argv;
const _ = require('lodash');

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

config.irc.channels.map(channel => {
  client.join(channel, () => {
    client.say(channel, "Heya Peeeps!! GHIA is in Da HOUSE!!")
  })

  client.addListener(`message${channel}`, (from, message) => {
    if (config.admins.indexOf(from) >= 0 && message.startsWith(config.irc.nick)) {
      handleAdminCommand(message, channel)
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

responses = {
  whitelist: {
    add: (nick) => `${nick}: Mah man! I now respect your authoritah`,
    remove: (nick) => `${nick}: No more am I a slave to your command!`
  },
  blacklist: {
    add: (nick) => `${nick}: Ohh noes! You're on the naughty list!`,
    remove: (nick) => `${nick}: Looks like santa is coming to your town after all.`
  }
}

const handleAdminCommand = (command, channel) => {
  const args1 = command.split(' ').slice(1)
  const nick = args1[2]
  const args = command.toLowerCase().split(' ').slice(1)
  const list = args[0]
  const action = args[1]
  switch (list) {
    case 'whitelist':
      doActionOnList(whitelist, action, nick)
      client.say(channel, responses[list][action](nick))
      break;
    case 'blacklist':
      doActionOnList(blacklist, action, nick)
      client.say(channel, responses[list][action](nick))
      break;
    default:
      const github_url = irc.colors.wrap("dark_blue", "https://git.io/vVXYn")
      client.say(channel, `No such command. See my github page for info: ${github_url}`)
  }
}

const doActionOnList = (array, action, obj) => {
  if (action === 'add') {
    if (array.indexOf(obj) === -1) {
      array.push(obj)
    }
  } else if (action === 'remove') {
      const index = array.indexOf(obj)
      if (index !== -1) {
        array.splice(index, 1)
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
    client.say(channel, `#${number}: [${state}] ${title} ${url}`)
  });
}

client.addListener('error', (error) => {
    console.log(error);
});

function isAllowedToAskForIssue(sender, whitelist, blacklist) {
  const whitelistExists = !_.isEmpty(whitelist)
  const blacklistExists = !_.isEmpty(blacklist)
  return (!whitelistExists && !blacklistExists)
      || (whitelistExists && _.includes(whitelist, sender))
      || (blacklistExists && !_.includes(blacklist, sender))
}
exports.isAllowedToAskForIssue = isAllowedToAskForIssue
