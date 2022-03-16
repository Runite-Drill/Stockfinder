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
    //either set the stock model here when the stock is followed, or create in the database when searched
    
    Stock.findOne({symbol: req.query.symbol})
    .then(stock=>{
        if (req.user) {
            console.log(`Following ${req.query.symbol}`)
            User.findById(req.user.id, ((err, user)=>{
                user.stocksFollowed.push(stock);
                user.save()
                .then(user=>{
                    stock.followers.push(user);
                    stock.save()
                    .then(()=>{res.redirect("back")})
                    .catch(err=>{
                        console.log(err); 
                        // res.send("Error displaying details for stock: " + err._message+'.')
                        console.log(`Error updating follow details for ${req.query.symbol}`)
                    })
                })
                .catch(err=>{
                    console.log(err); 
                    // res.send("Error displaying details for stock: " + err._message+'.')
                    console.log(`Error displaying follow details for ${req.user.username}`)
                })
            }))
        }
    })
    .catch(err=>{
        console.log(err); 
        // res.send("Error displaying details for stock: " + err._message+'.')
        console.log(`Error displaying details for ${req.query.symbol}`)
    })
  
}