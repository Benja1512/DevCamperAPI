const express = require('express');
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampInRadius
} = require('../controllers/bootcamps')

const router = express.Router();

const { protect } = require('../middleware/auth');

// Re-route into other resource routers

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius)


router
    .route('/')
    .get(getBootcamps)
    .post(protect, createBootcamp);
router
    .route('/:id')
    .get(getBootcamp)
    .put(protect, updateBootcamp)
    .delete(protect, deleteBootcamp);

module.exports = router;