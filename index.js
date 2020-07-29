const inquirer = require("inquirer"),
    colors = require("console-colors-2"),
    axios = require("axios");
    
'use strict';
const line = new inquirer.Separator();

// prompt users: 
(() => {
    console.clear();
    return inquirer.prompt(
        {
        type: "rawlist",
        name: "program",
        prefix: '*',
        message: `${colors.fg.green}Keep Heroku Alive.${colors.sp.reset} \n${line}\n Welcome`,
        choices: ["Start pinging a new page?", `${colors.fg.red}Quit Keep Alive${colors.sp.reset}`]
        }
    )
  })().then( ({ program }) => {
      if (program === "Start pinging a new page?") {
        promptSchedule();
      }
        else {
            console.log(`${colors.fg.blue}Have a great day!${colors.sp.reset}`);
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
        if (eval(conditions)) {
            
            await axios.get(url)
            console.log(`${url} pinged successfully on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`)
        }
    }

    setInterval(() => {
        loadSite()
    }, 1740000);
}, 

promptSchedule = () => {

    return inquirer.prompt([
        {
        type: "input",
        name: "site",
        message: "Type in the URL for the website you would like to keep active"
        },
        {
        type: "list",
        name: "schedule",
        message: "On which schedule would you like to keep your site loaded to the server?\n",
        choices: ["Weekday Working Hours (8am-5pm)", line,"Full Weekdays (8am-8pm)", line, "Weekdays (24hrs/day)", line, "24hr/7days a Week\n"]
        }
      ])
    .then( answers => scheduleCalls(answers))
    .catch( err => console.log(err)) 
}