let database = require('./../database');
let middleware = require('./../middleware');
var crypto = require('crypto');
module.exports = {

    createusertable: async (req, res, next) => {
        var sql = "CREATE TABLE shopping (name VARCHAR(75), quantity INT, note VARCHAR(75), category VARCHAR(25),famil_group VARCHAR(255),updated_by VARCHAR(25),updated_at DOUBLE, email VARCHAR(25),FOREIGN KEY (email) REFERENCES user(email))";
        database.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Table created", result);
        })
    },
    signup: async (req, res, next) => {
        try {

            var email = req.body.email;
            var password = req.body.password;
            var name = req.body.name;

            if (!email) {
                res.status(404).send({ code: 404, content: null, error: "Email ID cannot be NULL" });
            }


            if (!password) {
                res.status(404).send({ code: 404, content: null, error: "Password cannot be NULL" });
            }


            if (!name) {
                res.status(404).send({ code: 404, content: null, error: "Name cannot be NULL" });
            }

            console.log("Email id \n", email);
            console.log("Password \n", password);
            console.log("Name \n", name);
            let userData;
            await database.query("SELECT * FROM user WHERE email = ? ", email,async (err, rows, fields) => {
                console.log(rows);
                userData = rows;
                if (userData.length !== 0) {
                    res.status(403).send({ code: 403, content: null, error: "Email Already Registered!!!" })
                }
                else {
                    //******* Generating Hash Password */
                    let hashPassword = await middleware.GeneratePassword(password);
                    console.log("Hash Password \n", hashPassword);

                    //******** Generating Token***************** */
                    console.log("Generating new Token");
                    let token = crypto.randomBytes(16).toString('hex');

                    console.log("New Token ===>", token);
                    let query = "INSERT INTO user (name, email, password, token) VALUES ('" +
                    name + "', '" + email + "', '" + hashPassword + "', '" + token + "' )";
                    database.query(query, function (err, result) {
                        if (err) throw err;
                        console.log("1 record inserted", result);
                        res.status(200).send({code : 200 , content : {message : "User SignUp Successfully", authToken : token} , error : null})
                    });

                }
            });

        } catch (err) {
            console.log(err);
            res.status(500).send({ code: 500, content: null, error: err });
        }
    },
    signin: async (req, res, next) => {
        try {
            var email = req.body.email;
            var password = req.body.password;

            if (!email) {
                res.status(404).send({ code: 404, content: null, error: "Email ID cannot be NULL" });
            }


            if (!password) {
                res.status(404).send({ code: 404, content: null, error: "Password cannot be NULL" });
            }

            console.log("Email id \n", email);
            console.log("Password \n", password);
            await database.query("SELECT * FROM user WHERE email = ? ", email,async (err, rows, fields) => {
                console.log("User Data \n", rows);
                if (rows.length === 0) {
                    res.status(403).send({ code: 403, content: null, error: "User Not Found!!" })
                }
                else {
                    let comparedPass = await middleware.ComparePassword(password, rows[0].password);

                    console.log("Password Match Status ==>", comparedPass);

                    if (!comparedPass) {
                       res.status(403).send({code : 403, content : null, error : "Password Doesn't Match"})
                    }
                    else {
                        res.status(200).send({code : 200, content :{message : "User SignIn Successfully" , authToken : rows[0].token}, error : null});
                    }
                }
            })
           
        } catch (err) {
            console.log(err);
            res.status(500).send({ code: 500, content: null, error: err });
        }
    },
    getuserprofile: async (req, res, next) => {
        try {
            var email = req.body.email;

            if (!email) {
                res.status(404).send({ code: 404, content: null, error: "Email ID cannot be NULL" });
            }

            console.log("Email id \n", email);
            await database.query("SELECT * FROM user WHERE email = ? ", email,async (err, rows, fields) => {
                if(err) {
                    res.status(500).send({ code: 500, content: null, error: err });
                }
                console.log("User Data \n", rows);
                res.status(200).send({code : 200, content : rows[0], error : null})
            })

        }catch (err) {
            console.log(err);
            res.status(500).send({ code: 500, content: null, error: err });
        }
    },
    updateuserprofile: async (req, res, next) => {
        try{
            var email = req.body.email;
            var name = req.body.name;
            var password = req.body.password;

            if (!email) {
                res.status(404).send({ code: 404, content: null, error: "Email ID cannot be NULL" });
            }
            if (!password) {
                res.status(404).send({ code: 404, content: null, error: "Password cannot be NULL" });
            }


            if (!name) {
                res.status(404).send({ code: 404, content: null, error: "Name cannot be NULL" });
            }

            console.log("Email id \n", email);
            console.log("Password \n", password);
            console.log("Name \n", name);

             //******* Generating Hash Password */
             let hashPassword = await middleware.GeneratePassword(password);
             console.log("Hash Password \n", hashPassword);
             let query = "UPDATE user SET name = '" + name + "', password = '" + hashPassword + "' WHERE email = '" + email + "'";
             await database.query(query, (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send({ code: 500, content: null, error: err });

                }
                console.log(result);
                res.status(200).send({ code: 200, content: {"message" : "User Updated Successfully!!!"}, error: null });

            });
        }catch (err) {
            console.log(err);
            res.status(500).send({ code: 500, content: null, error: err });
        }
    },
    addshoppinglist: async(req, res, next) => {
        try {
            var name = req.body.name;
            var quantity = req.body.quantity;
            var note = req.body.note;
            var category = req.body.category;
            var email = req.body.email;

            if (!name) {
                res.status(404).send({ code: 404, content: null, error: "Name cannot be NULL" });
            }

            if (!quantity) {
                res.status(404).send({ code: 404, content: null, error: "quantity cannot be NULL" });
            }

            if (!note) {
                res.status(404).send({ code: 404, content: null, error: "note cannot be NULL" });
            }

            if (!category) {
                res.status(404).send({ code: 404, content: null, error: "category cannot be NULL" });
            }

            if (!email) {
                res.status(404).send({ code: 404, content: null, error: "Email ID cannot be NULL" });
            }
            let query = "INSERT INTO user (name, email, quantity, category, note) VALUES ('" +
            name + "', '" + email + "', '" + quantity + "', '" + category + "','" + note + "' )";

            await database.query(query, (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send({ code: 500, content: null, error: err });

                }
                console.log(result);
                res.status(200).send({ code: 200, content: {"message" : "Shopping List added Successfully!!!"}, error: null });

            });

        }catch (err) {
            console.log(err);
            res.status(500).send({ code: 500, content: null, error: err });
        }
    }
}