let bcrypt = require("bcryptjs");
(GeneratePassword = async password => {
    //*******  Generate Salt */
    return new Promise(async (resolve, reject) => {
      await bcrypt.genSalt(10, async function(error, salt) {
        if (error) {
          console.log(error);
          reject(error);
        }
        // hash the password using the new salt
        bcrypt.hash(password, salt, async function(error, hash) {
          if (error) {
            console.log(error);
            reject(error);
          }
          //console.log("Hash Password ==> \n", hash)
          // override the cleartext password with the hashed one
          password = hash;
          resolve(password);
        });
      });
    });
  }),
  (ComparePassword = async (password, encryptedPass) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, encryptedPass, function(error, success) {
        if (error) console.log(error);
        //console.log(success);
        resolve(success);
      });
    }).catch(error => {
      console.log(error);
    });
  })

  module.exports = {
    GeneratePassword:GeneratePassword,
    ComparePassword : ComparePassword
  }