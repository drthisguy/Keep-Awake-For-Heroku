# Keep-Awake-For-Heroku
CLI intended to keep heroku applications loaded onto their server for faster loading.  

# About This
Using the free Dynos with Heroku, your webapps will unload from the server after about 30mins of inactivity.  This could cause the load time for the next visit to take as long as 10-15 seconds.  This application will monitor your websites and ping it every 29mins to keep them loaded onto the server for faster load times. The catch is that Heroku has a limit of 1000 hours of free server time each month.  Thats more than enough to keep one page loaded 24/7 for the month. but with two pages, you'll last around 3 weeks.  Keep Awake for Heroku allows users to schedule the monitor times with pre-configured schedules such as work days and work hours (local time).  Knowing that most people with free Dynos may only be using their pages for demonstration purposes, this app will allow you to keep several more apps up and running during the times you need them to be, over an ordinary monitoring service.


# To use:  
Clone and type from the root directory "npm install && npm start"   


# Notes
This is suitable for myself and most people's purposes, I'd imagine one day, I may update to allow for custom schedules.  
Feel free to email me any questions.  