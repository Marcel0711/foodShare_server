const router = require('express').Router()
const { loginUser, registerUser, deleteUser, getUser } = require('../controllers/User')
const auth = require('../middleware/Auth')

const { storage } = require('../storage/storage') 
const multer = require('multer')
const upload = multer({storage})

router.get('/u/:username', getUser)

router.post('/register', upload.single('avatar'), registerUser)
router.post('/login', loginUser)

router.delete('/:id', auth, deleteUser)

module.exports = router
