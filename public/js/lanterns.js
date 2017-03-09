// import THREE from './three.min.js';
/*eslint-disable-global THREE*/

var scene, camera, renderer;
var geometry, material, mesh;

init();
animate();

function init() {

    scene = new THREE.Scene();

    let element = document.getElementById('threeD')
    console.log(element);

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;

    geometry = new THREE.BoxGeometry( 200, 200, 200 );
    material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();

    element.appendChild( renderer.domElement );

    console.log(document.getElementsByTagName('canvas'));
    let canvas = document.getElementsByTagName('canvas');
    console.log(canvas);

    //trying to get the renderer size to be the size of the canvas not the size of the window

    renderer.setSize( canvas.width, canvas.height );
}

function animate() {

    requestAnimationFrame( animate );

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    renderer.render( scene, camera );

}
