var m = require( 'mithril' )

var handlers = new Set()

m.module( document.createElement( 'x' ), {
	view :  [].forEach.bind( handlers, function( fn ){ fn() } )
} )

module.exports = {
  on  : handlers.add.bind( handlers )
  off : handlers.delete.bind( handlers )
}
