const router = require('express').Router()
const { getAllRecipes, getSingleRecipe, addRecipe, deleteRecipe, getUserRecipes, getRecipesByCategory } = require('../controllers/Recipe')
const auth = require('../middleware/Auth')

const { storage } = require('../storage/storage') 
const multer = require('multer')
const upload = multer({storage})


router.get('/', getAllRecipes)
router.get('/:category', getRecipesByCategory)
router.get('/user/:username', getUserRecipes)
router.get('/r/:id', getSingleRecipe)

router.post('/', auth,  upload.single('image'), addRecipe)

router.delete('/:id', auth, deleteRecipe)

module.exports = router
