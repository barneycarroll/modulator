var m = require( 'mithril' )

var instant = m.redraw

function queue( force ){
	redraw = true

	if( force ) forced = true
}

queue.strategy = instant.strategy

var redraw
var forced
var ticket

module.exports = function pause(){
	m.redraw = queue

	window.clearTimeout( ticket )

	ticket = window.setTimeout( function unpause(){
		m.redraw = instant

		if( redraw ) m.redraw( forced )

		redraw = forced = false
	} )
}
