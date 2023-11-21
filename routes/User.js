const router = require('express').Router()
const { loginUser, registerUser, deleteUser, getUser } = require('../controllers/User')
const auth = require('../middleware/Auth')
router.get('/u/:username', getUser)

router.post('/register', registerUser)
router.post('/login', loginUser)

router.delete('/:id', auth, deleteUser)

module.exports = router
