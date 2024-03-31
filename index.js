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
        await delay(10);
        document.getElementById("chat").scrollTo(0, document.body.scrollHeight)
    }
}

function printManual(cmd) {
    switch (cmd) {
        case ("man"):
            printTerminal("Here is the manual page for the command:")
            printTerminal("man")
            break;
        default:
            printTerminal(`Command ${cmd} not found.`)
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
                "rename <username>\t\t- Set your username to <username>\n"
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
    }
    currentFolder.contents[arguments[1]] = Object.assign({}, selectedItem)
    currentFolder.contents[arguments[1]].name = arguments[1]

}

function moveFile(arguments) {
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
    document.getElementById("chat").scrollTo(0, document.body.scrollHeight)


    // create a start menu screen and wrap this in an event listener for the
    // start button
    bgm.volume = 0.30;
    bgm.play();
}

async function gameLoop() {
    let latestCMD;
    while (true) {
        if (chatEventQueue.length) {
            await printChat("\n" + chatEventQueue.shift())
            saveSession();
        }

        // console.log("ticking...")

        latestCMD = cmdHistory[cmdHistory.length - 1].toLowerCase()

        await delay(500)
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
    document.getElementById("cmdInput").focus()
});



var root = new Folder('root', null);

var homeFolder = new Folder("home", root)
var userFolder = new Folder("user", homeFolder)
var desktopFolder = new Folder("Desktop", userFolder)

var homeFile = new SFile("notepad.txt", "true", "hey now, you're an all star")
var desktopFile = new SFile("desktop.txt", "true", "yay, you found the file")

var secret = new SFile(".secret.md", "true", "Hello more experienced user! This game is meant for users who haven't touched an ounce of BASH or terminal based navigation but since you found this file, it seems you know your way around!\n\nFeel free to keep playing, but you WILL notice that most BASH functionality will be missing!")

userFolder.append(homeFile)
userFolder.append(secret)
desktopFolder.append(desktopFile)

var bgm = new Audio('sounds/HacknetOSTNonCR.mp3');
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


document.addEventListener("DOMContentLoaded", async function () {
    firstTimeStartup()
    await gameLoop()
});




const storyCommands = [
    {
        "command": "help",
        "chat": "Great, you got it!\n\nThis is a list of commands that are most commonly used in BASH navigation. It may be a lot but you can and will surely master them all!\n\nTry taking a look around your current position. Type the command 'ls'."
    },
    {
        "command": "ls",
        "chat": "Nice! The terminal should've printed the contents of your current folder.\n\nThe bolded 'Desktop' means that this is a folder and the regular highlighted text means that it is a file.\n\nJust like you would have folders and files that you can see when you open File Explorer on Windows or Finder on MacOS, you can navigate through a file system using just text! \n\nLet's try seeing what's inside of the text file. Type 'cat notepad.txt'"
    },
    {
        "command": "cat notepad.txt",
        "chat": "Weird note, I wonder if it's a pop culture reference or something.\n\nThe command 'cat' stands for concatinate. You usually use this command to combine two files and print their contents to the terminal, but here we only wanted print out what was inside the file.\n\nAll you need to know is that 'cat' is a great command for peeking into files!"
    },
]

var asyncCommands = [
    {
        "command": "ls -a",
        "chat": "Oh.. looking for secrets maybe?"
    },
]