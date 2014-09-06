var map, layerControl, rsidebar, lsidebar, drawControl, drawnItems = null;

$(document).ready(function() {

    var map = L.map('map').setView([48.0369, -122.4085], 13);

    var featureLayer = L.mapbox.featureLayer()
        .loadURL('/gisdata/geojson/citylimitsline_4326.geojson')
        .addTo(map);

    layerControl = L.control.layers({
        'Base Map': L.mapbox.tileLayer('examples.map-i87786ca').addTo(map),
        'Grey Map': L.mapbox.tileLayer('examples.map-20v6611k')
    }, {
        "City Limits": featureLayer
    },{'collapsed': false});

    layerControl.addTo(map);

    // Test getting layers
    $.getJSON( "/gisdata/geojson/filelist.json").done(function( data ) {
        proj4defs = data;
        var autocompdata = [];
        $.each( data, function( key, val ) {
            for( var indx = 0; indx < 5; indx++ ){ //val.length; indx ++ ){
                var filename = val[indx];
                var featureLayer = L.mapbox.featureLayer()
                    .loadURL('/gisdata/geojson/'+filename);
                    //.addTo(map);
                layerControl.addOverlay(featureLayer,filename);
            }
            autocompdata.push({label:key+'-'+val[0],value:key})
        });
    //    $( "#projection" ).autocomplete({
    //        source: autocompdata,
    //        minLength: 3,
    //        select: function( event, ui ) {
    //            // Update all the proj windows
    //            $('#projlabel').text('EPSG:'+ ui.item.value +' - ' + proj4defs[ui.item.value][0]);
    //            currentproj = ui.item.value;
    //            $('#boxboundsmerc').text(formatBounds(bounds.getBounds(),currentproj));
    //            $('#mouseposmerc').text(formatPoint(new L.LatLng(0, 0),currentproj));
    //            $('#mapboundsmerc').text(formatBounds(map.getBounds(),currentproj));
    //            $('#centermerc').text(formatPoint(map.getCenter(),currentproj));
    //        }
    //    }).val('3857');
    //    $('#projection').on( 'click', function(evt){
    //         $( "#projection" ).autocomplete(  "search", currentproj  );
    //    });        
    //    // Set labels for output... left always 4326, right is proj selection
    //    $('#wgslabel').text('EPSG:4326 - ' + proj4defs['4326'][0]);
    //    $('#projlabel').text('EPSG:3857 - ' + proj4defs['3857'][0]);
    }).fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        console.log( "Request Failed: " + err );
    });

});

