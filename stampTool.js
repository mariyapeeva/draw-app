//a tool for drawing straight lines to the screen. Allows the user to preview
//the a line to the current mouse position before drawing the line to the 
//pixel array.
function StampTool(){
    // set icon and name of point
	this.icon = "assets/stamp.png";
	this.name = "Stamp";
    // initialise mouse position to off-canvas
	var startMouseX = -1;
	var startMouseY = -1;
    // initialise drawing as false
	var drawing = false;

	//draws the line to the screen 
	this.draw = function(){

		//only draw when mouse is clicked
		if(mouseIsPressed){
			//if it's the start of drawing a new line
			if(startMouseX == -1){
				startMouseX = mouseX;
				startMouseY = mouseY;
				drawing = true;
                
                // draw a heart stamp
                ellipse(startMouseX-9,
                        startMouseY-13,
                        25);
                ellipse(startMouseX+9,
                        startMouseY-13,
                        25);
                ellipse(startMouseX,
                        startMouseY,
                        8);
                triangle(startMouseX-14,
                         startMouseY-1,
                         startMouseX+14,
                         startMouseY-1,
                         startMouseX,
                         startMouseY+8);
                
				//save the current pixel Array
				loadPixels();
			}

			else{
				//update the screen with the saved pixels to hide any previous
				//line between mouse pressed and released
				updatePixels();

			}

		}

		else if(drawing){
			//save the pixels with the most recent line and reset the
			//drawing bool and start locations
			loadPixels();
			drawing = false;
			startMouseX = -1;
			startMouseY = -1;
		}
	};


}
