//TOP OF CODE
//IMPORTING BABYLONJS
import setSceneIndex from "./index" ;
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

  function createSceneButton(scene: Scene, name: string, index: string, x: string, y: string, advtex) {

    let button = GUI.Button.CreateSimpleButton(name, index);
        button.left = x;
        button.top = y;
        button.width = "160px";
        button.height = "60px"; 
        button.color = "white";
        button.cornerRadius = 20;
        button.background = "green";

        const buttonClick = new Sound("MenuClickSFX", "./audio/menu-click.wav", scene, null, {
          loop: false,
          autoplay: false,
        });

        button.onPointerUpObservable.add(function() {
            console.log("THE BUTTON HAS BEEN CLICKED");
            buttonClick.play();
            setSceneIndex(1);
        });
        advtex.addControl(button);
        return button;
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
  export default function MenusScene(engine: Engine) {
    interface SceneData {
      scene: Scene;
      light?: Light;
      skybox?: Mesh;
      camera?: Camera;
    }
  
    let that: SceneData = { scene: new Scene(engine) };
    that.scene.debugLayer.show();
    //Initialise physics [MUST BE CALLED BEFORE FURTHER FUNCTIONS ARE CALLED]
    
    //-------------------------------------
    let advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI", true);
    let button1 = createSceneButton(that.scene, "butt1", "Start Game", "0px", "-75px", advancedTexture);

    //any further code goes here
   
    
    //--------------------------------------
    that.light = createLight(that.scene);
    that.skybox = createSkybox(that.scene);
    that.camera = createArcRotateCamera(that.scene);
    return that;
  }
