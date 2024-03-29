
'use strict';

angular.module('iTravelApp', ['ngRoute', 'ui.bootstrap', 'uiGmapgoogle-maps','ngSanitize',
    'ui.select', 'ui.calendar', 'ngDragDrop', 'angular-loading-bar', 'fox.scrollReveal',
    'angular-timeline','pascalprecht.translate', 'nvd3ChartDirectives']);

/**
 * Configure the Routes
 */
angular.module('iTravelApp')
.config( ['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $routeProvider
        // Home
        .when("/", {
            templateUrl: "templates/home.html",
            controller: "HomeCtrl"
        })

        //user pages
        .when("/login", {
            templateUrl: "templates/user/login.html",
            controller: "LoginCtrl"
        })
        .when("/signup", {
            templateUrl: "templates/user/signup.html",
            controller: "SignupCtrl"
        })
        .when("/users/:id", {
            templateUrl: "templates/user/profile.html",
            controller: "UserShowCtrl"
        })

        //venue selection pages
        .when("/venueSelect", {
            templateUrl: "templates/venueSelector/venueSelect.html",
            controller: "VenueSelectorCtrl"
        })

        //activity scheduler page
        .when("/activityScheduler", {
            templateUrl: "templates/activityScheduler/activityScheduler.html",
            controller: "ActivitySchedulerCtrl"
        })

        //venue page
        .when("/venues/:id", {
            templateUrl: "templates/venues/venueDetails.html",
            controller: "VenuesShowCtrl"
        })

        //plan page
        .when("/plans/:id", {
            templateUrl: "templates/plans/planDetail.html",
            controller: "PlansShowCtrl"
        })

        //footer url pages
        //.when("/aboutus", {templateUrl: "templates/footerPages/aboutus.html"})
        .when("/contact", {templateUrl: "templates/footerPages/contact.html"})
        .when("/locations", {
            templateUrl: "templates/footerPages/locations.html",
            controller: "GoogleMapCtrl"
        })
        .when("/tech", {templateUrl: "templates/footerPages/tech.html"})
        .when("/privacy", {templateUrl: "templates/footerPages/privacy.html"})
        .when("/security", {templateUrl: "templates/footerPages/security.html"})
        .when("/developer", {templateUrl: "templates/footerPages/developer.html"})

        // else error
        .otherwise("/error", {templateUrl: "templates/error.html"});

        $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
          return {
            'response': function(originalRes) {

                if(originalRes.status === 401) {
                    return deferred.reject(originalRes.status);
                    $location.url('/login');
               } else {
                    return originalRes;
               }

            }
            };
        }]);

}])
.config(['uiGmapGoogleMapApiProvider', function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyDT32xVCkqxlZQz5DQly-1-6j7RlsouvM8',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
}])
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}])

//translate module
.config(['$translateProvider', function ($translateProvider) {
    // add translation tables
    $translateProvider.translations('en', translationsEN);
    $translateProvider.translations('cn', translationsCN);
    $translateProvider.preferredLanguage('en');
    $translateProvider.fallbackLanguage('en');
}])


.run(['User', 'Venue', function(User, Venue) {
    // detect if there is valid user token upon app start, and load user data if there is one
    User.restore();
}])

.run(['$rootScope','$location','$anchorScroll', '$routeParams',function($rootScope, $location, $anchorScroll, $routeParams) {
    $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
        $location.hash($routeParams.scrollTo);
        $anchorScroll();
    });

    $rootScope.$on('userLogout', function() {
        $location.url('/');
    })
}]);