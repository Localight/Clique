(function(){
  var cliqueApp = angular.module('clique',[]);
  
  cliqueApp.directive('pickADate', function () {
    return {
      restrict: "A",
      link: function (scope, element, attrs) {
        element.pickadate({
          min: new Date(), // minimum date = today
          max: +365, // maximum date = 1 year from now
          clear: '', // disable 'Clear' button
          onSet: function(){
            var date = this.get('select', 'yyyy-mm-dd'); // 'this' refers to element.pickadate()
            var formattedDate = this.get('select', 'mmm. dd, yyyy');
            scope.$apply(function(){
              scope.formData.Date = date;
              scope.formattedDate = formattedDate;
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
    		ExpireCVV: '',
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
    };
    $scope.isAmount = function(checkAmount){
      return $scope.formData.Amount == checkAmount; // boolean
    };
    
    /**********
    * Occasion
    **********/
    // import occasions: $scope.occasions.left_column, $scope.occasions.right_column
    $scope.occasions = OccasionService;
    
    $scope.occasions.charsLeft = 100;
    var occCharLimit = 100;
    
    $scope.setOccasion = function(occasion){
      // change occasion text only if a new occasion is selected
      if ($scope.formData.Icon != occasion.name) {
        $scope.formData.Occasion = occasion.text;
        $scope.formData.Icon = occasion.name;
      }
      $scope.limitOccText();
    };
    
    $scope.limitOccText = function() {
      $scope.occasions.charsLeft = TextService.limit($scope.formData.Occasion, occCharLimit);
    };
    
    /**********
    * Date
    **********/
    $scope.formattedDate = '';
  }]);
  
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
    var occasions = {};
    occasions.left_column = [
      {
        name: 'birthday',
        images: {
          normal: '../public/demo23_files/occasion_bday.png',
          selected: '../public/demo23_files/occasion_bday_selected.png'
        },
        alt: 'Birthday',
        text: 'Variety is the spice of life. So I’m giving you the gift of choice!'
      },
      {
        name: 'anniversary',
        images: {
          normal: '../public/demo23_files/occasion_anniversary.png',
          selected: '../public/demo23_files/occasion_anniversary_selected.png'
        },
        alt: 'Anniversary',
        text: 'You remind me of time itself for you are my Past, Future, and Forever. Happy Anniversary!'
      },
      {
        name: 'love',
        images: {
          normal: '../public/demo23_files/occasion_love.png',
          selected: '../public/demo23_files/occasion_love_selected.png'
        },
        alt: 'I Love You',
        text: 'I Iove you for all that you are, all you have been, and all you\'re yet to be.'
      },
      {
        name: 'getwell',
        images: {
          normal: '../public/demo23_files/occasion_getwell.png',
          selected: '../public/demo23_files/occasion_getwell_selected.png'
        },
        alt: 'Get Well',
        text: 'I look forward to your speedy recovery. Get well soon!'
      },
      {
        name: 'congrats',
        images: {
          normal: '../public/demo23_files/occasion_congrats.png',
          selected: '../public/demo23_files/occasion_congrats_selected.png'
        },
        alt: 'Congrats',
        text: 'Spread joy. Chase your wildest dreams. Congratulations!'
      }
    ];
    occasions.right_column = [
      {
        name: 'wedding',
        images: {
          normal: '../public/demo23_files/occasion_wedding.png',
          selected: '../public/demo23_files/occasion_wedding_selected.png'
        },
        alt: 'Wedding',
        text: 'Falling in love is easy. Staying in love is AMAZING. Congrats on your marriage!'
      },
      {
        name: 'baby',
        images: {
          normal: '../public/demo23_files/occasion_baby.png',
          selected: '../public/demo23_files/occasion_baby_selected.png'
        },
        alt: 'Baby',
        text: 'Congratulations on the birth of your child!'
      },
      {
        name: 'sympathy',
        images: {
          normal: '../public/demo23_files/occasion_sympathy.png',
          selected: '../public/demo23_files/occasion_sympathy_selected.png'
        },
        alt: 'Sympathy',
        text: 'Our collective hearts are heavy with sympathy.'
      },
      {
        name: 'thankyou',
        images: {
          normal: '../public/demo23_files/occasion_thankyou.png',
          selected: '../public/demo23_files/occasion_thankyou_selected.png'
        },
        alt: 'Thank You',
        text: 'You’re the best! You deserve some retail therapy.'
      },
      {
        name: 'custom',
        images: {
          normal: '../public/demo23_files/occasion_custom.png',
          selected: '../public/demo23_files/occasion_custom_selected.png'
        },
        alt: 'Custom',
        text: 'If you want to be loved for who you are, just be yourself.'
      }
    ];
    return occasions;
  });
})();