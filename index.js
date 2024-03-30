class SFile {
    #content;
    #readable;
    #sudo;
    name;
    constructor(name, readable, content, sudo = false) {
        this.name = name;
        this.#readable = readable;
        this.#sudo = sudo;
        this.#content = content;
    }
    get name() {
        return this.name
    }
    // set name(newName){
    //     this.name = newName
    // }
    get readable() {
        return this.#readable
    }
    get content() {
        return this.#content
    }
    get sudo() {
        return this.#sudo
    }

}

class Folder {
    #name;
    #contents;
    #parent;
    constructor(name, parent) {
        this.#name = name;
        this.#contents = [];
        this.#parent = parent;
        if (parent) {
            console.log(parent)
            parent.append(this)
        }
    }
    /**
     * @param {(arg0: SFile | Folder) => void} file
     */
    append(file) {
        this.#contents.push(file)
    }
    get name() {
        return this.#name
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

async function printChat(text) {
    let i = 0
    text += "\n"
    while (i < text.length) {
        chat.textContent += text.charAt(i);
        i++;
        await delay(10);
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

    const submit = document.createElement("input");
    submit.setAttribute("type", "submit");
    submit.setAttribute("style", "display: none")
    form.appendChild(submit)


    terminal.appendChild(line)
    cmdInput.focus()

    document.getElementById("cmdInput").onblur = function () {
        cmdInput.focus()
    };

    document.getElementById('cmdInput').addEventListener('keydown', function (event) {
        if (event.key === 'Tab') {
            event.preventDefault();
        }
        // TODO: autocomplete
    });

    form.onsubmit = function (event) {
        event.preventDefault();

        homeCMD.textContent += cmdInput.value

        parseAndRunCMD(cmdInput.value)

        cmdInput.removeEventListener('blur', function () {
            cmdInput.focus()
        });



        form.remove()

        historyIndex = 0
    };


}

async function parseAndRunCMD(cmd) {
    if (cmd != '')
        cmdHistory.push(cmd)
    if (cmdHistory.length > 50)
        cmdHistory = cmdHistory.slice(1)
    const parsedCMD = cmd.split(" ");

    switch (parsedCMD[0].toLowerCase()) {
        case ("clear"):
            terminal.textContent = ''
            break;
        case ('help'):
            printTerminal(helpMSG)
            break;
        case ('man'):
            if (!parsedCMD[1])
                printTerminal("Missing parameter <cmd>. \nSyntax: man <cmd>")
            else
                printManual(parsedCMD[1])
            break;
        case ("ch"):
            cmdHistory = ['']
            break;
        case ("ls"):
            let files = currentFolder.contents
            if (parsedCMD[1]){
                if (parsedCMD[1] == "-a") {
                    printChat("test")
                    printTerminal(files.map((file) => file.name).join("\t"))
                } else {
                    let newArr = files.filter(a => a.name.slice(0, 1) !== '.')
                    printTerminal(newArr.map((file) => file.name).join("\t"))
                }
            } else {
                let newArr = files.filter(a => a.name.slice(0,1) !== '.')
                printTerminal(newArr.map((file) => file.name).join("\t"))
            }
            break;
        case ("history"):
            printTerminal(cmdHistory.slice(1).join("\n") + "\n")
            break;
        case ("pwd"):
            printTerminal(currentFolder.rootPath)
            break;
        case ('rename'):
            if (!parsedCMD[1]) {
                printTerminal("Missing parameter <username>. \nSyntax: rename <username>")
            } else {
                username = parsedCMD[1].slice(0, 10)
            }
            break;
        case ('cat'):
            if (!parsedCMD[1]) {
                printTerminal("Missing parameter <filename>. \nSyntax: cat <filename>")
            } else {
                catFile(parsedCMD[1])
            }
            break;
        case (""):
            break;
        default:
            printTerminal(`${cmd}: command not found. Type 'help' to see a list of commands\n`)
            await printChat("bruh")
            break;
    }
    resetCMDLine();
    saveSession();
}


function saveSession() {
    localStorage.setItem("username", username);
    localStorage.setItem("cmdHistory", cmdHistory);
}

function catFile(target) {
    let files = userFolder.contents;
    for (let file of files) {
        if (file.name == target) {
            printTerminal(file.content)
            return;
        }
    }
    printTerminal(`File "${target}" not found.`)
}

const helpMSG = "Commonly used commands:\n" +
    "clear \t\t\t\t\t- Clear the terminal screen\n" +
    "ls\t\t\t\t\t\t- View the current folder's contents\n" +
    "man <cmd>\t\t\t\t- Explain the specified <cmd> in more detail\n" +
    "cd <folder>\t\t\t\t- Move yourself into the specified folder\n" +
    "cat <file> \t\t\t\t- Print out the contents of a file\n" +
    "rm <filepath>\t\t\t- Remove the specified file\n" +
    "mv <filepath> <dest>\t- Move the file <filepath> to <dest>\n" +
    "cp <filepath> <dest>\t- Copy the file <filpath> and paste it in <dest>\n" +
    "pwd\t\t\t\t\t\t- Show where you are located (Print Working Directory)\n" +
    "ps\t\t\t\t\t\t- Show currently running processes\n" +
    "kill <ID>\t\t\t\t- Kill the process with id <ID>\n" +
    "rename <username>\t\t- Set your username to <userame>\n"
    ;


function firstTimeStartup() {

}

var root = new Folder('/home/user', null);

var homeFolder = new Folder("home", root)
var userFolder = new Folder("user", homeFolder)
var desktopFolder = new Folder("Desktop", userFolder)
var homeFile = new SFile("FileX.net", "true", "hey now, you're an all star")

var secret = new SFile(".secret.md", "true", "Hello more experienced user! This game is meant for users who haven't touched an ounce of BASH or terminal based navigation but since you found this file, it seems you know your way around! Feel free to keep playing, but you will notice that some features may be missing")

userFolder.append(homeFile)
userFolder.append(homeFile)
userFolder.append(homeFile)
userFolder.append(homeFile)
userFolder.append(secret)
desktopFolder.append(homeFile)
desktopFolder.append(homeFile)
desktopFolder.append(homeFile)


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
    cmdInput.focus()
});





var bgm = new Audio('sounds/HacknetOSTNonCR.mp3');
var username = localStorage.getItem("username") != null ? localStorage.getItem("username") : "s-admin"
var cmdHistory = localStorage.getItem("cmdHistory") != null ? localStorage.getItem("cmdHistory").split(",") : [''];
var currentFolder = userFolder
var historyIndex = 0;

document.addEventListener("DOMContentLoaded", async function () {

    chat.textContent = ''
    terminal.textContent = ''

    const greeting = "Welcome to D3b1an XX.04.5 LTS.\n\n" +
        "25 updates can be applied immediately.\n" +
        "8 of these updates are standard security updates.\n\n" +
        "To view a list of commands, run:\n" +
        "help\n\n";
    printTerminal(greeting);
    resetCMDLine();


    await printChat('Welcome to ReUnix.')
    await delay(500)

    await printChat('\nYour guide in mastering the BASH terminal basics.\n')

    await delay(500)

    await printChat('To get started, try typing "help" in the terminal and ' +
        'pressing enter.')

    // create a start menu screen and wrap this in an event listener for the
    // start button
    bgm.volume = 0.30;
    bgm.play();

});
