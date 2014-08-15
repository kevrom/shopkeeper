'use strict'

angular.module('API.resource', [])
    .factory('$APIResource', ['$http', 'API_CONFIG', function($http, API_CONFIG) {
        function APIResourceFactory(collection) {

            var config = API_CONFIG

            var dbUrl = config.BASE_URL
            var collectionUrl = dbUrl + collection
            var defaultParams = {}

            var resourceRespTransform = function(data) {
                return new Resource(data)
            }

            var resourcesArrayRespTransform = function(data) {
                var result = []
                for (var i = 0; i < data.length; i++) {
                    result.push(new Resource(data[i]))
                }
                return result
            }

            var promiseThen = function(httpPromise, successcb, errorcb, fransformFn) {
                return httpPromise.then(function (response) {
                    var result = fransformFn(response.data)
                    ;(successcb || angular.noop)(result, response.status, response.headers, response.config)
                    return result
                }, function(response) {
                    ;(errorcb || angular.noop)(undefined, response.status, response.headers, response.config)
                    return undefined
                })
            }

            var preparyQueryParam = function(queryJson) {
                return angular.isObject(queryJson) && !angular.equals(queryJson,{}) ? {q:JSON.stringify(queryJson)} : {}
            }

            var Resource = function(data) {
                angular.extend(this, data)
            }

            Resource.query = function(queryJson, options, successcb, errorcb) {

                var prepareOptions = function(options) {

                    var optionsMapping = {sort: 's', limit: 'l', fields: 'f', skip: 'sk'}
                    var optionsTranslated = {}

                    if (options && !angular.equals(options, {})) {
                        angular.forEach(optionsMapping, function (targetOption, sourceOption) {
                            if (angular.isDefined(options[sourceOption])) {
                                if (angular.isObject(options[sourceOption])) {
                                    optionsTranslated[targetOption] = JSON.stringify(options[sourceOption])
                                } else {
                                    optionsTranslated[targetOption] = options[sourceOption]
                                }
                            }
                        })
                    }
                    return optionsTranslated
                }

                if (angular.isFunction(options)) { errorcb = successcb; successcb = options; options = {} }

                var requestParams = angular.extend({}, defaultParams, preparyQueryParam(queryJson), prepareOptions(options))
                var httpPromise = $http.get(collectionUrl, {params:requestParams})
                return promiseThen(httpPromise, successcb, errorcb, resourcesArrayRespTransform)
            }

            Resource.all = function(options, successcb, errorcb) {
                if (angular.isFunction(options)) { errorcb = successcb; successcb = options; options = {} }
                return Resource.query({}, options, successcb, errorcb)
            }

            Resource.getById = function(id, successcb, errorcb) {
                var httpPromise = $http.get(collectionUrl + '/' + id, {params:defaultParams})
                return promiseThen(httpPromise, successcb, errorcb, resourceRespTransform)
            }

            //instance methods

            Resource.prototype.$save = function(successcb, errorcb) {
                var httpPromise = $http.post(collectionUrl, this, {params:defaultParams})
                return promiseThen(httpPromise, successcb, errorcb, resourceRespTransform)
            }

            Resource.prototype.$update = function(successcb, errorcb) {
                var httpPromise = $http.put(collectionUrl + "/" + this.id, angular.extend({}, this, {_id:undefined}), {params:defaultParams})
                return promiseThen(httpPromise, successcb, errorcb, resourceRespTransform)
            }

            Resource.prototype.$remove = function(successcb, errorcb) {
                var httpPromise = $http['delete'](collectionUrl + "/" + this.id, {params:defaultParams})
                return promiseThen(httpPromise, successcb, errorcb, resourceRespTransform)
            }

            Resource.prototype.$saveOrUpdate = function(savecb, updatecb, errorSavecb, errorUpdatecb) {
                if (this.id) {
                    return this.$update(updatecb, errorUpdatecb)
                } else {
                    return this.$save(savecb, errorSavecb)
                }
            }

            return Resource
        }
        return APIResourceFactory
    }])