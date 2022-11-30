const Bootcamp = require ('../models/bootcamp');
const ErrorResponse = require ('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const asyncHandler = require ('../middlewares/async')


// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
        let query;

        let queryStr = JSON.stringify(req.query);

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        query = Bootcamp.find(JSON.parse(queryStr));

        const bootcamps = await query

        res
          .status(200)
          .json({ success: true, count: bootcamps.length, data: bootcamps });

   });

// @desc Get single bootcamps
// @route GET /api/v1/bootcamps/:id
// @access Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);

                if(!bootcamp) {
                   return  next(
                       new ErrorResponse(`Bootcamp not found with id of ${res.params.id}`, 404)
                   );
                }
                res.status(200).json({ success: true, data: bootcamp });
   });

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @access Private

exports.createBootcamp = asyncHandler( async (req, res, next) => {
                const bootcamp = await Bootcamp.create(req.body);

                res.status(200).json({
                    success: true,
                    data: bootcamp
                });
  });

// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
                       new: true,
                       runValidators: true
                });
                if (!bootcamp) {
                        return next(
                            new ErrorResponse(`Bootcamp not found with id of ${res.params.id}`, 404)
                        );
                }
                res.status(200).json({success: true, data: bootcamp })

    });

// @desc Delete bootcamp
// @route PUT /api/v1/bootcamps
// @access Private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
                if (!bootcamp) {
                    return next (
                        new ErrorResponse(`Bootcamp not found with id of ${res.params.id}`, 404)
                    );
                }
                res.status(200).json({success: true, data: {} })

    });


// @desc    Get bootcamps within a radius
// @route   Get /api/v1/bootcamps/radius/:zipcode/:distance
// @access  private

exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // calc radius using radians
    // divide dist by radius of earth
    // earth radius  = 3,965 / 6,378 km

    const radius = distance / 3963

    const bootcamps = await Bootcamp.find ({
        location: {$geoWithin: { $centerSphere: [ [ lng, lat ], radius ] } }
    });

    res.status(200).json({
        success: true,
       count: bootcamps, length,
        data: bootcamps
    });
});
