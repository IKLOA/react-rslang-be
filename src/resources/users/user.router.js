const { OK, NO_CONTENT } = require('http-status-codes');
const router = require('express').Router();
const upload = require('../../utils/upload');
const User = require('./user.model');

const userService = require('./user.service');
const { id, user } = require('../../utils/validation/schemas');
const {
  validator,
  userIdValidator
} = require('../../utils/validation/validator');

router.post(
  '/',
  upload.single('photo'),
  validator(user, 'body'),
  async (req, res) => {
    const photo = req.file ? req.file.path : null;
    const { name, email, password } = req.body;
    const userEntity = await userService.save({ name, email, password, photo });
    res.status(OK).send(userEntity.toResponse());
  }
);

router.get(
  '/:id',
  userIdValidator,
  validator(id, 'params'),
  async (req, res) => {
    const userEntity = await userService.get(req.params.id);
    res.status(OK).send(userEntity.toResponse());
  }
);

router.put(
  '/:id',
  userIdValidator,
  validator(id, 'params'),
  validator(user, 'body'),
  async (req, res) => {
    const userEntity = await userService.update(req.userId, req.body);
    res.status(OK).send(userEntity.toResponse());
  }
);

router.patch('/', upload.single('photo'), async (req, res) => {
  try {
    const { name, email } = req.body;
    const photo = req.file ? req.file.path : null;

    const updated = {
      name
    };

    if (photo) updated.photo = photo;

    const updatedUser = await User.findOneAndUpdate(
      {
        email
      },
      {
        $set: updated
      },
      {
        new: true
      }
    );

    res.status(200).json({ name: updatedUser.name, photo: updatedUser.photo });
  } catch (e) {
    console.log(e);
  }
});

router.delete(
  '/:id',
  userIdValidator,
  validator(id, 'params'),
  async (req, res) => {
    await userService.remove(req.params.id);
    res.sendStatus(NO_CONTENT);
  }
);

module.exports = router;
