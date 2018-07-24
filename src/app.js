const fs = require( 'fs' );
const path = require( 'path' );
const puppeteer = require( 'puppeteer' );
const url = process.argv.slice( 2 );

puppeteer.launch().then( async ( browser ) => {
    let resources = [];

    const page = await browser.newPage();

    await page.setViewport( {width: 1920, height: 1200} );
    await page.goto( url.toString(), {waitUntil: 'networkidle2'} );

    const headLinks = await page.$$eval( 'link', ( e ) => e.map( ( n ) => n.href ) );

    // write css hrefs to resources array
    for ( let i = 0; i < headLinks.length; ++i ) {
        if ( headLinks[i].match( /(css)/ ) ) {
            resources.push( headLinks[i] );
        }
    }

    // load resource file into browser
    for ( let j = 0; j < resources.length; ++j ) {
        await page.goto( resources[j] );

        let res = resources[j].split( '/' );
        let fileName = res[res.length - 1];

        const css = await page.$eval( 'html', ( e ) => e.innerText );

        // write the CSS files to disc
        fs.writeFile( path.join( __dirname, '../output', fileName ), css, 'utf8', ( err ) => {
            if ( err ) {
                throw err;
            }
            console.log( `${fileName} has been written.` );
        } );
    }
    // close browser when done
    await browser.close();
} );
