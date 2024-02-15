function printElement(text, type) {
    const element = document.createElement(type);
    element.textContent = text;
    terminal.appendChild(element);
}

function resetCMDLine() {
    const homeCMD = document.createElement("div")

    var username = "s-admin"
    const homeCMDtext = username + "@HomeDesktop:~$ ";
    homeCMD.textContent = homeCMDtext;

    const form = document.createElement("form");
    form.setAttribute("style", "display: inline")
    homeCMD.appendChild(form)

    const cmdInput = document.createElement("input");
    form.appendChild(cmdInput)

    const submit = document.createElement("input");
    form.appendChild(submit)
    submit.setAttribute("type", "submit");
    submit.setAttribute("style", "display: none")


    terminal.appendChild(homeCMD)
    cmdInput.focus()
    cmdInput.onblur = function() {
        cmdInput.focus()
    };

    form.onsubmit = function (event) {
        event.preventDefault();

        homeCMD.textContent += cmdInput.value

        parseAndRunCMD(cmdInput.value)
        
        cmdInput.remove()
        submit.remove()
    };
}


function parseAndRunCMD(cmd) {
    switch (cmd) {
        case ("clear"):
            terminal.innerHTML = ''
            break;
        case ('help'):
            printElement("\n", "p")
            const helpMSG = "test"
            printElement(helpMSG, "p")
            printElement("\n", "p")
            break;
        default:
            printElement("\n", "p")
            printElement("Command '" + cmd +"' not found. Type 'help' to see a list of commands ", "p")
            printElement("\n", "p") 
            break;
        }
    resetCMDLine();
}




document.addEventListener("DOMContentLoaded", function (event) {

    terminal.innerHTML = ''
    const greeting = "Welcome to Debian 22.04.1 LTS.\n\n25 updates can be " +
    "applied immediately.\n8 of these updates are standard security updates." +
    "\n\nTo view a list of commands, run:\nhelp\n\n";
    printElement(greeting, "p");


    resetCMDLine();
});
