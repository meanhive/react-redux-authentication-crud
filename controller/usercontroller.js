const secretKey = require("../config.json").secret;
const jwt = require("jsonwebtoken");
const User = require("../model/usermodel");
const assert = require("assert");

module.exports = {
  login: (req, res) => {
    if ((req.body.username || req.body.email) && req.body.password) {
      var qry = {
        password: req.body.password,
        $or: [
          {
            email: req.body.email,
          },
          {
            username: req.body.username,
          },
        ],
      };

      // calling user collection
      User.findOne(qry, "-new -password")
        .populate({
          path: "language",
          select: "name",
        })
        .exec((err, user) => {
          if (err) res.status(500).json({ error_code: 500, message: err });

          // user info validation
          if (user !== undefined && user !== null) {
            //jwt token
            var token = jwt.sign(
              {
                email: user.email,
                password: user.password,
              },
              secretKey
            );

            //auth object
            var authObject = {
              data: user,
              message: "Login Successful",
              error_code: 200,
              token: token,
            };
            res.status(200).send(authObject);
          } else {
            // exception handling
            res.status(200).send({
              error_code: 704,
              property: "user",
              message: "User not found",
            });
          }
        });
    }
  },
  signUp: (req, res) => {
    if (req.body) {
      let userObj = new User(req.body);

      userObj.save((err, user) => {
        if (err) {
          console.log(err.name);
          let count = 0,
            err_c;

          switch (err.name) {
            case "ValidationError":
              console.log(err.errors);
              for (field in err.errors) {
                if (count == 0) {
                  switch (err.errors[field].properties.type) {
                    case "invalid":
                      count++;
                      res.status(200).json({
                        error_code: 401,
                        property: field,
                        message: "Invalid Format",
                      });
                      break;

                    case "unique":
                      count++;
                      res.status(200).json({
                        error_code: 402,
                        property: field,
                        message: "Already Exists",
                      });
                      break;

                    case "user defined":
                      count++;
                      res.status(200).json({
                        error_code: 401,
                        property: field,
                        message: "Invalid format",
                      });
                      break;

                    case "regexp":
                      count++;
                      res.status(200).json({
                        error_code: 301,
                        property: field,
                        message: "register expired",
                      });
                      break;

                    case "required":
                      count++;
                      res.status(200).json({
                        err_code: 201,
                        property: field,
                        message: "Required",
                      });
                      break;

                    default:
                      err_c = 500;
                      count++;
                      res.status(200).json({
                        error_code: err_c,
                        message: err,
                      });
                      break;
                  }
                }
              }
              break;
            default:
              res.status(200).json({ error_code: 500, message: err });
              break;
          }
        } else {
          res
            .status(200)
            .json({ data: user, message: "Success", successCode: 200 });
        }
      });
    } else {
      req.status(200).json({ error_code: 707, message: "values required" });
    }
  },
  showAll: (req, res) => {
    User.find((err, response) => {
      if (err) assert.equal(null, err);
      res.json(response);
    });
  },
  showOne: (req, res) => {
    // viewing single contact info
    let id = req.params.id;
    User.findById({ _id: id }, (err, data) => {
      if (err) assert.equal(err, null);
      res.json(data);
    });
  },
  update: (req, res) => {
    let id = req.params.id; // read id form url address

    User.findById({ _id: id }, (err, response) => {
      if (err) assert.equal(null, err);
      if (!response) {
        res.status(200).json({ code: 301, message: "No data found.." });
      } else {
        response.username = req.body.username;
        response.email = req.body.email;
        response.mobile = req.body.mobile;
        response.address = req.body.address;
        response.role = req.body.role;
        response.password = req.body.password;
        response
          .save()
          .then((obj) => {
            res
              .status(200)
              .json({ code: 200, message: "Successfully updated" });
          })
          .catch((err) => {
            assert.equal(null, err);
            res.status(200).json({ code: 301, message: "Unable to update" });
          });
      }
    });
  },
  delete: (req, res) => {
    let id = req.params.id;

    User.findByIdAndDelete({ _id: id }, (err, response) => {
      if (err) {
        assert.equal(null, err);
        res.status(200).json({ code: 301, message: "Unable to delete" });
      } else {
        res.status(200).json({ code: 200, message: "deleted successfully" });
      }
    });
  },
};
