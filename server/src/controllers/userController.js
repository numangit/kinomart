const createErrors = require('http-errors');
const User = require('../models/userModel');

//endpoint logics/controls here

//get all users control
const getUsers = async (req, res, next) => {
  try {
    const searchKeyword = req.query.search || "";
    const searchRegexp = new RegExp(".*" + searchKeyword + ".*", 'i'); //before or after search word doesn't matter and i is for case insensitive

    //filtration and queries
    const filterQuery = {
      isAdmin: { $ne: true }, //not admin
      $or: [ //filter by searched name, email or phone
        { name: { $regex: searchRegexp } },
        { email: { $regex: searchRegexp } },
        { phone: { $regex: searchRegexp } },
      ]
    };
    const options = { password: 0 }; //to exclude the password field from users results

    const users = await User.find(filterQuery, options);
    res.status(200).send({
      message: "Users data has been sent",
      users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers };