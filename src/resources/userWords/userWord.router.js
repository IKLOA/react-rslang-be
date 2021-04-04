const { OK, NO_CONTENT } = require('http-status-codes');
const UserWord = require('./userWord.model');
const router = require('express').Router({ mergeParams: true });
const { userWord, wordId } = require('../../utils/validation/schemas');
const { validator } = require('../../utils/validation/validator');
const { ENTITY_EXISTS } = require('../../errors/appErrors');
const ENTITY_NAME = 'user word';
const MONGO_ENTITY_EXISTS_ERROR_CODE = 11000;

const userWordService = require('./userWord.service');

router.get('/', async (req, res) => {
  const userWords = await userWordService.getAll(req.userId);
  res.status(OK).send(userWords.map(w => w.toResponse()));
});

router.get('/:wordId', validator(wordId, 'params'), async (req, res) => {
  const word = await userWordService.get(req.params.wordId, req.userId);
  res.status(OK).send(word.toResponse());
});

router.post('/:wordId', async (req, res) => {
  try {
    const games = {
      savannah: 0,
      sprint: 0,
      audioCall: 0,
      ourGame: 0
    };

    games[req.body.currentGame] = 1;

    const newUserWord = {
      wordId: req.params.wordId,
      userId: req.userId,
      difficulty: req.body.difficulty,
      games
    };

    await UserWord.create(newUserWord);

    res.status(OK).json(newUserWord);
  } catch (err) {
    if (err.code === MONGO_ENTITY_EXISTS_ERROR_CODE) {
      throw new ENTITY_EXISTS(`such ${ENTITY_NAME} already exists`);
    } else {
      throw err;
    }
  }
});

router.patch('/:wordId', async (req, res) => {
  try {
    const word = await UserWord.findOne({
      userId: req.userId,
      wordId: req.params.wordId
    });
    const games = word.games;
    games[req.body.currentGame] = games[req.body.currentGame] + 1;

    const updated = { games };

    const updatedUserWord = await UserWord.findOneAndUpdate(
      {
        _id: word._id
      },
      {
        $set: updated
      },
      {
        new: true
      }
    );

    res.status(200).json(updatedUserWord);
  } catch (e) {
    console.log(e);
  }
});

router.put(
  '/:wordId',
  validator(wordId, 'params'),
  validator(userWord, 'body'),
  async (req, res) => {
    const word = await userWordService.update(
      req.params.wordId,
      req.userId,
      req.body
    );
    res.status(OK).send(word.toResponse());
  }
);

router.delete('/:wordId', validator(wordId, 'params'), async (req, res) => {
  await userWordService.remove(req.params.wordId, req.userId);
  res.sendStatus(NO_CONTENT);
});

module.exports = router;
