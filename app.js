const http = require('http');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const server = http.createServer(async function (req, res) {
    var print = '';
    function getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    var user =
        [
            {
                first_name: 'ashish',
                email: 'ashish@gmail.com',
                last_name: 'rawat',
                password: '1234',
                profile: { dob: '01/04/1994', mobile_no: '12345678' }
            },
            {
                first_name: 'ramesh',
                email: 'ramesh@gmail.com',
                last_name: 'yadav',
                password: '56789',
                profile: { dob: '10/06/1995', mobile_no: '999999999' }
            },
            {
                first_name: 'nitesh',
                email: 'nitesh@mail.com',
                last_name: 'padney',
                password: 'abcd',
                profile: { dob: '03/05/1999', mobile_no: '999999999999' }
            },
            {
                first_name: 'sonu',
                email: 'sonu@gmail.com',
                last_name: 'kumar',
                password: '12333',
                profile: { dob: '03/05/2000', mobile_no: '999999999999' }
            },
            {
                first_name: 'deepak',
                email: 'deepak@gmail.com',
                last_name: 'maurya',
                password: '1234',
                profile: { dob: '03/03/1990', mobile_no: '99999999999' }
            }
        ]
    
    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = await db.db("assignmentFirst");
        for await (element of user) {        
            let data = await dbo.collection("users").insertOne(element);
            await dbo.collection("usersProfile").insertOne({
                _id: data.ops[0]._id,
                dob: element.profile.dob,
                mobile_no: element.profile.mobile_no
            })
        }
        await dbo.collection('users').find({}).toArray(function(err, docs) {
            let dob = '';
            let sum = 0;
            docs.forEach(element => {
                console.log(element);
                let age = '';
                dob = element.profile.dob;
                age = getAge(dob); 
                console.log(age);               
                if(age > 25){                 
                    dbo.collection('users').deleteOne({_id: element._id});
                    dbo.collection('usersProfile').deleteOne({_id: element._id});                           
                }
                sum = sum + age;                
            });
            res.end('average of age is :'+sum/5);            
        });
    });
});

server.listen(3000, '127.0.0.1');
console.log('server created and listing on localhost:3000');
