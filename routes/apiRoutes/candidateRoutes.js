// setup router
const router = require( 'express' ).Router();
// import db connection
const db = require( '../../db/connection' );
// import the utility func inputCheck
const inputCheck = require( '../../utils/inputCheck' );

// ROUTES
// GET all candidates
router.get( '/candidates', ( req, res ) => {
    const sql = `SELECT candidates.*, parties.name
                 AS party_name
                 FROM candidates
                 LEFT JOIN parties
                 ON candidates.party_id = parties.id`;

    db.query( sql, ( err, rows ) => {
        if ( err ) {
            res.status( 500 ).json( { error: err.message } )
            return;
        }
        res.json( {
            message: 'success',
            data: rows
        } );
    } );
} );

// GET a single candidate by id
router.get( '/candidate/:id', ( req, res ) => {
    const sql = `SELECT candidates.*, parties.name
                 AS party_name
                 FROM candidates
                 LEFT JOIN parties
                 ON candidates.party_id = parties.id
                 WHERE candidates.id = ?`;
    const params = [req.body.id];
    
    db.query(sql, params, (err, row) => {
        if (err){
            res.status(400).json({error:err.message})
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
} );

// CREATE a candidate
router.post( '/candidate', ( { body }, res ) => {
    // validate 
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if(errors){
        res.status(500).json({error:errors});
        return;
    }

    // database call
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
                 VALUES (?, ?, ?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result)=>{
        if(err){
            // send error message not found
            res.status(400).json({error:err.message})
            return;
        }
        res.json({
            message:'success',
            data: body
        });
    });
} );

// UPDATE a candidate's party_id
router.put( '/candidate/:id', ( req, res ) => {
    // handle input validation
    const errors = inputCheck(req.body, 'party_id');
    if(errors){
        res.status(400).json({error:errors});
        return;
    }

    // define query parameters
    const sql = `UPDATE candidates SET party_id = ?
    WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    
    // Update db
    db.query(sql, params, (err, result)=>{
        // check for err => send 400
        if(err){
            res.status(400).json({error:err.message});
        } else if (!result.affectedRows){
            // send not found msg
            res.json({message:'Candidate Not Found'});
        } else {
            // send result
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
} );

// DELETE a candidate by id
router.delete( '/candidate/:id', ( req, res ) => {
    // sql string & params
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    // database call
    db.query(sql, params, (err, result)=>{
        // handle err
        if (err){
            res.status(400).json({error:err.message});
        } else if (!result.affecteRows){
            // handle not found
            res.json({message:'Candidate Not Found'});
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
} );

// modularize the router -> for index.js to handle
module.exports = router;