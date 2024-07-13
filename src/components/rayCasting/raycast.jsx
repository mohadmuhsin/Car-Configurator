
function Raycast(THREE, renderer, scene, event, camera, controls) {
  // Raycasting
  const rayCaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const rect = renderer.domElement.getBoundingClientRect();
  const rectX = rect.right - rect.left;
  const rectY = rect.bottom - rect.top;

  // Event Listner

  mouse.x = ((event.clientX - rect.left) / rectX) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rectY) * 2 + 1;

  rayCaster.setFromCamera(mouse, camera);

  const intersects = rayCaster.intersectObjects(scene.children);

  if (intersects.length > 0) {

    const object = intersects[0].object
    if (object.type == "Sprite") {
      return true;
    } else if (
      object.name == "DoorLF_Interior_InteriorBase_0002"
    ) {
      return true;
    } else if (
      object.name == "DoorLF_Interior_InteriorBase_0002_1"
    ) {
      document.querySelector("#door").style.display = "none";
      return false;
    }
    else if (object.name == "DoorLF_Interior_InteriorBase_0001") {
      return "handle"
    }
  }
}
export default Raycast;

function onMouseup(event, THREE, renderer, scene, camera, setMesh) {

  const rayCaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const rect = renderer.domElement.getBoundingClientRect();
  const rectX = rect.right - rect.left;
  const rectY = rect.bottom - rect.top;

  mouse.x = ((event.clientX - rect.left) / rectX) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rectY) * 2 + 1;

  rayCaster.setFromCamera(mouse, camera);
  const intersects = rayCaster.intersectObjects(scene.children);
  if (intersects.length > 0) {

    const objectIntersect = intersects[0]?.object
    if (objectIntersect.name == "DoorLF_Interior_InteriorBase_0001") {
      return "handle"
    }
    else if (objectIntersect.geometry.type == "PlaneGeometry" || intersects[0]?.length < 0) {
      document.querySelector('.colorpick').style.display = 'none'
      // document.querySelector(".colorPicker").style.display = "none";
      return
    }
    if (
      objectIntersect.parent.type === "Object3D" ||
      objectIntersect.parent.type === "Group"
    ) {
      let object = objectIntersect;
      object = iterateObject(object, THREE);
      if (object) {
        if (object.children[0].name == "Sketchfab_model") {
          object = intersects[0].object;
          setMesh(object)

          return object;
        }
      }
    }

    else {
      return
    }

  }

}

export { onMouseup };

function iterateObject(obj, THREE) {
  while (!(obj instanceof THREE.Scene)) {
    obj = obj.parent;
    if (obj.parent instanceof THREE.Scene) {
      return obj;
    }
  }
}
