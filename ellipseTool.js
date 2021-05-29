function EllipseTool(){
    // initialise variables
    // set object icon and name
	this.icon = "assets/ellipse.png";
	this.name = "Ellipse";
    // initialise mouse location before drawing and set it to X and Y of -1 (off-canvas)
	var startMouseX = -1;
	var startMouseY = -1;
    
    // initialise drawing state as inactive (false)
	var drawing = false;
    // closure
    var self = this;
    // set mode to fill
    this.mode = "fill";
	this.draw = function(){
        // if mouse is pressed
		if(mouseIsPressed){
            // check if mouse X location is set to its initial value -1 (off-canvas)
			if(startMouseX == -1){
                // set ellipse start point X and Y to the current mouse location
				startMouseX = mouseX;
				startMouseY = mouseY;
                // set drawing state to active
				drawing = true;
                // load pixel data for the display window into the pixels[] array 
				loadPixels();
			}
            // if ellipse start point X (startMouseX) is not off-canvas
			else{
                // update the pixels[] array with new pixel data and update the display window
				updatePixels();

                push();
                // check mode
                if(self.mode == "border") {
                    // if mode is border, remove fill
                    noFill();
                } 
                // draw an ellipse with a radius from the ellipse start point (startMouseX and startMouseY) to the current mouse X and Y location
				ellipse(startMouseX, 
                        startMouseY, 
                        (mouseX - startMouseX)*2, 
                        (mouseY - startMouseY)*2);
                pop();
			}

		}
        // if mouse is not pressed, check is drawing state is set to active
		else if(drawing){
            // reset drawing state to inactive
			drawing = false;
            // reset mouse start point to off-canvas
			startMouseX = -1;
			startMouseY = -1;
		}
	};
    this.unselectTool = function(){
		updatePixels();
		// clear options
		$(".options").html("");
	};
    this.populateOptions = function(){
		$(".options").html("<button id='borderButton'>Border</button>");
		// click handler
		$("#borderButton").on("click", function(){
            // if mode is fill, set mode to border
			if (self.mode == "fill"){ 
				self.mode = "border";
				$(this).text('Fill');
			}
            // if mode is boder, set mode to fill
			else{ 
				self.mode = "fill";
				$(this).text('Border');

			}
		});
	};


}
