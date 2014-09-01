(function(){
  var cliqueApp = angular.module('clique',['ui.router']);
  
  // configuring our routes 
  cliqueApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main', { // route to show our main page (/)
        url: '/',
        templateUrl: 'partials/main.html',
        controller: 'MainController'
      })
      .state('review', { // review page (/review)
        url: '/review',
        templateUrl: 'partials/review.html',
        controller: 'ReviewController'
      })
      .state('final', { // final overlay (/final)
        url: '/final',
        templateUrl: 'partials/final.html',
        controller: 'FinalController'
      });
       
    // catch all route: send users to the main page
    $urlRouterProvider.otherwise('/');
  });
  
  cliqueApp.directive('pickADate', function () {
    return {
      restrict: "A",
      link: function (scope, element) {
        element.pickadate({
          min: new Date(), // minimum date = today
          max: +365, // maximum date = 1 year from now
          clear: '', // disable 'Clear' button
          format: 'Sen!d on mmm. dd, yyyy', // use '!' to escape any "rule" characters
          onSet: function(){
            var date = this.get('select', 'yyyy-mm-dd'); // 'this' refers to element.pickadate()
            scope.$apply(function(){
              scope.formData.Date = date;
            });
          },
          onClose: function(){
            element.blur(); // remove focus from input element
          }
        });
        
        var picker = element.pickadate('picker');
        
        var setTodayImg = $('#sendToday');
        setTodayImg.on('click', function(event){
          picker.set('select', new Date()); // set picker to today --> triggers onSet()
        });
        
        var setOnDateImg = $('#sendOnDate');
        setOnDateImg.on('click', function(event){
          picker.open();
          $(['#clique_senddate_selection', '#clique_senddate'].toString()).removeClass('nextinput');
          event.stopPropagation(); // stop click event outside of input from triggering picker.close()
        });
      }
    };
  });
  
  cliqueApp.controller('BuyerController', function($scope){
    // we will store all of our form data in this object
    $scope.formData = {
      To: '',
      From: '',
      Amount: '',
      Code: '',
      Occasion: '',
      Date: '',
      CreditCardNumber: '',
      ExpireMonth: '',
      ExpireYear: '',
      CVV: '',
      Zipcode: '',
      PhoneNumber: '',
      Email: '',
      Icon: '',
      UniqueLink: ''
    };
    
    // function to process the form
    $scope.processForm = function() {
      alert('awesome!');  
    };
  });
  
  cliqueApp.controller('MainController', ['$scope', 'TextService', 'OccasionService',
                                  function($scope,   TextService,   OccasionService){
    /**********
    * Amount
    **********/
    $scope.prices = [2,25,50,75,100,250,500];
    $scope.setAmount = function(newAmount){
      $scope.formData.Amount = newAmount;
      $('#localStreetNoBlur').addClass('blur'); // uses CSS Blur Filter
      $(['#clique_amt_selection', '#clique_amt'].toString()).addClass('valid');
    };
    $scope.isAmount = function(checkAmount){
      return $scope.formData.Amount == checkAmount; // boolean
    };
    
    /**********
    * Clique Code
    **********/
    $scope.flipCard = function() {
      $('.card').addClass('flipped');
    };
    
    $scope.getStoreName = function() {
      $scope.storeName = 'Doly\'s Delectibles';      
    };
    
    /**********
    * Occasion
    **********/
    // import occasions: $scope.occasions.left_column, $scope.occasions.right_column
    $scope.occasions = OccasionService;
    
    // set default img
    $scope.occasions.selectedImg = 'images/occasion-custom-icon-blk.png';
    
    $scope.occasions.charsLeft = 100;
    var occCharLimit = 100; // no need to include the character limit inside $scope
    
    $scope.setOccasion = function(occasion){
      // change occasion text only if a new occasion is selected
      if ($scope.formData.Icon != occasion.name) {
        $scope.formData.Occasion = occasion.text;
        $scope.formData.Icon = occasion.name;
        $scope.occasions.selectedImg = occasion.images.selected;
      }
      $scope.limitOccText();
    };
    
    $scope.limitOccText = function() {
      textarea = $('#clique_input_occasion');
      textarea.val(textarea.val().replace(/(\r\n|\n|\r)/gm,"")); // remove all line breaks
      $scope.occasions.charsLeft = TextService.limit($scope.formData.Occasion, occCharLimit);
    };
    
    /**********
    * Date
    **********/
    // set default img
    $scope.dateTypeImg = 'images/send-today-blk.png';
    
    $scope.setDateType = function(type) {
      if(type=='today')
        $scope.dateTypeImg = 'images/send-today-blk.png';
      else if(type=='choose')
        $scope.dateTypeImg = 'images/send-on-date-blk.png';
    };
    
    /**********
    * Payment
    **********/
    $scope.setExpireMonthAndYear = function(){
      res = $scope.Expiry.split(' / ');
      $scope.formData.ExpireMonth = res[0];
      $scope.formData.ExpireYear = res[1];
    };
    
    // set default img
    $scope.cardTypeImg = 'images/cc-basic-blk.png';
    
    $scope.updateCreditCardImg = function(){
      $scope.cardTypeImg;
      switch ($.formance.creditCardType($scope.formData.CreditCardNumber)) {
        case 'amex':
          $scope.cardTypeImg = 'images/cc-amex-blk.png';
          break;
        case 'discover':
          $scope.cardTypeImg = 'images/cc-discover-blk.png';
          break;
        case 'mastercard':
          $scope.cardTypeImg = 'images/cc-mastercard-blk.png';
          break;
        case 'visa':
          $scope.cardTypeImg = 'images/cc-visa-blk.png';
          break;
        default:
          $scope.cardTypeImg = 'images/cc-basic-blk.png';
      };
    };
    
    
    /**********
    * Validation
    **********/
    jQuery(function($){
      fields = ['credit_card_number',
                'credit_card_expiry',
                'credit_card_cvc',
                'number',
      ];

      $.each( fields, function (index, value) {
        $('input.'+value).formance('format_'+value);
      });
    });
    
    $scope.dirty = {
      To: false,
      From: false,
      Amount: true,
      Code: false,
      Occasion: false,
      Date: false,
      CreditCard: false
    };
    
    $scope.valid = {
      To: false,
      From: false,
      Amount: false,
      Code: false,
      Occasion: false,
      Date: false,
      CreditCard: true
    };
    
    var fieldOrder = ['To', 'From', 'Amount', 'Code', 'Occasion', 'Date', 'CreditCard'];
    
    // var elems = {
      // Amount: '#clique_amt_wrapper',
      // Code: '#clique_code_wrapper',
      // Occasion: '#clique_occasion_wrapper',
      // Date: '#clique_senddate_wrapper',
      // CreditCard: '#clique_CreditCard'
    // };
    
    $scope.isNextInput = function(input) {
      // this function returns true only if 'input' is not dirty and the element before 'input' is not valid
      thisIndex = fieldOrder.indexOf(input);
      return !$scope.dirty[fieldOrder[thisIndex]] && !$scope.valid[fieldOrder[thisIndex-1]];
    };
    
    $scope.allDirtyBefore = function(input) {
      // this function returns true only if all elements before 'input' are dirty
      thisIndex = fieldOrder.indexOf(input);
      for(i=0; i<thisIndex; i++) {
        if (!$scope.dirty[fieldOrder[i]]) 
          return false;
      }
      return true;
    };
    
    $scope.$watchCollection('formData', function(newVals, oldVals) {
      for(i=0; i<fieldOrder.length-1; i++) { // do not include Credit Card
        var field = fieldOrder[i];
        if(newVals[field] != oldVals[field]) {
          var val = newVals[field];
          if(val) { // if val exists
            $scope.dirty[field] = true;
            $scope.valid[field] = $scope.checkValid(field,val);
          };
          console.log(fieldOrder[i] + ': ' + val + ' - dirty=' + $scope.dirty[field] + ', valid=' + $scope.valid[field]);
        }
      };
      
      $scope.mainInvalid = false;
      for(i=0; i<fieldOrder.length; i++) {
        if (!$scope.valid[fieldOrder[i]]) 
          $scope.mainInvalid = true;
      };
      console.log('mainInvalid = ' + $scope.mainInvalid);
    });
    
    $scope.checkValid = function(field, val) {
      switch(field) {
        case 'To':
          return val.length > 0 && val.length <= 16;
          break;
        case 'From':
          return val.length > 0 && val.length <= 16;
          break;
        case 'Amount':
          return $scope.prices.indexOf(val) != -1;
          break;
        case 'Code':
          if (/^\d{5}$/.test(val)) { // only digits, exactly 5 digits in length
            $('#clique_code .checkmark').css('visibility','visible');
            return true;
          }
          else {
            $('#clique_code .checkmark').css('visibility','hidden');
            return false;
          }
          break;
        case 'Occasion':
          return val.length > 0 && val.length <= 100;
          break;
        case 'Date':
          return true; // NEEDS BETTER VALIDATION
          break;
        case 'CreditCard':
          // if ($scope.checkValid('CreditCardNumber') &&
              // $scope.checkValid('ExpireMonth') &&
              // $scope.checkValid('ExpireYear') &&
              // $scope.checkValid('CVV') &&
              // $scope.checkValid('Zipcode'))
            // return true;
          // else
            // return false;
          return true;
          break;
        case 'CreditCardNumber':
          return $('#clique_input_creditcardnumber').formance('validate_credit_card_number');
          break;
        case 'ExpireMonth':
          return true;
          break;
        case 'ExpireYear':
          return true;
          break;
        case 'CVV':
          return $('#clique_input_cvv').formance('validate_credit_card_cvc');
          break;
        case 'Zipcode':
          return /^\d{5}$/.test(val);
          break;
      }
    };
  }]);
  
  cliqueApp.controller('ReviewController', ['$scope', function($scope){
    // Scroll to top of page
    window.scrollTo(0, 0);
  
    /**********
    * Validation
    **********/
    jQuery(function($){
      fields = ['email',
                'phone_number'
      ];

      $.each( fields, function (index, value) {
        $('input.'+value).formance('format_'+value)
          .parent()
            .append('<label class=\'control-label\'></label>');

        $('input.'+value).on('keyup change blur', function (value) {
          return function (event) {
            $this = $(this);
            if ($this.formance('validate_'+value)) {
              $this.parent()
                .removeClass('has-success has-error')
                .addClass('has-success')
                .children(':last')
                  .text('Valid!');
            } else {
              $this.parent()
                .removeClass('has-success has-error')
                .addClass('has-error')
                .children(':last')
                  .text('Invalid');
            }
          }
        }(value));
      });
    });
    
    $scope.test = function() {
      alert('hi');
    }
  }]);
  
  cliqueApp.controller('FinalController', function(){
    //
  });
  
  cliqueApp.factory('TextService', function(){
    var TextService = {};
    TextService.limit = function(text, charLimit) {
      // if text is undefined or null, set equal to empty string
      if (typeof text != 'string') text = '';
      charsLeft = 0;
      if (text.length > charLimit)
        text = text.substring(0, charLimit); // trim text to charLimit
      else
        charsLeft = charLimit - text.length;
      return charsLeft;
    };
    return TextService;
  });
  
  cliqueApp.factory('OccasionService', function(){
    var occasions = [
      {
        name: 'birthday',
        images: {
          normal: 'images/occasion-birthday-icon-wht.png',
          selected: 'images/occasion-birthday-icon-blk.png'
        },
        alt: 'Birthday',
        text: 'Variety is the spice of life. So I’m giving you the gift of choice!'
      },
      {
        name: 'anniversary',
        images: {
          normal: 'images/occasion-anniversary-icon-wht.png',
          selected: 'images/occasion-anniversary-icon-blk.png'
        },
        alt: 'Anniversary',
        text: 'You remind me of time itself for you are my Past, Future, and Forever. Happy Anniversary!'
      },
      {
        name: 'love',
        images: {
          normal: 'images/occasion-love-icon-wht.png',
          selected: 'images/occasion-love-icon-blk.png'
        },
        alt: 'I Love You',
        text: 'I Iove you for all that you are, all you have been, and all you\'re yet to be.'
      },
      {
        name: 'getwell',
        images: {
          normal: 'images/occasion-getwell-icon-wht.png',
          selected: 'images/occasion-getwell-icon-blk.png'
        },
        alt: 'Get Well',
        text: 'I look forward to your speedy recovery. Get well soon!'
      },
      {
        name: 'congrats',
        images: {
          normal: 'images/occasion-congrats-icon-wht.png',
          selected: 'images/occasion-congrats-icon-blk.png'
        },
        alt: 'Congrats',
        text: 'Spread joy. Chase your wildest dreams. Congratulations!'
      },
      {
        name: 'wedding',
        images: {
          normal: 'images/occasion-wedding-icon-wht.png',
          selected: 'images/occasion-wedding-icon-blk.png'
        },
        alt: 'Wedding',
        text: 'Falling in love is easy. Staying in love is AMAZING. Congrats on your marriage!'
      },
      {
        name: 'baby',
        images: {
          normal: 'images/occasion-baby-icon-wht.png',
          selected: 'images/occasion-baby-icon-blk.png'
        },
        alt: 'Baby',
        text: 'Congratulations on the birth of your child!'
      },
      {
        name: 'sympathy',
        images: {
          normal: 'images/occasion-sympathy-icon-wht.png',
          selected: 'images/occasion-sympathy-icon-blk.png'
        },
        alt: 'Sympathy',
        text: 'Our collective hearts are heavy with sympathy.'
      },
      {
        name: 'thankyou',
        images: {
          normal: 'images/occasion-thankyou-icon-wht.png',
          selected: 'images/occasion-thankyou-icon-blk.png'
        },
        alt: 'Thank You',
        text: 'You’re the best! You deserve some retail therapy.'
      },
      {
        name: 'custom',
        images: {
          normal: 'images/occasion-custom-icon-wht.png',
          selected: 'images/occasion-custom-icon-blk.png'
        },
        alt: 'Custom',
        text: 'If you want to be loved for who you are, just be yourself.'
      }
    ];
    return occasions;
  });
})();