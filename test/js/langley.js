var map, layerControl, rsidebar, lsidebar, drawControl, drawnItems = null;
var autocompdata = [];

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
        $.each( data, function( key, val ) {
            for( var indx = 0; indx < val.length; indx ++ ){
                var filename = val[indx];
                autocompdata.push({label:filename,value:filename})
            }
        });
        $( "#projection" ).autocomplete({
            source: autocompdata,
            minLength: 0,
            select: function( event, ui ) {
                var filename = ui.item.value;
                var featureLayer = L.mapbox.featureLayer()
                    .loadURL('/gisdata/geojson/'+filename)
                    .addTo(map);
                layerControl.addOverlay(featureLayer,filename);
                // Try to remove from autocomplete list
                for( var indx = 0; indx < autocompdata.length; indx++ ){
                    if (autocompdata[indx].value == filename) {
                        var index = autocompdata.indexOf(filename);
                        autocompdata.splice(indx, 1);
                        $( "#projection" ).autocomplete( "option", "source", autocompdata);
                        
                    }
                }
                return false;
            }
        }).val('');
        $('#projection').on( 'click', function(evt){
             $( "#projection" ).autocomplete(  "search", "" );
        });        
    }).fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        console.log( "Request Failed: " + err );
    });

});

