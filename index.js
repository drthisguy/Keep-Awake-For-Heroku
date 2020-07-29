const inquirer = require("inquirer"),
    colors = require("console-colors-2"),
    ioHook = require('iohook'),
    axios = require("axios");
    
'use strict';
const line = new inquirer.Separator(),
    { sp: { reset } } = colors,
    { fg: color } = colors;

// prompt user: 
(() => {
    console.clear();
    return inquirer.prompt(
        {
        type: "rawlist",
        name: "program",
        prefix: '*',
        message: `${color.green}Keep Heroku Alive.${reset} \n${line}\n Welcome`,
        choices: ["Start pinging a new page?", `${color.red}Quit Keep Alive${reset}`]
        }
    )
  })().then(({ program }) => {
      if (program === "Start pinging a new page?") {
        promptSchedule();
      }
        else {
            console.log(`${color.blue}Have a great day!${reset}`);
            process.exit([0]);
        }
    })
  .catch( err => console.log(err)) 

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
        
        default:

        conditions = "() => true;"
        runSchedule(site, conditions)
    }
}

const runSchedule = (url, conditions) => {

    const loadSite = async () => {
        const now = new Date();

        try {
        if (eval(conditions)) {
            
            await axios.get(url)
            console.log(`${color.green + url + reset} pinged successfully on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`)
        }
      } catch (err) {console.log(err)}
    }
    loadSite()
    promptAdd()
    setInterval(() => {
        loadSite()
    }, 5000);
    ioHook.start();
}
    
ioHook.on("keyup", event => {
    const { keycode } = event;
    if(keycode) {
        console.log(`${color.blue}Have a great day!${reset}`);
        process.exit([0]);
    }
})

const promptSchedule = () => {

    return inquirer.prompt([
        {
        type: "input",
        name: "site",
        message: "Type in the URL for the website you would like to keep active\n"
        },
        {
        type: "rawlist",
        name: "schedule",
        message: "On which schedule would you like to keep your site loaded to the server?\n",
        choices: ["Weekday Working Hours (8am-5pm)", line,"Full Weekdays (8am-8pm)", line, "Weekdays (24hrs/day)", line, "24hr/7days a Week\n"]
        }
      ])
    .then( answers => scheduleCalls(answers))
    .catch( err => console.log(err)) 
},

promptAdd = () => {

    return inquirer.prompt([
        {
        type: "confirm",
        name: "add",
        message: "Would you like to keep another website awake?"
        }
      ])
    .then(({ add }) => {
        if(add){
            promptSchedule();
        } else {
            console.clear()
            console.log(`${color.cyan}Terrific!${reset} \n We'll keep this going then...`)
        }
    })
    .catch( err => console.log(err)) 
}