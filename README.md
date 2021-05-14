**this app is basic backend stuckTrade tracker developed by me
**pls run npm install to run app locally
**to use db either install mongodb locally or use mongodb atlass 
**first make a get request to /login
**make a post request to /register with your email and password in json format
**you will get auth token, use token to login with your email and password 

** use get  /profile to get your profile
**use post /buyshares to add shares to user account note this is provided from abroker in front end but you can provide shares detaial **which includes symbol,company name, volume, rate, etc
**use   get /shares to get all your shares
**use /sellshares/shareid eg 32hex value from your available shares
**all routh is protected from unauthorised asses to data
** check for price update for a particular share us /qoute/symbol   symbol  is 3 values ie IBM


*******pls note you must register and login before you acces any of the routh except registeration routh***
