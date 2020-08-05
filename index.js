const inquirer = require("inquirer"),
    colors = require("console-colors-2"),
    axios = require("axios");
    
'use strict';

const line = new inquirer.Separator(),
    { fg: color, sp: { reset } } = colors;
    

// prompt user: 
const start = () => {
    console.clear();
    return inquirer.prompt(
        {
        type: "rawlist",
        name: "program",
        prefix: '*',
        message: `${color.green}Keep Awake for Heroku Apps.${reset} \n${line}\n Welcome`,
        choices: ["Set up a keep awake Schedule to for your website?", `${color.red}Quit Keep Awake${reset}`]
        }
    )
  .then(({ program }) => {
      if (program === "Set up a keep awake Schedule to for your website?") {
        promptSchedule();
      }
        else {
            console.log(`${color.blue}Have a great day!${reset}`);
            process.exit();
        }
    })
  .catch( err => console.log(err)) 
}
start();

const scheduleCalls = ({ schedule, site }) => {
    let conditions;

    switch (schedule) {
        case "Weekday Working Hours (8am-5pm)":

        conditions = "(now.getDay() > 0 && now.getDay() < 6) && (now.getHours() > 7 && now.getHours() < 17)"
        runSchedule(site, conditions)
        break;

        case "Full Weekdays (8am-8pm)":

        conditions = "(now.getDay() > 0 && now.getDay() < 6) && (now.getHours() > 7 && now.getHours() < 20)"
        runSchedule(site, conditions)
        break;
        
        case "Weekdays (24hrs/day)":
        
        conditions = "now.getDay() > 0 && now.getDay() < 6"
        runSchedule(site, conditions)
        break;

        case "24hr/7days a Week":
        
        conditions = "() => true;"
        runSchedule(site, conditions)
        break;
        
        default:
        start();
    }
}

const runSchedule = (url, conditions) => {

    const loadSite = async () => {
        const now = new Date();

        try {
        if (eval(conditions)) {
            
            await axios.get(url)
            console.log(`${color.green + url + reset} pinged successfully on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}\n`)
        }
      } catch (err) {console.log(err)}
    }
    loadSite()
    instructUser()

    setInterval(() => {
        loadSite()
    }, 1740000);
   
    loadEventListeners();
},

instructUser = () => {

    printOut = () => {
    console.log(`\nPress "${color.red}Esc${reset}" to quit. \nOr press "${color.cyan}Ctrl + n${reset}" to add another site to Keep Awake.\n`)
    }
    printOut();
    setInterval(() => {
        printOut()
    }, 43200000);
}

//Arrow functions won't work properly here. 
function loadEventListeners() {
    process.stdin.setRawMode(true);
    process.stdin.resume()

    process.stdin.on('keypress', (ch, key) => {
        const { ctrl, name } = key;
        
        if (ctrl && name === 'n') {
            promptAdd();
        } 
        if (name === 'escape') {
            console.log(`${color.blue}Have a great day!${reset}`);
            process.exit();
        } 
    })
}

promptSchedule = () => {

    return inquirer.prompt([
        {
        type: "input",
        name: "site",
        message: "Type in the URL for the website you would like to keep awake\n"
        },
        {
        type: "list",
        name: "schedule",
        message: "On which schedule would you like to keep your site loaded to the server?\n",
        choices: ["Weekday Working Hours (8am-5pm)", line, "Full Weekdays (8am-8pm)", line, "Weekdays (24hrs/day)", line, "24hr/7days a Week", line, "Return to Main Menu", line]
        }
      ])
    .then( answers => scheduleCalls(answers))
    .catch( err => console.log(err)) 
},

promptAdd = () => {
    console.clear();

    return inquirer.prompt([
        {
        type: "confirm",
        name: "add",
        message: "Would you like to add another site to keep awake?"
        }
      ])
    .then(({ add }) => {
        if(add){
            promptSchedule();
        } else {
            console.log(`${color.cyan}Terrific!${reset} \n We'll keep this going then...`)
            loadEventListeners();
        }
    })
    .catch( err => console.log(err)) 
}