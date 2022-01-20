// setup router instance
const express = require( 'express' );
const router = express.Router();

// handle routes for candidates
router.use( require( './candidateRoutes' ) );
// handle routes for parties 
router.use( require( './partyRoutes' ) );
// handle routes for voters
router.use( require( './voterRoutes' ) );

// modularize router
module.exports = router;