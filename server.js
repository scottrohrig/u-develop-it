const express = require( 'express' );
const db = require('./db/connection')
const apiRoutes = require('./routes/apiRoutes');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use( express.urlencoded( { extended: false } ) );
app.use( express.json() );

// use api routes
app.use('/api', apiRoutes);

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

// handle unsupported requests (overrides all other routes, place at end)
app.use( ( req, res ) => {
    res.status( 404 ).end();
} );
    

// start Express server after db connection
db.connect(err=>{
    if (err) throw err;
    console.log('Database Connected')
    app.listen( PORT, () => {
        console.log( `Server running on port http://localhost:${ PORT }` );
    } );
});
