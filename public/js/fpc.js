/*eslint-disable id-length no-redeclare*/
/*global THREE*/


  var camera, scene, renderer;
  var geometry, material, mesh;
  var controls;
  var water;
  var waterNormals;
  var objects = [];
  var raycaster;
  var composer;
  var blocker = document.getElementById( 'blocker' );
  var instructions = document.getElementById( 'instructions' );
  // http://www.html5rocks.com/en/tutorials/pointerlock/intro/
  var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
  if ( havePointerLock ) {
    var element = document.body;


/*----------------------------POINTER LOCK FOR DIV----------------------------*/
    var pointerlockchange = function ( event ) {
      if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
        controlsEnabled = true;
        controls.enabled = true;
        blocker.style.display = 'none';
      } else {
        controls.enabled = false;
        blocker.style.display = '-webkit-box';
        blocker.style.display = '-moz-box';
        blocker.style.display = 'box';
        instructions.style.display = '';
      }
    };
    var pointerlockerror = function ( event ) {
      instructions.style.display = '';
    };
    // Hook pointer lock state change events
    document.addEventListener( 'pointerlockchange', pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'pointerlockerror', pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
    instructions.addEventListener( 'click', function ( event ) {
      instructions.style.display = 'none';
      // Ask the browser to lock the pointer
      element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
      element.requestPointerLock();
    }, false );
  } else {
    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
  }


/*-----------------------------THREE BOILERPLATE-----------------------------*/

  var controlsEnabled = false;
  var moveForward = false;
  var moveBackward = false;
  var moveLeft = false;
  var moveRight = false;
  var canJump = false;
  var prevTime = performance.now();
  var velocity = new THREE.Vector3();

  var parameters = {
				width: 2000,
				height: 2000,
				widthSegments: 250,
				heightSegments: 250,
				depth: 1500,
				param: 4,
				filterparam: 1
			};

  init();
  animate();

/*--------------------------INITIALIZATION FUNCTION--------------------------*/
  function init() {

    const skyColors = [
      0x413952,
      0x6D2EEB,
      0xFF9D31
    ];
    const groundColors = [
      0x3650B8,
      0x4171B7,
      0x283899
    ];
    const groundColors2 = [
      0x3552AF,
      0x3650B8,
      0x3350AA
    ];

    var loader = new THREE.OBJLoader();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( skyColors[1], 0, 1700 );

    var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.5 );
    light.position.set( 0.5, 1, 0.75 );
    scene.add( light );

    var pointLight = new THREE.PointLight( skyColors[2], 1 );
    light.position.set( 500, 500, 500 );
    // scene.add( pointLight );

    var sphereSize = 1;
    var pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
    scene.add( pointLightHelper );

    var size = 10;
    var divisions = 10;

    var gridHelper = new THREE.GridHelper( size, divisions );
    scene.add( gridHelper );


    controls = new THREE.PointerLockControls( camera );
    // pointer lock controls require the PointerLockCOntrols.js file in examples/js/controls
    scene.add( controls.getObject() );

    var onKeyDown = function ( event ) {
      switch ( event.keyCode ) {
        case 38: // up
        case 87: // w
          moveForward = true;
          break;
        case 37: // left
        case 65: // a
          moveLeft = true; break;
        case 40: // down
        case 83: // s
          moveBackward = true;
          break;
        case 39: // right
        case 68: // d
          moveRight = true;
          break;
        case 32: // space
          if ( canJump === true ) velocity.y += 350;
          canJump = false;
          break;
      }
    };
    var onKeyUp = function ( event ) {
      switch( event.keyCode ) {
        case 38: // up
        case 87: // w
          moveForward = false;
          break;
        case 37: // left
        case 65: // a
          moveLeft = false;
          break;
        case 40: // down
        case 83: // s
          moveBackward = false;
          break;
        case 39: // right
        case 68: // d
          moveRight = false;
          break;
      }
    };
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );


    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, -1, 0 ), 0, 10 );

    let skyBox = new THREE.SphereGeometry( 800, 32, 15);
    let skyMat = new THREE.MeshBasicMaterial( {color: skyColors[0]} );
    skyMat.side = THREE.BackSide;
    let skyMesh = new THREE.Mesh(skyBox, skyMat);

    scene.add(skyMesh);


    // GROUND PLANE GEOMETRY
    geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
    geometry.rotateX( -Math.PI / 2 ); //rotates to x plane

    for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
      //randomizes the location of each vertex in the x and z direction,slightly vertically
      var vertex = geometry.vertices[ i ];
      vertex.x += Math.random() * 20;
      vertex.y += Math.random() * 8 - 5;
      vertex.z += Math.random() * 20;
    }
    for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {
      //the color of each face randomizes to fade between three randomized values of the same color
      const groundColors2 = [
        0x3552AF,
        0x3650B8,
        0x3350AA
      ];
      var face = geometry.faces[ i ];
      face.vertexColors[ 0 ] = new THREE.Color(groundColors2[Math.floor(Math.random() * 3)]);
      face.vertexColors[ 1 ] = new THREE.Color(groundColors2[Math.floor(Math.random() * 3)]);
      face.vertexColors[ 2 ] = new THREE.Color(groundColors2[Math.floor(Math.random() * 3)]);
    }

    material = new THREE.MeshStandardMaterial( { vertexColors: THREE.VertexColors } );
    // material = new THREE.MeshStandardMaterial( {color: 0x3650B8} );
    //uses the vertex colors of each triangle to make a basic material
    mesh = new THREE.Mesh( geometry, material );

    scene.add( mesh );


    // FLOATING OBJECTS GEOMETRY
    geometry = new THREE.CylinderGeometry( 5, 5, 10, 32 );
    var loader = new THREE.OBJLoader();

    loader.load(
      'objects/Lamp.obj',
      function ( lamp ) {
        loader.load(
          'objects/Holder.obj',
          function (holder) {

            for ( var i = 0; i < 50; i ++ ) {
              let lampGeo = lamp.children[0].geometry;
              let emitMap = new THREE.TextureLoader().load( 'textures/testTexture.jpg' );
              let lampMaterial = new THREE.MeshStandardMaterial( { /*specular: 0xffffff,*/ shading: THREE.SmoothShading, vertexColors: THREE.VertexColors, emissive: skyColors[2], emissiveIntensity: 1, emissiveMap: emitMap } );
              var lampMesh = new THREE.Mesh( lampGeo, lampMaterial );

              // console.log('Lamp Mesh', lampMesh);

              let holderGeo = holder.children[0].geometry;
              let holderMaterial = new THREE.MeshStandardMaterial( { /*specular: 0xffffff,*/ shading: THREE.FlatShading, vertexColors: THREE.VertexColors, color: 0x000000 } );
              var holderMesh = new THREE.Mesh( holderGeo, holderMaterial );

              var Lamps = new THREE.Group();
              Lamps.add(lampMesh);
              Lamps.add(holderMesh);

              Lamps.scale.set(5, 5, 5);

              Lamps.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
              Lamps.position.y = Math.floor( Math.random() * 40 ) + 5;
              Lamps.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
              Lamps.rotation.y = -Math.PI/(Math.random()*2);

              scene.add( Lamps );

              let posRandomizer = Math.random() * 2;
              let rotRandomizer = Math.random() * 2;
              // console.log(i, ': ', posRandomizer);

              Lamps.animate = function( time ){
                this.position.y = (Math.sin( posRandomizer * time ) + 5) * 2;
                this.rotation.y = (Math.sin( rotRandomizer * time ) + 5) * 0.5;
              }

              objects.push( Lamps );
            }

            // FLOATING OBJECTS GEOMETRY HIGH UPS
            geometry = new THREE.CylinderGeometry( 5, 5, 10, 32 ); //new box geometry

            for ( var i = 0; i < 50; i ++ ) {
              let lampGeo = lamp.children[0].geometry;
              let emitMap = new THREE.TextureLoader().load( 'textures/testTexture.jpg' );
              let lampMaterial = new THREE.MeshStandardMaterial( { /*specular: 0xffffff,*/ shading: THREE.SmoothShading, vertexColors: THREE.VertexColors, emissive: skyColors[2], emissiveIntensity: 1, emissiveMap: emitMap } );
              var lampMesh = new THREE.Mesh( lampGeo, lampMaterial );

              // console.log('Lamp Mesh', lampMesh);

              let holderGeo = holder.children[0].geometry;
              let holderMaterial = new THREE.MeshStandardMaterial( { /*specular: 0xffffff,*/ shading: THREE.FlatShading, vertexColors: THREE.VertexColors, color: 0x000000 } );
              var holderMesh = new THREE.Mesh( holderGeo, holderMaterial );

              var Lamps = new THREE.Group();
              Lamps.add(lampMesh);
              Lamps.add(holderMesh);

              Lamps.scale.set(5, 5, 5);

              //make a new mesh
              Lamps.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
              Lamps.position.y = Math.floor( Math.random() * 40 ) + 30;
              Lamps.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
              Lamps.rotation.y = -Math.PI/(Math.random()*2);

              //place that mesh in the scene randomly
              scene.add( Lamps );

              // material.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
              //alter the material color between loops

              let posRandomizer = Math.random() * 2;
              let rotRandomizer = Math.random() * 2;
              let heightRandomizer = Math.random() * 60 + 5;
              // console.log(i, ': ', posRandomizer);

              Lamps.animate = function( time ){
                this.position.y = (Math.sin( posRandomizer * time ) + heightRandomizer) * 2;
                this.rotation.y = (Math.sin( rotRandomizer * time ) + 5) * 0.5;
              }

              objects.push( Lamps );
              //objects array will be used later for raycasting
            }

            // RESIZE LISTENER
            window.addEventListener( 'resize', onWindowResize, false );


            // RENDERER SETUP
            renderer = new THREE.WebGLRenderer();
            renderer.setClearColor( skyColors[1] );
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( window.innerWidth, window.innerHeight );
            document.body.appendChild( renderer.domElement );

            // var effectBloom = new THREE.BloomPass( 5 );
            // var effectFilm = new THREE.FilmPass( 0.35, 0.025, 648, false );
            //
            // var rtParameters = {
            // 					minFilter: THREE.LinearFilter,
            // 					magFilter: THREE.LinearFilter,
            // 					format: THREE.RGBFormat,
            // 					stencilBuffer: true
            // 				};
            //
            // composer = new THREE.EffectComposer( renderer, new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, rtParameters )  );
            //
            //
            //
            // let renderScene = new THREE.RenderPass(scene, camera);
            // console.log('Render Scene: ', renderScene);
            // let renderObjects = new THREE.TexturePass( renderScene.renderTarget2.texture );
            //
            //
            // composer.addPass(renderObjects);
            // // composer.addPass(effectBloom);
            // // composer.addPass(effectFilm);
            // console.log(composer);

            // WATER GEOMETRY
            waterNormals = new THREE.TextureLoader().load( 'textures/waternormals.jpg' );
            waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
            water = new THREE.Water( renderer, camera, scene, {
              textureWidth: 512,
              textureHeight: 512,
              waterNormals: waterNormals,
              alpha: 	1.0,
              // sunDirection: light.position.clone().normalize(),
              sunColor: skyColors[1],
              waterColor: 0x001e0f,
              distortionScale: 50.0
            } );
            let mirrorMesh = new THREE.Mesh(
              new THREE.PlaneBufferGeometry( 1000, 1000 ),
              water.material
            );
            mirrorMesh.add( water );
            mirrorMesh.rotation.x = -Math.PI * 0.5;
            scene.add( mirrorMesh );


            console.log('Scene Object: ', scene);
            console.log('Objects Array: ', objects);

          })
      }
    );

  }


  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

  }


/*-----------------------------ANIMATION FUNCTION-----------------------------*/
  function animate() {
    requestAnimationFrame( animate );
    if ( controlsEnabled ) {
      raycaster.ray.origin.copy( controls.getObject().position );
      raycaster.ray.origin.y -= 10;
      var intersections = raycaster.intersectObjects( objects );
      var isOnObject = intersections.length > 0;
      var time = performance.now();
      var delta = ( time - prevTime ) / 1000;
      velocity.x -= velocity.x * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;
      velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
      if ( moveForward ) velocity.z -= 400.0 * delta;
      if ( moveBackward ) velocity.z += 400.0 * delta;
      if ( moveLeft ) velocity.x -= 400.0 * delta;
      if ( moveRight ) velocity.x += 400.0 * delta;
      if ( isOnObject === true ) {
        velocity.y = Math.max( 0, velocity.y );
        canJump = true;
      }
      controls.getObject().translateX( velocity.x * delta );
      controls.getObject().translateY( velocity.y * delta );
      controls.getObject().translateZ( velocity.z * delta );
      if ( controls.getObject().position.y < 10 ) {
        velocity.y = 0;
        controls.getObject().position.y = 10;
        canJump = true;
      }
      prevTime = time;
    }

    //animate each lantern
    var tim = performance.now() * 0.001;
    for (var i = 0; i < objects.length; i++) {
      objects[i].animate(tim);
    }

    water.material.uniforms.time.value += 1.0 / 60.0;
    // controls.update();
    water.render();

    // var delta = 0.01;
    // renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );
    // composer.render( delta );
    renderer.render( scene, camera );
  }
