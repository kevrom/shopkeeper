'use strict'

angular.module('shopkeeper.controllers', ['ui', 'ui.bootstrap'])

.config(['$routeProvider', 
function($routeProvider) {
    $routeProvider
        .when('/s/machines/create', {
            templateUrl: '/partials/machines/create',
            controller: 'MachinesCreateCtrl'
        })
        .when('/s/machines/:id/edit', {
            templateUrl: '/partials/machines/edit',
            controller: 'MachinesEditCtrl'
        })
        .when('/s/machines/:id', {
            templateUrl: '/partials/machines/detail',
            controller: 'MachinesDetailCtrl'
        })
        .when('/s/drawings/create', {
            templateUrl: '/partials/drawings/create',
            controller: 'DrawingsCreateCtrl'
        })
        .when('/s/drawings/:id/edit', {
            templateUrl: '/partials/drawings/edit',
            controller: 'DrawingsEditCtrl'
        })
        .when('/s/drawings/:id', {
            templateUrl: '/partials/drawings/detail',
            controller: 'DrawingsDetailCtrl'
        })
        .when('/s/programs/list', {
            templateUrl: '/partials/programs/list',
            controller: 'ProgramsListCtrl'
        })
        .when('/s/programs/create', {
            templateUrl: '/partials/programs/create',
            controller: 'ProgramsCreateCtrl'
        })
        .when('/s/programs/:id/edit', {
            templateUrl: '/partials/programs/edit',
            controller: 'ProgramsEditCtrl'
        })
        .when('/s/programs/:id', {
            templateUrl: '/partials/programs/detail',
            controller: 'ProgramsDetailCtrl'
        })
        .otherwise({
            redirectTo: '/s'
        })
}])

.controller('MachinesListCtrl',
['$scope', 'Machines', 
function($scope, Machines) {
    Machines.all(function(machines) {
        $scope.machines = machines
    })

    // listen for any new machines
    $scope.$on('MachineAdded', function(event, machine) {
        /* push new machine into current scope */
        $scope.machines.push(machine)
    })

    // listen for any updates to an existing machine
    $scope.$on('MachineUpdated', function(event, machine) {
        /* update existing machine in scope */
        angular.forEach($scope.machines, function(_machine, i) {
            if (_machine.id == machine.id) {
                angular.extend($scope.machines[i], machine)
            }
        })
    })

    // listen for any deleted machines
    $scope.$on('MachineDeleted', function(event, machineId) {
        /* update scope to remove deleted machine */
        angular.forEach($scope.machines, function(_machine, i) {
            if (_machine.id == machineId) {
                $scope.machines.splice(i, 1)
            }
        })
    })
}])

.controller('MachinesEditCtrl', 
['$scope', '$route', '$location', '$rootScope', 'Machines', 
function($scope, $route, $location, $rootScope, Machines) {
    Machines.getById($route.current.params.id, function(machine) {
        $scope.machine = machine
    })

    $scope.save = function() {
        $scope.machine.$update(function(machine) {
            // broadcast updated machine
            $rootScope.$broadcast('MachineUpdated', machine)
            $location.url('/s/machines/' + $route.current.params.id)
        })
    }

    $scope.cancel = function() {
        $location.url('/s/machines/' + $route.current.params.id)
    }
}])

.controller('MachinesCreateCtrl', 
['$scope', '$location', 'Machines', '$rootScope', 
function($scope, $location, Machines, $rootScope) {
    $scope.machine = new Machines()

    $scope.cancel = function() {
        $location.url('/s')
    }

    $scope.save = function() {
        $scope.machine.$save(function(machine) {
            // broadcast our newly added machine
            $rootScope.$broadcast('MachineAdded', machine)
            $scope.machine = {}
            $location.url('/s/machines/' + machine.id)
        })
    }
}])

.controller('MachinesDetailCtrl', 
['$scope', '$route', '$rootScope', '$location', 'Machines', 'Programs', 
function($scope, $route, $rootScope, $location, Machines, Programs) {
    Machines.getById($route.current.params.id, function(machine) {
        $scope.machine = machine
    })

    $scope.remove = function() {
        Programs.all(function(programs) {
            angular.forEach(programs, function(_program, i) {
                if (_program.MachineId == $route.current.params.id) {
                    _program.$remove(function() {
                        $rootScope.$broadcast('ProgramDeleted', _program.id)
                    })
                }
            })
        })
        $scope.machine.$remove(function() {
            // broadcast deleted machine
            $rootScope.$broadcast('MachineDeleted', $route.current.params.id)
            $location.url('/s')
        })
    }
}])

.controller('DrawingsListCtrl', 
['$scope', '$location', 'Drawings', 'Machines', 
function($scope, $location, Drawings, Machines) {

    /* iterate through our drawings to find machines that are related to the
    drawings, so we can add that to our scope also */
    Drawings.all(function(drawings) {
        angular.forEach(drawings, function(_drawing, i) {
            angular.forEach(_drawing.programs, function(_program, j) {
                Machines.getById(_program.MachineId, function(machine) {
                    _program.machine = machine
                    angular.extend(drawings[i].programs[j], { machine: machine })
                })
            })
        })
        $scope.drawings = drawings
    })

    // listen for any new drawings
    $scope.$on('DrawingAdded', function(event, drawing) {
        /* push new drawing to current scope */
        $scope.drawings.push(drawing)
    })

    // listen for any new programs
    $scope.$on('ProgramAdded', function(event, program) {
        /* iterate through current drawings in the scope and
        find a match for added program's drawing relation
        so that it can be pushed into the scope correctly  */
        angular.forEach($scope.drawings, function(drawing, i) {
            if (drawing.id == program.DrawingId) {
                Machines.getById(program.MachineId, function(machine) {
                    program.machine = machine
                    if (!$scope.drawings[i].programs) $scope.drawings[i].programs = []
                    $scope.drawings[i].programs.push(program)
                })
            }
        })  
    })

    // listen for any updates to existing drawings
    $scope.$on('DrawingUpdated', function(event, drawing) {
        /* update existing machine in the scope */
        angular.forEach($scope.drawings, function(_drawing, i) {
            if (_drawing.id == drawing.id) {
                angular.extend($scope.drawings[i], drawing)
            }
        })
    })

    // listen for any updates to existing programs
    $scope.$on('ProgramUpdated', function(event, program) {
        /* update existing program in the scope */
        angular.forEach($scope.drawings, function(drawing, i) {
            if (drawing.id == program.DrawingId) {
                angular.forEach(drawing.programs, function(_program, j) {
                    if (_program.id == program.id) {
                        angular.extend($scope.drawings[i].programs[j], program)
                    }
                })
            }
        })
    })

    // listen for any deleted drawings
    $scope.$on('DrawingDeleted', function(event, drawingId) {
        /* update scope to remove deleted drawing */
        angular.forEach($scope.drawings, function(drawing, i) {
            if (drawing.id == drawingId) {
                $scope.drawings.splice(i, 1)
            }
        })
    })

    // listen for any deleted programs
    $scope.$on('ProgramDeleted', function(event, programId) {
        /* update scope to remove deleted program */
        angular.forEach($scope.drawings, function(drawing, i) {
            angular.forEach(drawing.programs, function(_program, j) {
                if (_program.id == programId) {
                    $scope.drawings[i].programs.splice(j, 1)
                }
            })
        })
    })
}])

.controller('DrawingsEditCtrl', 
['$scope', '$route', '$location', '$rootScope', 'Drawings', 
function($scope, $route, $location, $rootScope, Drawings) {
    Drawings.getById($route.current.params.id, function(drawing) {
        $scope.drawing = drawing
    })

    $scope.save = function() {
        $scope.drawing.$update(function(drawing) {
            // broadcast updated drawing
            $rootScope.$broadcast('DrawingUpdated', drawing)
            $location.url('/s/drawings/' + $route.current.params.id)
        })
    }

    $scope.cancel = function() {
        $location.url('/s/drawings/' + $route.current.params.id)
    }
}])

.controller('DrawingsCreateCtrl', 
['$scope', '$location', 'Drawings', '$rootScope', 
function($scope, $location, Drawings, $rootScope) {
    $scope.drawing = new Drawings()

    $scope.cancel = function() {
        $location.url('/s')
    }

    $scope.save = function() {
        $scope.drawing.$save(function(drawing) {
            // broadcast our newly added drawing
            $rootScope.$broadcast('DrawingAdded', drawing)
            $location.url('/s/drawings/' + drawing.id)
        })
    }
}])

.controller('DrawingsDetailCtrl', 
['$scope', '$route', '$rootScope', '$location', 'Drawings', 'Programs', 
function($scope, $route, $rootScope, $location, Drawings, Programs) {
    Drawings.getById($route.current.params.id, function(drawing) {
        $scope.drawing = drawing
    })

    $scope.remove = function() {
        Programs.all(function(programs) {
            angular.forEach(programs, function(_program, i) {
                if (_program.DrawingId == $route.current.params.id) {
                    _program.$remove(function() {
                        $rootScope.$broadcast('ProgramDeleted', _program.id)
                    })
                }
            })
        })
        $scope.drawing.$remove(function() {
            // broadcast deleted drawing
            $rootScope.$broadcast('DrawingDeleted', $route.current.params.id)
            $location.url('/s')
        })
    }
}])

.controller('ProgramsListCtrl', 
['$scope', '$routeParams', 'Programs', 'Machines', 
function($scope, $routeParams, Programs, Machines) {
    $scope.currentMachine = $routeParams.MachineId

    Programs.all(function(programs) {
        $scope.programs = programs
    })
}])

.controller('ProgramsEditCtrl', 
['$scope', '$route', '$location', '$rootScope', 'Programs',
function($scope, $route, $location, $rootScope, Programs) {

    Programs.getById($route.current.params.id, function(program) {
        $scope.program = program
    })

    $scope.save = function() {
        $scope.program.$update(function(program) {
            $rootScope.$broadcast('ProgramUpdated', program)
            $location.url('/s/programs/' + $route.current.params.id)
        })
    }

    $scope.cancel = function() {
        $location.url('/s/programs/' + $route.current.params.id)
    }
}])

.controller('ProgramsDetailCtrl', 
['$scope', '$route', '$location', '$rootScope', 'Programs', 
function($scope, $route, $location, $rootScope, Programs) {
    Programs.getById($route.current.params.id, function(program) {
        $scope.program = program
    })

    $scope.remove = function() {
        $scope.program.$remove(function() {
            // broadcast deleted program
            $rootScope.$broadcast('ProgramDeleted', $route.current.params.id)
            $location.url('/s')
        })
    }
}])

.controller('ProgramsCreateCtrl', 
['$scope', '$location', '$routeParams', '$timeout', 'Programs', 'Drawings', 'Machines', '$rootScope', 
function($scope, $location, $routeParams, $timeout, Programs, Drawings, Machines, $rootScope) {

    $scope.program = new Programs()

    // iterate through all drawings to make a dropdown list
    var drawingSelectData = []
    Drawings.all(function(drawings) {
        angular.forEach(drawings, function(drawing) {
            drawingSelectData.push({id:drawing.id, text:drawing.number})
            // if the DrawingId query string is available, select that drawing
            if (drawing.id == $routeParams.DrawingId) {
                angular.extend($scope.program, { 'DrawingId': drawing.id })
            }
        })
    })
    // provides the data for the select2 dropdowns
    $scope.drawingId = { data: drawingSelectData }
    
    // iterate through all machines to make a dropdown list
    var machineSelectData = []
    Machines.all(function(machines) {
        angular.forEach(machines, function(machine) {
            machineSelectData.push({id:machine.id, text:machine.name})
            // if the MachineId query string is available, select that machine
            if (machine.id == $routeParams.MachineId) {
                angular.extend($scope.program, { 'MachineId': machine.id })
            }
        })
    })
    // provides the data for the select2 dropdowns
    $scope.machineId = { data: machineSelectData }

    $scope.cancel = function() {
        $location.url('/s')
    }

    $scope.save = function() {
        // angular.extend(_program, $scope.program)
        if ($scope.program.MachineId['id']) {
            $scope.program.MachineId = $scope.program.MachineId['id']
        }
        if ($scope.program.DrawingId['id']) {
            $scope.program.DrawingId = $scope.program.DrawingId['id']
        }
        $scope.program.$save(function(program) {
            // broadcast our newly created program
            $rootScope.$broadcast('ProgramAdded', program)
            $location.url('/s/programs/' + program.id)
        })
    }
}])