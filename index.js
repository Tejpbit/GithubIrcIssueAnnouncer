const SimpleApi = require('github-api-simple');
const github = new SimpleApi();
const argv = require('yargs').argv;
const _ = require('lodash');

const irc = require('irc');
const config = require('./config.js');

const github_url = irc.colors.wrap("dark_blue", "https://git.io/vVXYn");

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
      handleAdminCommand(from, message, channel)
    }

    if (!isAllowedToAskForIssue(from, whitelist, blacklist)) {
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

commands = {
  whitelist: {
    error: (nick) => `${nick}: bad command. Try "whitelist (add|remove) NICK"`,
    add: {
      response: (nick) => `${nick}: Mah man! I now respect your authoritah`,
      execute: (nick) => doActionOnList(whitelist, 'add', nick)
    },
    remove: {
      response: (nick) => `${nick}: No more am I a slave to your command!`,
      execute: (nick) => doActionOnList(whitelist, 'remove', nick)
    }
  },
  blacklist: {
    error: (nick) => `${nick}: bad command. Try "blacklist (add|remove) NICK"`,
    add: {
      response: (nick) => `${nick}: Ohh noes! You're on the naughty list!`,
      execute: (nick) => doActionOnList(blacklist, 'add', nick)
    },
    remove: {
      response: (nick) => `${nick}: Looks like santa is coming to your town after all.`,
      execute: (nick) => doActionOnList(blacklist, 'remove', nick)
    }
  }
}



const handleAdminCommand = (from, command, channel) => {
  const args = command.split(' ').slice(1);

  const list = args[0].toLowerCase();
  console.log(list);
  if (list !== 'whitelist' && list !== 'blacklist') {
    client.say(channel, commands[list]["error"](from));
    return;
  }

  if (args.length !== 3) {
    client.say(channel, `${from}: No such command. See my github page for info: ${github_url}`)
    return;
  }

  const action = args[1].toLowerCase();
  if (!action in commands) {
    client.say(channel, `${from}: No such command. See my github page for info: ${github_url}`)
    return;
  }
  const nick = args[2];


  client.say(channel, commands[list][action].response(nick))
  commands[list][action].execute()
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
