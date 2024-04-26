'use strict'
const express = require('express')
const user = require('../controllers/userController')
const router = express.Router()

router.get(`/api/v1/user/:id`, user.show)
router.get(`/api/v1/user/`, user.index)
router.post(`/api/v1/user/`, user.store)
router.put(`/api/v1/user/:id`, user.update)
router.delete(`/api/v1/user/:id`, user.destroy)

module.exports = router