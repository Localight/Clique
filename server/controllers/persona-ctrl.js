'use strict';

var Persona = require('../models/persona') // require personas model
var twilio = require('../services/twillio-service'); // require twilio service
var balanced = require('./balanced-ctrl');
var mailgun = require('../services/mailgun-service'); // require mailgun service
var uuid = require('node-uuid');

function createBuyer(request, response) {

  // find Buyer with unqiueLink
  Persona.findOne(
    {'cliqueCards.uniqueLink': request.body.UniqueLink}
  )
  .exec(function(err, persona) {
    if (err) {
      console.log('saveBuyerCardId error: ', err);
    }

    // discern type of Clique Card User
    if (persona.basicProfile.typeOfUser == "recipient") {
      persona.basicProfile.typeOfUser = "both"
    }
    else {
     persona.basicProfile.typeOfUser = "buyer" 
    }

    // loop through Buyer's cliqueCards to find correct card to manipulate data
    for (var i=0; i<persona.cliqueCards.length; i++){
      if (persona.cliqueCards[i].uniqueLink == request.body.UniqueLink) {

        // save card href created by BP for user
        persona.basicProfile.bpCardId = request.body.fundingInstrument.href;

        // change status of card to activated
        persona.cliqueCards[i].status = "activated"; // "loaded" designates credits

        // create profile for Buyer
        persona.basicProfile.firstName = request.body.From;
        persona.basicProfile.contact.mobileNumber = request.body.PhoneNumber;
        persona.basicProfile.contact.email =  request.body.Email ;
        
        // create gift card for Buyer
        persona.cliqueCards[i].amount = request.body.Amount;
        persona.cliqueCards[i].giftRecipient = request.body.To;
        persona.cliqueCards[i].occassion = request.body.Occasion;
        persona.cliqueCards[i].cliqueCardCode = request.body.Code;
        persona.cliqueCards[i].typeOfCard = "purchased"; 
        // persona.cliqueCards.cliqueId = link; // not working yet
      }
    }

    // save newly created Persona basicProfile and 
    persona.save(function(err, persona) {
      if (err) {
        console.log('saveBuyerCardId error: ', err);
      }
      console.log('Buyer Persona and Card created');

      // debit Buyer's newly created credit card
      balanced.debitBuyerCard({bpCardId: persona.basicProfile.bpCardId});
      console.log('Buyer card debited');

      // date for email receipt
      var date = new Date();

      // create/send email receipt
      mailgun.sendEmail(
        'gift-confirm@clique.cc',
        request.body.Email,
        'From: gift-confirm@clique.cc' +
          '\nTo: ' + request.body.Email +
          '\nContent-Type: text/html; charset=utf-8' +
          '\nSubject: Your Clique Card has been sent!' +
          // '\n\nYou have just sent '+ request.body.To +' a $'+ request.body.Amount +' Clique Gift Card.',
          '\n\n'+ request.body.From +', your gift of $'+ request.body.Amount +' is on it&#39;s way to '+ request.body.To +'! With the CLIQUE Local Gift Card you can apply your gift toward purchases at numerous locally-owned merchants in the Long Beach area, including Doly&#39;s Delectables at 245 E Broadway, Long Beach, CA.<br><br>'+' CLIQUE stands for...'+'Cooperative of Local Independent Quality Urban Establishments<br>'+'<em>Yes, that&#39;s a mouthful :-)</em><br><br>'+' CLIQUE is a Localism Project.'+' Did you know three times more money stays in our local economy when we buy from local businesses instead of big chains? That translates to more local jobs, and more of the unique shops, eateries and other businesses that give our city it&#39;s character. Make a difference with your dollars and support independent merchants.<br><br>'+' ~ The Localism Team<br><br>'+' Visit Localism.co to see what we&#39;re all about!<br><br>'+'________________________________<br><br>'+'GIFT RECEIPT '+ date +'<br><br>Amount: $'+ request.body.Amount +' Sent to '+ request.body.To +' at '+ request.body.PhoneNumber +'<br><br>Transaction ID: '+ request.body.UniqueLink + '<br><br>________________________________<br><br>'+'235 E Broadway '+'Eighth Floor '+'Long Beach, CA 90802 '+'<br><br>© 2014 Localism Inc. All rights reserved. '+'<br><br>Questions? Call is at (877) 752-1550 or email hello@localism.co',
        function(err) { 
          if (err) {
            console.log(err);
            return response.end(500, err);
          } 
          response.end();
        }
      );

    });

  });  

}


function createRecipient(request, response){

  var to = request.body.PhoneNumber; // Recipient number
  var from = '15622836856'; // twilio account number

  // pass along unique id
  var uniqueLink = request.body.UniqueLink;

  // create Recipient's profile
  var persona = new Persona({
    basicProfile: {
      firstName: request.body.To,
      contact: {
        mobileNumber: request.body.PhoneNumber
      }
    }
  });

  // discern type of Clique Card User
  if (persona.basicProfile.typeOfUser == "buyer") {
    persona.basicProfile.typeOfUser = "both"
  }
  else {
   persona.basicProfile.typeOfUser = "recipient" 
  }
  console.log(request.body);
  // create Recipient card
  var card = {

    amount: request.body.Amount,
    giftBuyer: request.body.From,
    occassion: request.body.Occasion,
    cliqueCardCode: request.body.Code,
    typeOfCard: "received", 
    status: "activated" // "loaded" designates credits

  };

  // add card to Recipient's array of cards
  persona.cliqueCards.push(card);

  //  save newly created instance Recipient persona
  persona.save(function(err, person){
    if (err) {
      console.log('unable to create Recipient b/c err: ', err);
    }
    console.log('Recipient Persona and Card created');

    // create unique URI path for recipient landing page
    var uniqueCreditLink = 'clique.cc/recipient-gift-card/' + uniqueLink;

    // get icon type for icon and message in sms message
    var iconType = request.body.Icon;

    if (iconType == 'birthday') {
      var icon = '🍰';
      var message = icon + request.body.To + ', ' + request.body.From + ' sent you a $' + request.body.Amount + ' gift for your birthday! View it here ▸ ' + uniqueCreditLink;  
    }
    else if (iconType == 'wedding'){
      var icon = '💍';
      var message = icon + request.body.To + ', ' + request.body.From + ' sent you a $' + request.body.Amount + ' wedding gift! View it here ▸ ' + uniqueCreditLink;  
    }    
    else if (iconType == 'anniversary'){
      var icon = '💞';
      var message = icon + request.body.To + ', ' + request.body.From + ' sent you a $' + request.body.Amount + ' gift for your anniversary! View it here ▸ ' + uniqueCreditLink;  
    }    
    else if (iconType == 'baby'){
      var icon = '🚼';
      var message = icon + request.body.To + ', ' + request.body.From + ' sent you a $' + request.body.Amount + ' gift for your baby! View it here ▸ ' + uniqueCreditLink;        
    }    
    else if (iconType == 'love'){
      var icon = '💝';
      var message = icon + request.body.To + ', ' + request.body.From + ' sent you a $' + request.body.Amount + ' gift! View it here ▸ ' + uniqueCreditLink;        
    }    
    else if (iconType == 'sympathy'){
      var icon = '💐';
      var message = icon + request.body.To + ', ' + request.body.From + ' sent you a $' + request.body.Amount + ' gift and a thoughtful note. View it here ▸ ' + uniqueCreditLink;        
    }    
    else if (iconType == 'getwell'){
      var icon = '🎈';
      var message = icon + request.body.To + ', ' + request.body.From + ' sent you a $' + request.body.Amount + ' gift to cheer you up. View it here ▸ ' + uniqueCreditLink;        
    }    
    else if (iconType == 'thankyou'){
      var icon = '😊';
      var message = icon + request.body.To + ', ' + request.body.From + ' sent you a $' + request.body.Amount + ' gift to say thank you! View it here ▸ ' + uniqueCreditLink;        
    }    
    else if (iconType == 'congrats'){
      var icon = '🏆';
      var message = icon + request.body.To + ', ' + request.body.From + ' sent you a $' + request.body.Amount + ' gift to congratulate you! View it here ▸ ' + uniqueCreditLink;        
    }    
    else if (iconType == 'custom'){
      var icon = '🎁';
      var message = icon + request.body.To + ', ' + request.body.From + ' sent you a $' + request.body.Amount + ' gift! View it here ▸ ' + uniqueCreditLink;        
    } 

  if (message){
    // text unique recipient landing page link
    twilio.giftConfirmationText(to, from, message, 
      function(err, twilioResponse){
        if (err){
          console.log('twilio error ', err);
          response.json(500, {message: "Twilio message not sent"});
          return;
        }
        response.json({message: "Twilio message sent"});
    });
  }

  });

}


module.exports = {
  createBuyer: createBuyer,
  createRecipient: createRecipient
};