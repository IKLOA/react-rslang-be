const { OK } = require('http-status-codes');
const router = require('express').Router({ mergeParams: true });
const statisticService = require('./statistic.service');
const { statistics } = require('../../utils/validation/schemas');
const { validator } = require('../../utils/validation/validator');
const Statistics = require('./statistic.model');
const { Types } = require('mongoose');
const dateFormat = require('dateformat');

router.get('/', async (req, res) => {
  const userId = req.userId;
  console.log(userId);
  const statistic = await Statistics.aggregate([
    {
      $match: { userId: { $eq: userId } }
    },
    {
      $group: {
        _id: '$statiscticDate',
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        date: '$_id',
        count: '$count'
      }
    },
    { $sort: { date: 1 } }
  ]);

  return res.status(OK).json(statistic);
});

router.put('/', validator(statistics, 'body'), async (req, res) => {
  const statistic = await statisticService.upsert(req.userId, req.body);
  res.status(OK).send(statistic.toResponse());
});

router.post('/', async (req, res) => {
  const date = dateFormat(new Date(), 'yyyy-mm-dd');
  const statistic = {
    userId: req.userId,
    learnedWord: 1,
    statiscticDate: date
  };

  await Statistics(statistic).save();
  res.status(200).json(statistic);
});

module.exports = router;
