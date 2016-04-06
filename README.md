# GithubIrcIssueAnnouncer
Prints information about an issue when it's referded to in an irc-channel 

##Setup

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
}
github: {
  user: "Tejpbit"
  repo: "GithubIrcIssueAnnouncer"
}
```

From repo-root
- `npm install`
- `node index.js`
