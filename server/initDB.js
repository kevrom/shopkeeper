var path = require('path'),
    orm = require('./lib/model'),
    Seq = orm.Seq()

var User = orm.model('User'),
    Drawing = orm.model('Drawing'),
    Program = orm.model('Program'),
    Machine = orm.model('Machine')

User.sync()
Drawing.sync()
Program.sync()
Machine.sync()

// User.sync({force: true}).success(function() {
//     var user = User.build({
//         email: 'steve@gmail.com',
//         name: 'Steve Steve',
//         provider: 'local',
//         isActive: true,
//         isAdmin: true
//     })
//     user.setPassword('onetwo12')
//     user.save().success(function(user) {
//         console.log('Successfully created admin user ' + user.email)
//     })

//     var user2 = User.build({
//         email: 'test@test.com',
//         name: 'Bob Dole',
//         provider: 'local',
//         isActive: true,
//         isAdmin: false
//     })
//     user2.setPassword('8675309')
//     user2.save()
// })

// Drawing.sync({force: true}).success(function() {
//     Drawing.create({
//         UserId: 1,
//         number: "2039230-21",
//         description: "None really",
//         notes: ""
//     })

//     Drawing.create({
//         UserId: 1,
//         number: "4369230-21",
//         description: "None really 2",
//         notes: ""
//     })

//     Drawing.create({
//         UserId: 1,
//         number: "346347-21",
//         description: "None really 3",
//         notes: ""
//     })
// })

// Program.sync({force: true}).success(function() {
//     Program.create({
//         UserId: 1,
//         DrawingId: 1,
//         MachineId: 1,
//         number: "o3252",
//         location: "USB 1",
//         description: "",
//         notes: ""
//     })

//     Program.create({
//         UserId: 1,
//         DrawingId: 1,
//         MachineId: 3,
//         number: "o3325",
//         location: "USB 1",
//         description: "",
//         notes: ""
//     })

//     Program.create({
//         UserId: 1,
//         DrawingId: 2,
//         MachineId: 2,
//         number: "o5252",
//         location: "USB 1",
//         description: "",
//         notes: ""
//     })

//     Program.create({
//         UserId: 1,
//         DrawingId: 3,
//         MachineId: 3,
//         number: "o7652",
//         location: "USB 2",
//         description: "",
//         notes: ""
//     })
// })

// Machine.sync({force: true}).success(function() {
//     Machine.create({
//         UserId: 1,
//         name: "Slant 40",
//         number: "20",
//         description: "",
//         notes: ""
//     })

//     Machine.create({
//         UserId: 1,
//         name: "Haas VF8",
//         number: "27",
//         description: "",
//         notes: ""
//     })

//     Machine.create({
//         UserId: 1,
//         name: "Quickturn 20",
//         number: "22",
//         description: "",
//         notes: ""
//     })
// })


