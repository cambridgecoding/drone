var TrackerUtils = (function() {

    var my = {};

    my.startTrackingColors = function(tracker) {
        var trackedColors = {
            custom: false
        };

        Object.keys(tracking.ColorTracker.knownColors_).forEach(function(color) {
            trackedColors[color] = true;
        });

        var colors = [];
        for (var color in trackedColors) {
            if (trackedColors[color]) {
                colors.push(color);
            }
        }

        tracker.setColors(colors);
    }


    my.addTrackingColor = function(value, name, tracker) {
        var components = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
        var customColorR = parseInt(components[1], 16);
        var customColorG = parseInt(components[2], 16);
        var customColorB = parseInt(components[3], 16);

        var colorTotal = customColorR + customColorG + customColorB;

        if (colorTotal === 0) {
            tracking.ColorTracker.registerColor(name, function(r, g, b) {
                return r + g + b < 10;
            });
        } else {
            var rRatio = customColorR / colorTotal;
            var gRatio = customColorG / colorTotal;

            tracking.ColorTracker.registerColor(name, function(r, g, b) {
                var colorTotal2 = r + g + b;

                if (colorTotal2 === 0) {
                    if (colorTotal < 10) {
                        return true;
                    }
                    return false;
                }

                var rRatio2 = r / colorTotal2,
                    gRatio2 = g / colorTotal2,
                    deltaColorTotal = colorTotal / colorTotal2,
                    deltaR = rRatio / rRatio2,
                    deltaG = gRatio / gRatio2;

                return deltaColorTotal > 0.8 && deltaColorTotal < 1.2 &&
                    deltaR > 0.8 && deltaR < 1.2 &&
                    deltaG > 0.8 && deltaG < 1.2;
            });
        }

    }

    my.loadImage = function (data, element) {
        // console.log("received frame");
        var blob = new Blob([data], {
            type: 'image/png'
        });
        var url = URL.createObjectURL(blob);
        var img = new Image();

        img.onload = function() {
            var canvas = $(element).get(0);
            var context = canvas.getContext('2d');   
            context.drawImage(this, 0, 0);
            URL.revokeObjectURL(url);
        }
        img.src = url;
    }

    return my;

}());
