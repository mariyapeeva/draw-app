function SprayCanTool(){
    // set tool name and icon
	this.name = "SprayCan";
	this.icon = "assets/sprayCan.png";
    // set number of sprayed points
	var points = 13;
    // set spread of points
	var spread = 10;
    
	this.draw = function(){
		var r = random(5,10);
		if(mouseIsPressed){
            // draw points
			for(var i = 0; i < points; i++){
				point(random(mouseX-spread, mouseX + spread), random(mouseY-spread, mouseY+spread));
			}
		}
	};
}