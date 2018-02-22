const Campaign = require('../models/Campaign.js');

function authorizeCampaign(req, res, next){
  Campaign.findById(req.params.id, (err, campaign) => {
    // If there's an error, forward it
    if (err)      { return next(err) }
    // If there is no campaign, return a 404
    if (!campaign){ return next(new Error('404')) }
    // If the campaign belongs to the user, next()
    if (campaign._creator.equals(req.user._id)){
      return next()
    } else {
    // Otherwise, redirect
      return res.redirect(`/campaigns/${campaign._id}`)
    }
  });
}

//este middleware es opcional.
//me explico, pueden utilizar en el ejs  el if (user._id === campaign._owner)
function checkOwnership(req, res, next){
  Campaign.findById(req.params.id, (err, campaign) => {
    if (err){ return next(err) }
    if (!campaign){ return next(new Error('404')) }
//podemos almacenar en res.locals cualquier dato que nos interesa a futuro
    if (campaign._creator.equals(req.user._id)){
      res.locals.campaignIsCurrentUsers = true;
    } else {
      res.locals.campaignIsCurrentUsers = false;
    }
    return next()
  });
}

module.exports = {authorizeCampaign,checkOwnership} ;