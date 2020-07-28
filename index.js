const inquirer = require("inquirer"),
    colors = require("console-colors-2"),
    axios = require("axios");

'use strict';

// prompt users: 
(() => {
    const separator = new inquirer.Separator();
  
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
      choices: ["Weekday Working Hours (8am-5pm)", separator,"Full Weekdays (8am-8pm)", separator, "Weekdays (24hrs/day)", separator, "24hr/7days a Week\n"]
      }
    ])
  })().then( answers => scheduleCalls(answers))
  .catch( err => console.log(err)) 

const scheduleCalls = ({ schedule, site }) => {
    let conditions;

    switch (schedule) {
        case "Weekday Working Hours (8am-5pm)":

        conditions = "(now.getDay() > 0 && now.getDay() < 6) && (now.getHours() > 8 && now.getHours() < 17)"
        runSchedule(site, conditions)
        break;

        case "Full Weekdays (8am-8pm)":

        conditions = "(now.getDay() > 0 && now.getDay() < 6) && (now.getHours() > 8 && now.getHours() < 20)"
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
}