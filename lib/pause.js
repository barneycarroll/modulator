import m from 'mithril'

const instant = Object.assign( m.redraw )
const queue   = Object.assign( force => {
	redraw = true

	if( force ) forced = true
}, m.redraw )

let redraw
let forced
let ticket

export default function pause(){
	m.redraw = queue

	window.clearTimeout( ticket )

	ticket = window.setTimeout( function unpause(){
		m.redraw = instant;

		if( redraw ) m.redraw( forced )

		redraw = forced = false;
	} )
}
