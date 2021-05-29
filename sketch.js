//global variables that will store the toolbox colour palette
//amnd the helper functions
var toolbox = null;
var colourP = null;
var helpers = null;

//rectangle / ellipse tool⁺
//with a fill or outline selector⁺⁺
//stamp tool⁺
//eraser⁺
//load button⁺⁺
//star trail⁺⁺
//scissors tool⁺⁺⁺
//blur tool⁺⁺⁺
//spiragraph tool⁺⁺⁺
//flood fill⁺⁺⁺
//background and foreground colours⁺⁺⁺

function setup() {
    //create a canvas to fill the content div from index.html
    canvasContainer = $('#content');
    var c = createCanvas(canvasContainer.innerWidth(), canvasContainer.innerHeight());
    c.parent("content");

   //create helper functions and the colour palette
    helpers = new HelperFunctions();
    colourP = new ColourPalette();
    
    //create a toolbox for storing the tools
    toolbox = new Toolbox();
    
    //add the tools to the toolbox.
    toolbox.addTool(new FreehandTool());
    toolbox.addTool(new LineToTool());
    toolbox.addTool(new SprayCanTool());
    toolbox.addTool(new MirrorDrawTool());
    toolbox.addTool(new RectangleTool());
    toolbox.addTool(new EllipseTool());
    toolbox.addTool(new StampTool());
    toolbox.addTool(new EraserTool());
    toolbox.addTool(new StarTrailTool());
    toolbox.addTool(new ScissorsTool());
    toolbox.addTool(new SpirographTool());
    toolbox.addTool(new FloodFillTool());
    toolbox.addTool(new BFColourTool());
    background(255);
}

function draw() {
    //call the draw function from the selected tool.
    //hasOwnProperty is a javascript function that tests
    //if an object contains a particular method or property
    //if there isn't a draw method the app will alert the user
	if(toolbox.selectedTool.hasOwnProperty("draw")){
    	toolbox.selectedTool.draw();
	}
	else{
		alert("it doesn't look like your tool has a draw method!");
	}
}

