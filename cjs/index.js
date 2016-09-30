var m = require( 'mithril' )

var draw     = require( './draw-event' )
var pause    = require( './pause' )
var register = require( './register' )

// Registry of instantiation contexts
var contexts = new WeakMap()
// All automated counts
var counts   = new Map()
// Persistent object reference to use as a default key
var unique   = {}

// Clear counts at the begninning of every redraw
draw.on( counts.clear.bind( counts ) )

// Shorthand for a component which will always return the same instance
mod.unique = function( component ){ return mod( component, unique, unique ) }
// Shorthand for a keyed component with a global context
mod.global = function( component ){ return mod( component, unique ) }

module.exports = function mod( component, context=unique, key=false ){
  if( typeof context == 'undefined' )
    context = unique

  if( typeof key == 'undefined' )
    key = false

  var components = register( contexts,   context,   function(){ return new WeakMap() } )
  var keys       = register( components, component, function(){ return new WeakMap() } )

  return function identify( key ){
    var count = key === false && register( counts, keys, m.prop.bind( undefined, 0 ) )

    return Object.assign( function(){
      var args = arguments

      if( count )
        key = count( count() + 1 )

      var ctrl = register( keys, key, function(){
        pause()

        if( !component.controller )
          return {}

        var instance = new ( component.controller.bind.apply( component.controller, args ) )()

        garbageCollect( instance )

        // Shorthand for instantiatin sub-modules
        instance.mod = function contextualMod( component, key ){
          return mod( component, instance, key )
        }

        return instance
      } )

      // Return the controller instance if the component is view-less.
      return component.view ? component.view.apply( undefined, [ ctrl ].concat( args )  ) : ctrl
    }, {
      mapWith( collection, keys ){
        var keyed = typeof keys != 'undefined' && keys.concat
        var path  = [].slice.call( arguments, 1 )

        return collection.map( function( item, index ){
          return identify(
            keyed
          ? key = keys[ index ]
          : path.length
          ? path.reduce( source, function( segment ){
              var value = source[ segment ]

              return typeof value == 'function' ? value.call( source ) : value
            }, item )
          : index
          )( item )
        } )
      }
    } )
  }( key )
}
