/*
  This file includes Endpoint logics/controls here
*/

const createErrors = require('http-errors');
const User = require('../models/userModel');
const { successResponse } = require('./responseController');
const { findItemById } = require('../services/findItem');
const fs = require('fs'); //built-in Node.js file system module helps us store, access, and manage data on our operating/file system.

//get all users control
const getUsers = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;//page number for pagination
    const pageLimit = Number(req.query.limit) || 5; //data per page limit
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
    const options = { password: 0 }; //exclude password field from users results

    const users = await User.find(filterQuery, options)
      .limit(pageLimit)
      .skip((page - 1) * pageLimit); //understand the pagination

    const count = await User.find(filterQuery).countDocuments(); //count of searched results

    //throw error if no result found
    if (!users) throw createErrors(404, 'no users found');

    return successResponse(res, {
      statusCode: 200,
      message: "users were returned",
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / pageLimit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / pageLimit) ? page + 1 : null
        }
      }
    });

  } catch (error) {
    next(error);
  };
};

//get user by id
const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 }; //exclude password field from users results
    const user = await findItemById(User, id, options);

    return successResponse(res, {
      statusCode: 200,
      message: "user returned",
      payload: { user }
    });

  } catch (error) {
    next(error);
  };
};

//delete user by id
const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findItemById(User, id, options);//to check if user exist

    //delete user image (from local device I guess)
    const userImagePath = user.image;
    fs.access(userImagePath, (error) => {
      if (error) {
        console.error('user image does not exist');
      } else {
        //fs.unlink is used for deleting
        fs.unlink(userImagePath, (error) => {
          if (error) throw error;
          console.log('User image deleted successfully');
        });
      };
    });

    //delete user from db
    await User.deleteOne({ _id: id, isAdmin: false });

    return successResponse(res, {
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUserById, deleteUserById };