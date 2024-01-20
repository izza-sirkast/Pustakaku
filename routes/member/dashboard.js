const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('member/dashboard', {
        layout : 'layouts/member-layout'
    })
})

module.exports = router