import * as THREE from "three";
import { AmbientLight, PointLight } from "three";

export default class Scene {
  public camera: THREE.Vector3;
  // @ts-ignore
  public imagePlane: {
    topLeft: THREE.Vector3;
    topRight: THREE.Vector3;
    bottomLeft: THREE.Vector3;
    bottomRight: THREE.Vector3;
  } = {};
  public ia: AmbientLight;
  public lights: PointLight[] = [];
  public objects: THREE.Mesh[] = [];

  public addLight(light: PointLight): void {
    this.lights.push(light);
  }

  public addObject(object: THREE.Mesh): void {
    this.objects.push(object);
  }
}
