import THREE from 'three';
import scene from './scene';


let renderer = new THREE.WebGLRenderer();

let element = document.getElementById('threeD');

element.appendChild( renderer.domElement );

let canvas = document.getElementsByTagName('canvas');

//trying to get the renderer size to be the size of the canvas not the size of the window

renderer.setSize( canvas.width, canvas.height );

function animate() {

    requestAnimationFrame( animate );

    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.02;

    renderer.render( scene, scene.camera );

}

export default animate;
