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
      Expiry: '',
      CVV: '',
      ZIPcode: '',
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
    $scope.toggleShow = function(elemsArray) {
      for (i=0; i<elemsArray.length; i++) {
        elem = $(elemsArray[i]);
        if (elem.css('display') == 'none')
          elem.show();
        else
          elem.hide();
      }
    };
    
    $scope.showHide = function(elemsToShow, elemsToHide) {
      $(elemsToShow).show();
      $(elemsToHide).hide();
    };
    
    /**********
    * To / From
    **********/
    $('#clique_input_to, #clique_input_from').on('blur', function() {
      if($(this).hasClass('ng-dirty'))
        $(this).addClass('filledIn');
    });
    
    $('#clique_input_to, #clique_input_from').on('focus', function() {
      $(this).removeClass('filledIn');
    });
    
    /**********
    * Amount
    **********/
    $scope.prices = [2,25,50,75,100,250,500];
    $scope.setAmount = function(newAmount){
      $scope.formData.Amount = newAmount;
      $('#localStreetNoBlur').addClass('blur'); // uses CSS Blur Filter
    };
    $scope.isAmount = function(checkAmount){
      return $scope.formData.Amount == checkAmount; // boolean
    };
    
    /**********
    * Clique Code
    **********/
    $scope.flipCard = function() {
      $('#flip_container').show();
      window.setTimeout(function(){$('.card').addClass('flipped')}, 500);
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
      
      $('#clique_occasion_selection').hide();
      $('#clique_occasion').show();
    	$('#clique_input_occasion').focus();
    };
    
    $scope.limitOccText = function() {
      textarea = $('#clique_input_occasion');
      textarea.val(textarea.val().replace(/(\r\n|\n|\r)/gm,"")); // remove all line breaks
      $scope.occasions.charsLeft = TextService.limit($scope.formData.Occasion, occCharLimit);
    };
    
    // $scope.occasionLabel_click = function() {
      // $('#clique_occasion_selection').show();
      // $('#clique_input_occasion').focus();
    // };
    
    // $scope.occasionWrapper_blur = function() {
      // if($scope.dirty.Occasion && $('#clique_input_occasion').is(":focus"))
        // $('#clique_occasion_selection').hide();
    // };
    
    // $scope.inputOccasion_blur = function() {
    	// $('#clique_input_occasion_wrapper').addClass('filledIn');
      // $('#occCharCount').hide();
    // };
    
    // $('#clique_input_occasion').on('blur', function() {
    	// $('#clique_input_occasion_wrapper').addClass('filledIn');
      // $('#occCharCount').hide();
    // });
    
    // $scope.inputOccasion_focus = function() {
      // $('#clique_input_occasion_wrapper').removeClass('filledIn');
      // $('#occCharCount').show();
    // };
    
    // $('#clique_input_occasion').on('focus', function() {
    	// $('#clique_input_occasion_wrapper').removeClass('filledIn');
      // $('#occCharCount').show();
    // });
    
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
      
      $scope.toggleShow(['#clique_senddate_selection', '#clique_senddate']);
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
      console.log(filledIn);
      if(filledIn)
        $scope.cardTypeImg += '-wht.png';
      else
        $scope.cardTypeImg += '-blk.png';
      console.log($scope.cardTypeImg);
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
      From: false,
      Amount: true,
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
      From: false,
      Amount: false,
      Code: false,
      Occasion: false,
      Date: false,
      CreditCardNumber: false,
      Expiry: false,
      CVV: false,
      ZIPcode: false
    };
    
    $scope.mainValid = false;
    
    var fieldOrder = ['To', 'From', 'Amount', 'Code', 'Occasion', 'Date', 'CreditCardNumber', 'Expiry', 'CVV', 'ZIPcode'];
    
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
    
    // watch all fields
    angular.forEach(fieldOrder, function (field) {
      $scope.$watch('formData.'+field, function (newVal, oldVal) {
        if(newVal) { // if newVal exists
          $scope.dirty[field] = true;
          $scope.valid[field] = $scope.checkValid(field,newVal);
        }
        else {
          $scope.valid[field] = false;
        }
        console.log(field + ': ' + newVal + ' - dirty=' + $scope.dirty[field] + ', valid=' + $scope.valid[field]);
        
        $scope.mainValid = true;
        for(i=0; i<fieldOrder.length; i++) {
          if (!$scope.valid[fieldOrder[i]]) {
            $scope.mainValid = false;
            break;
          }
        };
        if ($scope.mainValid) {
          $scope.dirty.ProceedButton = true;
          console.log('mainValid = ' + $scope.mainValid);
        }
      });
    });
    
    $scope.checkValid = function(field, val) {
      switch(field) {
        case 'To': // 'To' and 'From' share the same validation
        case 'From':
          return val.length > 0 && val.length <= 16;
          break;
        case 'Amount':
          return $scope.prices.indexOf(val) != -1;
          break;
        case 'Code':
          if (/^\d{5}$/.test(val)) { // only digits, exactly 5 digits in length
            $('#clique_code .checkmark').css('visibility','visible');
            $('#clique_code_message').show(400)
            $('#flip_container, #clique_code').hide();
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
        case 'CreditCardNumber':
          if ($('#clique_input_creditcardnumber').formance('validate_credit_card_number')) {
            $('#creditcardnumbercontainer .checkmark').css('visibility','visible');
            return true;
          }
          else {
            $('#creditcardnumbercontainer .checkmark').css('visibility','hidden');
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
            $('#creditcardinfo .checkmark').css('visibility','hidden');
            return false;
          }
          break;
        case 'CVV':
          if ($('#clique_input_cvv').formance('validate_credit_card_cvc')) {
            if ($scope.valid.Expiry && $scope.valid.ZIPcode)
              $('#creditcardinfo .checkmark').css('visibility','visible');
            return true;
          }
          else {
            $('#creditcardinfo .checkmark').css('visibility','hidden');
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