//TOP OF CODE
//IMPORTING BABYLONJS
import setSceneIndex from "./index";
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
  import * as GUI from "@babylonjs/gui";
  import HavokPhysics from "@babylonjs/havok";
  import { HavokPlugin, PhysicsAggregate, PhysicsShapeType } from "@babylonjs/core";

//Havok physics initiatisation----------
let initializedHavok;
HavokPhysics().then((havok) => {
  initializedHavok = havok;
});

const havokInstance = await HavokPhysics();
const havokPlugin = new HavokPlugin(true, havokInstance);

globalThis.HK = await HavokPhysics();
//-------------------------------------


  //MIDDLE OF CODE
 let keyDownMap: any[] = [];


  function importPlayerMesh(scene: Scene, collider: Mesh, x: number, y: number) {
    let tempItem = { flag: false } 
    let item: any = SceneLoader.ImportMesh("", "./models/", "dummy3.babylon", scene, 
   function(newMeshes, particleSystems, skeletons) {
    let mesh = newMeshes[0];
    let skeleton = skeletons[0];
    skeleton.animationPropertiesOverride = new AnimationPropertiesOverride();
    skeleton.animationPropertiesOverride.enableBlending = true; 
    skeleton.animationPropertiesOverride.blendingSpeed = 0.05; 
    skeleton.animationPropertiesOverride.loopMode = 1; 
    let walkRange: any = skeleton.getAnimationRange("YBot_Walk");
    // let runRange: any = skeleton.getAnimationRange("YBot_Run");
    // let leftRange: any = skeleton.getAnimationRange("YBot_LeftStrafeWalk");
    // let rightRange: any = skeleton.getAnimationRange("YBot_RightStrafeWalk");
    // let idleRange: any = skeleton.getAnimationRange("YBot_Idle");

    let animating: boolean = false; 

    scene.onBeforeRenderObservable.add(()=> { 
      let keydown: boolean = false;
      if (keyDownMap["w"] || keyDownMap["ArrowUp"]) {
        mesh.position.z += 0.1; 
        mesh.rotation.y = 0; 
        keydown = true;
      } 
      if (keyDownMap["a"] || keyDownMap["ArrowLeft"]) {
        mesh.position.x -= 0.1; 
        mesh.rotation.y = 3 * Math.PI / 2; 
        keydown = true;
      } 
      if (keyDownMap["s"] || keyDownMap["ArrowDown"]) {
        mesh.position.z -= 0.1; 
        mesh.rotation.y = 2 * Math.PI / 2; 
        keydown = true;
      } 
      if (keyDownMap["d"] || keyDownMap["ArrowRight"]) {
        mesh.position.x += 0.1; 
        mesh.rotation.y = Math.PI / 2; 
        keydown = true;
      }
      
      if (keydown) {
        if (!animating) {
          animating = true; 
          scene.beginAnimation(skeleton, walkRange.from, walkRange.to, true);
        } 
       } else { 
          animating = false; 
          scene.stopAnimation(skeleton);
       } 
       
       //collision
      if (mesh.intersectsMesh(collider)){
        console.log("COLLIDIED");
      }
      });
     
      //physics collision
      item = mesh;
      let playerAggregate = new PhysicsAggregate(item, PhysicsShapeType.CAPSULE, { mass: 0}, scene);
      playerAggregate.body.disablePreStep = false;

    });
    return item; 
    }

    function actionManager(scene: Scene){
      scene.actionManager = new ActionManager(scene);
      scene.actionManager.registerAction( 
      new ExecuteCodeAction( 
      { 
        trigger: ActionManager.OnKeyDownTrigger, 
        //parameters: 'w' 
      },
      function(evt) {keyDownMap[evt.sourceEvent.key] = true; }
      ) 
      );
      scene.actionManager.registerAction( 
        new ExecuteCodeAction( 
      { 
        trigger: ActionManager.OnKeyUpTrigger
      
      },
      function(evt) {keyDownMap[evt.sourceEvent.key] = false; }
      ) 
      );
      return scene.actionManager; 
     } 

  function createLight(scene: Scene) {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    return light;
  }
  function createSkybox(scene: Scene) {
    //Skybox
    const skybox = MeshBuilder.CreateBox("skyBox", {size:150}, scene);
	  const skyboxMaterial = new StandardMaterial("skyBox", scene);
	  skyboxMaterial.backFaceCulling = false;
	  skyboxMaterial.reflectionTexture = new CubeTexture("textures/skybox", scene);
	  skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
	  skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
	  skyboxMaterial.specularColor = new Color3(0, 0, 0);
	  skybox.material = skyboxMaterial;
    return skybox;
  }
  
  function createBox(scene: Scene, x: number, y: number, z: number){
    let box: Mesh = MeshBuilder.CreateBox("box");
    box.position.x = x; 
    box.position.y = y; 
    box.position.z = z; 
    const boxAggregate = new PhysicsAggregate(box, PhysicsShapeType.BOX, { mass: 1 }, scene);
    return box; 
   } 
    
   function createGround(scene: Scene) {
    const ground: Mesh = MeshBuilder.CreateGround("ground", {height: 10, width: 10, 
   subdivisions: 4});
    const groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0}, 
   scene);
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
  export default function GameScene(engine: Engine) {
    interface SceneData {
      scene: Scene;
     box?: Mesh;
      light?: Light;
     sphere?: Mesh;
     ground?: Mesh;
     importMesh?: any;
     actionManager?: any;
      skybox?: Mesh;
      camera?: Camera;
    }
  
    let that: SceneData = { scene: new Scene(engine) };
    that.scene.debugLayer.show();
    //Initialise physics [MUST BE CALLED BEFORE FURTHER FUNCTIONS ARE CALLED]
    that.scene.enablePhysics(new Vector3(0, -9.8, 0), havokPlugin);
    //-------------------------------------
    let advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI", true);
    //let button1 = createSceneButton(that.scene, "butt1", "Start Game", "0px", "-75px", advancedTexture);

    //any further code goes here
    that.box = createBox(that.scene, 2, 2, 2);
   that.importMesh = importPlayerMesh(that.scene, that.box, 0, 0);
   that.actionManager = actionManager(that.scene);
    
    //--------------------------------------
    that.light = createLight(that.scene);
    that.skybox = createSkybox(that.scene);
    that.ground = createGround(that.scene);
    that.camera = createArcRotateCamera(that.scene);
    return that;
  }
