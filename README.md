## About
Exyllian is a discord bot made for a closed community named Exyl. Due to the nature of how Exyl is ran, Exyllian runs as a facade for the members to have control over their area without having too much control over other aspects of the community's server.
## Usage
This list of commands will keep growing depending on Exyl's needs.
### Utility
- `create <name> <topic?> <private?>`: creates a channel within your category.
- `delete <id>`: deletes a channel by id, has to be within your category.
- `allow <user> <readonly?>`: allow user access to the channel the command was sent.
- `disallow <user>`: disallow user access to the channel the command was sent.
- `setpublic <readonly?>`: set the channel where command was sent as public for **everyone**.
- `setprivate`: set the channel where command was sent as private for **everyone**.
- `settopic <name>`: change the channel's topic/description.
### Miscellaneous
- `flip <number?>`: flip a coin (or more).
- `ping`: replies with pong (usually for testing).
- `server`: get server info (name, member count and creation date).
### SQLite3 Database
`cat data/exylliandb.sql | sqlite3 data/ExyllianDB.db`
