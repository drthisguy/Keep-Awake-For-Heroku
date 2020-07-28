const inquirer = require("inquirer"),
    axios = require("axios");

    // prompt users: 
(() => {
    const separator = new inquirer.Separator(),
          end = new inquirer.Separator('******END******');
  
    return inquirer.prompt([
      {
      type: "input",
      name: "site",
      message: "Type in the URL for the website you would like to keep active"
      },
      {
      type: "list",
      name: "schedule",
      message: "On which schedule would you like to keep your site loaded to the server?",
      choices: ["Weekday Working Hours (8am-5pm)", separator,"Full Weekdays (8am-9pm)", separator, "Weekdays (24hr)", separator, "24hr/7days a Week", end]
      }
    ])
  })().then( answers => scheduleCalls(answers))
  .catch( err => console.log(err)) 

const scheduleCalls = ({ site, schedule }) => {
    switch (schedule) {
        case"Weekday Working Hours (8am-5pm)":
            runSchedule(site)
            break;
    
        default:
            console.log('hit default')
            break;
    }
}

const runSchedule = url => {
    
    const loadSite = async () => {
        const now = new Date();
        if ((now.getDay() > 0 && now.getDay() < 6) && (now.getHours() > 9 && now.getHours() < 16)) {
            
            const awaken = await axios.get("https://pennypincha.herokuapp.com")
            console.log('hit', awaken);
        }
    }

    setInterval(() => {
        loadSite()
    }, 10000);
}