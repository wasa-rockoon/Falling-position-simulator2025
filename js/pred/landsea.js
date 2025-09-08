// Land/Sea classification helper
// Loads clipped Japan land GeoJSON and offers point-in-polygon test.
// Very lightweight custom PIP for convex-ish small polygons; for many polygons falls back to bbox prefilter.

var LandSea = (function(){
	var landFeatures = [];
	var loaded = false;
	var pendingCbs = [];

	function load(url){
		if(loaded || landFeatures.length>0){ return; }
		try {
			$.getJSON(url, function(geo){
				try {
					if(geo && geo.features){
						landFeatures = geo.features.filter(function(f){
							return f.geometry && (f.geometry.type==='Polygon' || f.geometry.type==='MultiPolygon');
						}).map(function(f){
							// Precompute bboxes for quick reject
							var bbox = computeBBox(f.geometry);
							f.__bbox = bbox;
							return f;
						});
					}
					loaded = true;
					pendingCbs.forEach(function(cb){ cb(); });
					pendingCbs = [];
				} catch(e){ console.error('LandSea parse error', e); loaded = true; }
			}).fail(function(){ loaded=true; pendingCbs=[]; console.warn('LandSea GeoJSON load failed'); });
		} catch(e){ console.warn('LandSea load exception', e); }
	}

	function onReady(cb){
		if(loaded){ cb(); } else { pendingCbs.push(cb); }
	}

	function computeBBox(geom){
		var minX=  999, minY=  999, maxX= -999, maxY= -999;
		function addCoord(c){
			var x=c[0], y=c[1];
			if(x<minX) minX=x; if(x>maxX) maxX=x; if(y<minY) minY=y; if(y>maxY) maxY=y;
		}
		if(geom.type==='Polygon'){
			geom.coordinates.forEach(function(ring){ ring.forEach(addCoord); });
		} else if(geom.type==='MultiPolygon'){
			geom.coordinates.forEach(function(poly){ poly.forEach(function(ring){ ring.forEach(addCoord); }); });
		}
		return [minX,minY,maxX,maxY];
	}

	function pointInPolygon(lon, lat, ring){
		// ray casting
		var inside=false;
		for(var i=0,j=ring.length-1;i<ring.length;j=i++){
			var xi=ring[i][0], yi=ring[i][1];
			var xj=ring[j][0], yj=ring[j][1];
			var intersect = ((yi>lat)!=(yj>lat)) && (lon < (xj-xi)*(lat-yi)/(yj-yi+1e-12)+xi);
			if(intersect) inside = !inside;
		}
		return inside;
	}

	function isLand(lat, lon){ // Leaflet uses (lat,lng); our geom uses [lon,lat]
		if(!loaded || landFeatures.length===0) return null; // unknown yet
		var x=lon, y=lat;
		for(var fi=0; fi<landFeatures.length; fi++){
			var f = landFeatures[fi];
			var b = f.__bbox; if(x<b[0]||x>b[2]||y<b[1]||y>b[3]) continue;
			var geom = f.geometry;
			if(geom.type==='Polygon'){
				if(pointInPolygon(x,y, geom.coordinates[0])) return true;
			} else if(geom.type==='MultiPolygon'){
				for(var pi=0; pi<geom.coordinates.length; pi++){
					if(pointInPolygon(x,y, geom.coordinates[pi][0])) return true;
				}
			}
		}
		return false; // not in any land polygon within Japan clip
	}

	return { load:load, onReady:onReady, isLand:isLand };
})();

// Auto-load on script include
$(function(){
	LandSea.load('data/land_japan_raw.geojson');
	LandSea.onReady(function(){
		try {
			if(typeof refreshEhimePanel === 'function') refreshEhimePanel();
		} catch(e){}
	});
});
