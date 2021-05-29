// A tool to draw a spirograph
function SpirographTool(){
    // initialise variables
    // set object icon and name
	this.name = "Spirograph";
	this.icon = "assets/spirograph.png";
	
	// set grid to visible
	this.grid = "on";
	// set number of symmetric grids
    this.symmetry = 54;

	// closure 
	var self = this;

	//where was the mouse on the last time draw was called.
	//set it to -1 to begin with 
	var previousMouseX = -1;
	var previousMouseY = -1;

	//mouse coordinates for the other side of symmetric lines.
	var previousSymmetric = -1;

	this.draw = function(){
		//display the last save state of pixels
        updatePixels();
        
       // if mouse is pressed
		if(mouseIsPressed){
            
			//if the previous values are -1 set them to the current mouse location
			//and mirrored positions
			if (previousMouseX == -1){
                // set previousMouseX and previousMouseY to the mouse position on click
				previousMouseX = mouseX;
				previousMouseY = mouseY;
                
                // caluclate angle of first point
                var initAngle = this.calculateInitAngle(previousMouseX,
                                                        previousMouseY);
                // empty previousSymmetric
                previousSymmetric = [];
                
                // add points to previousSymmetric[]
                for(let i = 0; i < this.symmetry; i++) {
                    // calculate point angle
                    let symmetricAngle = initAngle + i*(TWO_PI/this.symmetry);
                    // calculate point position
                    let pos = this.calculateSymmetric(previousMouseX,
                                                      previousMouseY,
                                                      symmetricAngle);
                    // add point position to previousSymmetric
                    previousSymmetric.push(pos);
                }
                
			}

			//if there are values in the previous locations 
			//draw a line between them and the current positions
			else{
                push()
                // translate to center
                translate(width/2, height/2);    
                // draw a line
				line(previousMouseX, previousMouseY, mouseX, mouseY);
                pop();
                // update the pixels[] array
                updatePixels();
                
                // set previousMouseX and previousMouseY
				previousMouseX = mouseX;
				previousMouseY = mouseY;

				//these are for the mirrored drawing the other side of the 
				//lines of symmetry
                // calculate new point angle
                var initAngle = this.calculateInitAngle(previousMouseX,
                                                        previousMouseY);
                
                // empty symmetric
                var symmetric = [];
                for(let i = 0; i < this.symmetry; i++) {
                    // calculate point angle
                    let symmetricAngle = initAngle + i*(TWO_PI/this.symmetry);
                    // calculate point position
                    let pos = this.calculateSymmetric(mouseX,
                                                      previousMouseY,
                                                      symmetricAngle);
                    // add point to symmetric[]
                    symmetric.push(pos);
                }
                push();
                // translate to center
                translate(width/2, height/2);     
                // draw a line from previousSymmetric to symmetric
                for(let i = 0; i < this.symmetry; i++) {
                    line(previousSymmetric[i][0], 
                         previousSymmetric[i][1], 
                         symmetric[i][0], 
                         symmetric[i][1]);
                }
                pop();
                // assign symmetric to previousSymmetric
                previousSymmetric = symmetric;
			}
		}
		//if the mouse isn't pressed reset the previous values to -1
		else{
            // reset mouse position
			previousMouseX = -1;
			previousMouseY = -1;

            previousSymmetric = -1;
           
		}

		//after the drawing is done save the pixel state. We don't want the
		//line of symmetry to be part of our drawing 
		loadPixels();
        
        // draw grids
        push();
        strokeWeight(1);
        stroke(210);
        //draw the line of symmetry
        var angle = TWO_PI/this.symmetry;
        translate(width/2, height/2);
        for(let i = 1; i <= this.symmetry; i++) {
            rotate(angle);
            line(0,0,width,height);
        }
        //return to the original stroke
        pop();
        
	};

	/*calculate an opposite coordinate the other side of the 
	*symmetry line. 
	*@param n number: location for either x or y coordinate
	*@param a [x,y]: the axis of the coordinate (y or y)
	*@return number: the opposite coordinate
	*/
    this.calculateInitAngle = function(x,y){
        // calculate angle
        var a = y-height/2;
        var b = x-width/2;
        var r = sqrt(a**2 + b**2);
        var angle = acos(b/r);
        return angle;
    };
	this.calculateSymmetric = function(x,y,angle){
        // calculate symmetric point x and y
        var a = abs(y-height/2);
        var b = abs(x-width/2);
        var r = sqrt(a**2 * b**2);
        var x = r*cos(angle);
        var y = r*sin(angle);
        return [x,y];
	};
    this.unselectTool = function(){
		updatePixels();
		//clear options
		$(".options").html("");
	};
    this.populateOptions = function(){
		$(".options").html("<button id='grid54_Button'>Grid 54</button><button id='grid36_Button'>Grid 36</button><button id='grid18_Button'>Grid 18</button><button id='grid9_Button'>Grid 9</button>");
		//click handler
        // activate grid 54
		$("#grid54_Button").on("click", function(){
			if (self.symmetry != 54){ 
				self.symmetry = 54;
			}
		});
        // activate grid 36
        $("#grid36_Button").on("click", function(){
			if (self.symmetry != 36){ 
				self.symmetry = 36;
			}
		});
        // activate grid 18
        $("#grid18_Button").on("click", function(){
			if (self.symmetry != 18){ 
				self.symmetry = 18;
			}
		});
        // activate grid 9
        $("#grid9_Button").on("click", function(){
			if (self.symmetry != 9){ 
				self.symmetry = 9;
			}
		});
	};
}