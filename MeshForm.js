THREE.MeshForm = function() {
  console.log('form the mesh');

  this.initialMesh = function(){
  
  	var axisMin = -5;
	  var axisMax =  5;
	  var axisRange = axisMax - axisMin;
	
	
	  var size  = 30; 
	  var size2 = size*size; 
	  var size3 = size*size*size;
	
	  var points = [];
	
	  // generate the list of 3D points
	  for (var k = 0; k < size; k++)
	  for (var j = 0; j < size; j++)
	  for (var i = 0; i < size; i++){ 
		  var x = axisMin + axisRange * i / (size - 1);
		  var y = axisMin + axisRange * j / (size - 1);
		  var z = axisMin + axisRange * k / (size - 1);
		  points.push( new THREE.Vector3(x,y,z) );
	  }
	
  var values = [];
	// initialize values
	for (var i = 0; i < size3; i++) 
		values[i] = 0;
  
	 
    // resetValues();
    // addBall( points, values, new THREE.Vector3(0,3.5,0) );
    // addBall( points, values, new THREE.Vector3(0,0,0) );
    // addBall( points, values, new THREE.Vector3(-1,-1,0) );

    // var lava = new THREE.MarchCube();

    // var geo =   lava.march(points, values, 0.5);

    var customMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        opacity: 0.5
              // color: Math.random() * 0xff00000 - 0xff00000,
              // shading: THREE.FlatShading,
          })
//     var mesh = new THREE.Mesh( geo, customMaterial );

//     mesh.name = "meshBalls";


    // scene.add(mesh);
    
    // return mesh;

    return{
      points:points,
      values:values,
      customMaterial:customMaterial
    }
  
  } //END OF BUILDING INITIAL MESH
      // bubbles like to move around
  
  this.ballUpdate = function(t, points, values){
		resetValues( values );
		addBall( points, values, new THREE.Vector3( 2.0 * Math.cos(2.1 * t), 1.5 * Math.sin(1.6 * t), 3.0 * Math.sin(1.0 * t) ) );
		addBall( points, values, new THREE.Vector3( 2.4 * Math.sin(1.8 * t), 1.5 * Math.sin(1.3 * t), 1.9 * Math.cos(1.9 * t) ) );
		addBall( points, values, new THREE.Vector3( 3.0 * Math.cos(1.5 * t), 2.5 * Math.cos(1.2 * t), 2.1 * Math.sin(1.7 * t) ) );
			
		var object = scene.getObjectByName( "meshBalls" );
    object.geometry.dispose();
    // object.material.dispose();
    scene.remove( object );
    // var newTest = new THREE.MarchCube(points, values, 0.5);
    
    var customMaterial = object.material;
    var newLava = new THREE.MarchCube();
    // newTest.march(points, values, 0.5);
    var newGeo = newLava.march(points, values, 0.5);
		mesh = new THREE.Mesh( newGeo, customMaterial );
    mesh.name ="meshBalls";
		scene.add( mesh );
	}
  
	
};

THREE.MeshForm.prototype = Object.create( THREE.ImmediateRenderObject.prototype );