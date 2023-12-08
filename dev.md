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
# element03
This scene uses player mesh, a model and havok physics to create an interactive element. This element is focused on physics collision between the player mesh and a box.
The box can be pushed around through player collision.
# element04
Element 4 is comprised of two scenes. A menu scene and a game scene. When the start button is clicked on the menu scene, the scene transistions to the game scene.
The game scene is the same as element 03, an interactive element with physics collision.
# element05
Element 05 is a multi-scene element comprising of a menu scene and a game scene. Once the start button is clicked, the scene transistions to a village scene with a controllable player mesh.

```typescript
// syntax highligted javascript
```