function StarTrailTool() {
    // initialise variables
    // set tool name and icon
    this.name = "StarTrail";
    this.icon = "assets/starTrail.png";
    // set number of stars for each mouse press
    this.stars = 2;
    // set spread of spray from the mouse pointer
    this.spread = 30;
    // set scale
    this.scale = [0.1,0.3];
    // draw stars
    this.draw = function(){
        //if the mouse is pressed spray stars on the canvas
        if(mouseIsPressed){
            for(var i = 0; i < this.stars; i++){
                // set star X and Y location
                let starX = random(mouseX - this.spread, mouseX + this.spread);
                let starY = random(mouseY - this.spread, mouseY + this.spread);
                // set star scale
                let scale = random(this.scale[0], this.scale[1]);
                // draw a star
                beginShape();
                vertex(starX, starY);
                vertex(starX + 10*scale, starY - 20*scale);
                vertex(starX + 20*scale, starY);
                vertex(starX + 40*scale, starY + 5*scale);
                vertex(starX + 25*scale, starY + 17*scale);
                vertex(starX + 30*scale, starY + 40*scale);
                vertex(starX + 10*scale, starY + 25*scale);
                vertex(starX - 10*scale, starY + 40*scale);
                vertex(starX - 5*scale, starY + 17*scale);
                vertex(starX - 20*scale, starY + 5*scale);
                vertex(starX, starY);
                endShape();
            }
        }
    };
}