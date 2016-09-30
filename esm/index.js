import m from 'mithril'

import draw     from './draw-event'
import pause    from './pause'
import register from './register'

// Registry of instantiation contexts
var contexts = new WeakMap()
// All automated counts
var counts   = new Map()
// Persistent object reference to use as a default key
var unique   = {}

// Clear counts at the begninning of every redraw
draw.on( () => counts.clear() )

// Shorthand for a component which will always return the same instance
mod.unique = component => mod( component, unique, unique )
// Shorthand for a keyed component with a global context
mod.global = component => mod( component, unique )

export default function mod( component, context=unique, key=false ){
	let components = register( contexts,   context,   () => new WeakMap() )
	let keys       = register( components, component, () => new WeakMap() )

	return function identify( key ){
		let count = key === false && register( counts, keys, () => m.prop( 0 ) )

		return Object.assign( ( ...args ) => {
			if( count ){
				key = count( count() + 1 )
			}

			let ctrl = register( keys, key, () => {
				pause()

				let instance = new ( component.controller || new Function )( ...args )

				garbageCollect( instance );

				// Shorthand for instantiatin sub-modules
				instance.mod = ( component, key ) => mod( component, instance, key )

				return instance;
			} )

			// Return the controller instance if the component is view-less.
			return component.view ? component.view( ctrl, ...args ) : ctrl
		}, {
			mapWith( collection, keys, ...rest ){
				let keyed = Array.isArray( keys )
				let path  = [ keys, ...rest ]

				return collection.map( ( item, index ) => {
					let key

					if( keyed )
						key = keys[ index ]

					else if( path.length )
						key = path.reduce( source, segment => {
							let value = source[ segment ]

							return value instanceof Function ? value.call( source ) : value
						}, item )

					else
						key = index


					return identify( key )( item )
				} )
			}
		} )
	}( key )
}
