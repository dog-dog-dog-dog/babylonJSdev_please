# element01
Element 01 is comprised of a textured sphere and a rotating box.
The sphere texture is sourced from https://pixabay.com/photos/feather-pattern-texture-form-4431599/
 ```typescript
 //rotate the box
 // new animation
 const rotate = new Animation(
      "rotationAnimation",
      "rotation.y",//rotation axis
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
    scene.beginAnimation(box, 0, 100, true);//begin animation
```
This code takes the boks and rotates it on it's y axis.

The following code applies a texture to the sphere
```typescript
//give sphere texture
    const material = new StandardMaterial("sphereMaterial", scene);
    material.diffuseTexture = new Texture("assets/spheretex.jpg", scene); //specify texture location
    sphere.material = material;
```
# element02
This element focuses on a village scene with cloned houses and tree sprites.
```typescript
 //skybox creation, specify skybox texture and size
  function createSkybox(scene: Scene) {
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
``` 
# element03
This scene uses player mesh, a model and havok physics to create an interactive element. This element is focused on physics collision between the player mesh and a box.
The box can be pushed around through player collision.
```typescript
 //physics collision
      item = mesh;
      let playerAggregate = new PhysicsAggregate(item, PhysicsShapeType.CAPSULE, { mass: 0}, scene);
      playerAggregate.body.disablePreStep = false;
```
# element04
Element 4 is comprised of two scenes. A menu scene and a game scene. When the start button is clicked on the menu scene, the scene transistions to the game scene.
The game scene is the same as element 03, an interactive element with physics collision.
```typescript
//game scene
 //physics collision
      item = mesh;
      let playerAggregate = new PhysicsAggregate(item, PhysicsShapeType.CAPSULE, { mass: 0}, scene);
      playerAggregate.body.disablePreStep = false;
```

```typescript
//menu scene
function createSceneButton(scene: Scene, name: string, index: string, x: string, y: string, advtex) {

    let button = GUI.Button.CreateSimpleButton(name, index);
        button.left = x;
        button.top = y;
        button.width = "160px";
        button.height = "60px"; 
        button.color = "white";//button color and styling
        button.cornerRadius = 20;
        button.background = "green";

        const buttonClick = new Sound("MenuClickSFX", "./audio/menu-click.wav", scene, null, {//when the button is clicked, play sound
          loop: false,
          autoplay: false,
        });
```
# element05
Element 05 is a multi-scene element comprising of a menu scene and a game scene. Once the start button is clicked, the scene transistions to a village scene with a controllable player mesh.

```typescript
function createSceneButton(scene: Scene, name: string, index: string, x: string, y: string, advtex) {

    let button = GUI.Button.CreateSimpleButton(name, index);
        button.left = x;
        button.top = y;
        button.width = "160px";
        button.height = "60px"; 
        button.color = "white";
        button.cornerRadius = 20;
        button.background = "green";
        // create the menu with a button
        const buttonClick = new Sound("MenuClickSFX", "./audio/menu-click.wav", scene, null, {
          loop: false,
          autoplay: false,
        });//sound plays on click

        button.onPointerUpObservable.add(function() {
            console.log("THE BUTTON HAS BEEN CLICKED");
            buttonClick.play();
            setSceneIndex(1);
        });//log when the button is clicked
        advtex.addControl(button);
        return button;
 }
```

```typescript
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
    //skeleton player mesh
```
```typescript
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
       //if a directional key is being pressed, move in the corresponding direction
```

```typescript
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
```

```typescript
 function createSkybox(scene: Scene) {
    //skybox creation
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

   //sprite trees
  function createTrees(scene: Scene) {
    const spriteManagerTrees = new SpriteManager("treesManager", "textures/palmtree.png", 2000, {width: 512, height: 1024}, scene);

    //create trees random positions
    for (let i = 0; i < 500; i++) {
        const tree = new Sprite("tree", spriteManagerTrees);
        tree.position.x = Math.random() * (-30);
        tree.position.z = Math.random() * 20 + 8;
        tree.position.y = 0.5;
    }

    for (let i = 0; i < 500; i++) {
        const tree = new Sprite("tree", spriteManagerTrees);
        tree.position.x = Math.random() * (25) + 7;
        tree.position.z = Math.random() * -35  + 8;
        tree.position.y = 0.5;
    }
    return spriteManagerTrees;
  }
```

```typescript
//different images on each side
    const faceUV: Vector4[] = [];
    if (width == 2) {
      faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); //rear face
      faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
      faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
      faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
    }
    else {
      faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
      faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
      faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
      faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
    }
    //only need 4 faces, can't see top and bottom
```
  
