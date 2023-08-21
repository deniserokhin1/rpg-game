const router = require('express').Router()

const { getConfig } = require('../controllers/configs')

router.get('/:config', getConfig)

module.exports = router
