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
        url: '/',
        templateUrl: 'partials/review.html',
        controller: 'ReviewController'
      })
      .state('final', { // final overlay (/final)
        url: '/',
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
      ExpireCVV: '',
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
    };
    $scope.isAmount = function(checkAmount){
      return $scope.formData.Amount == checkAmount; // boolean
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
      $scope.occasions.charsLeft = TextService.limit($scope.formData.Occasion, occCharLimit);
    };
    
    /**********
    * Date
    **********/
    $scope.dateTypeImg = '';
    $scope.setDateType = function(type) {
      if(type=='today')
        $scope.dateTypeImg = '../public/demo23_files/send_today_blk.png';
      if(type=='choose')
        $scope.dateTypeImg = '../public/demo23_files/send_on_date_blk.png';
    }
  }]);
  
  cliqueApp.controller('ReviewController', function(){
    //
  });
  
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
      },
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