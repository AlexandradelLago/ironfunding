const express = require('express');
const router  = express.Router();
const Campaign = require ("../models/Campaign.js")

/* GET home page. */
router.get('/', (req, res, next) => {
  Campaign.find({})
    .populate("_creator")
    .then(campaigns => {
      console.log(campaigns)
      res.render("index", {campaigns})
    })
    .catch (err => res.render("error"))   
});

module.exports = router;
