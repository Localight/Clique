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
        
        // when "Send Today" is clicked, set picker to Today, but don't open the popup
        $('#sendToday').on('click', function(event){
          picker.set('select', new Date()); // set picker to today --> triggers onSet()
        });
        
        // when "Send On Date" is clicked, remove 'nextInput' class and open picker
        $('#sendOnDate').on('click', function(event){
          $('#clique_date_wrapper').removeClass('nextInput');
          picker.open();
          event.stopPropagation(); // stop click event outside of input from triggering picker.close()
        });
      }
    };
  });
  
  cliqueApp.controller('BuyerController', function($scope){
    // NOTE: only Javascript objects declared here will be accessible by child controllers
    // Primitive variable types will NOT be accessible by child controllers
    
    // we will store all of our form data in this object
    $scope.formData = {
      To: '',
      From: '',
      Amount: '',
      Code: '',
      Occasion: '',
      Date: '',
      CreditCardNumber: '',
      Expiry: '',
      CVV: '',
      ZIPcode: '',
      PhoneNumber: '',
      Email: '',
      Icon: '',
      UniqueLink: ''
    };
    
    // allocate validation variables
    $scope.pagesValid = {
      main: false,
      review: false
    };
    
    // function to process the form
    $scope.processForm = function() {
      // do some AJAX call to server only if both the main and review pages are valid
      if ($scope.pagesValid.main && $scope.pagesValid.review) {
        // disable the Submit Button on the review page to prevent processing
        // the form twice in case the user double-clicks on the Submit Button
        $scope.pagesValid.review = false;
        
        // make AJAX Call
        alert('awesome!');
      }
    };
  });
  
  cliqueApp.controller('MainController', function($scope, TextService, OccasionService){
    // on document load, give focus to "To" and make it the current input
    $( document ).ready(function() {
      $('#clique_input_to').focus().parent().addClass('currentInput');
    });
    
    // when an input or textarea is focused, scroll it to the top of the screen
    // use setTimeout so other DOM manipulation finishes before scroll happens
    $('input, textarea').on('focus', function() {
      elem = $(this)[0];
      setTimeout(function(){ elem.scrollIntoView(); }, 50);
    });
    
    // General show/hide function
    $scope.showHide = function(elemsToShow, elemsToHide) {
      $(elemsToShow).show();
      $(elemsToHide).hide();
    };
    
    // if any field after "To" becomes dirty, blur the background and stop watching $scope.dirty
    var background = $scope.$watchCollection('dirty', function() {
      for(i=1; i<fieldOrder.length; i++) { // start "i" at 1 to avoid "To"
        if ($scope.dirty[fieldOrder[i]]) {
          $('#localStreetNoBlur').addClass('blur'); // uses CSS Blur Filter
          background(); // de-register this listener once background is blurred
          break; // no need to check remaining fields once any field is not valid
        }
      };
    });
    
    /**********
    * To / From / Code
    **********/
    $('#clique_input_to, #clique_input_from, #clique_input_code')
      .on('blur', function() {
        $(this).parent().removeClass('currentInput');
      })
      .on('focus', function() {
        $(this).parent().removeClass('nextInput').addClass('currentInput');
    });
    
    /**********
    * Amount
    **********/
    // price options to display
    $scope.prices = [2,25,50,75,100,250,500];
    
    // set new amount
    $scope.setAmount = function(newAmount){
      $scope.formData.Amount = newAmount;
      $('#clique_amt').show();
      $('#clique_amt_selection').hide();
      
      // give focus to "From" if it isn't dirty yet
      if(!$scope.dirty.From) $('#clique_input_from').focus();
    };
    
    $scope.isAmount = function(checkAmount){
      return $scope.formData.Amount == checkAmount; // boolean
    };
    
    /**********
    * Clique Code
    **********/
    $scope.flipCard = function() {
      $('#flip_container').show();
      
      // delay the flip by 0.5 seconds
      window.setTimeout(function(){$('.card').addClass('flipped')}, 500);
    };
    
    $scope.getStoreName = function() {
      $scope.storeName = 'Doly\'s Delectibles'; // USING A PLACEHOLDER FOR NOW
    };
    
    $('#clique_code_message').on('click', function(){
      $('#flip_container, #clique_code').show();
      $('#clique_input_code').focus();
    });
    
    /**********
    * Occasion
    **********/
    // import occasions object from OccasionService
    $scope.occasions = OccasionService;
    
    // set default occasion icon to display
    $scope.occasions.selectedIcon = 'images/occasion-custom-icon-blk.png';
    
    $scope.occasions.charsLeft = 100;
    var occCharLimit = 100; // no need to include the character limit inside $scope
    
    $scope.setOccasion = function(occasion){
      // change occasion text only if a new occasion is selected
      if ($scope.formData.Icon != occasion.name) {
        $scope.formData.Occasion = occasion.text;
        $scope.formData.Icon = occasion.name;
        $scope.occasions.selectedIcon = occasion.images.selected;
      }
      $scope.limitOccText(); // limit occasion text to 100 characters
      
      $('#clique_occasion').show();
      $('#clique_occasion_selection').hide();
    	$('#clique_input_occasion').focus();
    };
    
    // calls on TextService to limit occasion text to 100 characters
    $scope.limitOccText = function() {
      var textarea = $('#clique_input_occasion');
      textarea.val(textarea.val().replace(/(\r\n|\n|\r)/gm,"")); // remove all line breaks
      $scope.occasions.charsLeft = TextService.limit($scope.formData.Occasion, occCharLimit);
    };
    
    // when occasion label is clicked, show occasion selection and focus on textarea
    $('#clique_occasion label').on('click', function() {
      $('#clique_occasion_selection').show();
      $('#clique_input_occasion').focus();
    });
    
    // hide #clique_occasion_selection when user clicks outside of #clique_occasion_wrapper
    var hide_clique_occasion_selection = function(event) {
      var occasionWrapper = $('#clique_occasion_wrapper')[0];
      
      // if event.target is outside of #clique_occasion_wrapper
      if(!$.contains(occasionWrapper, event.target) && event.target != occasionWrapper) {
        $('#clique_occasion_selection').hide();
        $('html').off('click', hide_clique_occasion_selection);
      }
    };
    
    // When #clique_input_occasion loses focus, only hide #clique_occasion_selection if the click was
    // outside of #clique_occasion_wrapper. This prevents #clique_occasion_selection from hiding when
    // the occasion label is clicked.
    $('#clique_input_occasion').on('blur', function() {
      // remove all previous click event listeners on $('html') to save memory
      $('html').off('click', hide_clique_occasion_selection);
      
      // add new click event listener to $('html')
      $('html').on('click', hide_clique_occasion_selection);
      
      $('#occCharCount').hide();
      $('#clique_occasion').removeClass('currentInput');
    });
    
    $('#clique_input_occasion').on('focus', function() {
      $('#clique_occasion').addClass('currentInput');
      $('#occCharCount').show();
    });
    
    /**********
    * Date
    **********/
    // set default img
    $scope.dateTypeImg = 'images/send-today-blk.png';
    
    // changes the date image based on what the user selects
    $scope.setDateType = function(type) {
      if(type=='today')
        $scope.dateTypeImg = 'images/send-today-blk.png';
      else if(type=='on-date')
        $scope.dateTypeImg = 'images/send-on-date-blk.png';
      
      $('#clique_date_selection').hide()
      $('#clique_date').show();
    };
    
    /**********
    * Payment
    **********/
    // $scope.setExpireMonthAndYear = function(){
      // res = $scope.Expiry.split(' / ');
      // $scope.formData.ExpireMonth = res[0];
      // $scope.formData.ExpireYear = res[1];
    // };
    
    // set default img
    $scope.cardTypeImg = 'images/cc-basic-blk.png';
    
    $scope.updateCreditCardImg = function(){
      var type = $.formance.creditCardType($scope.formData.CreditCardNumber);
      var acceptedTypes = ['amex', 'discover', 'mastercard', 'visa'];
      
      if(acceptedTypes.indexOf(type) != -1)
        $scope.cardTypeImg = 'images/cc-' + type;
      else
        $scope.cardTypeImg = 'images/cc-basic';      
      
      var filledIn = $('#creditcardnumbercontainer').hasClass('filledIn');
      if(filledIn)
        $scope.cardTypeImg += '-wht.png';
      else
        $scope.cardTypeImg += '-blk.png';
    };
    
    $scope.ccnFocus = function() {
      $('#creditcardnumbercontainer').removeClass('filledIn');
      $('#creditcardinfo').addClass('filledIn');
      $scope.updateCreditCardImg();
    };
    
    $scope.expiryFocus = function() {
      $('#creditcardnumbercontainer').addClass('filledIn');
      $('#creditcardinfo').removeClass('filledIn');
      $scope.updateCreditCardImg();
    };
    
    /**********
    * Validation
    **********/
    jQuery(function($){
      fields = ['credit_card_number', 'credit_card_expiry', 'credit_card_cvc', 'number'];

      $.each( fields, function (index, value) {
        $('input.'+value).formance('format_'+value);
      });
    });
    
    $scope.dirty = {
      To: false,
      Amount: false,
      From: false,
      Code: false,
      Occasion: false,
      Date: false,
      CreditCardNumber: false,
      Expiry: false,
      CVV: false,
      ZIPcode: false,
      ProceedButton: false
    };
    
    $scope.valid = {
      To: false,
      Amount: false,
      From: false,
      Code: false,
      Occasion: false,
      Date: false,
      CreditCardNumber: false,
      Expiry: false,
      CVV: false,
      ZIPcode: false
    };
    
    var fieldOrder = ['To', 'Amount', 'From', 'Code', 'Occasion', 'Date', 'CreditCardNumber', 'Expiry', 'CVV', 'ZIPcode'];
    
    $scope.isNextInput = function(input) {
      // this function returns true only if 'input' is not dirty and the element before 'input' is not valid
      thisIndex = fieldOrder.indexOf(input);
      return !$scope.dirty[fieldOrder[thisIndex]]; // && !$scope.valid[fieldOrder[thisIndex-1]];
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
    
    // watch each field separately
    angular.forEach(fieldOrder, function(field) { // for each field in fieldOrder
      $scope.$watch('formData.'+field, function (newVal, oldVal) {
        if(newVal) { // if newVal exists
          $scope.dirty[field] = true;
          $scope.valid[field] = $scope.checkValid(field,newVal);
        }
        else { // if newVal is null or undefined, then it is invalid
          $scope.valid[field] = false;
          
          // we still need to call checkValid with empty val so that checkmarks will be shown appropriately
          $scope.checkValid(field,'')
        }
        console.log(field + ': ' + newVal + ' - dirty=' + $scope.dirty[field] + ', valid=' + $scope.valid[field]);
        
        // check if all field on the main page are valid
        $scope.pagesValid.main = true;
        for(i=0; i<fieldOrder.length; i++) {
          // if any of the fields are not valid, then set pagesValid.main to false
          if (!$scope.valid[fieldOrder[i]]) {
            $scope.pagesValid.main = false;
            break; // no need to check remaining fields once any field is not valid
          }
        };
        console.log('pagesValid.main = ' + $scope.pagesValid.main);
        
        // if pagesValid.main has ever been true, the Proceed Button will be visible
        if ($scope.pagesValid.main)
          $scope.dirty.ProceedButton = true;
      });
    });
    
    // giant validation switch for each field
    $scope.checkValid = function(field, val) {
      switch(field) {
        case 'To': // 'To' and 'From' share the same validation
        case 'From':
          return val.length > 0 && val.length <= 16;
          break;
        case 'Amount':
          return $scope.prices.indexOf(val) != -1; // Amount must be in the $scope.prices array
          break;
        case 'Code':
          if (/^\d{5}$/.test(val)) { // only digits, exactly 5 digits in length
            $('#clique_code_message').show('slow') // show message with animation
            $('#flip_container').hide();
            $('#clique_input_code').blur();
            return true;
          }
          else { // if invalid
            $('#clique_code_message').hide('fast'); // hide message with animation
            return false;
          }
          break;
        case 'Occasion':
          return val.length > 0 && val.length <= 100;
          break;
        case 'Date':
          return true; // NEEDS BETTER VALIDATION
          break;
        case 'CreditCardNumber':
          if ($('#clique_input_creditcardnumber').formance('validate_credit_card_number')) {
            $('#creditcardnumbercontainer .checkmark').css('visibility','visible'); // show checkmark
            return true;
          }
          else {
            $('#creditcardnumbercontainer .checkmark').css('visibility','hidden'); // hide checkmark
            return false;
          }
          break;
        case 'Expiry':
          if ($('#clique_input_expiry').formance('validate_credit_card_expiry')) {
            if ($scope.valid.CVV && $scope.valid.ZIPcode)
              $('#creditcardinfo .checkmark').css('visibility','visible');
            return true;
          }
          else {
            $('#creditcardinfo .checkmark').css('visibility','hidden'); // hide checkmark
            return false;
          }
          break;
        case 'CVV':
          if ($('#clique_input_cvv').formance('validate_credit_card_cvc')) {
            if ($scope.valid.Expiry && $scope.valid.ZIPcode)
              $('#creditcardinfo .checkmark').css('visibility','visible'); // show checkmark
            return true;
          }
          else {
            $('#creditcardinfo .checkmark').css('visibility','hidden'); // hide checkmark
            return false;
          }
          break;
        case 'ZIPcode':
          if (/^\d{5}$/.test(val)) { // only digits, exactly 5 digits in length
            if ($scope.valid.Expiry && $scope.valid.CVV)
              $('#creditcardinfo .checkmark').css('visibility','visible');
            return true;
          }
          else {
            $('#creditcardinfo .checkmark').css('visibility','hidden');
            return false;
          }
          break;
        default:
          return false;
      }
    };
  });
  
  cliqueApp.controller('ReviewController', function($scope){
    // scroll to top of page
    window.scrollTo(0, 0);
    
    // on document load, give focus to "Phone Number" and make it the current input
    $( document ).ready(function() {
      $('#clique_input_phonenumber').focus().parent().removeClass('nextInput').addClass('currentInput');
    });
    
    /**********
    * Phone Number / Email
    **********/
    $('#clique_input_phonenumber, #clique_input_email')
      .on('blur', function() {
        $(this).parent().removeClass('currentInput');
      })
      .on('focus', function() {
        $(this).parent().addClass('currentInput');
    });
    
    $scope.dirty = {
      PhoneNumber: false,
      Email: false,
      SubmitButton: false
    };
    
    $scope.valid = {
      PhoneNumber: false,
      Email: false
    };
    
    var fieldOrder = ['PhoneNumber', 'Email'];
    
    // watch each field separately
    angular.forEach(fieldOrder, function(field) { // for each field in fieldOrder
      $scope.$watch('formData.'+field, function (newVal, oldVal) {
        if(newVal) { // if newVal exists
          $scope.dirty[field] = true;
          $scope.valid[field] = $scope.checkValid(field,newVal);
        }
        else { // if newVal is null or undefined, then it is invalid
          $scope.valid[field] = false;
        }
        console.log(field + ': ' + newVal + ' - dirty=' + $scope.dirty[field] + ', valid=' + $scope.valid[field]);
        
        // check if all fields on the review page are valid
        $scope.pagesValid.review = true;
        for(i=0; i<fieldOrder.length; i++) {
          // if any of the fields are not valid, then set pagesValid.review to false
          if (!$scope.valid[fieldOrder[i]]) {
            $scope.pagesValid.review = false;
            break; // no need to check remaining fields once any field is not valid
          }
        };
        console.log('pagesValid.main = ' + $scope.pagesValid.main);
        console.log('pagesValid.review = ' + $scope.pagesValid.review);
        
        // if pagesValid.review has ever been true, the SubmitButton Button will be visible
        if ($scope.pagesValid.review)
          $scope.dirty.SubmitButton = true;
      });
    });
    
    // giant validation switch for each field
    $scope.checkValid = function(field, val) {
      switch(field) {
        case 'PhoneNumber':
          return $('#clique_input_phonenumber').formance('validate_phone_number');
          break;
        case 'Email':
          return $('#clique_input_email').formance('validate_email');
          break;
        default:
          return false;
      }
    };
    
    /**********
    * Validation
    **********/
    jQuery(function($){
      fields = ['email',
                'phone_number'
      ];

      $.each( fields, function (index, value) {
        $('input.'+value).formance('format_'+value);
      });
    });
    
    
  });
  
  cliqueApp.controller('FinalController', function(){
    // begin fade in transition 100ms after page loads
    window.setTimeout(function(){$('#finalOverlay').addClass('complete')}, 100);
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