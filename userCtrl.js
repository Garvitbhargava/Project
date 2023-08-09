const req = require("express/lib/request");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { genrateToken } = require("../config/jwtToken");


const createUser = asyncHandler(async (req, res) =>
{
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });

    if (!findUser)
    {
        //create a new user  
        const newUser = User.create(req.body);
        res.json(newUser);
    } else
    {
        //User already Exists
       throw new Error("User already Exists")
    }
});

const loginUserCtrl = asyncHandler(async (req, res) =>
{
    const { email, password } = req.body;
    //Check if user exixts or not
    const findUser = await User.findOne({ email });
    if (findUser && await findUser.isPasswordMatched(password))
    {
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: genrateToken(findUser?._id),
        });
    } else
    {
        throw new Error("Invalid Credential");
    }
});

//Update a user

const updatedUser = asyncHandler(async (req, res) =>
{
    const { id } = req.user;
    try
    {
        const updatedUser = await User.findByIdAndUpdate(id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        },
            {
            new: true,
            }
        );
        res.json(updatedUser);
    }
    catch (error)
    {
        throw new Error(error);
    }
});

//Get all the users

const getallUser = asyncHandler(async (req, res) =>
{
    try
    {
        const getUsers = await User.find();
        res.json(getUsers);
    }
    catch (error)
    {
        throw new Error(error);
    }
});

//Get a single user

const getUser = asyncHandler(async (req,res) =>
{
    const { id } = req.params;
    try
    {
        const getUser = await User.findById(id);
        res.json({
            getUser,
        });

        
    }
    catch (error)
    {
        throw new Error(error);
    }
});


//delete a user

const deleteaUser = asyncHandler(async (req,res) =>
{
    const { id } = req.params;
    try
    {
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({
            deleteaUser,
        });

        
    }
    catch (error)
    {
        throw new Error(error);
    }
});

const blockUser = asyncHandler(async (req, res) =>
{ 
    const { id } = req.params;
    try
    {
        const block = User.findByIdAndUpdate(
            id,
            {
                isBlocked: true,
            },
            {
                new: true,
            }
        );
        res.json({
            message: "User Blocked",
        });
    } catch (error)
    {
        throw new Error(error);
    }
});
const unblockUser = asyncHandler(async (req, res) => {const { id } = req.params;
    try
    {
        const unblock = User.findByIdAndUpdate(
            id,
            {
                isBlocked: false,
            },
            {
                new: true,
            }
        );
        res.json({
            message: "User Unblocked",
        });
    } catch (error)
    {
        throw new Error(error);
    } });


module.exports = {
    createUser,
    loginUserCtrl,
    getallUser,
    getUser,
    deleteaUser,
    updatedUser,
    blockUser,
    unblockUser,
};
 