import * as TWEEN from "@tweenjs/tween.js";

export function getIn(camera, controls, action) {
  const tween = new TWEEN.Tween(camera.position).to(
    { x: 15, y: 10, z: -13 },
    2000
  );
  const tween1 = new TWEEN.Tween(camera.position).to(
    { x: 10, y: 10, z: -6 },
    1500
  );
  const tween2 = new TWEEN.Tween(camera.position).to(
    { x: 2.5, y: 10, z: -4 },
    1500
  );
  const tween3 = new TWEEN.Tween(controls.target).to(
    { x: 2.25, y: 4, z: 6 },
    1500
  );


  tween.easing(TWEEN.Easing.Cubic.InOut)
  tween1.easing(TWEEN.Easing.Quadratic.InOut)
  tween2.easing(TWEEN.Easing.Cubic.InOut)
  tween3.easing(TWEEN.Easing.Quadratic.InOut)

  tween.chain(tween1);
  tween.onStart(() => {
    action.play()
  })
  tween.onComplete(() => {
    action.paused = true
  })
  tween1.onComplete(() => {
    action.paused = false
    tween2.start()
  })
  tween2.onStart(() => {
    tween3.start()
  })
  
  tween.start();
  return TWEEN;
}

export function getOut(camera, controls, action) {
  action.reset()
  const tween = new TWEEN.Tween(camera.position).to(
    { x: 10, y: 10, z: -6 },
    2000
  );
  const tween1 = new TWEEN.Tween(camera.position).to(
    { x: 15, y: 10, z: -13 },
    1500
  );

  const tween2 = new TWEEN.Tween(camera.position).to(
    { x: 30, y: 20, z: 40 },
    2000
  );
  const tween3 = new TWEEN.Tween(controls.target).to(
    { x: 0, y: 1, z: 0 },
    2000
  );

  tween.easing(TWEEN.Easing.Cubic.InOut)
  tween1.easing(TWEEN.Easing.Quadratic.InOut)
  tween2.easing(TWEEN.Easing.Cubic.InOut)
  tween3.easing(TWEEN.Easing.Quadratic.InOut)


  tween.chain(tween1)
  tween1.onComplete(() => {
    tween2.start()
  })

  tween2.onStart(() => {
    tween3.start()
  })
  tween.onStart(() => {
    action.play();
  });

  tween3.onComplete(() => {
    document.querySelector("#door").style.display = "block";
  })

  tween.start();
  return TWEEN;
}


export function InitialAnimation(camera){
  console.log("initial animation called")
  const tween = new TWEEN.Tween(camera?.position).to(
    { x: 2.5, y: 10, z: -4 },
    5000
  )
  tween.start()
  
  tween.onComplete(() => {
  })
  return TWEEN
}