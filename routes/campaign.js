const express  = require('express');
const Campaign = require('../models/Campaign');
const TYPES    = require('../models/campaign-types');
const router   = express.Router();
const { ensureLoggedIn }  = require('connect-ensure-login');
//Para hacer un populate hay que traer el modelo-extra
const User = require ("../models/User.js");
//esto es para subir multer
var multer  = require('multer');
var upload = multer({ dest: './public/uploads/' });


const {authorizeCampaign, checkOwnership} = require ("../middlewares/authorizationCampaign.js")


router.get('/new', (req, res) => {
    res.render('campaign/new', { types: TYPES });
  });


router.post('/new', ensureLoggedIn('/login'),upload.single('caballito'), (req, res, next) => {
    console.log(req.file)
    const newCampaign = new Campaign({
      title: req.body.title,
      goal: req.body.goal,
      description: req.body.description,
      category: req.body.category,
      deadline: req.body.deadline,
      _creator: req.user._id,
      pathPicture: `/uploads/${req.file.filename}`
    });
  
    newCampaign.save()
      .then(campaignCreated => res.redirect(`/campaign/${campaignCreated._id}`))
      .catch(err => ren.render("error"));
  });

router.get('/:id',checkOwnership , (req, res, next) => {
    Campaign.findById(req.params.id)
      .populate("_creator")
      .then(result => res.render("campaign/single", {campaign:result}))
  });

router.get('/:id/edit', ensureLoggedIn('/login'), authorizeCampaign, (req, res, next) => {
    Campaign.findById(req.params.id, (err, campaign) => {
      if (err)       { return next(err) }
      if (!campaign) { return next(new Error("404")) }
      return res.render('campaigns/edit', { campaign, types: TYPES })
    });
  });

router.post('/:id/edit', ensureLoggedIn('/login'), authorizeCampaign, (req, res, next) => {
    const updates = {
      title: req.body.title,
      goal: req.body.goal,
      description: req.body.description,
      category: req.body.category,
      deadline: req.body.deadline
    };
    Campaign.findByIdAndUpdate(req.params.id, updates, (err, campaign) => {
      if (err) {
        return res.render('campaigns/edit', {
          campaign,
          errors: campaign.errors
        });
      }
      if (!campaign) {
        return next(new Error('404'));
      }
      return res.redirect(`/campaigns/${campaign._id}`);
    });
  });


module.exports = router;





