'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  uuid = require('node-uuid'),
  Schema = mongoose.Schema;

var PersonaSchema = new Schema({

  basicProfile: {
    firstName: String,
    bpCardId: String,
    typeOfUser: String, //buyer, recipient or both
    contact: {
      mobileNumber: String,
      email: {
        type: String,
        match: [/.+\@.+\..+/, 'Please enter a valid email']
      }
    }
  },
  cliqueCards: [{    // holds all cards user has texted for, but not yet activated.
    typeOfCard: String, // purchased or received
    issueDate: { type: Date, default: Date.now },
    activationDate: String,
    districtNumber: String,
    keyword: String,
    uniqueLink: String, 
    status: String, 
    amount: String,
    giftRecipient: String,
    giftBuyer: String,
    occassion: String,
    cliqueCardCode: String,
    mobileNumber: String,
    cliqueId: String,
    test: String
   }]
});

PersonaSchema.methods.generateUniqueLink = function(options, urlpath, callback) {
  
  // create random id for new Buyer
  var uniqueLink= uuid.v4();

  // create new credit object
  var newCredit = {
    districtNumber: options.districtNumber,
    keyword: options.keyword,
    uniqueLink: uniqueLink,
    status: 'new'
  };

  // add card to Buyer's collection of cliqueCards
  this.cliqueCards.push(newCredit);

  // save new inactive card
  this.save(function(err, persona) {
  if(err) {
    console.log('Unable to save new inactiveCard in generateUniqueLink: ', err);
  }
    // pass back URI w/uniqueLink/id for Buyer to follow
    callback(err, 'clique.cc/' + urlpath + uniqueLink);
  });

};

var findOrCreate = function(options, callback) {
 
  var Persona = this.model('persona');

  // check if persona already exists based of their mobile number
  this.model('persona').findOne({
    basicProfile: {
      contact: {
        mobileNumber: options.mobileNumber
      }
    }
  }, function(err, persona){
    if (err) {
      console.log('findOrCreate not working: ', err);
    }
    // if persona is found return persona data to be used in generateUniqueLink
    if (persona) {
      console.log(persona.basicProfile.contact.mobileNumber);
      console.log('persona already exists');
      return callback(null, persona);
    }
    // if person doesn't exist pull in data from options to create new Buyer data object
    console.log('create new persona');
    persona = new Persona({
      basicProfile: {
        contact: {
          mobileNumber: options.mobileNumber
        }
      },
      keyword: options.keyword // possibly take this out because recipient can't use this immediately
    });
    // on save, generate Unique Link for new Buyer
    persona.save(callback);
  });

};

PersonaSchema.set('versionKey', false);

PersonaSchema.plugin(function(schema, options) {
schema.static('findOrCreate', findOrCreate);
});

module.exports = mongoose.model('persona', PersonaSchema);