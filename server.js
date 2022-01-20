const express = require( 'express' );
const mysql = require( 'mysql2' );
const inputCheck = require('./utils/inputCheck');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use( express.urlencoded( { extended: false } ) );
app.use( express.json() );
// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'election'
    },
    console.log( 'Connected to the election database.' )
);

// root location
app.get( '/', ( req, res ) => {
    if ( req.query ) {
        res.send( `<h1>${ 'MySQL Voting App' }</h1>` )
    } else {
        res.json( {
            message: 'hello world'
        } );
    }
} );

// GET all candidates
app.get( '/api/candidates', ( req, res ) => {
    const sql = `SELECT candidates.*, parties.name
                 AS party_name
                 FROM candidates
                 LEFT JOIN parties
                 ON candidates.party_id = parties.id`;

    db.query( sql, ( err, rows ) => {
        if ( err ) {
            res.status( 500 ).json( { error: err.message } );
            return;
        }
        res.json( {
            message: 'success',
            data: rows
        } );
    } );
} );

// // GET a single candidate
app.get('/api/candidates/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                 FROM candidates
                 LEFT JOIN parties
                 ON candidates.party_id = parties.id
                 WHERE candidates.id = ?`;
    const params = [req.params.id];

    db.query( sql, params, (err, row) => {
        if (err){
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// Delete a candidate
app.delete('/api/candidates/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result)=>{
        if (err) {
            // respond with 400 error message
            res.status(400).json({error: err.message});
        } else if (!result.affectedRows){
            // respond with message Request Not Found
            res.json({message: "Candidate Not Found"});
        } else {
            // respond with changes on the result's affected rows
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// Create a candidate
app.post('/api/candidate', ({body}, res) => {
    // inputCheck is imported from utils module
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if(errors){
        res.status(400).json({error: errors});
        return;
    }
    // database call
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
                VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err){
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

// query for READ
// db.query( 'SELECT * FROM candidates WHERE id = 1', ( err, row ) => {
//     if ( err ) { console.log( err ); }
//     console.log( row );
// } );

// query for DELETE 
// db.query( `DELETE FROM candidates WHERE ID = ?`, 1, ( err, result ) => {
//     if ( err ) { console.log( err ); }
//     console.log( result );
// } );

// query for CREATE
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
// VALUES (?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank',1];

// db.query(sql, params, (err, result) => {
//         if ( err ) { console.log( err ); }
//         console.log( result );
// });

// handle unsupported requests (overrides all other routes, place at end)
app.use( ( req, res ) => {
    res.status( 404 ).end();
} );

// start Express server
app.listen( PORT, () => {
    console.log( `Server running on port http://localhost:${ PORT }` );
} );

