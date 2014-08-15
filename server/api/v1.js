var orm = require('../lib/model'),
    Seq = orm.Seq(),
    _ = require('underscore'),
    util = require('util'),
    User = orm.model('User'),
    Drawing = orm.model('Drawing'),
    Machine = orm.model('Machine'),
    Program = orm.model('Program')

module.exports = function(app) {
    var API = {
        User: {
            find: function(req, res) {

            },
            list: function(req, res) {

            },
            create: function(req, res) {

            },
            update: function(req, res) {

            }
        },
        Drawing: {
            find: function(req, res) {
                Drawing.find(req.params.id).success(function(drawing) {
                    if (drawing.UserId != req.user.id) { res.send(401);  return }
                    if (!drawing) { res.send(404); return }
                    res.send(drawing)
                }).error(function(err) {
                    res.send(err, 500)
                })
            },
            list: function(req, res) {
                Drawing.findAll({
                    where: ['"Drawings"."UserId" = ?', req.user.id],
                    include: [ Program ]
                }).success(function(drawings) {
                    res.send(drawings)
                }).error(function(err) {
                    res.send(err, 500)
                })
            },
            create: function(req, res) {
                // validation
                req.assert('number', 'Drawing number is a required field.').notEmpty()
                var errors = req.validationErrors()
                if (errors) {
                    res.send('Invalid data: ' + util.inspect(errors), 400)
                    return
                }

                Drawing.create({
                    UserId: req.user.id,
                    number: req.body.number,
                    description: req.body.description,
                    notes: req.body.notes
                }).success(function(drawing) {
                    res.send(drawing, 200)
                }).error(function(err) {
                    res.send(err, 500)
                })
            },
            update: function(req, res) {
                Drawing.find(req.params.id).success(function(drawing) {
                    // make sure the drawing exists and belongs to the current user
                    if (drawing.UserId != req.user.id) { res.send(401);  return }
                    if (!drawing) { res.send(404); return }

                    // validation
                    req.assert('number', 'Drawing number is a required field.').notEmpty()
                    var errors = req.validationErrors()
                    if (errors) {
                        res.send('Invalid data: ' + util.inspect(errors), 400)
                        return
                    }

                    drawing.updateAttributes({
                        number: (req.body.number) ? req.body.number : drawing.number,
                        description: (req.body.description) ? req.body.description : drawing.description,
                        notes: (req.body.notes) ? req.body.notes : drawing.notes
                    }).success(function(drawing) {
                        res.send(drawing, 200)
                    }).error(function(err) {
                        res.send(err, 500)
                    })
                }).error(function(err) {
                    res.send(err, 500)
                })
            },
            delete: function(req, res) {
                Drawing.find(req.params.id).success(function(drawing) {
                    if (drawing.UserId != req.user.id) { res.send(401);  return }
                    if (!drawing) { res.send(404); return }
                    drawing.destroy().success(function() {
                        res.send(200)
                    }).error(function(err) {
                        res.send(err, 500)
                    })
                }).error(function(err) {
                    res.send(err, 500)
                })
            }
        },
        Program: {
            find: function(req, res) {
                Program.find(req.params.id).success(function(program) {
                    if (program.UserId != req.user.id) { res.send(401);  return }
                    if (!program) { res.send(404); return }
                    res.send(program)
                }).error(function(err) {
                    res.send(err, 500)
                })
            },
            list: function(req, res) {
                console.log(req.query['MachineId'])
                if (req.query['MachineId']) {
                    Program.findAll({
                        where: {
                            UserId: req.user.id,
                            MachineId: req.query['MachineId']
                        }
                    }).success(function(programs) {
                        res.send(programs)
                    }).error(function(err) {
                        res.send(err, 500)
                    })
                } else if (req.query['DrawingId']) {
                    Program.findAll({
                        where: {
                            UserId: req.user.id,
                            DrawingId: req.query['DrawingId']
                        }
                    }).success(function(programs) {
                        res.send(programs)
                    }).error(function(err) {
                        res.send(err, 500)
                    })
                } else {
                    Program.findAll({
                        where: { UserId: req.user.id }
                    }).success(function(programs) {
                        res.send(programs)
                    }).error(function(err) {
                        res.send(err, 500)
                    })
                }
            },
            create: function(req, res) {
                // validation
                req.assert('number', 'Program number is a required field.').notEmpty()
                var errors = req.validationErrors()
                if (errors) {
                    res.send('Invalid data: ' + util.inspect(errors), 400)
                    return
                }

                Program.create({
                    UserId: req.user.id,
                    DrawingId: req.body.DrawingId,
                    MachineId: req.body.MachineId,
                    number: req.body.number,
                    location: req.body.location,
                    description: req.body.description,
                    notes: req.body.notes
                }).success(function(program) {
                    res.send(program, 200)
                }).error(function(err) {
                    res.send(err, 500)
                })
            },
            update: function(req, res) {
                Program.find(req.params.id).success(function(program) {
                    if (program.UserId != req.user.id) { res.send(401);  return }
                    if (!program) { res.send(404); return }

                    // validation
                    req.assert('number', 'Program number is a required field.').notEmpty()
                    var errors = req.validationErrors()
                    if (errors) {
                        res.send('Invalid data: ' + util.inspect(errors), 400)
                        return
                    }

                    program.updateAttributes({
                        number: req.body.number,
                        location: req.body.location,
                        description: req.body.description,
                        notes: req.body.notes
                    }).success(function(program) {
                        res.send(program, 200)
                    }).error(function(err) {
                        res.send(err, 500)
                    })
                }).error(function(err) {
                    res.send(err, 500)
                })

            },
            delete: function(req, res) {
                Program.find(req.params.id).success(function(program) {
                    if (program.UserId != req.user.id) { res.send(401);  return }
                    if (!program) { res.send(404); return }
                    program.destroy().success(function() {
                        res.send(200)
                    }).error(function(err) {
                        res.send(err, 500)
                    })
                }).error(function(err) {
                    res.send(err, 500)
                })
            }
        },
        Machine: {
            find: function(req, res) {
                Machine.find(req.params.id).success(function(machine) {
                    if (machine.UserId != req.user.id) { res.send(401);  return }
                    if (!machine) { res.send(404); return }
                    res.send(machine)
                }).error(function(err) {
                    res.send(err, 500)
                })
            },
            list: function(req, res) {
                Machine.findAll({
                    where: { UserId: req.user.id }
                }).success(function(machines) {
                    res.send(machines)
                }).error(function(err) {
                    res.send(err, 500)
                })
            },
            create: function(req, res) {
                // validation
                req.assert('name', 'Machine name is a required field.').notEmpty()
                var errors = req.validationErrors()
                if (errors) {
                    res.send('Invalid data: ' + util.inspect(errors), 400)
                    return
                }

                Machine.create({
                    UserId: req.user.id,
                    name: req.body.name,
                    number: req.body.number,
                    description: req.body.description,
                    notes: req.body.notes
                }).success(function(machine) {
                    res.send(machine, 200)
                }).error(function(err) {
                    res.send(err, 500)
                })
            },
            update: function(req, res) {
                Machine.find(req.params.id).success(function(machine) {
                    if (machine.UserId != req.user.id) { res.send(401);  return }
                    if (!machine) { res.send(404); return }

                    // validation
                    req.assert('name', 'Machine name is a required field.').notEmpty()
                    var errors = req.validationErrors()
                    if (errors) {
                        res.send('Invalid data: ' + util.inspect(errors), 400)
                        return
                    }

                    machine.updateAttributes({
                        name: (req.body.name) ? req.body.name : machine.name,
                        number: (req.body.number) ? req.body.number : machine.number,
                        description: req.body.description,
                        notes: req.body.notes
                    }).success(function(machine) {
                        res.send(machine, 200)
                    }).error(function(err) {
                        res.send(err, 500)
                    })
                }).error(function(err) {
                    res.send(err, 500)
                })
            },
            delete: function(req, res) {
                Machine.find(req.params.id).success(function(machine) {
                    if (machine.UserId != req.user.id) { res.send(401);  return }
                    if (!machine) { res.send(404); return }
                    machine.destroy().success(function() {
                        res.send(200)
                    }).error(function(err) {
                        res.send(err, 500)
                    })
                }).error(function(err) {
                    res.send(err, 500)
                })
            }
        }
    }

    return API
}