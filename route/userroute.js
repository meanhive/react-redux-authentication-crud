const express = require("express");
const appRoute = express.Router();
const userController = require("../controller/usercontroller");

appRoute.route("/signup").post(userController.signUp);
appRoute.route("/login").post(userController.login);

appRoute.route("/users").get(userController.showAll); // read single
appRoute.route("/users/:id").get(userController.showOne); // read single
appRoute.route("/users/:id").patch(userController.update); // update
appRoute.route("/users/:id").delete(userController.delete); // delete
module.exports = appRoute;
