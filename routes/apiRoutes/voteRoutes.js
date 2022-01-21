const router = require( 'express' ).Router();
const db = require( '../../db/connection' );
const inputCheck = require( '../../utils/inputCheck' );

// get vote totals (AGGREGATE)
router.get( '/votes', ( req, res ) => {
    // Declare a sql variable and set it equal to the SQL query you just wrote.
    const sql = `
        SELECT candidates.*, parties.name AS party_name, COUNT(candidate_id) AS vote_count
        FROM votes
        LEFT JOIN candidates ON votes.candidate_id = candidates.id
        LEFT JOIN parties ON candidates.party_id = parties.id
        GROUP BY candidate_id ORDER BY vote_count DESC        
    `;

    // Run the query with db.query().
    db.query( sql, ( err, rows ) => {
        if ( err ) {
            // In the callback function, check for errors and return a status of 500 if there are any.
            res.status( 500 ).json( { error: err.message } );
            return;
        }
        // Otherwise, return a success object that includes the rows of data.
        res.json( {
            message: 'success',
            data: rows
        } );
    } );
} );

// POST route to update the voter's vote
router.post( '/vote', ( { body }, res ) => {
    const errors = inputCheck( body, 'voter_id', 'candidate_id' );
    if ( errors ) {
        res.status( 400 ).json( { error: errors } );
        return;
    }

    // sql query update the vote's voter_id and candidate_id values
    const sql = `INSERT INTO votes (voter_id, candidate_id) VALUES (?, ?)`;
    const params = [ body.voter_id, body.candidate_id ];

    db.query( sql, params, ( err, result ) => {
        if ( err ) {
            res.status( 400 ).json( { error: err.message } );
            return;
        }
        res.json( {
            message: 'success',
            data: body,
            changes: result.affectedRows
        } );
    } );
} );

module.exports = router;