'use strict';

//Setting up route
angular.module('mean.auth').config(['$stateProvider', '$logProvider',

    function($stateProvider, $logProvider) {

        $logProvider.debugEnabled(true);
        // Check if the user is not conntected
        var checkLoggedOut = function($q, $timeout, $http, $location) {
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin').success(function(user) {
                // Authenticated
                if (user !== '0') {
                    $timeout(deferred.reject);
                    $location.url('/login');
                }

                // Not Authenticated
                else $timeout(deferred.resolve);
            });

            return deferred.promise;
        };

        // states for my app
        $stateProvider
            .state('auth.login', {
                url: '/login',
                templateUrl: 'public/auth/views/login.html',
                resolve: {
                    loggedin: checkLoggedOut
                }
            })
            .state('auth.thanks', {
                url: '/something',
                template: 'Something'
            })
            .state('auth.register', {
                url: '/register',
                templateUrl: 'public/auth/views/register.html',
                resolve: {
                    loggedin: checkLoggedOut
                }
            }).state('send', {
                url: '/send-gift',
                templateUrl: 'public/auth/views/send-gift.html',
            }).state('thanks', {
                url: '/thanks',
                templateUrl: 'public/auth/views/thanks.html',
                controller: function($scope, $state) {
                    $scope.spend = function() { $state.transitionTo('gift');}
                }
            }).state('gift', {
                    templateUrl: 'public/gifts/views/index.html'
            })
            .state('auth.test', {
                url: '/test',
                templateUrl: 'public/auth/views/test.html'
            });
    }
]);
