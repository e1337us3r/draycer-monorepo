import { Scene, ObjectLoader } from "three";
import Editor from "../Editor";

export default class SceneLoader {
  private static loader = new ObjectLoader();

  public static async load(sceneObj: any): Promise<Scene> {
    return new Promise((resolve, reject) => {
      this.loader.parse(sceneObj, scene => {
        // @ts-ignore

        for (const obj of scene.children) {
          obj.matrixWorld = obj.matrix;
        }

        const camera = scene.getObjectByName(Editor.NAME_CAMERA);
        // These attributes are missing from the exported camera obj and need to be set manually-
        // @ts-ignore
        camera.matrixWorldInverse = camera.userData.matrixWorldInverse;

        // @ts-ignore
        resolve(scene);
      });
    });
  }
}
