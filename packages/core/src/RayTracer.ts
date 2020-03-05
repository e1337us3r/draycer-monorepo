import * as THREE from "three";
import {
  Color,
  Mesh,
  Intersection,
  Vector3,
  AmbientLight,
  Light,
  PerspectiveCamera
} from "three";
import Editor from "./Editor";
import { Utils } from "./index";

const MAX_BOUNCES = 3;
const NUM_SAMPLES_PER_DIRECTION = 2;
const NUM_SAMPLES_PER_PIXEL =
  NUM_SAMPLES_PER_DIRECTION * NUM_SAMPLES_PER_DIRECTION;

export default class RayTracer {
  private threeScene: THREE.Scene;
  private readonly w: number;
  private readonly h: number;
  private readonly raycaster: THREE.Raycaster;
  private readonly ambient: Color;
  private readonly camera: PerspectiveCamera;
  private readonly lights: Light[] = [];
  private imagePlane: any;

  public constructor(threeScene: THREE.Scene, w: number, h: number) {
    this.threeScene = threeScene;
    this.w = w;
    this.h = h;

    // Optimization for ambient light calculations
    const ambient = threeScene.getObjectByName(
      Editor.NAME_AMBIENT
    ) as AmbientLight;
    this.ambient = ambient.color.clone().multiplyScalar(ambient.intensity);

    for (const obj of threeScene.children) {
      if (obj.name === Editor.NAME_LIGHT) {
        this.lights.push(obj as Light);
      }
    }

    this.raycaster = new THREE.Raycaster();

    this.camera = threeScene.getObjectByName(
      Editor.NAME_CAMERA
    ) as PerspectiveCamera;

    this.imagePlane = this.calculateImagePlane();
  }

  public tracedValueAtPixel(
    x: number,
    y: number
  ): { r: number; g: number; b: number } {
    const color = new Color(0, 0, 0);

    for (let dx = 0; dx < NUM_SAMPLES_PER_DIRECTION; dx++) {
      for (let dy = 0; dy < NUM_SAMPLES_PER_DIRECTION; dy++) {
        const ray = this.rayForPixel(
          x + dx / NUM_SAMPLES_PER_DIRECTION,
          y + dy / NUM_SAMPLES_PER_DIRECTION
        );

        const sample = this.tracedValueForRay(ray, MAX_BOUNCES);
        color.add(sample.clone().multiplyScalar(1 / NUM_SAMPLES_PER_PIXEL));
      }
    }

    return Utils.imageColorFromColor(color);
  }

  private tracedValueForRay(ray: THREE.Ray, depth: number): Color {
    this.raycaster.set(ray.origin, ray.direction);
    const intersection = this.raycaster.intersectObjects(
      this.threeScene.children
    )[0];

    if (intersection === undefined) {
      return new Color(0, 0, 0);
    }

    const normal = this.getNormalFromIntersection(intersection);

    const color = this.colorAtIntersection(intersection);

    if (depth > 0) {
      const v = ray.direction
        .clone()
        .multiplyScalar(-1)
        .normalize();
      const r = normal
        .clone()
        .multiplyScalar(2)
        .multiplyScalar(normal.dot(v))
        .sub(v);
      const reflectionRay = new THREE.Ray(
        intersection.point.clone().add(normal.clone().multiplyScalar(0.01)),
        r
      );

      const reflected = this.tracedValueForRay(reflectionRay, depth - 1);
      color.add(
        reflected
          .clone()
          .multiplyScalar(
            ((intersection.object as THREE.Mesh)
              .material as THREE.MeshPhongMaterial).reflectivity
          )
      );
    }

    return color;
  }

  private colorAtIntersection(intersection: THREE.Intersection): Color {
    const color = new Color(0, 0, 0);
    const material = (intersection.object as THREE.Mesh)
      .material as THREE.MeshPhongMaterial;

    const v = this.camera.position
      .clone()
      .sub(intersection.point)
      .normalize();

    const normal = this.getNormalFromIntersection(intersection);

    this.lights.forEach(light => {
      const l = light.position
        .clone()
        .sub(intersection.point)
        .normalize();

      const lightInNormalDirection = normal.dot(l);
      if (lightInNormalDirection < 0) {
        return;
      }

      const isShadowed = this.isPointInShadowFromLight(
        intersection.point,
        light
      );
      if (isShadowed) {
        return;
      }

      const diffuse = material.color
        .clone()
        .multiply(light.color)
        .multiplyScalar(lightInNormalDirection);
      color.add(diffuse);

      const r = normal
        .clone()
        .multiplyScalar(2)
        .multiplyScalar(lightInNormalDirection)
        .sub(l);

      const amountReflectedAtViewer = v.dot(r);
      const specular = material.specular
        .clone()
        .multiplyScalar(Math.pow(amountReflectedAtViewer, material.opacity));
      color.add(specular);
    });

    const ambient = material.color.clone().multiply(this.ambient);
    color.add(ambient);

    color.r = color.r < 0 ? 0 : color.r > 1 ? 1 : color.r;
    color.g = color.g < 0 ? 0 : color.g > 1 ? 1 : color.g;
    color.b = color.b < 0 ? 0 : color.b > 1 ? 1 : color.b;

    return color;
  }

  private isPointInShadowFromLight(
    point: THREE.Vector3,
    light: Light
  ): boolean {
    const shadowRay = new THREE.Ray(point, light.position.clone().sub(point));

    this.raycaster.set(shadowRay.origin, shadowRay.direction.normalize());
    const intersections = this.raycaster.intersectObjects(
      this.threeScene.children
    );

    return intersections.length > 0 /** && intersections[0].distance <= 1**/;
  }

  private rayForPixel(x: number, y: number): THREE.Ray {
    const xt = x / this.w;
    const yt = (this.h - y - 1) / this.h;

    const top = new THREE.Vector3().lerpVectors(
      this.imagePlane.topLeft,
      this.imagePlane.topRight,
      xt
    );

    const bottom = new THREE.Vector3().lerpVectors(
      this.imagePlane.bottomLeft,
      this.imagePlane.bottomRight,
      xt
    );

    const point = new THREE.Vector3().lerpVectors(bottom, top, yt);
    return new THREE.Ray(
      point,
      point
        .clone()
        .sub(this.camera.position)
        .normalize()
    );
  }

  private calculateImagePlane(): object {
    const imagePlane: any = {};
    let vector = new THREE.Vector3();
    const zNearPlane = 0.1;

    // Top left corner
    vector.set(-1, 1, zNearPlane).unproject(this.camera);
    imagePlane.topLeft = new THREE.Vector3(vector.x, vector.y, vector.z);
    vector = new THREE.Vector3();
    // Top right corner
    vector.set(1, 1, zNearPlane).unproject(this.camera);
    imagePlane.topRight = new THREE.Vector3(vector.x, vector.y, vector.z);
    vector = new THREE.Vector3();
    // Bottom left corner
    vector.set(-1, -1, zNearPlane).unproject(this.camera);

    imagePlane.bottomLeft = new THREE.Vector3(vector.x, vector.y, vector.z);
    vector = new THREE.Vector3();
    // Bottom right corner
    vector.set(1, -1, zNearPlane).unproject(this.camera);

    imagePlane.bottomRight = new THREE.Vector3(vector.x, vector.y, vector.z);

    return imagePlane;
  }

  private getNormalFromIntersection(intersection: Intersection): Vector3 {
    const mesh = intersection.object as Mesh;
    return mesh.geometry.type === "SphereGeometry"
      ? intersection.point.clone().sub(mesh.position)
      : intersection.face.normal;
  }
}
