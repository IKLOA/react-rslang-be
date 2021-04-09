const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { addMethods } = require('../../utils/toResponse');

const games = new Schema({
  savannah: { type: Number, required: false, default: 0 },
  sprint: { type: Number, required: false, default: 0 },
  audioCall: { type: Number, required: false, default: 0 },
  ourGame: { type: Number, required: false, default: 0 }
});

const UserWordsSchema = new Schema(
  {
    wordId: { type: mongoose.Schema.Types.ObjectID, required: true },
    userId: { type: mongoose.Schema.Types.ObjectID, required: true },
    difficulty: { type: String, required: false },
    games: { type: games },
    isRight: { type: Boolean, required: true },
    userWordDate: { type: String }
  },
  { collection: 'userWords' }
);

UserWordsSchema.index({ wordId: 1, userId: 1 }, { unique: true });

addMethods(UserWordsSchema);

module.exports = mongoose.model('UserWords', UserWordsSchema);
