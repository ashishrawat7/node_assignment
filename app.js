const http = require('http');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const server = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    var user =
        [
            {
                first_name: 'ashish',
                email: 'ashish@gmail.com',
                last_name: 'rawat',
                password: '1234',
                profile: { dob: '', mobile_no: '' }
            },
            {
                first_name: 'ramesh',
                email: 'ramesh@gmail.com',
                last_name: 'yadav',
                password: '56789',
                profile: { dob: '', mobile_no: '' }
            },
            {
                first_name: 'nitesh',
                email: 'nitesh@mail.com',
                last_name: 'padney',
                password: 'abcd',
                profile: { dob: '', mobile_no: '' }
            },
            {
                first_name: 'sonu',
                email: 'sonu@gmail.com',
                last_name: 'kumar',
                password: '12333',
                profile: { dob: '', mobile_no: '' }
            },
            {
                first_name: 'deepak',
                email: 'deepak@gmail.com',
                last_name: 'maurya',
                password: '1234',
                profile: { dob: '', mobile_no: '' }
            }
        ]

    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("assignmentFirst");
        for await (element of user) {            
            let data = await dbo.collection("users").insertOne(element)            
            await dbo.collection("usersProfile").insertOne({
                _id: data.ops[0]._id,
                dob: element.dob,
                mobile_no: element.mobile_no
            })
        }
    });
    res.end(JSON.stringify(user));
    res.end('got req. Record saved!');
});

server.listen(3000, '127.0.0.1');
console.log('server created and listing on localhost:3000');
