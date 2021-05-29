function EraserTool(){
	// set an icon and a name for the object
	this.icon = "assets/eraser.png";
	this.name = "Eraser";

    // initialise mouse positionn to off-canvas
	var previousMouseX = -1;
	var previousMouseY = -1;

	this.draw = function(){
		//if the mouse is pressed
		if(mouseIsPressed){
			//check if they previousX and Y are -1. set them to the current
			//mouse X and Y if they are.
			if (previousMouseX == -1){
				previousMouseX = mouseX;
				previousMouseY = mouseY;
			}
			//if we already have values for previousX and Y we can draw a line from 
			//there to the current mouse location
			else{
                push();
                strokeWeight(30);
                stroke(255);
				line(previousMouseX, previousMouseY, mouseX, mouseY);
                pop();
                // set previousMouseX and previousMouseY to the end point of the line
				previousMouseX = mouseX;
				previousMouseY = mouseY;
			}
		}
		//if the user has released the mouse we want to set the previousMouse values 
		//back to -1.
		else{
			previousMouseX = -1;
			previousMouseY = -1;
		}
	};
}