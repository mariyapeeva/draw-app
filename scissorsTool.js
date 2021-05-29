// A tool to cut a shape
function ScissorsTool(){
    // initialise variables
    // set object icon and name
	this.icon = "assets/scissors.png";
	this.name = "Scissors";
    // initialise mouse position before selection to off-canvas
	var startMouseX = -1;
	var startMouseY = -1;
    // initialise drawing state as inactive
	var drawing = false;
    // closure
    var self = this;
    // set range for hue, saturation, lightness and alpha
    this.hRange = 1;
    this.sRange = 10;
    this.lRange = 10;
    this.aRange = 1;
    
    // set mode to "cut"
    this.mode = "cut";
    // initialise this.points as an empty array
    this.points = [];
    // initialise this.pieces as an empty array
    this.pieces = [];
    // initialise this.scissors as an empty array
    this.scissors = [];
    
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
        var off = 4 * ((y * d) * width * d + (x * d));
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
    this.compareColour = function(c1,c2){
        // compare colours in terms of range
        if(abs(c1[0] - c2[0]) <= this.hRange &&
           abs(c1[1] - c2[1]) <= this.sRange &&
           abs(c1[2] - c2[2]) <= this.lRange &&
           abs(c1[3] - c2[3]) <= this.aRange) {
            return true;
        }
        return false;
    };
    this.checkColour = function(x,y,colour){
        // get pixel colour to compare with selected colour
        return this.compareColour(this.getColour(x,y),colour);
    };
    this.selectEdge = function(array,startColour,colour,x,y,ind){
        // index the outline of a shape
        // initialise variables
        // set start point of indexing to mouse position
        var startX = x;
        var startY = y;
        // set indexing variables to mouse position
        var newX = x;
        var newY = y;
        // initialise termination variables
        var endX;
        var endY;
        // initialise pixel selection variables
        var nextX;
        var nextY;
        var prevX;
        var prevY;
        // initialise start index
        var start = 1;
        // initialise inner
        var inner;
        // if no start index is provided, i.e. call from this.selectColour()
        if(!ind){
            ind = 0;
        }
        // if start index is provided, i.e. call from indexInner()
        else{
            start = -1;
        }
        // set i to 0
        var i = 0;
        // index outline until start point equals end point
        while(startX != endX || startY != endY){
            // set pixel selection variables
            prevX = newX - 1;
            prevY = newY - 1;
            nextX = newX + 1;
            nextY = newY + 1;
            // if i is at start point + 1
            if(i == start + 1){
                // get the current pixel's colour
                let c2 = this.getColour(newX,newY);
                // add new point into the array
                array.splice(ind,0,[newX,newY,c2]);
                // increment splicing index
                ind++;
            }
            // if the colour of the pixel to the right and the top pixel is different, the colour of the pixel to the left is the same and x is greater than 0
            if(!this.checkColour(nextX,newY,startColour) &&
                this.checkColour(prevX,newY,startColour) &&
               !this.checkColour(newX,prevY,startColour) &&
                newX > 0){
                // get current colour
                let c1 = this.getColour(newX,newY);
                // while colour of the pixel to the left is the same,
                // colour of the top pixel is different and x is greater than 0
                while(this.checkColour(prevX,newY,startColour) &&
                     !this.checkColour(newX,prevY,startColour) &&
                      newX > 0){
                    // keep on moving left
                    newX--;
                    prevX--;
                    if(i > start && (newX != startX || newY != startY)){
                        // get the current colour
                        let c2 = this.getColour(newX,newY);
                        // if the colour is not exactly the same as the initial colour
                        if(!this.compareExactColour(c1,c2)) {
                            // add a new point to the array
                            array.splice(ind,0,[newX,newY,c2]);
                            // increment splicing index
                            ind++;
                        }
                    }
                }
                // if indexing is after the start point
                if(i > start && (newX != startX || newY != startY)){
                    let c2 = this.getColour(newX,newY);
                    array.splice(ind,0,[newX,newY,c2]);
                    ind++;
                }
            }
            // if the colour of the pixel to the left is the same and that of the top pixel is different and x is greater than 0
            else if(this.checkColour(prevX,newY,startColour) &&
                   !this.checkColour(newX,prevY,startColour) &&
                    newX > 0){
                let c1 = this.getColour(newX,newY);
                // while the colour of the pixel to the left is the same and the colour of the top pixel is different and x is greater than the width of the canvas
                while(this.checkColour(prevX,newY,startColour) &&
                     !this.checkColour(newX,prevY,startColour) &&
                      newX > 0){
                    // keep on moving left
                    newX--;
                    prevX--;
                    if(i > start && (newX != startX || newY != startY)){
                        let c2 = this.getColour(newX,newY);
                        if(!this.compareExactColour(c1,c2)) {
                            array.splice(ind,0,[newX,newY,c2]);
                            ind++;
                        }
                    }
                } 
                if(i > start && (newX != startX || newY != startY)){
                    let c2 = this.getColour(newX,newY);
                    array.splice(ind,0,[newX,newY,c2]);
                    ind++;
                }
            } 
            // if colour of the pixel the left and the top pixel is the same, the colour of the left top pixel diagonally is different and x is greater than 0
            else if(this.checkColour(prevX,newY,startColour) &&
                    this.checkColour(newX,prevY,startColour) &&
                   !this.checkColour(prevX,prevY,startColour) && 
                    newX > 0){
                // move left
                newX--;
                if(i > start && (newX != startX || newY != startY)){
                    let c2 = this.getColour(newX,newY);
                    array.splice(ind,0,[newX,newY,c2]);
                    ind++;
                }
            } 
            // if colour of the pixel to the left and the top left pixel diagonally are the same, the colour of the top pixel is different and x is greater than 0
            else if(this.checkColour(prevX,newY,startColour) &&
                   !this.checkColour(newX,prevY,startColour) &&
                    this.checkColour(prevX,prevY,startColour) && 
                    newX > 0) {
                // move left
                newX--;
                if(i > start && (newX != startX || newY != startY)){
                    let c2 = this.getColour(newX,newY);
                    array.splice(ind,0,[newX,newY,c2]);
                    ind++;
                }
            } 
            // if all the colour of all surrounding pixels is the same and x is less than the width of the canvas
            else if(this.checkColour(nextX,newY,startColour) &&
                    this.checkColour(prevX,newY,startColour) &&
                    this.checkColour(newX,nextY,startColour) &&
                    this.checkColour(newX,prevY,startColour) &&
                    this.checkColour(nextX,nextY,startColour) &&
                    this.checkColour(prevX,nextY,startColour) &&
                    this.checkColour(nextX,prevY,startColour) &&
                    this.checkColour(prevX,prevY,startColour) &&
                    newX < width - 1){
                let c1 = this.getColour(newX,newY);
                // while the colour of the pixel to the right is the same and x is less than the width of the canvas
                while(this.checkColour(nextX,newY,startColour) && 
                      newX < width - 1){
                    // keep on moving right
                    newX++;
                    nextX++;  
                    if(i > start && (newX != startX || newY != startY)){
                        let c2 = this.getColour(newX,newY);
                        if(!this.compareExactColour(c1,c2)) {
                            array.splice(ind,0,[newX,newY,c2]);
                            ind++;
                        }
                    }
                }
                if(i > start && (newX != startX || newY != startY)){
                    let c2 = this.getColour(newX,newY);
                    array.splice(ind,0,[newX,newY,c2]);
                    ind++;
                }
            } 
            // if the colour of the top pixel is the same and the current pixel is the rightmost pixel of the canvas and y is greater than 0
            else if(this.checkColour(newX,prevY,startColour) &&
                    newX == width - 1 && newY > 0){
                // while the colour of top pixel is the same and y is greater than 0 
                while(this.checkColour(newX,prevY,startColour) &&  
                      newY > 0){
                    // keep on moving top
                    newY--;
                    prevY--;
                    if(i > start && (newX != startX || newY != startY)){
                        let c2 = this.getColour(newX,newY);
                        array.splice(ind,0,[newX,newY,c2]);
                        ind++;
                    }
                }
            } 
            // if the colour of top pixel is the same and the current pixel is the rightmost pixel at the top of the canvas
            else if(this.checkColour(prevX,newY,startColour) &&
                    newX == width - 1 && abs(newY) == 0){
                let c1 = this.getColour(newX,newY);
                // while the colour of the previous pixel is the same and x is greater than 0
                while(this.checkColour(prevX,newY,startColour) && 
                      newX > 0){
                    // keep on moving left
                    newX--;
                    prevX--;
                    if(i > start && (newX != startX || newY != startY)){
                        let c2 = this.getColour(newX,newY);
                        if(!this.compareExactColour(c1,c2)) {
                            array.splice(ind,0,[newX,newY,c2]);
                            ind++;
                        }
                    }
                }
                if(i > start && (newX != startX || newY != startY)){
                    let c2 = this.getColour(newX,newY);
                    array.splice(ind,0,[newX,newY,c2]);
                    ind++;
                }
            }
            // if the colour of the bottom pixel is the same and the current pixel is the leftmost pixel at the top of the canvas 
            else if(this.checkColour(newX,nextY,startColour) &&
                    abs(newX) == 0 && abs(newY) == 0){
                // while the colour of the bottom pixel is the same and y is less than the height of the canvas
                while(this.checkColour(newX,nextY,startColour) && 
                      newY < height){
                    // keep on moving down
                    newY++;
                    nextY++;
                    if(i > start && (newX != startX || newY != startY)){
                        let c2 = this.getColour(newX,newY);
                        array.splice(ind,0,[newX,newY,c2]);
                        ind++;
                    }
                }
            } 
            // if the colour of the pixel to the right is the same and the current pixel is the leftmost pixel at the bottom of the canvas
            else if(this.checkColour(nextX,newY,startColour) &&
                    abs(newX) == 0 && newY == height){
                let c1 = this.getColour(newX,newY);
                // while the colour of the pixel to the right is the same and x is less than the width of the canvas
                while(this.checkColour(nextX,newY,startColour) && 
                      newX < width - 1){
                    // keep on moving right
                    newX++;
                    nextX++;
                    if(i > start && (newX != startX || newY != startY)){
                        let c2 = this.getColour(newX,newY);
                        if(!this.compareExactColour(c1,c2)) {
                            array.splice(ind,0,[newX,newY,c2]);
                            ind++;
                        }
                    }
                }
                if(i > start && (newX != startX || newY != startY)){
                    let c2 = this.getColour(newX,newY);
                    array.splice(ind,0,[newX,newY,c2]);
                    ind++;
                }
            // if the colour of the pixel to the right is the same, the colour of the pixel to the left and bottom pixels is different and x is less than the width of the canvas 
            } else if(this.checkColour(nextX,newY,startColour) &&
                     !this.checkColour(prevX,newY,startColour) &&
                     !this.checkColour(newX,nextY,startColour) &&
                      newX < width - 1){
                let c1 = this.getColour(newX,newY);
                // while the colour of the pixel to the right is the same, the colour of the bottom pixel is the different and x is less than the width of the canvas
                while(this.checkColour(nextX,newY,startColour) && 
                     !this.checkColour(newX,nextY,startColour) &&
                      newX < width - 1){
                    // keep on moving right
                    newX++;
                    nextX++; 
                    if(i > start && (newX != startX || newY != startY)){
                        let c2 = this.getColour(newX,newY);
                        if(!this.compareExactColour(c1,c2)) {
                            array.splice(ind,0,[newX,newY,c2]);
                            ind++;
                        }
                    }
                }
                if(i > start && (newX != startX || newY != startY)){
                    let c2 = this.getColour(newX,newY);
                    array.splice(ind,0,[newX,newY,c2]);
                    ind++;
                }
            } 
            // if the colour of the pixel to the right and the bottom right pixel diagonally is the same and the colour of bottom pixel is different and x is less than the width of the canvas 
            else if(this.checkColour(nextX,newY,startColour) &&
                   !this.checkColour(newX,nextY,startColour) &&
                    this.checkColour(nextX,nextY,startColour) &&
                    newX < width - 1){
                // move right
                newX++;
                if(i > start && (newX != startX || newY != startY)){
                    let c2 = this.getColour(newX,newY);
                    array.splice(ind,0,[newX,newY,c2]);
                    ind++;
                }
            } 
            // if the colour of the pixel to the right is the same, the colour of the bottom pixel is different and x is less than the width of the canvas
            else if(this.checkColour(nextX,newY,startColour) &&
                   !this.checkColour(newX,nextY,startColour) &&
                    newX < width - 1) {
                let c1 = this.getColour(newX,newY);
                // while the xolour of the pixel to the right is the same, the colour the the bottom pixel is different and x is less the width of the canvas
                while(this.checkColour(nextX,newY,startColour) &&
                     !this.checkColour(newX,nextY,startColour) &&
                      newX < width - 1){
                    // keep on moving right
                    newX++;
                    nextX++;
                    if(i > start && (newX != startX || newY != startY)){
                        let c2 = this.getColour(newX,newY);
                        if(!this.compareExactColour(c1,c2)) {
                            array.splice(ind,0,[newX,newY,c2]);
                            ind++;
                        }
                    }
                }
                if(i > start && (newX != startX || newY != startY)){
                    let c2 = this.getColour(newX,newY);
                    array.splice(ind,0,[newX,newY,c2]);
                    ind++;
                }  
            } 
            // if the colour of the pixel to the right and the bottom pixel is the same, the colour of the bottom right pixel diagonally is different and x is less than width
            else if(this.checkColour(nextX,newY,startColour) &&
                    this.checkColour(newX,nextY,startColour) &&
                   !this.checkColour(nextX,nextY,startColour) &&
                    newX < width - 1){
                // move right
                newX++;
                if(i > start && (newX != startX || newY != startY)){
                    let c2 = this.getColour(newX,newY);
                    array.splice(ind,0,[newX,newY,c2]);
                    ind++;
                }
            } 
            // if the colour of the pixel to the right is different, the colour of the top pixel is the same and y is greater than 0
            else if(!this.checkColour(nextX,newY,startColour) &&
                     this.checkColour(newX,prevY,startColour) &&
                     newY > 0){
                // while the colour of the top pixel is the same, the colour of the pixel the right is different and x is greater than 0
                while(this.checkColour(newX,prevY,startColour) && 
                     !this.checkColour(nextX,newY,startColour) &&
                      newY > 0) {
                    // keep on moving top
                    newY--;
                    prevY--; 
                    if(i > start && (newX != startX || newY != startY)){
                        let c2 = this.getColour(newX,newY);
                        array.splice(ind,0,[newX,newY,c2]);
                        ind++;
                    }
                }  
            } 
            // if the colour of the pixel to the right and the top pixel is the same, the colour of the right top pixel diagonally is different and y is greater than 0
            else if(this.checkColour(nextX,newY,startColour) &&
                    this.checkColour(newX,prevY,startColour) &&
                   !this.checkColour(nextX,prevY,startColour) &&
                    newY > 0){
                // move top
                newY--;
                if(i > start && (newX != startX || newY != startY)){
                    let c2 = this.getColour(newX,newY);
                    array.splice(ind,0,[newX,newY,c2]);
                    ind++;
                }
            } 
            // if the colour of the pixel to the right and the bottom pixel is different, the colour of the top pixel is the same and y is greater than 0
            else if(!this.checkColour(nextX,newY,startColour) &&
                    !this.checkColour(newX,nextY,startColour) &&
                     this.checkColour(newX,prevY,startColour) &&
                     newY > 0){
                // while the colour of the top pixel is the same, the colour of the pixel to the right is different and y is greater than 0
                while(this.checkColour(newX,prevY,startColour) && 
                     !this.checkColour(nextX,newY,startColour) && 
                      newY > 0){
                    // keep on moving top
                    newY--;
                    prevY--;
                    if(i > start && (newX != startX || newY != startY)){
                        let c2 = this.getColour(newX,newY);
                        array.splice(ind,0,[newX,newY,c2]);
                        ind++;
                    }
                }  
            } 
            // if the colour of the pixel to the right is different, the colour of the top pixel is the same and y is greater than 0
            else if(!this.checkColour(nextX,newY,startColour) &&
                     this.checkColour(newX,prevY,startColour) &&
                     newY > 0){
                // while the colour of the top pixel is the same, the colour of the pixel to the right is different and y is greater than 0
                while(this.checkColour(newX,prevY,startColour) && 
                     !this.checkColour(nextX,newY,startColour) && 
                      newY > 0){
                    // keep on moving top
                    newY--;
                    prevY--;
                    if(i > start && (newX != startX || newY != startY)){
                        let c2 = this.getColour(newX,newY);
                        array.splice(ind,0,[newX,newY,c2]);
                        ind++;
                    }
                }  
            } 
            // if the colour of the pixel to the right is different, the colour of the top pixel and the top right pixel diagonally is the same and y is greater than 0
            else if(!this.checkColour(nextX,newY,startColour) &&
                     this.checkColour(newX,prevY,startColour) &&
                     this.checkColour(nextX,prevY,startColour) &&
                     newY > 0){
                    // move top
                    newY--;
                if(i > start && (newX != startX || newY != startY)){
                    let c2 = this.getColour(newX,newY);
                    array.splice(ind,0,[newX,newY,c2]);
                    ind++;
                }
            }
            // if the colour of the pixel to the left and the top pixel is different, the colour of the bottom pixel is the same and y is less than the height
            else if(!this.checkColour(prevX,newY,startColour) &&
                     this.checkColour(newX,nextY,startColour) &&
                    !this.checkColour(newX,prevY,startColour) &&
                     newY < height){
                // while the colour of the bottom pixel is the same, the colour of the pixel to the left is different and y is less than height 
                while(this.checkColour(newX,nextY,startColour) && 
                     !this.checkColour(prevX,newY,startColour) && 
                      newY < height) {
                    // keep on moving down
                    newY++;
                    nextY++; 
                    if(i > start && (newX != startX || newY != startY)){
                        let c2 = this.getColour(newX,newY);
                        array.splice(ind,0,[newX,newY,c2]);
                        ind++;
                    }
                } 
            } 
            // if the colour of the pixel to the left is different, the colour of the pixel to the top and the left bottom pixel diagonally is the same and y is less than height
            else if(!this.checkColour(prevX,newY,startColour) &&
                     this.checkColour(newX,nextY,startColour) &&
                     this.checkColour(prevX,nextY,startColour) &&
                     newY < height){
                // move bottom
                newY++;
                if(i > start && (newX != startX || newY != startY)){
                    let c2 = this.getColour(newX,newY);
                    array.splice(ind,0,[newX,newY,c2]);
                    ind++;
                }
            } 
            // if the colour of the pixel the left is different, the colour of the bottom pixel is the same and y is less than height
            else if(!this.checkColour(prevX,newY,startColour) &&
                     this.checkColour(newX,nextY,startColour) &&
                     newY < height){
                // while the colour of the bottom pixel is the same, the colour of the pixel to the left is different and y is less than height
                while(this.checkColour(newX,nextY,startColour) && 
                     !this.checkColour(prevX,newY,startColour) &&
                      newY < height){
                    // keep on moving down
                    newY++;
                    nextY++;
                    if(i > start && (newX != startX || newY != startY)){
                        let c2 = this.getColour(newX,newY);
                        array.splice(ind,0,[newX,newY,c2]);
                        ind++;
                    }
                } 
            } 
            // if the colour of the pixel to the left and the bottom pixel is the same, the colour of the bottom left pixel is different and y is less than height
            else if(this.checkColour(prevX,newY,startColour) &&
                    this.checkColour(newX,nextY,startColour) &&
                   !this.checkColour(prevX,nextY,startColour) &&
                    newY < height){
                // move down
                newY++;
                if(i > start && (newX != startX || newY != startY)){
                    let c2 = this.getColour(newX,newY);
                    array.splice(ind,0,[newX,newY,c2]);
                    ind++;
                }
            } 
            // if the colour of the pixel to the right is different, the colour of the right top pixel diagonally and the top pixel is the same, x is less than width and y is greater than 0
            else if(!this.checkColour(nextX,newY,startColour) &&
                     this.checkColour(nextX,prevY,startColour) &&
                     this.prevYcolor(newX,prevY,startColour) &&
                     newX < width - 1 && newY > 0){
                // while the colour of the pixel to the right is different, the colour of the right top pixel diagonally and the top pixel is different and x is less than width and y is greater than 0
                while(!this.checkColour(nextX,newY,startColour) && 
                       this.checkColour(nextX,prevY,startColour) &&
                       this.prevYcolor(newX,prevY,startColour) &&
                       newX < width - 1 && newY > 0){
                    // keep on moving top right diagonally
                    newX++;
                    nextX++;
                    newY--;
                    nextY--;
                    if(i > start && (newX != startX || newY != startY)){
                        let c2 = this.getColour(newX,newY);
                        array.splice(ind,0,[newX,newY,c2]);
                        ind++;
                    }
                } 
            }
            // if the colour of the pixel to the left is different, the colour of the left bottom pixel diagonally and the bottom pixel is the same, x is greater than 0 and y is less tha height
            else if(!this.checkColour(prevX,newY,startColour) &&
                     this.checkColour(prevX,nextY,startColour) &&
                     this.checkColour(newX,nextY,startColour) &&
                     newX > 0 && newY < height){
                //while the colour of the pixel to the left is different, the colour of the left bottom pixel diagonally and the bottom pixel is the same, x is greater than 0 and y is less tha height
                while(!this.checkColour(prevX,newY,startColour) && 
                       this.checkColour(prevX,nextY,startColour) &&
                       this.checkColour(newX,nextY,startColour) &&
                       newX > 0 && newY < height){
                    // keep on moving left bottom diagonally
                    newX--;
                    nextX--;
                    newY++;
                    nextY++;
                    if(i > start && (newX != startX || newY != startY)){
                        let c2 = this.getColour(newX,newY);
                        array.splice(ind,0,[newX,newY,c2]);
                        ind++;
                    }
                } 
            }
            // if the colour of the bottom pixel is different, the colour of the right bottom pixel diagonally and the right pixel is the same, x is less than width and y is less tha height
            else if(!this.checkColour(newX,nextY,startColour) &&
                     this.checkColour(nextX,nextY,startColour) &&
                     this.checkColour(nextX,newY,startColour) &&
                     newX < width - 1 && newY < height){
                // while the colour of the bottom pixel is different, the colour of the right bottom pixel diagonally and the right pixel is the same, x is less than width and y is less tha height
                while(!this.checkColour(newX,nextY,startColour) && 
                       this.checkColour(nextX,nextY,startColour) &&
                       this.checkColour(nextX,newY,startColour) &&
                       newX < width - 1 && newY < height){
                    // keep on moving right bottom diagonally
                    newX++;
                    nextX++;
                    newY++;
                    nextY++;
                    if(i > start && (newX != startX || newY != startY)){
                        let c2 = this.getColour(newX,newY);
                        array.splice(ind,0,[newX,newY,c2]);
                        ind++;
                    }
                } 
            }
            // if the colour of the top pixel is different, the colour of the left top pixel diagonally and the left pixel is the same, x is greater than 0 and y is greater than 0
            else if(!this.checkColour(newX,prevY,startColour) &&
                     this.checkColour(prevX,prevY,startColour) &&
                     this.checkColour(prevX,newY,startColour) &&
                     newX > 0 && newY > 0){
                // while the colour of the top pixel is different, the colour of the left top pixel diagonally and the left pixel is the same, x is greater than 0 and y is greater than 0
                while(!this.checkColour(newX,prevY,startColour) && 
                       this.checkColour(prevX,prevY,startColour) &&
                       this.checkColour(prevX,newY,startColour) &&
                       newX > 0 && newY > 0){
                    // keep on moving top left diagonally
                    newX--;
                    nextX--;
                    newY--;
                    nextY--;
                    if(i > start && (newX != startX || newY != startY)){
                        let c2 = this.getColour(newX,newY);
                        array.splice(ind,0,[newX,newY,c2]);
                        ind++;
                    }
                } 
            }
            else {
                break;
            }
            // if the current point is the start point
            if(i == start){
                // set startX and startY to the current point
                startX = newX;
                startY = newY;
                // check if call originates from this.innerIndex()
                if(this.checkColour(newX,prevY,startColour) && startX < width){
                    inner = true;
                }
            } 
            // if the current point is any point after the start point
            else if(i > start){
                // set end point to current point
                endX = newX;
                endY = newY;
            }
            // increment i
            i++;
        }
        // if call originates from this.innerIndex(), i.e. the outline is of an inner shape
        if(inner) {
            // find a point to continue indexing the outer shape from
            // find max x and y
            var maxX = startX;
            for(let i = 0; i < array.length; i++) {
                if(array[i][0] > maxX) {
                    maxX = array[i][0];
                    maxY = array[i][1];
                }
            }
            // find x of the pixel to the right of max x
            maxX += 1;
            // if the colour is the same as startColour, call this.selectColour() with x and y of maxX and maxY to continue the index
            if(this.checkColour(maxX,maxY,startColour)) {
                this.selectColour(array,startColour,colour,maxX,maxY);
            }
        }
        return array;
    };
    this.swap = function(array,i1,i2){
        // swap points
        var copy = array[i1];
        array[i1] = array[i2];
        array[i2] = copy;
        return array;
    };
    this.sortY = function(array,ind1,ind2){
        // sort y by insertion sort
        if(!ind1){
            ind1 = 0;
        } 
        if(!ind2){
            ind2 = array.length - 1;
        }
        for(let i = ind1+1; i <= ind2; i++){
            if(array[i-1][1] > array[i][1]) {
                for(let j = i; j > ind1; j--){
                    if(array[j-1][1] > array[j][1]){
                        this.swap(array,j,j-1);
                    } 
                    else if(array[j-1][1] == array[j][1]){
                        break;
                    }
                }
            }
        }
        return array;
    };
    this.sortX = function(array,ind1,ind2){
        // sort x by insertion sort
        if(!ind1){
            ind1 = 0;
        }
        if(!ind2){
            ind2 = array.length - 1;
        }
        var currY;
        var iY;
        for(var i = ind1+1; i <= ind2; i++){
            if(array[i-1][1] != currY){
                currY = array[i-1][1];
                iY = i-1;
            }
            if(array[i-1][1] == array[i][1] && 
               array[i-1][0] > array[i][0]){
                for(let j = i; j > iY; j--){
                    if(array[j-1][0] > array[j][0]){
                        this.swap(array,j,j-1);
                    }
                }
            }
        }
        return array;
    };
    this.indexInner = function(array,startColour,colour){
        // index inner points
        for(let i = 0; i < array.length - 1; i++) {
            let p1 = array[i];
            let p2 = array[i+1]; if(!this.checkColour(p1[0]+1,p1[1],startColour)){
                continue;
            }
            if(p2[0] - p1[0] > 1 && p1[1] == p2[1]){
                for(let j = p1[0]+1; j < p2[0]; j++){
                    if(this.checkColour(j,p1[1]+1,startColour) && 
                       this.checkColour(j+1,p1[1],startColour) && 
                      !this.checkColour(j+1,p1[1]+1,startColour)){
                        let initLen = array.length;
                        let i1 = i+1;
                        this.selectEdge(array,startColour,colour,j,p1[1],i1);
                        let newLen = array.length;
                        let newPoints = newLen - initLen;
                        let i2 = i1 + newPoints;
                        let endY = array[i1][1];
                        for(let l = i1; l < i2; l++){
                            if(array[l][1] > endY){
                                endY = array[l][1];
                            }
                        }
                        let k = i1;
                        while(array[k][1] <= endY) {  
                            k++;
                        }
                        this.sortX(this.sortY(array,i1,k),i1,k);
                        break;
                    } 
                    else{
                        let c1 = array[i][2];
                        let c2 = this.getColour(j,p1[1]);
                        if(!this.compareExactColour(c1,c2)) {
                            array.splice(++i,0,[j,p1[1],c2]);
                        }
                    } 
                }
            }
        }
        return array;
    };
    this.selectColour = function(array,startColour,colour,x,y,ind){
        // select shape
        var edge = this.selectEdge(array,startColour,colour,x,y,ind);
        var sorted = this.sortX(this.sortY(edge));
        var inner = this.indexInner(sorted,startColour,colour);
        return array;  
    };
    this.compareExactColour = function(arr1,arr2) {
        // compare exact colour values
        return (arr1[0] == arr2[0] && 
                arr1[1] == arr2[1] &&
                arr1[2] == arr2[2] &&
                arr1[3] == arr2[3]) ? true : false;
    };
    this.calcColour = function(pointColour,colour,startColour) {
        // calculate equivalent colour
        var h = colour[0];
        var s = round(max(min(pointColour[1]/startColour[1] * colour[1],100),0));
        var l = round(max(min(pointColour[2]/startColour[2] * colour[2],100),0));
        var a = parseFloat(max(min(pointColour[3]/startColour[3] * colour[3],1),0)).toFixed(1);
        var rgba = this.hslRGB([h,s,l,a]);
        return rgba;
    };
    this.replaceColour = function(array,colour,startColour,x1,y1,x2,y2) {
        // replace colour
        var adjX, adjY;
        for(let i = 1; i < array.length; i++) {
            var c1 = array[i-1];
            var c2 = array[i];
            var nextXColour = this.getColour(c1[0]+1,c1[1]);
            var c1Colour = c1[2];
            var newColour = this.calcColour(c1Colour,colour,startColour);
            push();
            stroke(newColour);
            if(this.compareColour(nextXColour,startColour) && 
               c1[1] == c2[1]) {
                if(this.mode == "move"){
                    adjX = x2 - x1;
                    adjY = y2 - y1;
                }
                else {
                    adjX = 0;
                    adjY = 0;
                }
                push();
                stroke(255);
                line(c1[0], c1[1], c2[0] - 1, c2[1]);
                pop();
                
                line(c1[0] + adjX, 
                     c1[1] + adjY,
                     c2[0] - 1 + adjX, 
                     c2[1] + adjY);
            }
            else {
                push();
                stroke(255);
                point(c1[0],c1[1]);
                pop();
                point(c1[0] + adjX,c1[1] + adjY);
            }
            pop();
            if(i == array.length - 1){
                push();
                let c2Colour = c2[2];
                newColour = this.calcColour(c2Colour,colour,startColour);
                push();
                stroke(255);
                point(c2[0],c2[1]);
                pop();
                stroke(newColour);
                point(c2[0] + adjX,c2[1] + adjY);
                pop();
            }   
        }
    };
    this.colourPHSL = function(colour){
        // convert colour name to HSLA
        if(colour == "black"){
            return [0,0,0,1];
        } 
        else if(colour == "silver"){
            return [0,0,75,1];
        }
        else if(colour == "gray"){
            return [0,0,50,1];
        }
        else if(colour == "white"){
            return [0,0,100,1];
        }
        else if(colour == "maroon"){
            return [0,100,25,1];
        }
        else if(colour == "red"){
            return [0,100,50,1];
        }
        else if(colour == "purple"){
            return [300,100,25,1];
        }
        else if(colour == "orange"){
            return [39,100,50,1];
        }
        else if(colour == "pink"){
            return [350,100,88,1];
        }
        else if(colour == "fuchsia"){
            return [300,100,50,1];
        }
        else if(colour == "green"){
            return [120,100,25,1];
        }
        else if(colour == "lime"){
            return [120,100,50,1];
        }
        else if(colour == "olive"){
            return [60,100,25,1];
        }
        else if(colour == "yellow"){
            return [60,100,50,1];
        }
        else if(colour == "navy"){
            return [240,100,25,1];
        }
        else if(colour == "blue"){
            return [240,100,50,1];
        }
        else if(colour == "teal"){
            return [180,100,25,1];
        }
        else if(colour == "aqua"){
            return [180,100,50,1];
        }
    };
    this.rgbHSL = function(rgba){
        // convert colour from RGBA to HSLA
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
    this.hslRGB = function(hsla) {
        // convert colour from HSLA to RGBA
        var h = hsla[0]/360;
        var s = hsla[1]/100;
        var l = hsla[2]/100;
        var a = hsla[3];
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } 
        else{
            var t1 = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var t2 = 2 * l - t1;
            r = h + 0.333;
            g = h;
            b = h - 0.333;
            function findVal(c){
              if (c < 0) c += 1;
              if (c > 1) c -= 1;
              if (c < 0.167) return t2 + (t1 - t2) * 6 * c;
              if (c < 0.5) return t1;
              if (c < 0.667) return t2 + (t1 - t2) * (0.667 - c) * 6;
              return t2;
            }
            r = findVal(r) * 255;
            g = findVal(g) * 255;
            b = findVal(b) * 255;
            a *= 255;
        }

      return [round(r),round(g),round(b),round(a)];
    };
    
    this.cutArray = function(array,scissors,x1,y1,x2,y2) {
        // cut shape
        var minY = min(y1,y2);
        var array1,array2;
        var p1,p2;
        if(minY == y1) {
            p1 = [x2,y2];
            p2 = [x1,y1];
        }
        else{
            p1 = [x1,y1];
            p2 = [x2,y2];
        }
        var slope = (p2[0] - p1[0])/(p2[1] - p1[1]);
        
        var sp2 = [round(p2[0] - slope*(p2[1] - array[0][1])),
                   array[0][1]];
        var sp1 = [round(p2[0] - slope*(p2[1] - array[array.length-1][1])),
                   array[array.length-1][1]];
        var rows = sp2[1] - sp1[1];
        push();
        stroke(0,255,255);
        for(let i = 0; i <= abs(rows); i++) {
            scissors.push([round(sp2[0] - slope * (sp2[1] - sp2[1]-i)),
                           sp2[1]+i,
                           this.getColour(round(sp2[0] - slope * (sp2[1] - sp2[1]-i)),
                                          sp2[1]+i)]);
            point(round(sp2[0] - slope*(sp2[1] - sp2[1]-i)),sp2[1]+i);
        }
        pop();
        array1 = array.slice();
        array2 = [];
        var prevYi = 0;
        for(let j = 0; j < scissors.length; j++){
            for(let i = 1; i < array.length; i++){
                if(scissors[j][1] == array[i-1][1] && 
                   scissors[j][1] == array[i][1] && 
                   scissors[j][0] >= array[i-1][0] &&
                   scissors[j][0] <= array[i][0]){
                  
                    for(let k = i-1; k <= i; k++) {
                        array1.splice(i,0,[scissors[j][0],scissors[j][1],array[i][2]]);
                        array2.push(array1[k]);
                        array1.splice(k,1);
                    }
                }
            }
        }
        pieces = [this.sortX(this.sortY(array1)),this.sortX(this.sortY(array2))];
        return pieces;
    };
    this.move = function(pieces,scissors,colour,startColour,x1,y1,x2,y2){
        // move shape
        var piece;
        for(let i = 0; i < pieces.length; i++){
            if(y1 >= pieces[i][0][1] &&
               y1 <= pieces[i][pieces[i].length - 1][1] &&
               x1 >= pieces[i][0][0] &&
               x1 <= pieces[i][pieces[i].length - 1][0]) {
                piece = i;
            }
        }
        push();
        for(let i = 0; i < scissors.length; i++) {
            stroke(scissors[i][2]);
            point(scissors[i][0],scissors[i][1]);
        }
        pop();
        this.replaceColour(pieces[piece],colour,startColour,x1,y1,x2,y2); 
    };
    
	this.draw = function(){
		// check if mouse is pressed
		if(mouseIsPressed){
			// check if mouse location is off-canvas
			if(startMouseX == -1){
                // set startMouseX and startMouseY to the position of the mouse on click
				startMouseX = mouseX;
				startMouseY = mouseY;
                // set drawing state to active
				drawing = true;
				//load pixels to pixels[] Array
				loadPixels();            
			}

			else{
				//update the screen with the saved pixels
				updatePixels();
                // set x1, y1 to the initial position of the mouse on click and x2 and y2 to the  position of the mouse while dragging
                let x1 = startMouseX;
                let y1 = startMouseY;
                let x2 = mouseX;
                let y2 = mouseY;
                // get the colour of the selected pixel
                let startColour = this.getColour(x1,y1);
                // get the colour from the colour palette
                let colour = colourP.selectedColour;
                // if the colour value is not an array, convert the colour name to HSLA
                if(!colour[0]){
                    colour = this.colourPHSL(colour);
                }
                // if startColour is set
                if(startColour[0] >= 0) {
                    // if mode is set to cut
                    if(this.mode == "cut"){
                        // reset scissors
                        this.scissors = [];
                        // reset points
                        this.points = [];
                        // select shape
                        this.selectColour(this.points,startColour,colour,x1,y1);
                        // cut shape
                        this.pieces = this.cutArray(this.points,this.scissors,x1,y1,x2,y2);
                    }
                    // if mode is set to move
                    else{ 
                       // move shape
                        this.move(this.pieces,this.scissors,startColour,startColour,x1,y1,x2,y2);
                    }
                }
               
			}
		}
        // if drawing is active
		else if(drawing){
			//save the pixels with the most recent line and reset the
			loadPixels();
            //drawing bool and start locations
			drawing = false;
			startMouseX = -1;
			startMouseY = -1;
		}
	};
    this.unselectTool = function(){
		//clear options
		$(".options").html("");
	};
    this.populateOptions = function(){
        $(".options").html("<button id='moveButton'>Move</button>");
		// click handler
		$("#moveButton").on("click", function(){
            // if mode is cut, switch to move
            if(self.mode == "cut"){ 
                self.mode = "move";
                $(this).text('Cut');
            }
            // if mode is move, switch to cut
            else{
                self.mode = "cut";
                $(this).text('Move');
            }
		});
    };
}
