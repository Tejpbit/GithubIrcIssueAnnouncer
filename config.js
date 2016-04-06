module.exports = {
    irc: {
        server: 'irc.server.com',
        channels: ["#ChannelName"],
        port: 9999,
        nick: 'GHIA',
        userName: 'banned',
        secure: true,
        debug: false
    },
    github: {
      user: "",
      repo: ""
    },
    whitelist: [],
    //Blacklist is only used if the whitelist is empty
    blacklist: []
}
