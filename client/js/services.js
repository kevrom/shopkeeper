'use strict'

angular.module('shopkeeper.services', [])

    .factory('Machines', ['$APIResource', function($APIResource) {
        return $APIResource('machines')
    }])

    .factory('Programs', ['$APIResource', function($APIResource) {
        return $APIResource('programs')
    }])

    .factory('Drawings', ['$APIResource', function($APIResource) {
        return $APIResource('drawings')
    }])