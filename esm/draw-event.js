import m from 'mithril'

const handlers = new Set()
const on       = handlers.add.bind( handlers )
const off      = handlers.delete.bind( handlers )

m.module( document.createElement( 'x' ), {
	view(){
		handlers.forEach( fn => fn() )
	}
} )

export { on, off }
