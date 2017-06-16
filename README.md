# GithubIrcIssueAnnouncer
Prints information about an issue when it's referded to in an irc-channel 

## Setup

Do configuration in config.js
For example a freenode setup would look like:
```
irc: {
    server: 'chat.freenode.net', 
    channels: ["#TejpbitsFancyChannel"],
    port: 6697,
    nick: 'GHIA',
    userName: 'banned',
    secure: false,
    debug: false
},
github: {
  user: "Tejpbit",
  repo: "GithubIrcIssueAnnouncer"
},
whitelist: ["Tejpbit"],
//Blacklist is only used if the whitelist is empty
blacklist: [],
//Is allowed to edit black/whitelist on the fly
admins: ["Tejpbit", "Tejp"]
}
```

From repo-root
- `npm install`
- `node index.js`

## Commands to control bot
Highlight the guy when you need to talk to him. i.e. <br />
`GHIA: whitelist add ThisGuy`<br />
`GHIA: blacklist remove AnotherGuy`<br />
Where `ThisGuy` and `AnotherGuy` are irc-nicks which you want to add/remove from the white-/blacklist
