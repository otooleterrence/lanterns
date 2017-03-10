import React, { Component } from 'react'
import THREE from 'three';
import renderer from '../Three/render';

export default function() {
  // var aspectratio = this.props.width / this.props.height;
  // var cameraprops = {fov : 75, aspect : aspectratio,
  //                    near : 1, far : 5000,
  //                    position : new THREE.Vector3(0,0,600),
  //                    lookat : new THREE.Vector3(0,0,0)};
  renderer.animate();

  return;
  // (
  //   // <div>
  //   //   <h1>THIS IS THE RENDERER COMPONENT</h1>
  //   //
  //   // </div>
  //   // <Renderer width={this.props.width} height={this.props.height}>
  //   //     <Scene width={this.props.width} height={this.props.height} camera="maincamera">
  //   //         <PerspectiveCamera name="maincamera" {...cameraprops} />
  //   //         <Cupcake {...this.props.cupcakedata} />
  //   //     </Scene>
  //   // </Renderer>
  // );
}
