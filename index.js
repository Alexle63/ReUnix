class SFile {
    content;
    readable;
    sudo;
    name;
    constructor(name, readable, content, sudo = false) {
        this.name = name;
        this.readable = readable;
        this.sudo = sudo;
        this.content = content;
    }
    get name() {
        return this.name
    }

}

class Folder {
    #name;
    #contents;
    #parent;
    constructor(name, parent) {
        this.#name = name;
        this.#contents = {};
        this.#parent = parent;
        if (parent) {
            parent.append(this)
        }
    }
    /**
     * @param {(arg0: SFile | Folder) => void} file
     */
    append(file) {
        this.#contents[file.name] = file
    }
    get name() {
        return this.#name
    }
    get parent() {
        return this.#parent
    }
    get contents() {
        return this.#contents
    }
    get rootPath() {
        return !this.#parent ? '' : this.#parent.rootPath + '/' + this.#name
    }
}

const motds = [
    "Hack the system, break the rules, rewrite the code.",
    "In the digital realm, nothing is as it seems.",
    "Unlock the secrets of the binary universe.",
    "Code is your weapon, wield it wisely.",
    "Stealth is your ally, anonymity your shield.",
    "Trust no code but your own.",
    "Navigate the networks, manipulate the data.",
    "In the land of algorithms, only the clever survive.",
    "Decrypt the mysteries of the cybernetic age.",
    "In a world of ones and zeroes, be the one who changes everything.",
    "Explore the dark corners of the digital domain.",
    "Leave no firewall unbreached.",
    "Master the art of virtual infiltration.",
    "Hackers rule the world behind the screen.",
    "Defy logic, defy authority, defy the system.",
    "Embrace the chaos of the digital frontier.",
    "Adapt, improvise, overcome - the hacker's creed.",
    "Information is power, but knowledge is liberation.",
    "Crack the codes, seize the data, control the outcome.",
    "In the realm of cyberspace, imagination is your only limit.",
    "Unleash your inner technomancer.",
    "In the heart of the mainframe, find your true self.",
    "The code is your canvas, paint your masterpiece.",
    "Navigate the labyrinth of the digital maze.",
    "Behind every firewall lies a world waiting to be explored.",
    "Hackers thrive where others fear to tread.",
    "Data is the currency of the future, steal wisely.",
    "Bypass the defenses, rewrite the narrative.",
    "In the digital wilderness, be the apex predator.",
    "Crack the encryption, uncover the truth.",
    "In the dance of bytes and bits, be the choreographer.",
    "Forge your own path through the tangled web of cyberspace.",
    "In the realm of the virtual, anything is possible.",
    "Challenge the status quo, rewrite the rules.",
    "Venture into the unknown, conquer the digital frontier.",
    "Hackers are the architects of the future.",
    "Embrace the shadows, harness the darkness.",
    "In the world of bits and bytes, be the byte-sized revolution.",
    "Unleash the power of the algorithmic arts.",
    "Defy the binary code, transcend the limitations.",
    "In the realm of electrons, be the spark of change.",
    "Ride the digital wave, carve your own destiny.",
    "In the labyrinth of cyberspace, find your way or forge it.",
    "Hack the planet, one line of code at a time.",
    "In the age of information, knowledge is your greatest weapon.",
    "Decode the mysteries of the digital cosmos.",
    "In the infinite expanse of cyberspace, be the anomaly.",
    "Crack the virtual vaults, claim your rightful plunder.",
    "In the code, find your purpose, your power, your destiny.",
    "Navigate the sea of data, chart your own course."
];

function getMOTD() {
    return motds[Math.floor(Math.random() * motds.length)]
}

function printTerminal(text, type = "p") {
    const element = document.createElement(type);
    element.textContent = text;
    terminal.appendChild(element);
}

function printTerminalFormatted(text, type = "p") {
    const element = document.createElement(type);
    element.innerHTML = text;
    terminal.appendChild(element);
}

async function printChat(text) {
    let i = 0
    text += "\n"
    while (i < text.length) {
        chat.textContent += text.charAt(i);
        i++;
        if (text.charAt(i) == '\n')
            await delay(490);
        await delay(10);
        document.getElementById("chat").scrollTo(0, 100000)
    }
}

function printManual(cmd) {
    switch (cmd.pop()) {
        case ("man"):
            printTerminal("Here is the manual page for the command:")
            printTerminal("man")
            break;
        case (undefined):
            printTerminal("Missing arguments. Syntax: man <cmd>")
            break;
        default:
            printTerminal(`Manual page for ${cmd} coming soon!`)
    }
}



function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function resetCMDLine() {

    const line = document.createElement("div")
    line.setAttribute("style", "display: flex")

    const homeCMD = document.createElement("p")

    let path = currentFolder.rootPath.replace("/home/user", "~");
    if (path.split('/').length > 3) {
        let len = path.split('/').length
        path = '/' + path.split('/').slice(len - (len - 3)).join('/')
    }
    const homeCMDtext = username + "@HomeDesktop:" + path + "$ ";

    homeCMD.textContent = homeCMDtext;

    const form = document.createElement("form");
    form.setAttribute("style", "flex-grow:1")

    line.appendChild(homeCMD)
    line.appendChild(form)

    let cmdInput = document.createElement("input");
    cmdInput.setAttribute("id", "cmdInput")
    cmdInput.setAttribute('autocomplete', 'off')
    cmdInput.setAttribute('spellcheck', 'false')
    cmdInput.setAttribute('style', 'background-color:transparent; width:100%')
    form.appendChild(cmdInput)
    cmdInput.focus()

    const submit = document.createElement("input");
    submit.setAttribute("type", "submit");
    submit.setAttribute("style", "display: none")
    form.appendChild(submit)


    terminal.appendChild(line)


    function tabComplete(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
        }
    }

    document.getElementById("cmdInput").addEventListener('blur', this.focus());

    document.getElementById('cmdInput').addEventListener('keydown', (e) => tabComplete(e));

    form.onsubmit = function (event) {
        event.preventDefault();

        homeCMD.textContent += cmdInput.value

        parseAndRunCMD(cmdInput.value)
        try {
            document.getElementById("cmdInput").removeEventListener('blur', this.focus());
            document.getElementById("cmdInput").removeEventListener('keydown', (e) => tabComplete(e));
        } catch (error) { }

        form.remove()

        historyIndex = 0
        resetCMDLine()
    };


}

function saveSession() {
    localStorage.setItem("username", username);
    localStorage.setItem("cmdHistory", cmdHistory);
    localStorage.setItem("GAMESTEP", GAMESTEP)
    localStorage.setItem("chat", document.getElementById("chat").textContent)
    localStorage.setItem("processes", JSON.stringify(processes))
    localStorage.setItem("asyncCommands", JSON.stringify(asyncCommands))
}


async function parseAndRunCMD(cmd) {
    if (cmd != '')
        cmdHistory.push(cmd)
    if (cmdHistory.length > 50)
        cmdHistory = cmdHistory.slice(1)
    const parsedCMD = cmd.split(" ");

    const command = parsedCMD[0].toLowerCase();

    switch (command) {
        case ('help'):
            printTerminal("Commonly used commands:\n" +
                "clear \t\t\t\t\t- Clear the terminal screen\n" +
                "ls\t\t\t\t\t\t- View the current folder's contents\n" +
                "man <cmd>\t\t\t\t- Explain the specified <cmd> in more detail\n" +
                "cd <folder>\t\t\t\t- Move yourself into the specified folder\n" +
                "cat <file> \t\t\t\t- Print out the contents of a file\n" +
                "rm <file>\t\t\t\t- Remove the specified file\n" +
                "mv <filepath> <dest>\t- Move the file <filepath> to <dest>\n" +
                "cp <filepath> <dest>\t- Copy the file <filpath> and paste it in <dest>\n" +
                "pwd\t\t\t\t\t\t- Show where you are located (Print Working Directory)\n" +
                "ps\t\t\t\t\t\t- Show currently running processes\n" +
                "kill <ID>\t\t\t\t- Kill the process with id <ID>\n" +
                "history \t\t\t\t- See previous command history\n" +
                "rename <username>\t\t- Set your username to <username>\n" +
                "music \t\t\t\t\t- Turns on the music\n\n" +
                "IF THE GAME BREAKS AT ANY MOMENT, reset the game progress with the command: 'sc'\n" +
                "Remember, 'sc' is not a real BASH command and is unique to this game.\n\n"
            );
            break;
        case ("clear"):
            terminal.textContent = ''
            break;
        case ("ls"):
            listContents(parsedCMD.slice(1))
            break;
        case ('man'):
            printManual(parsedCMD.slice(1))
            break;
        case ("cd"):
            changeDirectory(parsedCMD.slice(1))
            break;
        case ('cat'):
            catFile(parsedCMD.slice(1))
            break;
        case ('rm'):
            removeFile(parsedCMD.slice(1));
            break;
        case ('mv'):
            moveFile(parsedCMD.slice(1));
            break;
        case ('cp'):
            copyFile(parsedCMD.slice(1))
            break;
        case ("pwd"):
            printTerminal(currentFolder.rootPath);
            break;
        case ("ps"):
            processStatus();
            break;
        case ("kill"):
            killProcess(parsedCMD.slice(1));
            break;
        case ("ch"):
            cmdHistory = [''];
            break;
        case ("history"):
            printTerminal(cmdHistory.slice(1).join("\n") + "\n");
            break;
        case ('rename'):
            if (!parsedCMD[1])
                printTerminal("Missing parameter <username>. \nSyntax: rename <username>");
            else
                username = parsedCMD[1].slice(0, 10);
            break;
        case ('music'):
            processes["1304244"] = "spotify.exe"
            bgm.play()
            break;
        case ('sc'):
            localStorage.clear();
            console.log("cleared localstorage")
            location.reload(); // reload because we dont want to save the session
            return; // return just in-case
        case (""):
            break;
        default:
            printTerminal(`${cmd}: command not found. Type 'help' to see a list of commands\n`);
            break;
    }
    saveSession()
}




function catFile(arguments) {
    if (!arguments.length) {
        printTerminal(`Missing arguments. Syntax: cat <filename>`)
        return
    }

    let selectedItem = currentFolder.contents[arguments[0]];

    if (selectedItem) {
        printTerminal(selectedItem.content)
        return;
    }
    printTerminal(`File "${arguments[0]}" not found.`)
}

function removeFile(arguments) {
    if (!arguments.length) {
        printTerminal("Missing arguments. Syntax: rm <filename>.")
        return
    }

    let selectedItem = currentFolder.contents[arguments[0]]

    if (selectedItem.constructor.name == "Folder") {
        if (Object.keys(selectedItem.contents).length) {
            printTerminal(`Cannot delete non-empty folder '${arguments[0]}'.`)
            return
        } else {
            delete currentFolder.contents[arguments[0]]
            printTerminal(`Deleted folder '${arguments[0]}'.`)
            return
        }
    }

    if (selectedItem) {
        delete currentFolder.contents[arguments[0]]
        printTerminal(`Deleted file '${arguments[0]}'.`)
        return
    }
    printTerminal(`File '${arguments[0]}' not found.`)

}

function copyFile(arguments) {
    if (arguments.length < 2) {
        printTerminal("Missing arguments. Syntax: cp <filename> <destination>.")
        return
    }

    let selectedItem = currentFolder.contents[arguments[0]]

    if (!selectedItem) {
        printTerminal(`File '${arguments[0]}' not found.`)
        return
    }
    currentFolder.contents[arguments[1]] = Object.assign({}, selectedItem)
    currentFolder.contents[arguments[1]].name = arguments[1]

}

function moveFile(arguments) {
    if (arguments.length < 2) {
        printTerminal("Missing arguments. Syntax: mv <filename> <destination>.")
        return
    }
    copyFile(arguments)
    delete currentFolder.contents[arguments[0]]
}

function listContents(arguments) {
    let files = currentFolder.contents
    let formattedFileNames = []
    for (const [name, item] of Object.entries(files)) {
        if (item.constructor.name == "Folder")
            formattedFileNames.push("<b>" + item.name + "</b>")
        else
            formattedFileNames.push(item.name)
    }

    if (!arguments.length || arguments[0] != "-a") {
        formattedFileNames = formattedFileNames.filter(a => a.slice(0, 1) !== '.')
    }

    printTerminalFormatted(formattedFileNames.join("\t\t"));
}

function changeDirectory(arguments) {
    if (!arguments.length) {
        printTerminal("Missing arguments. Syntax: cd <folder>")
        return
    }

    if (arguments[0] == ".")
        return

    if (arguments[0] == "..") {
        if (currentFolder.name != "root")
            currentFolder = currentFolder.parent
        return
    }


    if (!currentFolder.contents[arguments[0]]) {
        printTerminal(`Folder '${arguments[0]}' not found.`)
        return
    }

    let selectedItem = currentFolder.contents[arguments[0]];

    if (selectedItem.constructor.name != "Folder") {
        printTerminal(`Folder '${arguments[0]}' not found.`)
        return
    }

    currentFolder = selectedItem
}

function processStatus() {
    printTerminal("ID\t\t\tCommand")
    for (var id of Object.keys(processes)) {
        printTerminal(id + "\t\t" + processes[id])
    }
}

function killProcess(arguments) {
    if (!arguments.length) {
        printTerminal("Missing arguments. Syntax: kill <process_ID>.");
        return;
    }

    let selectedItem = processes[arguments[0]]

    if (selectedItem) {
        delete processes[arguments[0]]
        printTerminal(`Killed process '${selectedItem}'`)
    } else {
        printTerminal(`Could not find process with ID ${arguments[0]}`)
    }

}

function firstTimeStartup() {

    chat.textContent = ''
    terminal.textContent = ''

    const greeting = "Welcome to D3b1an XX.04.5 LTS.\n\n" +
        "25 updates can be applied immediately.\n" +
        "8 of these updates are standard security updates.\n\n" +
        `\t"${getMOTD()}"\n\n` +
        "To view a list of commands, run:\n" +
        "help\n\n";

    printTerminal(greeting);
    resetCMDLine();

    if (localStorage.getItem("chat"))
        document.getElementById("chat").textContent = localStorage.getItem("chat")
    else {
        chatEventQueue.push('Welcome to ReUnix.')
        chatEventQueue.push('\nYour guide in mastering the BASH terminal basics.\n')
        chatEventQueue.push('To get started, try typing "help" in the terminal and ' +
            'pressing enter.')
    }
    document.getElementById("chat").scrollTo(0, 100000)


    // create a start menu screen and wrap this in an event listener for the
    // start button
    bgm.loop = true;
    bgm.volume = 0.30;
    if (processes["1304244"])
        bgm.play();
}

async function startGame() {
    document.getElementById("startMenu").style.display = "none"
    document.getElementById("mainGame").style.display = "flex"
    document.getElementById("terminal").style.height = "100%"
    document.getElementById("chat").style.height = "100%"
    firstTimeStartup()
    await gameLoop()
}

async function gameLoop() {
    let latestCMD;
    while (true) {
        if (chatEventQueue.length) {
            await printChat(chatEventQueue.shift() + "\n")
            saveSession();
        }

        // console.log("ticking...")

        latestCMD = cmdHistory[cmdHistory.length - 1]
        document.getElementById("cmdInput").focus()

        await delay(500)
        if (asyncCommands[latestCMD]) {
            chatEventQueue.push(asyncCommands[latestCMD])
            delete asyncCommands[latestCMD]
            console.log("popped and broken")
            if (latestCMD == 'kill 1304244')
                bgm.pause()
        }

        if (GAMESTEP >= storyCommands.length) {
            continue
            // chatEventQueue.push("\nfinish")
        } else if (latestCMD == storyCommands[GAMESTEP].command) {
            chatEventQueue.push("\n" + storyCommands[GAMESTEP].chat)
            GAMESTEP += 1
        }


    }
}


window.addEventListener("blur", function (event) {
    bgm.volume = 0.08;
},
    false);

window.addEventListener("focus", function (event) {
    bgm.volume = 0.30;
},
    false);

document.addEventListener('keyup', function (event) {
    if (event.key === 'ArrowUp') {
        historyIndex = historyIndex > 0 ? historyIndex - 1 : cmdHistory.length - 1;
        cmdInput.value = cmdHistory[historyIndex];
    } else if (event.key === 'ArrowDown') {
        historyIndex += 1;
        historyIndex = historyIndex % cmdHistory.length
        cmdInput.value = cmdHistory[historyIndex];
    }
});



var root = new Folder('root', null);

var homeFolder = new Folder("home", root)
var userFolder = new Folder("user", homeFolder)
var desktopFolder = new Folder("Desktop", userFolder)

var homeFile = new SFile("notepad.txt", "true", "hey now, you're an all star")
var desktopFile = new SFile("desktop.txt", "true", "According to all known laws of aviation, there is no way that a bee should be able to fly. Its wings are too small to get its fat little body off the ground")

var secret = new SFile(".secret.md", "true", "Hello more experienced user! This game is meant for users who haven't touched an ounce of BASH or terminal based navigation but since you found this file, it seems you know your way around!\n\nFeel free to keep playing, but you WILL notice that most BASH functionality will be missing!")

userFolder.append(homeFile)
userFolder.append(secret)
desktopFolder.append(desktopFile)

var bgm = new Audio('sounds/HacknetOSTNonCR.mp3');
// var bgm = new Audio('sounds/test.mp3');
var username = localStorage.getItem("username") ? localStorage.getItem("username") : "s-admin"
var cmdHistory = localStorage.getItem("cmdHistory") ? localStorage.getItem("cmdHistory").split(",") : [''];
var currentFolder = userFolder
var historyIndex = 0;

var chatEventQueue = []


var GAMESTEP = localStorage.getItem("GAMESTEP") ? parseInt(localStorage.getItem("GAMESTEP")) : 0

var processes = localStorage.getItem("processes") ? JSON.parse(localStorage.getItem("processes")) : {
    "1304244": "spotify.exe",
    "5583421": "discord.exe",
    "8631995": "steam.exe",
    "8046344": "vscode.exe",
    "4166002": "definitelyNotaTr0jAn.exe",
}




const storyCommands = [
    {
        "command": "help",
        "chat": "You've just entered your first command! \n\nThe command you just entered gives a list of commands that are most commonly used in BASH navigation. It may be a lot but you can and will surely master them all!\n\nTry taking a look around your current position. \n\nType the command 'ls'."
    },
    {
        "command": "ls",
        "chat": "Nice! The terminal should've printed the contents of your current folder.\n\nThe bolded 'Desktop' means that this is a folder and the regular highlighted text means that it is a file.\n\nJust like you would have folders and files that you can see when you open File Explorer on Windows or Finder on MacOS, you can navigate through a file system using just text! \n\nLet's try seeing what's inside of the text file. \n\nType 'cat notepad.txt'"
    },
    {
        "command": "cat notepad.txt",
        "chat": "Weird note, I wonder if it's a pop culture reference or something.\n\nThe command 'cat' stands for concatinate. You usually use this command to combine two files and print their contents to the terminal, but here we only wanted print out what was inside the file.\n\nAll you need to know is that 'cat' is a great command for peeking into files!\n\nLet's see if there's anything interesting on your Desktop. You can CHANGE DIRECTORY using the command 'cd'. \n\nType 'cd Desktop' to move to your desktop.\n\nRemember, names are case-sensitive!"
    },
    {
        "command": "cd Desktop",
        "chat": "You just switched from your user folder to your Desktop! If you ever get lost, you can run the following command to see where you're at:\n\n'pwd'\n\nThis stands for Print Working Directory. This command will print the file path of where you are located based on the root folder--your Working Directory."
    },
    {
        "command": "pwd",
        "chat": "Imagine your computer system as a big file cabinet named 'root'. \nIf so, then you are currently in the 'Desktop' folder, \nwhich is inside the 'user' folder, \nwhich is inside the 'home' folder, \nwhich is inside the root 'cabinet'. \n\nTalk about file-ception! \n\nNow that you're in the Desktop folder, let's take a look around and see what's inside the folder."
    },
    {
        "command": "ls",
        "chat": "'desktop.txt'.... I wonder what it says."
    },
    {
        "command": "cat desktop.txt",
        "chat": "Well that wasn't very helpful. Let's clean this place up a little. Remove the file using the command \n\n'rm desktop.txt'"
    },
    {
        "command": "rm desktop.txt",
        "chat": "Much cleaner. Take a look again to see that the file was deleted."
    },
    {
        "command": "ls",
        "chat": "Yup, a whole lotta nothing around here.\n\nSo now, how do we get back to the folder we were in before? What do I mean? Print out your working directory."
    },
    {
        "command": "pwd",
        "chat": "See how you're in the Desktop folder right now? We want to go back to the 'user' folder, but how do we do this? \n\nWe call the folder 'before' or 'above' us, our parent folder/directory. Here, the 'user' folder is our parent directory; it is above our current position.\n\nThe way we refer to our parent folder is the notation '..' -- yup, just two dots. Try it: \n\nCD into the folder named '..' with the command 'cd ..'"
    },
    {
        "command": "cd ..",
        "chat": "You're back in the user folder! You can confirm that by printing your working directory again."
    },
    {
        "command": "pwd",
        "chat": "Yup, you really are back in the user folder.\n\nLet's manipulate the 'notepad.txt' file a bit. Let's rename the text file so we can better identify it in the future. \n\nRenaming is a bit weird in BASH, because you use the same command to both move AND rename a file. Rename the file to 'smashMouth.txt' by running the command:\n\n'mv notepad.txt smashMouth.txt'"
    },
    {
        "command": "mv notepad.txt smashMouth.txt",
        "chat": "Not confident the file was renamed? Type 'ls' to check that your file was renamed."
    },
    {
        "command": "ls",
        "chat": "Looks like it was renamed alright. Confirm that its contents didn't change either by printing out its contents."
    },
    {
        "command": "cat smashMouth.txt",
        "chat": "Yup, same old pop culture lyrics. \n\nWe can also copy/duplicate a file, as long as it has a different name. Duplicate 'smashMouth.txt' to another file named 'steveHarwell.txt' with the command:\n\n'cp smashMouth.txt steveHarwell.txt'"
    },
    {
        "command": "cp smashMouth.txt steveHarwell.txt",
        "chat": "Seems to have copied successfully. Try listing your working directory contents. ('ls')"
    },
    {
        "command": "ls",
        "chat": "Nice, the file was copied successfully!\n\nEND OF DEMO"
    },
]

var asyncCommands = localStorage.getItem("asyncCommands") ? JSON.parse(localStorage.getItem("asyncCommands")) : 
    {
        "ls -a": "Oh.. looking for secrets maybe?",
        "ps": "Ah, the command 'ps'.\n\nThis stands for Process Status; it's how you check what programs are running on your computer. From the looks of it, you seem to have Spotify, Discord, VSCode, and Steam open. \n\nOh? But what's this? 'definitelyNotaTr0jAn.exe'?? Do you even remember opening this?\n\nStop the process, it's probably not a good idea to have a trojan running on your computer... You can kill a process by running the command:\n\n'kill <id>'\n\nLooks like the id here is '4166002'. Give that a try.",
        "kill 4166002": "Should've done this sooner, at least you didn't log into your bank account while it was running... Did you?",
        "kill 1304244": "Do you just not like music? Run 'music' if you change your mind...",
    }