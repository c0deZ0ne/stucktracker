
const { isAuth } = require('../lib/authmiddleware');
const bodyParser = require('body-parser');
const urlencoded = bodyParser.urlencoded({ extended: false });
const UserShares = require('../models/UserShares');
const connection = require('../config/dbconnection');//getting to connect to perform action
const axios = require('../config/axiosConfig')
const finnhubClient = require('../config/finhubConfig');
const Messages = require('../config/activityStatus/MessageGen');
const User = connection.models.User//all seaches access user db model and find matches

module.exports = async function router(app) {
    // this contols routh and passing data to view engine
    app.post('/buyshares', isAuth, urlencoded, (req, res, next) => {
        const share = new UserShares(req.body, UserShares)
        let user = req.session.passport.user;// geting users from session 
        const { Rate, volume_bought, Status } = share;
        User.findById(user).then((result) => {
            if (!result) {
                res.message = new Messages(401, "Opps you must be loged in first :(");
                return res.status(400).json(result.message), next(null, res.message)

            } else {
                let before = result.Shares.length;

                let current_ballance = result.acountballance;

                if (!current_ballance > 0) {
                    return (res.status(200).json(new Messages(201, 'account ballance is too low')))

                } else {
                    let share_cost = Rate * volume_bought
                    if (current_ballance < share_cost) {
                        return (res.status(200).json(new Messages(201, 'account ballance is too low')));
                    }
                }
                result.Shares.push(share)
                result.save().then((result) => {
                    let after = result.Shares.length
                    if (after > before) {

                        let cost = Rate * volume_bought;
                        let accountBallance = current_ballance - cost
                        result.acountballance = accountBallance,
                            result.save().then(result => console.log(result.acountballance)).catch(
                                console.log('error updating acount ballance')
                            )
                        res.message = new Messages(200, " shares Aded bought successfully! :)");
                        res.status(200).json(res.message);
                    } else {
                        res.message = new Messages(401, "Opps shares not Added :(");
                        return res.status(400).json(res.message), next(null, res.message)
                    }
                })
            }
        });
    }).get("/shares", isAuth, (req, res, done) => {

        let user = req.session.passport.user;
        User.findById(user).then((user) => {
            User.findById(user).then(result => console.log(result.Shares))
            return (user.Shares.length < 1) ? res.status(200).json({ message: new Messages(204, 'no such '), data: 'you have no shares, you can add or create shares here http://localhost:3000/buyshares' }) : res.status(200).json({ message: new Messages(200, 'data found'), data: user.Shares })

        }).catch(
            console.log('there was exeption')
        )

    }).get('/quote/:symbole', isAuth, (req, res, next) => {

        let symbol = req.params.symbole;
        let user = req.session.passport.user;
        symbol = symbol.toUpperCase();

        finnhubClient.quote(`${symbol}`, (error, data, response) => {
            let lastupdate = Date.now()
            User.findById(user).then((result) => {
                let copyResult = result.Shares;
                // filter shares to be updated
                let filtershares = copyResult.filter((share) => share.symbole == `${symbol}`);
                (!filtershares.length > 0) ? res.status(200).json(new Messages(200, `${symbol} is not in your shares list`)) :
                    //console.log(filtershares);
                    filtershares.map((share) => {
                        if (share.symbole == `${symbol}`) {
                            const { symbole, CompanyNmae, _id } = share;
                            result.Shares.map((share) => { if (share._id == _id) { return share.Price_update.push(data) } });
                            result.stuckTracker.push({ _id, lastupdate: lastupdate, symbole, CompanyNmae, data });
                            result.save().then((doc) => { res.status(201).json({ messages: new Messages(201, 'stuckupdated success'), data }) })

                        } else {
                            return
                        }
                    });
            })
        })

    }).post("/sellshares/:id", isAuth, (req, res, next) => {
        //get shares update with axios
        let user = req.session.passport.user
        let shareId = req.params.id
        User.findById(user).then((result) => {
            soldShare = result.Shares.filter((share) => {
                return (share._id == `${shareId}`)//getting share with id and amout worth
            })
            if (!result.Shares.length > 0) {
                return res.status(200).json({ message: new Messages(204, 'no shares to sell') })
            } else if (!soldShare.length > 0) {
                return res.status(200).json({ message: new Messages(204, 'No succh share available '), availableShares: result.Shares })
            }
            !result ? res.status(200).json({ message: new Messages(204, ' no user') }) :
                soldShare.map((soldShare) => {
                    const { Rate, volume_bought, _id, symbole } = soldShare;

                    finnhubClient.quote(`${symbole}`, (error, data, response) => {
                        if (error) {
                            return res.status(200).json({ message: new Messages(200, "error updating current price") })
                        } else {

                            res.status(200).json(new Messages(200,"in progress"), data);
                            let price = data.pc * volume_bought;
                            console.log(data.pc)
                            result.acountballance += price;
                            let userShares = result.Shares.filter((share) => {
                                return (share._id != `${shareId}`)//removing share with id
                            })
                            result.Shares = userShares;//updating shares
                            result.save().then(() => { res.status(200).json({ message: new Messages(200, 'share sold success'), price, Shares: userShares }) })
                        }

                    })
                })

        }).catch(
            console.log('thre was error')
        )
    })
}
