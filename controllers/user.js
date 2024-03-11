/**
 * We can interact with mongoose in three diffirent ways:
 * [v] Callback
 * [v] Promises
 * [v] Async/await (Promises)
 */

const bodyParser = require("body-parser");
const Deck = require("../models/Deck");
const User = require("../models/User");
const JWT = require("jsonwebtoken");
const {JWT_SECRET} = require("../configs/index")
console.log(Date())
const encodedToken = (userID)=>{
  return JWT.sign({
    iss : 'Cong Son',
    sub : userID,
    iat : new Date().getTime(),
    exp : new Date().setDate(new Date().getDate() + 3)
  },JWT_SECRET)
}
const getUser = async (req, res, next) => {
  const { userID } = req.value.params;

  const user = await User.findById(userID);

  return res.status(200).json({ user });
};

const getUserDecks = async (req, res, next) => {
  const { userID } = req.value.params;

  // Get user
  const user = await User.findById(userID).populate("decks");

  return res.status(200).json({ decks: user.decks });
};

const index = async (req, res, next) => {
  const users = await User.find({});

  return res.status(200).json({ users });
};

const newUser = async (req, res, next) => {
  const newUser = new User(req.value.body);

  await newUser.save();

  return res.status(201).json({ user: newUser });
};

const newUserDeck = async (req, res, next) => {
  const { userID } = req.value.params;

  // Create a new deck
  const newDeck = new Deck(req.value.body);

  // Get user
  const user = await User.findById(userID);

  // Assign user as a deck's owner
  newDeck.owner = user;

  // Save the deck
  await newDeck.save();

  // Add deck to user's decks array 'decks'
  user.decks.push(newDeck._id);

  // Save the user
  await user.save();

  res.status(201).json({ deck: newDeck });
};

const replaceUser = async (req, res, next) => {
  // enforce new user to old user
  const { userID } = req.value.params;

  const newUser = req.value.body;

  const result = await User.findByIdAndUpdate(userID, newUser);

  return res.status(200).json({ success: true });
};

const updateUser = async (req, res, next) => {
  // number of fields
  const { userID } = req.value.params;

  const newUser = req.value.body;

  const result = await User.findByIdAndUpdate(userID, newUser);

  return res.status(200).json({ success: true });
};
const secret = async (req, res, next) => {
  console.log("hellow rodl");
};
const signin = async (req, res, next) => {
  console.log("hellow rodl");
};
const showData = async (req,res,next) =>{
  console.log("This is Data : ")
  const Data = await User.find({})
  return res.status(400).json({Data : {Data}})
}
const signup = async (req, res, next) => {
  const {firstName,lastName,password,email} = req.value.body;
  console.log(req.body);
  // check gmail user send : 
  const email_user = await User.findOne({email : email})
  if (email_user) {
    return res.status(403).json({Error : {message : "email is existed", status : res.statusCode}})
  }
  // create user :
  const newUser = new User({firstName,lastName,password,email})
  await newUser.save();
  console.log(newUser)
  // encoded : 
  const token = encodedToken(newUser._id)
  console.log(token)
  res.setHeader('Authentication',token)
  return res.status(400).json({Usernew : newUser})
};
module.exports = {
  getUser,
  getUserDecks,
  index,
  newUser,
  newUserDeck,
  replaceUser,
  updateUser,
  secret,
  signin,
  signup,
  showData,
};
