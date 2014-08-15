'use strict';

angular.module('shopkeeper', ['API.resource', 'shopkeeper.services', 'shopkeeper.controllers'])
    .config(['$locationProvider', function($locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');
    }])
    .constant('API_CONFIG', {
        API_KEY: '',
        BASE_URL: '/api/v1/',
        DB_NAME: 'shopkeeper'
    })