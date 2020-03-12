import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import Editor from "./Editor";
import { MeshPhongMaterial, Mesh } from "three";

export default class ObjectUploader {
  private editor: Editor;

  public constructor(threeScene: Editor) {
    this.editor = threeScene;
  }

  public LoadModel(path: ArrayBuffer): void {
    const objLoader = new OBJLoader2();
    const object = objLoader.parse(path);
    object.position.set(0, 0, 0);
    const material = new MeshPhongMaterial({
      color: 0x00ff00,
      reflectivity: 1
    });
    (object.children[0] as Mesh).material = material;
    this.editor.addObjectToScene(object.children[0]);
  }

  public LoadMaterial(path: string): void {
    const mtrLoader = new MTLLoader();
    const material = mtrLoader.parse(path);
  }
}
