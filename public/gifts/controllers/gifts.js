'use strict';


var myCtrl = function($scope, $http) {
        $scope.thing = 'a';
    }

var myCtrl = function($scope, $http) {
        $scope.thing = 'a';
    }

angular.module('mean.gifts', [])
    .controller('GiftOneCtrl', ['$scope', '$state',
        function($scope, $state) {
            // This object will be filled by the form
            $scope.stuff = ['one', 'two', 'three'];


        }
    ])
    .controller('myCtrl', myCtrl)
    .controller('myCtrl2', function($scope) {
        $scope.two = 'dva';
    })

    .controller('myCtrl2', ['$scope', '$http', 'myService' function($scope, $http, myService) {
        $scope.two = 'dva';
    }])

    ;