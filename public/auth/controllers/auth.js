'use strict';

angular.module('mean.controllers.login', [])
    .controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location',
        function($scope, $rootScope, $http, $location) {
            // This object will be filled by the form
            $scope.user = {};

            // Register the login() function
            $scope.login = function() {
                $http.post('/login', {
                    email: $scope.user.email,
                    password: $scope.user.password
                })
                .success(function(response) {
                    // authentication OK
                    $scope.loginError = 0;
                    $rootScope.user = response.user;
                    $rootScope.$emit('loggedin');
                    if (response.redirect) {
                        if (window.location.href === response.redirect) {
                            //This is so an admin user will get full admin page
                            window.location.reload();
                        } else {
                            window.location = response.redirect;
                        }
                    } else {
                        $location.url('/');
                    }
                })
                .error(function() {
                    $scope.loginerror = 'Authentication failed.';
                });
            };
        }
    ])
    .controller('RegisterCtrl', ['$scope', '$rootScope', '$http', '$location',
        function($scope, $rootScope, $http, $location) {
            $scope.user = {};

            $scope.register = function() {
                $scope.usernameError = null;
                $scope.registerError = null;
                $http.post('/register', {
                    email: $scope.user.email,
                    password: $scope.user.password,
                    confirmPassword: $scope.user.confirmPassword,
                    username: $scope.user.username,
                    name: $scope.user.name
                })
                    .success(function() {
                        // authentication OK
                        $scope.registerError = 0;
                        $rootScope.user = $scope.user;
                        $rootScope.$emit('loggedin');
                        $location.url('/');
                    })
                    .error(function(error) {
                        // Error: authentication failed
                        if (error === 'Username already taken') {
                            $scope.usernameError = error;
                        } else {
                            $scope.registerError = error;
                        }
                    });
            };
        }
    ]).controller('SendGiftController', ['$scope', '$state', '$timeout', function($scope, $state, $timeout) {

        $scope.send = function() {
            var yes = confirm('I don\'t have the money though! Still wanna give me a gift?');
            if(yes) {
                $scope.text = 'AWESOME!';
            } else {
                $scope.text = 'Sure you do!';
            }
            // in any case...
            $timeout(function(){
                $state.transitionTo('home');
            }, 2000);
        };
    }])
    .controller('testCtrl', ['$scope', '$rootScope', '$http', '$location',
        function($scope, $rootScope, $http, $location) {

            $scope.testModel = {};

            $scope.saveTest = function() {
                $http.post('/test', {
                    districtNumber: $scope.testModel.districtNumber,
                    keyword: $scope.testModel.keyword,
                    status: $scope.testModel.status,
                    amount: $scope.testModel.amount,
                    kickbackAmount: $scope.testModel.kickbackAmount
                })
                .success(function(){
                    $scope.registerError = 0;
                    $rootScope.testModel = $scope.testModel ;
                });


                // $rootScope.data = {
                //     districtNumber: $scope.testModel.districtNumber,
                //     keyword: $scope.testModel.keyword,
                //     status: $scope.testModel.status,
                //     amount: $scope.testModel.amount,
                //     kickbackAmount: $scope.testModel.kickbackAmount
                // };
            };
        }
    ]);