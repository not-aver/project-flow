const express = require('express');
const authRequired = require('../middleware/auth');
const controller = require('../controllers/timeEntry.controller');

const router = express.Router();

router.use(authRequired);

router.get('/', controller.listTimeEntries);
router.get('/active', controller.getActiveEntry);
router.post('/start', controller.startTimer);
router.post('/:entryId/stop', controller.stopTimer);
router.post('/manual', controller.createManualEntry);

module.exports = router;

