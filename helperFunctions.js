function HelperFunctions(){
	
  //Jquery click events. Notice that there is no this. at the
  //start we don't need to do that here because the event will
  //be added to the button and doesn't 'belong' to the object

  //event handler for the clear button event. Clears the screen
  $("#clearButton").on("click", function(){
    background(255, 255, 255);
    //call loadPixels to update the drawing state
    //this is needed for the mirror tool
    loadPixels();
  });

  //event handler for the save image button. saves the canvsa to the
  //local file system.
  $("#saveImageButton").on("click", function(){
    saveCanvas("myPicture", "jpg");
  });
  // load button
  $("#loadButton").on("change", function(){
    var file = this.files[0];
    file.src = URL.createObjectURL(this.files[0]);
    loadImage(file.src, img => {
        image(img, 0, 0);
    });
  });
    
  
}
