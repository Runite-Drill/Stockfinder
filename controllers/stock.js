//Include models
const User = require("../models/User"); 
const Stock = require("../models/Stock");
const moment = require("moment");
// const Search = require("../helper/search");
const yahooFinance = require('yahoo-finance');

const axios = require('axios');


//HTTP GET - load stock detail
exports.stock_detail_get = (req, res) => {

    Stock.findOne({symbol: req.query.symbol})
    .then(stock=>{res.render("stock/detail", {stock})})
    .catch(err=>{
        console.log(err); 
        // res.send("Error displaying details for stock: " + err._message+'.')
        console.log(`Error displaying details for ${req.query.symbol}`)
    })
}

exports.stock_follow_get = (req,res) => {
    Stock.findOne({symbol: req.query.symbol})
    .then(stock=>{
        console.log('1')
        if (req.user) {
            console.log(`Following ${req.query.symbol}...`)
            User.findById(req.user.id, ((err, user)=>{
                console.log('2')
                console.log(user.stocksFollowed)
                console.log(stock._id)
                if (!user.stocksFollowed.includes(stock._id)) {
                    user.stocksFollowed.push(stock);
                    user.save()
                    .then(user=>{
                        console.log('3')
                        if (!stock.followers.includes(user._id)) {
                            stock.followers.push(user);
                            stock.save()
                            .then(()=>{
                                console.log('4'); res.redirect("back")})
                            .catch(err=>{
                                console.log(err); 
                                console.log(`Error updating follow details for ${req.query.symbol}.`)
                            })
                        }
                    })
                    .catch(err=>{
                        console.log(err); 
                        console.log(`Error displaying follow details for ${req.user.username}.`)
                    })
                }
            }))
        }
    })
    .catch(err=>{
        console.log(err); 
        console.log(`Error finding ${req.query.symbol} in database.`)
    })
}

exports.stock_unfollow_get = (req,res) => {
    Stock.findOne({symbol: req.query.symbol})
    .then(stock=>{
        if (req.user) {
            console.log(`Unfollowing ${req.query.symbol}...`)
            User.findById(req.user.id, ((err, user)=>{
                let index = user.stocksFollowed.findIndex(val=>val===stock._id)
                user.stocksFollowed.splice(index, 1);
                user.save()
                .then(user=>{
                    let index = stock.followers.findIndex(val=>val===user.id)
                    stock.followers.splice(index, 1);
                    stock.save()
                    .then(()=>{res.redirect("back")})
                    .catch(err=>{
                        console.log(err); 
                        console.log(`Error updating follow details for ${req.query.symbol}.`)
                    })
                })
                .catch(err=>{
                    console.log(err); 
                    console.log(`Error displaying follow details for ${req.user.username}.`)
                })
            }))
        }
    })
    .catch(err=>{
        console.log(err); 
        console.log(`Error finding ${req.query.symbol} in database.`)
    })
}