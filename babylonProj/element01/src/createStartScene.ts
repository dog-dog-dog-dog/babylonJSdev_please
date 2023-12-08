//TOP OF CODE
//IMPORTING BABYLONJS
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import {
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Mesh,
  Light,
  Camera,
  Engine,
  StandardMaterial,
  Texture,
  Animation,
  EasingFunction,
  Color3,
  Space,
  ShadowGenerator,
  PointLight,
  DirectionalLight,
  CubeTexture,
  Sprite,
  SpriteManager,
  SceneLoader,
  HandPart,
  ActionManager,
  ExecuteCodeAction,
  AnimationPropertiesOverride,
  Sound
  } from "@babylonjs/core";
  
  //MIDDLE OF CODE
  function createBox(scene: Scene, px: number, py: number, pz: number, sx: number, sy: number, sz: number) {
    let box = MeshBuilder.CreateBox("box",{size: 1}, scene);
    //box in different postitions
    box.position = new Vector3(px, py, pz);
    box.scaling = new Vector3(sx, sy, sz);
    const rotate = new Animation(
      "rotationAnimation",
      "rotation.y",
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE,
    );
    const rotationKeys = [
      { frame: 0, value: 0 },
      { frame: 100, value: 2 * Math.PI },
    ];
    rotate.setKeys(rotationKeys);
  
  
    box.animations.push(rotate);
    scene.beginAnimation(box, 0, 100, true);

    //box.position.y = 3; original code to have box be in the centre
    return box;
  }

  
  function createLight(scene: Scene) {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    return light;
  }
  
  function createSphere(scene: Scene) {
    let sphere = MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 2, segments: 32 },
      scene,
    );
    //give it some cheeky wee material
    const material = new StandardMaterial("sphereMaterial", scene);
    material.diffuseTexture = new Texture("assets/spheretex.jpg", scene);
    sphere.material = material;

    sphere.position.y = 1;
    return sphere;
  }
  
  function createGround(scene: Scene) {
    let ground = MeshBuilder.CreateGround(
      "ground",
      { width: 6, height: 6 },
      scene,
    );
    return ground;
  }
  
  function createArcRotateCamera(scene: Scene) {
    let camAlpha = -Math.PI / 2,
      camBeta = Math.PI / 2.5,
      camDist = 10,
      camTarget = new Vector3(0, 0, 0);
    let camera = new ArcRotateCamera(
      "camera1",
      camAlpha,
      camBeta,
      camDist,
      camTarget,
      scene,
    );
    camera.attachControl(true);
    return camera;
  }
  //BOTTOM OF CODE
  export default function createStartScene(engine: Engine) {
    interface SceneData {
      scene: Scene;
      box?: Mesh;
      light?: Light;
      sphere?: Mesh;
      ground?: Mesh;
      camera?: Camera;
    }
  
    let that: SceneData = { scene: new Scene(engine) };
    that.scene.debugLayer.show();
  
    //createBox(that.scene) this is the deafualt for the box, without alterations

    //the arguments in the createBOx below are postition and scale values (posX, posY, etc)
    that.box = createBox(that.scene, 2, 5, 3, 3, 2, 1);
    that.light = createLight(that.scene);
    that.sphere = createSphere(that.scene);
    that.ground = createGround(that.scene);
    that.camera = createArcRotateCamera(that.scene);
    return that;
  }
