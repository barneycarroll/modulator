module.exports = function register( map, key, factory ){
	if( map.has( key ) )
		return map.get( key )

	var value = factory

	map.set( key, value )

	return value
}
