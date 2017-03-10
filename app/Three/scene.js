/*eslint-disable-global THREE*/

// import THREE from 'react-three';
console.log('three: ', THREE);
// var scene, camera, renderer;
// var geometry, material, mesh;

// init();
// animate();

// function init() {

let scene = new THREE.Scene();


let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
console.log('camera: ', camera);
// camera.position.z = 1000;

let geometry = new THREE.BoxGeometry( 200, 200, 200 );
let material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

let mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

export default scene;

// }
