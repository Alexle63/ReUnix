# FOR PLAYERS:

Open "PLAY_GAME.html" in your browser.

You can do this by...
 - Right-clicking the file, "Copy path," paste in a browser of your choice
 - Double-clicking on the file in File Explorer (Windows) / Finder (Apple)








# FOR DEVELOPERS OF THE GAME BELOW:


Run the following command in a new terminal before developing to see
changes in CSS:

npx tailwindcss -i ./input.css -o ./style.css --watch

Start HTTPS/JS Dev server, run the command:
npx http-server
(Note to self: this is only applicable when working with Node.js modules,
ignore this command otherwise)

See the "application":
Open 'index.html' in a web browser
- Right click 'index.html' in the explorer side bar   <<=== over there
- Click "Copy path" , NOT relative path
- Paste what you copied in a web browser search bar as if it were a URL
Or simply just double-click the index.html file in file explorer


# The Grand Idea:

player starts game by clicking start button, play start animation,
boot up terminal as usual

Here, the player is "in their home desktop directory" terminal and will
be guided by a contractor, who will talk through the chat. The contractor
(idk come up with a name or something) guides the player on how to use
the terminal to navigate, see, and interact with file system.

Eventually, "levels" will get harder. Here are some ideas for levels:

## Learning phase (how to reward...?)
1a) Player finds, reads, and deletes file in their directory (ls, cat, rm)
1a.i) Player is instructed on how to auto-tab complete  (tab)
1a.ii) Player is instructed on how to see previous commands and history  (up, down)
1b) Player is directed on how to change directories, including moving into and 
back out of directories (cd, ..)
1c) Player is directed on how to copy files (cp)
1d) Player is instructed on how to chain directory commands (./home/user ...)
1e) Plaer is instructed on how to use the wildcard (*)
2) Player is instructed to ssh into another computer using a password 
given by the contractor and does some file manipulation there (ssh <user>@<ip>)

## Problem solving phase
3) Player is given ssh information by contractor and will have to do some
detective work to find next ssh location
4) Player will be introduced to secret folders (. prefix) and will have to 
backtrack to find clues for final login place
5) Player will find final secret location (contractor's computer?) and browse
through filesystem to find evidence of a piece of malware planted on home
desktop
6) Use PS and Kill to terminate process