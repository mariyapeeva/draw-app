//Displays and handles the colour palette.
function BFColourTool(){
    // initialise variables
    // set object icon and name
    this.icon = "assets/BF.png";
    this.name = "BFColour";
	// initialise selected colour as black
    this.selectedColour = "black";
    // initialise foreground as black
	this.foreground = "black";
    // initialise background as black
    this.background = "white";
    // initialise mode as foreground
    this.mode = "foreground";
    //closure
    var self = this;
    // set startMouseX and startMouseY to off-canvas
    var startMouseX = -1;
	var startMouseY = -1;
    // set drawing to false
	var drawing = false;
    
    this.whiteFix = function(colour){
        // fix white colour 
        if(colour == [0,0,0,0]){
           colour = [255,255,255,255];
        }
        return colour;
    };
    this.getColour = function(x,y){
        // get colour from pixels[]
        var d = pixelDensity();
        var off = (y * width + x) * d * 4;
        var components = [
          pixels[off],
          pixels[off + 1],
          pixels[off + 2],
          pixels[off + 3]
        ];
        // if colour is white, fix white colour
        // convert colour to hsla and return hsla array
        return this.rgbHSL(this.whiteFix(components));
    };
    this.rgbHSL = function(rgba){
        // convert RGBA to HSLA
        var r = rgba[0]/255;
        var g = rgba[1]/255;
        var b = rgba[2]/255;
        var a = rgba[3]/255;
        var cMax = max(r,g,b);
        var cMin = min(r,g,b);
        var l = ((cMax + cMin)/2) * 100;
        var delta = cMax - cMin;
        var s;
        if(cMin == cMax){
            s = 0;
        } 
        else if(l < 50){
            s = (cMax - cMin)/(cMax + cMin) * 100;
        } 
        else{
            s = (cMax - cMin)/(2.0 - cMax - cMin) * 100;
        }
        var h;
        if(cMax == 0){
            h = 0;
        }
        else if(cMax == r){
            h = (g - b)/(cMax - cMin);
        }
        else if(cMax == g){
            h = 2.0 + (b - r)/(cMax - cMin);
        }
        else{
            h = 4.0 + (r - g)/(cMax - cMin);
        }
        h *= 60;
        if(h < 0) {
            h += 360;
        } 
        var hsla = [round(h),round(s),round(l),parseFloat(a.toFixed(1))]; 
        return hsla;
    };
    this.draw = function(){
        // if mouse is pressed
        if(mouseIsPressed){
			// if mouse position is off-canvas
			if(startMouseX == -1){
                // set startMouseX and startMouseY to the mouse position
				startMouseX = mouseX;
				startMouseY = mouseY;
                // set drawing to active
				drawing = true;
                
				// save the current pixels[] Array
				loadPixels();
			}
            // if mouse position is not off-canvas
			else{
				// update the screen with the saved pixels to hide any previous
				updatePixels();
                // get colour of the selected pixel
                var sample = this.getColour(mouseX,mouseY);
                // get colour from the colour palette
                colourP.selectedColour = sample;
                // if mode is foreground
                if(this.mode == "foreground") {
                    // set foreground colour to the colour of the selected pixel
                    this.foreground = sample;
                    // set background-color colour of #foregroundSwatch to the foreground colour
                    $("#foregroundSwatch").css("background-color",
                                               "hsla("+this.foreground[0]+","+
                                               this.foreground[1]+"%,"+
                                               this.foreground[2]+"%,"+
                                               this.foreground[3]+")");
                }
                // if mode is background
                else{
                    // set background colour to the colour of the selected pixel
                    this.background = sample;
                    // set background-color colour of #backgroundSwatch to the background colour
                    $("#backgroundSwatch").css("background-color",
                                               "hsla("+this.background[0]+","+
                                               this.background[1]+"%,"+
                                               this.background[2]+"%,"+
                                               this.background[3]+")");
                }
			}

		}

		else if(drawing){
			// reset drawing and start locations
			drawing = false;
			startMouseX = -1;
			startMouseY = -1;
		}
    }
    this.loadColour = function(colour,mode) {
        // load colour swatches
        fill(colour);
		stroke(colour);

		// for each colour create a new div in the html for the colourSwatches
        var colourID = mode + "Swatch";
        var colourHTML = "<div class="+mode+"><div class='colourSwatches' id='"+ colourID + "'></div></div>";
        // using JQuery add the swatch to the palette and set its background colour
        // to be the colour value.
        $(".colourPalette").prepend(colourHTML);
        $("#" + colourID).css("background-color", colour);
        $("#" + colourID).css("border", "2px solid blue");
    };
	
	// call the loadColours functions for background and foreground swatches
    this.loadColour(self.background,"background");
    this.loadColour(self.foreground,"foreground");
    
    $("#backgroundSwatch").on("click", function() {
        // switch mode to background
        self.mode = "background";
        $(".colourSwatches").css("border", "0");
        // add a border to the clicked swatch div.
        $(event.currentTarget).css("border", "2px solid blue");
    });
    $("#foregroundSwatch").on("click", function() {
        // switch mode to foreground
        self.mode = "foreground";
        $(".colourSwatches").css("border", "0");
        //add a border to the clicked swatch div.
        $(event.currentTarget).css("border", "2px solid blue");
    });
    $(".colourPalette").on("click", ".colourSwatches", (event) => {
        // get background-color from the css of the selected swatch
        var c = $(event.currentTarget).css("background-color");
        if(self.mode == "foreground"){
            // set foreground colour to the colour of the swatch
            self.foreground = c;
            $("#foregroundSwatch").css("background-color", c);
        }
        else if(self.mode == "background"){
            // set background colour to the colour of the swatch
            self.background = c;
            $("#backgroundSwatch").css("background-color", c);
        }
    });
    
}