import { Scene, ObjectLoader } from "three";

export default class SceneLoader {
  private static loader = new ObjectLoader();

  public static async load(sceneObj: any): Promise<Scene> {
    return new Promise((resolve, reject) => {
      this.loader.parse(sceneObj, scene => {
        // @ts-ignore
        resolve(scene);
      });
    });
  }
}
