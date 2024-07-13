import React, { Suspense } from "react";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as TWEEN from "@tweenjs/tween.js";
import Model, { getObject } from "../model/model";
import Raycast, { onMouseup } from "../rayCasting/raycast";
import ColorPicker from "../colorPicker/colorPicker";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { getIn, getOut, InitialAnimation } from "../../tween/tween";
import {
  Lensflare,
  LensflareElement,
} from "three/examples/jsm/objects/Lensflare";

function Canvas() {
  const [state, setColor] = useState({
    background: "#  ",
  });
  const [mesh, setMesh] = useState({});
  let scene = new THREE.Scene();

  let mixer,
    camera,
    controls,
    tween,
    action,
    clips,
    supra,
    obj,
    spotLight,
    spotLight1,
    Right_light,
    Left_light,
    lensflare,
    plane,
    texture,
    nightTexture;
  const tires = []

  function changeColor(e) {
    setColor({ background: e.target.value });
    mesh?.material?.color.set(e.target.value);
  }
  useEffect(() => {
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(22, 17, 40);
    window.camera = camera;
    let renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    scene.background = new THREE.Color("black");
    scene.fog = new THREE.Fog("black", 20, 200);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // to make object more shiny while adding object
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;
    document.body.appendChild(renderer.domElement);

    const LoadingManager = new THREE.LoadingManager();
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 1, 0);
    controls.maxDistance = 100;
    controls.maxPolarAngle = 1.5;


    const light = new THREE.SpotLight(0xffffff, 50, 0, Math.PI / 3 * 2 - 0.7, 0.5, 1.2)
    light.position.set(0, 35, 0)
    scene.add(light)  
    light.castShadow = true
   
    //plane with texture
    nightTexture = new THREE.TextureLoader().load("/rubber_tiles_diff_4k.jpg");
    texture = new THREE.TextureLoader().load("/rubber_tiles_diff_4k.jpg");
    nightTexture.mapping = THREE.EquirectangularReflectionMapping;
    const planeGeometry = new THREE.PlaneGeometry(500, 500);
    const planeMaterial = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      map: texture,
      color: "white"


    });
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    //hdri
    const Loader = new RGBELoader();
    Loader.load("/metro_vijzelgracht_4k.hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
    });

    // progress bar
    const progressBar = document.getElementById("progress-bar");
    LoadingManager.onProgress = function (url, loaded, total) {
      progressBar.value = (loaded / total) * 100;
    };
    const progressBarContainer = document.querySelector(
      ".progress-bar-container"
    );
    const toolbar = document.querySelector(".toolbar");
    LoadingManager.onLoad = function () {
      progressBarContainer.style.display = "none";
      toolbar.style.display = "block";
    };

    // // Event Listner
    window.addEventListener("dblclick", onDblClick);
    window.addEventListener("mouseup", onMouseUp);

    function onDblClick(e) {
      const event = e;
      const goBack = Raycast(THREE, renderer, scene, event, camera, controls);
      if (goBack) {
        getOut(camera, controls, action);
      } else if (goBack == false) {
        doorOpen();
      } else if (goBack == "handle") {
        doorOpen()
      }
      return;
    }

    function onMouseUp(e) {
      const event = e;
      let value = onMouseup(event, THREE, renderer, scene, camera, setMesh);
      if (value == "handle") {
        doorOpen()
      }
      else if (value) {
        setMesh(value);
        let meshColor = value?.material?.color;
        let picker = document.querySelector(".colorpick");
        picker.style.display = "block";
        picker.value = `#${meshColor.getHexString()}`;
      }
    }


    //animate fn
    const clock = new THREE.Clock();
    function animate() {
      if (mixer) {
        mixer.update(clock.getDelta());
        tween?.update();
        controls.update();
      }
      if (tires.length > 0) {
        tween?.update();
        controls.update();
        tires.forEach((tire) => {
          tire.rotation.x += 0.05;
        });
        if (supra.position.z < 40) {
          supra.position.z += 0.05;
          camera.position.z += 0.1;
        } else {
          tires.splice(0, 4);
        }
      }

      renderer.render(scene, camera);
      window.requestAnimationFrame(animate);
    }
    animate();
    //screen resize
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    //Model call
    Model(LoadingManager, scene, THREE);

    return () => {
      window.addEventListener("dblclick", onDblClick);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

    }
  }, []);

  // LensFlare
  const textureLoader = new THREE.TextureLoader();
  const textureFlare = textureLoader.load("/carLightflare.png");
  function addLight(Light) {
    lensflare = new Lensflare();
    lensflare.addElement(new LensflareElement(textureFlare, 200));
    lensflare.addElement(new LensflareElement(textureFlare, 200));
    lensflare.addElement(new LensflareElement(textureFlare, 200));
    lensflare.position.set(0, Light.position.y - 0.5, 0)
    Light.add(lensflare);
  }


  //door oper
  function doorOpen() {
    document.querySelector("#door").style.display = "none";
    let obj = getObject();
    mixer = new THREE.AnimationMixer(obj.scene);
    clips = obj.animations;
    const clip = THREE.AnimationClip.findByName(clips, "Left door open and close");
    action = mixer.clipAction(clip);
    // Set the animation to stop at the end`
    action.setLoop(THREE.LoopOnce);
    tween = getIn(camera, controls, action);
  }

  // color picker show/hide
  function showColor() {
    var colorPicker = document.querySelector(".colorPicker");
    if (
      colorPicker.style.display === "none" ||
      colorPicker.style.display === ""
    ) {
      colorPicker.style.display = "block";
    } else {
      colorPicker.style.display = "none";
    }
  }

  // move the car
  function moveCar() {
    obj = getObject();
    supra = obj.scene;
    supra.traverse((a) => {
      if (a.name == "Back_right_tire") {
        tires.push(a);
      }
      if (a.name == "front_right_tire") {
        tires.push(a);
      }
      if (a.name == "Front_Left_tire") {

        tires.push(a);
      }
      if (a.name == "back_left_tire") {
        tires.push(a);
      }
    });

    tween = new TWEEN.Tween(camera.position).to({ x: 53, y: 15, z: 0 }, 1000)
    const tween1 = new TWEEN.Tween(camera.position).to(
      { x: 10, y: 10, z: -20 },
      1500
    );
    const tween2 = new TWEEN.Tween(camera.position).to(
      { x: 65, y: 10, z: -4 },
      1500
    );
    const tween3 = new TWEEN.Tween(controls.target).to(
      { x: 2.25, y: 4, z: 6 },
      1500
    );
    tween.easing(TWEEN.Easing.Cubic.In)
    tween.onComplete(() => {
      tween1.start()
    })
    tween1.onComplete(() => {
      tween2.start()
    })
    tween2.onComplete(() => {
      tween3.start()
    })
    tween.start();
    document.querySelector(".moveCar").style.display = "none";
    document.querySelector(".stopCar").style.display = "block";
  }

  // to stop car
  function stopCar() {
    tires.splice(0, 4)
    obj = getObject();
    mixer = new THREE.AnimationMixer(obj.scene);
    tween = new TWEEN.Tween(camera.position).to({ x: 30, y: 20, z: 40 }).easing(TWEEN.Easing.Cubic.InOut);
    tween.start();
    supra.position.z = 0;
    camera.position.z = 40;

    document.querySelector(".moveCar").style.display = "block";
    document.querySelector(".stopCar").style.display = "none";
  }

  // night mode
  function lightOf() {
    // light 1
    spotLight = new THREE.SpotLight(0xffffff, 200, 0, Math.PI / 10, 0.6, 1);
    const targetObject = new THREE.Object3D();
    targetObject.position.set(-10, 0, 31);
    scene.add(targetObject);
    spotLight.target = targetObject;

    // light 2
    spotLight1 = new THREE.SpotLight(0xffffff, 200, 0, Math.PI / 10, 0.6, 1);
    const targetObject1 = new THREE.Object3D();
    targetObject1.position.set(-10, 0, 31);
    scene.add(targetObject1);
    spotLight1.target = targetObject1;
    obj = getObject();
    supra = obj.scene;

    supra.traverse((item) => {
      if (item.name == "Xenon_Light_Lightings_0") {
        item.material.emissive.set("white");
        item.material.emissive.intencity = 1;
      }
      if (item.name == "Glass_GlassClear_0") {
        item.material.color.set("white");
        item.material.emissive.intencity = 2;
      }
      if (item.name == "Rear_Light_Redlights_0") {
        item.material.emissive.set("red");
        item.material.color.set("red");
        item.material.emissive.intencity = 1;
      }

      if (item.name == "Right_light") {
        Right_light = item;
        const target = Right_light.getWorldPosition(new THREE.Vector3());
        targetObject.position.set(target.x, 0, target.z + 31);
        addLight(Right_light);
        Right_light.add(spotLight);
      }

      if (item.name == "Left_light") {
        Left_light = item;
        const target = Left_light.getWorldPosition(new THREE.Vector3());
        targetObject1.position.set(target.x, 0, target.z + 31);
        addLight(Left_light);
        Left_light.add(spotLight1);
      }
    });

    document.querySelector(".day").style.display = "none";
    document.querySelector(".night").style.display = "block";
  }

  // day mode
  function lightOn() {
    scene.background = new THREE.Color("black");
    plane.material.map = texture;
    Right_light.remove(spotLight);
    Left_light.remove(spotLight1);
    Right_light.remove(lensflare);
    Left_light.remove(Left_light.children[0]);
    supra.traverse((item) => {
      if (item.name == "Xenon_Light_Lightings_0") {
        item.material.emissive.set("black");
        item.material.emissive.intencity = 1;
      }
      if (item.name == "Rear_Light_Redlights_0") {
        item.material.color.set("red");
        item.material.emissive.set("red");
      }
      if (item.name == "Glass_GlassClear_0") {
        item.material.color.set("black");
        item.material.emissive.intencity = 2;
      }

    });
    document.querySelector(".day").style.display = "block";
    document.querySelector(".night").style.display = "none";
  }

  return (
    <div className="canvas   ">
      <div className="progress-bar-container ">
        <label htmlFor="progress-bar">Loading......</label>
        <progress id="progress-bar" value="0" max="100"></progress>
      </div>
      <input
        type="color"
        className="colorpick"
        value={state.background}
        style={{
          position: "absolute",
          top: "2em",
          left: "2em",
          display: "none",
        }}
        onChange={changeColor}
      />
      {/* tool bar start */}
      <div
        className="colorPicker"
        style={{
          position: "absolute",
          top: "2em",
          left: "2em",
          display: "none",
        }}
      >
        <ColorPicker scene={scene}></ColorPicker>
      </div>
      <div
        className="toolbar  flex flex-row  justify-center  "
        style={{
          position: "absolute",
          bottom: "1em",
          width: "100vw",
          display: "none",
        }}
      >
        <div className="  flex flex-row justify-center   items-center">
          <img
            id="door"
            onClick={doorOpen}
            src="icon/right door.png"
            alt="rotate image"
            className="m-4 h-16 w-16 hover:cursor-pointer  hover:shadow-xl  mr-5  rounded-md  "
          />{" "}
          <img
            id="door"
            onClick={showColor}
            src="icon/car paint.png"
            alt="rotate image"
            className="m-4 h-10 w-10 hover:cursor-pointer  hover:shadow-xl  mr-5   rounded-md m-2  "
          />{" "}
          <img
            id="door"
            onClick={lightOf}
            src="icon/headlight.png"
            alt="rotate image"
            className="day m-4 h-10 w-10 hover:cursor-pointer  hover:shadow-xl  mr-5   rounded-md m-2   "
          />
          <img
            id="door"
            onClick={lightOn}
            src="icon/headlight.png"
            alt="rotate image"
            className="night m-4 h-10 w-10 hidden hover:cursor-pointer  hover:shadow-xl  mr-5   rounded-md m-2  "
          />
          <img
            id="door"
            onClick={moveCar}
            src="icon/car move.png"
            alt="rotate image"
            className="moveCar m-4 h-14 w-14 hover:cursor-pointer  hover:shadow-xl  mr-5  rounded-md m-2  "
          />
          <img
            id="door"
            onClick={stopCar}
            src="icon/car move.png"
            alt="rotate image"
            className="stopCar m-4 h-14 w-14 hidden hover:cursor-pointer  hover:shadow-xl  mr-5  rounded-md  "
          />
        </div>
      </div>
      {/* tool bar end */}
    </div>
  );
}

export default Canvas;
