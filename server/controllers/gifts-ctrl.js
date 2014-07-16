/**
 * Gifts page controller.
 * - checks the gift ID, finds the persona and renders the landing page for giving gifts.
 */

var Personas = require('../models/persona') // require personas model

// render view for Buyer landing page
function renderBuyer(request, response) {

  // console.log(request.params.id);
  var uniqueLink = request.params.id;

  // find person by param then render index page
  Personas.find({uniqueLink: request.params.id})
  .exec(function(err, persona){
    response.render('layouts/default', {persona: persona, uniqueLink: uniqueLink});
  });

}

// render view for Recipient landing page
function renderRecipient(request, response) {

  var uniqueLink = request.params.id;

  // find person by param then render index page
  Personas.find({uniqueLink: request.params.id})
  .exec(function(err, persona){
    response.render('layouts/recipient', {persona: persona, uniqueLink: uniqueLink});
  })  
  // response.render('layouts/recipient');
}

// render view for Redemption landing page
function renderRedemption(request, response) {
  response.render('layouts/redemption');
}

function postGift(req, res) {

}

module.exports = {
    renderBuyer: renderBuyer,
    renderRecipient: renderRecipient,
    renderRedemption: renderRedemption,
    postGift: postGift
};