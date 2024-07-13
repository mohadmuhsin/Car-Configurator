import { Loader } from "@react-three/drei";
import React from "react";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
let obj;
let supra;
function Model(LoadingManager, scene, THREE) {
  const loader = new GLTFLoader(LoadingManager);

  // supra Model

  loader.load(
    "models/toyota_supra/car animation6.glb",
    (object) => {
      supra;
      obj = object;
      supra = object.scene;

      const map = new THREE.TextureLoader().setPath("./icon/").load("exit.png");
      const material = new THREE.SpriteMaterial({ map: map });
      const sprite = new THREE.Sprite(material);
      sprite.position.set(0.5, 8.8, 1.8);
      sprite.scale.set(1, 1, 1);
      // scene.add(sprite);


      supra.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
        }
        if (child.name == "Xenon_Light_Lightings_0") {
          child.material.emissive.set("black");
          child.material.color.set("black");
        }
        if(child.name === "InteriorEmissive_InteriorBase_0"){
          child.attach(sprite)
        }
      });
      supra.position.y = 0.05
      scene.add(supra);
      
      
      return supra;
    },
    undefined,
    (error) => {
      console.log(error);
    }
  );
}




export const getObject = () => {
  return obj;
};

export const getSupra = () => {
  return supra;
};

export default Model;
