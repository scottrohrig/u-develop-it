const router = require( 'express' ).Router();
const db = require( '../../db/connection' );

// GET all parties
router.get( '/parties', ( req, res ) => {
    const sql = `SELECT * FROM parties`;
    db.query( sql, ( err, rows ) => {
        if ( err ) {
            res.status( 500 ).json( { error: err.message } );
        }
        res.json( {
            message: 'success',
            data: rows
        } );
    } );
} );

// GET a single party by id
router.get( '/party/:id', ( req, res ) => {
    const sql = `SELECT * FROM parties WHERE id = ?`;
    const params = [ req.params.id ];
    db.query( sql, params, ( err, row ) => {
        if ( err ) {
            res.status( 400 ).json( { error: err.message } );
            return;
        }
        res.json( {
            message: 'success',
            data: row
        } );
    } );
} );

// DELETE a party
router.get( '/party/:id', ( req, res ) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [ req.params.id ];
    db.query( sql, params, ( err, result ) => {
        if ( err ) {
            res.status( 400 ).json( { error: err.message } );
        } else if ( !result.affectedRows ) {
            res.json( { message: 'Party Not Found' } );
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    } );
} );

// modularize the party routes (to serve as middleware)
module.exports = router;