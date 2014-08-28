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
        
        var setTodayImg = $('#setTodayImg');
        setTodayImg.on('click', function(event){
          picker.set('select', new Date()); // set picker to today --> triggers onSet()
        });
        
        var setOnDateImg = $('#setOnDateImg');
        setOnDateImg.on('click', function(event){
          picker.open();
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
      $('#localStreetNoBlur').addClass('blur'); // uses CSS Blur Filter
      $scope.formData.Amount = newAmount;
      // $('#localStreetDiv').addClass('blurImg');
    };
    $scope.isAmount = function(checkAmount){
      return $scope.formData.Amount == checkAmount; // boolean
    };
    
    /**********
    * Clique Code
    **********/
    $scope.flipCard = function() {
      $('.front, .back').addClass('flipped');
    };
    
    /**********
    * Occasion
    **********/
    // import occasions: $scope.occasions.left_column, $scope.occasions.right_column
    $scope.occasions = OccasionService;
    
    $scope.occasions.selectedImg = '';
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
      if(type=='choose')
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
                'dd_mm_yyyy',
                'yyyy_mm_dd',
                'email',
                'number',
                'phone_number',
                'time_yy_mm'
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
  
  cliqueApp.controller('ReviewController', ['$scope', function($scope){
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