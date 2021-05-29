function RectangleTool(){
    // initialise variables
    // set object icon and name
	this.icon = "assets/rectangle.png";
	this.name = "Rectangle";
    // initialise mouse location before drawing and set it to X and Y of -1
	var startMouseX = -1;
	var startMouseY = -1;
    // initialise drawing state as inactive (false)
	var drawing = false;
    // draw a rectangle
    var self = this;
    this.mode = "fill";
	this.draw = function(){
        // check if mouse is pressed
		if(mouseIsPressed){
            // check if mouse X location is set to its initial value -1 (off-canvas)
			if(startMouseX == -1){
                // set rectangle start point X and Y to the current mouse location
				startMouseX = mouseX;
				startMouseY = mouseY;
                // set drawing state to active
				drawing = true;
                // load pixel data for the display window into the pixels[] array 
				loadPixels();
			}
            // check if rectangle start point X (startMouseX) is not set to its initial value -1
			else{
                // update the pixels[] array with new pixel data and update the display window
				updatePixels();
                // draw a rectangle from the rectangle start point X and Y location (startMouseX and startMouseY) to the current mouse X and Y location
                push();
                if(self.mode == "border"){
                    noFill();
                } 
				rect(startMouseX, 
                     startMouseY, 
                     mouseX - startMouseX, 
                     mouseY - startMouseY);
                pop();
			}

		}
        // if mouse is not pressed, check is drawing state is set to active
		else if(drawing){
            // set drawing state to inactive
			drawing = false;
            // set rectangle start point location to its initial value of -1
			startMouseX = -1;
			startMouseY = -1;
		}
	};
    this.unselectTool = function(){
		updatePixels();
		//clear options
		$(".options").html("");
	};
    this.populateOptions = function(){
		$(".options").html("<button id='borderButton'>Border</button>");
		//click handler
		$("#borderButton").on("click", function(){
			if (self.mode == "fill"){ 
				self.mode = "border";
				$(this).text('Fill');
			}
			else{ 
				self.mode = "fill";
				$(this).text('Border');

			}
		});
	};

}
