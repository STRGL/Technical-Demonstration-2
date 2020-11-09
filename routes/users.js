const express = require('express');

const router = express.Router();
const User = require('../models/User');

// ? RETURN USERS PAGE
router.get('/', paginateResults(User), (req, res, next) => {
  res.render('users', { title: "User's Page", response: res.paginatedResults });
});

// ? GET USERS
router.get('/api', paginateResults(User), (req, res, next) => {
  res.json(res.paginatedResults);
});

// ? RETURN FRENCH SPEAKING USERS
router.get('/api/french', async (req, res) => {
  try {
    const frenchSpeakingPeople = await User.aggregate([
      // ? IF SHOULD ONLY SPEAK FRENCH
      // { $match: { spokenLanguages: ['French'] } },
      // ? IF SHOULD SPEAK FRENCH
      { $match: { spokenLanguages: 'French' } },
    ]);
    res.json(frenchSpeakingPeople);
  } catch (err) {
    res.json({ message: err });
  }
});

// ? RETURN FIVE UNIQUE LANGUAGE USERS
router.get('/api/FiveUniqueLanguages?', async (req, res) => {
  try {
    if (req.query.languages === undefined) {
      throw new Error(
        'No "languages" property present. Please use "languages" to define the five languages you would like to filter by'
      );
    }
    //* SAVE SHORTER REFERENCES TO LANGUAGES
    const langs = req.query.languages;

    //* CHECK FOR DUPLICATE VALUES
    langs.forEach((language, index) => {
      for (let i = 0; i < langs.length; i++) {
        if (index === i) continue;
        if (language === langs[i]) {
          throw new Error(
            'Multiple of the same language declared. Unique values only must be used'
          );
        }
      }
    });
    //* IF THERE ARE MORE OR LESS THAN 5 LANGUAGES PROVIDED THROW ERROR
    if (langs.length === 5) {
      const uniqueLanguageUsers = await User.find({
        spokenLanguages: { $all: langs },
      });
      res.json(uniqueLanguageUsers);
    } else {
      throw new Error('Query should contain exactly five languages');
    }
  } catch (err) {
    console.error(err);
    res.json({ message: err });
  }
});

// ? SAVE A USER
router.post('/api/createuser', async (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    location: req.body.location,
    email: req.body.email,
    spokenLanguages: req.body.spokenLanguages,
  });

  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.json({ message: err });
  }
});

function paginateResults(model) {
  return async (req, res, next) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};
    results.count = await model.countDocuments().exec();

    if (endIndex < results.count) {
      results.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit,
      };
    }
    try {
      results.data = await model
        .find()
        .limit(limit)
        .skip(startIndex)
        .exec();
    } catch (err) {
      res.status(500).json({ message: err });
    }
    results.currentPage = page;
    results.limit = limit;
    results.startIndex = startIndex;
    res.paginatedResults = results;
    next();
  };
}

module.exports = router;
