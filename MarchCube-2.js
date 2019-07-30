THREE.MarchCube = function() {
  console.log('building slowly');
  
    this.march = function(points, values, isolevel ){
      
      var size = Math.round(Math.pow(values.length, 1/3));
      var size2 = size * size;
      var size3 = size * size * size;

      var vlist = new Array(12);

      this.geometry = new THREE.Geometry();
      var vertexIndex = 0;

      for (var z = 0; z < size - 1; z++)
      for (var y = 0; y < size - 1; y++)
      for (var x = 0; x < size - 1; x++){
        // index of base point, and also adjacent points on cube
        var p    = x + size * y + size2 * z,
          px   = p   + 1,
          py   = p   + size,
          pxy  = py  + 1,
          pz   = p   + size2,
          pxz  = px  + size2,
          pyz  = py  + size2,
          pxyz = pxy + size2;

        // store scalar values corresponding to vertices
        var value0 = values[ p    ],
          value1 = values[ px   ],
          value2 = values[ py   ],
          value3 = values[ pxy  ],
          value4 = values[ pz   ],
          value5 = values[ pxz  ],
          value6 = values[ pyz  ],
          value7 = values[ pxyz ];

        // place a "1" in bit positions corresponding to vertices whose
        //   isovalue is less than given constant.

        var cubeindex = 0;
        if ( value0 < isolevel ) cubeindex |= 1;
        if ( value1 < isolevel ) cubeindex |= 2;
        if ( value2 < isolevel ) cubeindex |= 8;
        if ( value3 < isolevel ) cubeindex |= 4;
        if ( value4 < isolevel ) cubeindex |= 16;
        if ( value5 < isolevel ) cubeindex |= 32;
        if ( value6 < isolevel ) cubeindex |= 128;
        if ( value7 < isolevel ) cubeindex |= 64;

        // bits = 12 bit number, indicates which edges are crossed by the isosurface
        var bits = THREE.edgeTable[ cubeindex ];

        // if none are crossed, proceed to next iteration
        if ( bits === 0 ) continue;

        // check which edges are crossed, and estimate the point location
        //    using a weighted average of scalar values at edge endpoints.
        // store the vertex in an array for use later.
        var mu = 0.5; 

        // bottom of the cube
        if ( bits & 1 )
        {		
          mu = ( isolevel - value0 ) / ( value1 - value0 );
          vlist[0] = points[p].clone().lerp( points[px], mu );
        }
        if ( bits & 2 )
        {
          mu = ( isolevel - value1 ) / ( value3 - value1 );
          vlist[1] = points[px].clone().lerp( points[pxy], mu );
        }
        if ( bits & 4 )
        {
          mu = ( isolevel - value2 ) / ( value3 - value2 );
          vlist[2] = points[py].clone().lerp( points[pxy], mu );
        }
        if ( bits & 8 )
        {
          mu = ( isolevel - value0 ) / ( value2 - value0 );
          vlist[3] = points[p].clone().lerp( points[py], mu );
        }
        // top of the cube
        if ( bits & 16 )
        {
          mu = ( isolevel - value4 ) / ( value5 - value4 );
          vlist[4] = points[pz].clone().lerp( points[pxz], mu );
        }
        if ( bits & 32 )
        {
          mu = ( isolevel - value5 ) / ( value7 - value5 );
          vlist[5] = points[pxz].clone().lerp( points[pxyz], mu );
        }
        if ( bits & 64 )
        {
          mu = ( isolevel - value6 ) / ( value7 - value6 );
          vlist[6] = points[pyz].clone().lerp( points[pxyz], mu );
        }
        if ( bits & 128 )
        {
          mu = ( isolevel - value4 ) / ( value6 - value4 );
          vlist[7] = points[pz].clone().lerp( points[pyz], mu );
        }
        // vertical lines of the cube
        if ( bits & 256 )
        {
          mu = ( isolevel - value0 ) / ( value4 - value0 );
          vlist[8] = points[p].clone().lerp( points[pz], mu );
        }
        if ( bits & 512 )
        {
          mu = ( isolevel - value1 ) / ( value5 - value1 );
          vlist[9] = points[px].clone().lerp( points[pxz], mu );
        }
        if ( bits & 1024 )
        {
          mu = ( isolevel - value3 ) / ( value7 - value3 );
          vlist[10] = points[pxy].clone().lerp( points[pxyz], mu );
        }
        if ( bits & 2048 )
        {
          mu = ( isolevel - value2 ) / ( value6 - value2 );
          vlist[11] = points[py].clone().lerp( points[pyz], mu );
        }

        // construct triangles -- get correct vertices from triTable.
        var i = 0;
        cubeindex <<= 4;  // multiply by 16... 
        // "Re-purpose cubeindex into an offset into triTable." 
        //  since each row really isn't a row.

        // the while loop should run at most 5 times,
        //   since the 16th entry in each row is a -1.
        while ( THREE.triTable[ cubeindex + i ] != -1 ) 
        {
          var index1 = THREE.triTable[cubeindex + i];
          var index2 = THREE.triTable[cubeindex + i + 1];
          var index3 = THREE.triTable[cubeindex + i + 2];

          this.geometry.vertices.push( vlist[index1].clone() );
          this.geometry.vertices.push( vlist[index2].clone() );
          this.geometry.vertices.push( vlist[index3].clone() );
          this.face = new THREE.Face3(vertexIndex, vertexIndex+1, vertexIndex+2);
          this.geometry.faces.push( this.face );

          this.geometry.faceVertexUvs[ 0 ].push( [ new THREE.Vector2(0,0), new THREE.Vector2(0,1), new THREE.Vector2(1,1) ] );

          vertexIndex += 3;
          i += 3;
        }
      }
      this.geometry.mergeVertices();
      this.geometry.computeFaceNormals();
      this.geometry.computeVertexNormals();

      return this.geometry;


    }
  
  
	
};

THREE.MarchCube.prototype = Object.create( THREE.ImmediateRenderObject.prototype );