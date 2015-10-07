"use strict";
var Lsys     = require("../lib/LsysParametric.MIDI"),
    chai     = require('chai'),
    expect   = chai.expect,
    should   = require('chai').should(),
    fs       = require('fs'),
    dom      = require('node-dom').dom,
    window   = dom('<html><head></head><body></body></html>', null, {
        features:'',
        url: {}
    }),
    document = window.document;

var Log4js = require('Log4js');
Log4js.replaceConsole();

console.debug("This is a debugging message from the log4javascript in-page page");


// The content expected for the generation:
var expectContent = [
    '!(0.5)F(1,1)',
    '!(0.5)F(2,1)',
    '!(0.5)F(2,-1)F(1,1)',
    '!(0.5)F(1,-1)F(2,1)F(2,1)',
    '!(0.5)F(2,-1)F(2,-1)F(1,1)F(2,-1)F(1,1)'
];

// These options are fixed for every test:
var defaultOptions = {
    // An element into which the Lsys canvas can be inserted:
    //    el: document.createElement( 'div' ),
    variables: "#define $W    0.5\n" + "#define $AS  2\n" + "#define $BS  1\n" + "#define $R   1\n" + "#define $L    -1",
    rules: "F($s,$o) : $s == $AS && $o == $R -> F($AS,$L)F($BS,$R)\n" + "F($s,$o) : $s == $AS && $o == $L -> F($BS,$L)F($AS,$R)\n" + "F($s,$o) : $s == $BS             -> F($AS,$o)\n",
    // Axiom
    start: "!($W)F($BS,$R)",
    canvas: document.createElement( 'canvas' )
    //    document.getElementsByTagName( 'body' )[ 0 ].appendChild( this.canvas );
};

var testOutputPath = 'testing.midi';

describe("Basic", function() {
    // Remove file created by test:
    before( function () {
        fs.unlink(testOutputPath, function (){} );
    });

    it('Should import', function(done){
        should.exist(Lsys);
        done();
    });

    it( 'Constructed with old args', function () {
        var options = defaultOptions;
        delete options.variables;
        options.outputPath = testOutputPath;
        var lsys = new Lsys( options );
        should.equal( typeof lsys, "object", "Construted Lsys object" );

        it('created the file at outputPath', function (done) {
            fs.stat( this.outputPath, function (stats){
                should.be.true( stats.isFile() );
                done();
            });
        });
    });
});

// test( 'Constructed with new parametric args', function () {
//     var lsys = new Lsys( defaultOptions );
//     equal( typeof lsys, "object", "Construted Lsys object" );

//     // NB MooTools, not native:
//     equal( typeOf( lsys.options.rules ), 'array', 'Rules array' );
//     lsys.options.rules.each( function ( i ) {
//         equal( typeOf( i ), 'array', 'Rule cast' );
//         equal( i.length, 3, 'rule tuple' );
//     } );

//     deepEqual(
//         lsys.options.rules, [
//             [ "F($s,$o)", "$s == $AS && $o == $R", "F($AS,$L)F($BS,$R)" ],
//             [ "F($s,$o)", "$s == $AS && $o == $L", "F($BS,$L)F($AS,$R)" ],
//             [ "F($s,$o)", "$s == $BS", "F($AS,$o)" ]
//         ],
//         'Rules parsed'
//     );
// } );

// test( 'Interploation', function () {
//     equal(
//         new Lsys( defaultOptions )
//         .interploateVars( '$AS' ),
//         2,
//         'Interpolate variable'
//     );
// } );

// test( 'string to re and arg name', function () {
//     var rv = new Lsys( defaultOptions )
//         .string2reAndArgNames( 'F(s,o)' );
//     equal( typeOf( rv ), 'array', 'rv type' );
//     equal( rv.length, 2, 'rv length' );
//     equal( typeOf( rv[ 0 ] ), 'regexp', 'rv regexp' );
//     var varWord = '([\\$\\w-]+)';
//     equal( rv[ 0 ], '/(F)\\(' + varWord + ',' + varWord + '\\)/g', 'rv regexp' );
//     equal( typeOf( rv[ 1 ] ), 'array', 'rv var names type' );
//     deepEqual( rv[ 1 ], [ 's', 'o' ], 'rv var names value' );
// } );

// test( 'Constructor with bad rules', function () {
//     var badOptions = Object.clone( defaultOptions );
//     badOptions.rules = 'This is not a rule.';
//     try {
//         var lsys = new Lsys( badOptions );
//     } catch ( e ) {
//         ok( e.match( /parse error/gi ), 'Bad rule parse error thrown' );
//     }
// } );

// test( 'Bad variables option', function () {
//     var badOptions = Object.clone( defaultOptions );
//     badOptions.variables = 'This is not a variable definition.';
//     try {
//         var lsys = new Lsys( badOptions );
//     } catch ( e ) {
//         console.log( e );
//         ok(
//             e.match( /variable def/gi ),
//             'Bad variable parse error thrown as hoped'
//         );
//     }
// } );

// test( 'Variable parsing', function () {
//     var varOpts = Object.clone( defaultOptions );
//     varOpts.variables += "\n#define $Test -0.5";
//     var lsys = new Lsys( varOpts );
//     equal( lsys.variables.$AS, 2, 'positive int' );
//     equal( lsys.variables.$L, -1, 'negative int' );
//     equal( lsys.variables.$W, 0.5, 'positive float' );
//     equal( lsys.variables.$Test, -0.5, 'negative float' );
// } );

// test( 'Math routines', function () {
//     var lsys = new Lsys( defaultOptions );
//     equal( lsys.dsin( 1 ), 0.01745240643728351, 'sin' );
//     equal( lsys.dcos( 1 ), 0.9998476951563913, 'cos' );
// } );

// // ## Generate content

// test( 'Generated content', function () {
//     // Test each generation
//     for ( var g = 1; g < expectContent.length; g++ ) {
//         // Let not an error stop the next test
//         try {
//             var lsys = new Lsys( defaultOptions );
//             lsys.generate( g );
//             equal( lsys.generation, g, 'lsys.generation ' + g );
//             equal( lsys.total_generations, g, 'total_generations ' + g );
//             equal( lsys.content, expectContent[ g ], 'content ' + g );
//         } catch ( e ) {
//             console.error( e )
//         }
//     }
// } );
