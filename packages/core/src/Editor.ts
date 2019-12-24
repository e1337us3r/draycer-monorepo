import Scene from "./utils/Scene";
import * as THREE from "three";
import {
  AmbientLight,
  Light,
  PerspectiveCamera,
  PointLight,
  WebGLRenderer,
  Object3D,
  SphereGeometry
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import ObjectUploader from "./ObjectUploader";

export default class Editor {
  private editorCanvas: HTMLCanvasElement;
  private threeScene: THREE.Scene;
  private renderingScene: Scene;
  private orbitControls: OrbitControls;
  private transformControls: TransformControls;
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private isControllingLight = false;
  private helpers: Object3D[] = [];
  private objectLoader: ObjectUploader;

  public initialize(): void {
    this.editorCanvas = document.querySelector("#editorCanvas");
    this.threeScene = new THREE.Scene();
    this.objectLoader = new ObjectUploader(this);
    this.renderingScene = new Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.editorCanvas.width / this.editorCanvas.height,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.editorCanvas
    });

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    const gl = this.editorCanvas.getContext("webgl");
    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    // Near things obscure far things
    gl.depthFunc(gl.LEQUAL);
    // Clear the color as well as the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.camera.position.set(-5, 0, 0);

    const gridHelper = new THREE.GridHelper(5, 10);
    this.threeScene.add(gridHelper);
    this.helpers.push(gridHelper);

    this.orbitControls.update();

    this.transformControls = new TransformControls(
      this.camera,
      this.renderer.domElement
    );

    // Prevent camera and transfrom controls from interviening
    this.transformControls.addEventListener("dragging-changed", event => {
      this.orbitControls.enabled = !event.value;
      // Update transformed objects position in scene
      if (this.isControllingLight === true) {
        this.renderingScene.lights[
          this.renderingScene.lights.length - 1
        ].position.set(
          this.transformControls.object.position.x,
          this.transformControls.object.position.y,
          this.transformControls.object.position.z
        );
      } else {
        this.renderingScene.objects[
          this.renderingScene.objects.length - 1
        ].position.set(
          this.transformControls.object.position.x,
          this.transformControls.object.position.y,
          this.transformControls.object.position.z
        );
      }
    });
  }

  public back(): void {
    this.threeScene.add(...this.helpers)
  }

  private syncRenderingCamera(): void {
    this.renderingScene.camera = new THREE.Vector3(
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z
    );

    let vector = new THREE.Vector3();
    const zNearPlane = 0.1;

    // Top left corner
    vector.set(-1, 1, zNearPlane).unproject(this.camera);
    this.renderingScene.imagePlane.topLeft = new THREE.Vector3(
      vector.x,
      vector.y,
      vector.z
    );
    vector = new THREE.Vector3();
    // Top right corner
    vector.set(1, 1, zNearPlane).unproject(this.camera);
    this.renderingScene.imagePlane.topRight = new THREE.Vector3(
      vector.x,
      vector.y,
      vector.z
    );
    vector = new THREE.Vector3();
    // Bottom left corner
    vector.set(-1, -1, zNearPlane).unproject(this.camera);

    this.renderingScene.imagePlane.bottomLeft = new THREE.Vector3(
      vector.x,
      vector.y,
      vector.z
    );
    vector = new THREE.Vector3();
    // Bottom right corner
    vector.set(1, -1, zNearPlane).unproject(this.camera);

    this.renderingScene.imagePlane.bottomRight = new THREE.Vector3(
      vector.x,
      vector.y,
      vector.z
    );
  }

  public getRenderingScene(): Scene {
    this.syncRenderingCamera();
    // These object are for setting up the scene, should not be rendered
    this.threeScene.remove(...this.helpers);
    this.threeScene.remove(this.transformControls);
    console.log(this.threeScene.children);
    return this.renderingScene;
  }

  public getRenderingSceneThree(): THREE.Scene {
    return this.threeScene;
  }

  public addObjectToScene(object: Object3D): void {
    this.threeScene.add(object);
    this.renderingScene.addObject(object as THREE.Mesh);
    this.transformControls.attach(object);
    this.threeScene.add(this.transformControls);
    this.isControllingLight = false;
  }

  public addLightToScene(light: Light): void {
    this.threeScene.add(light);
    if (light instanceof PointLight) {
      this.renderingScene.addLight(light);

      // Add temp object to control light position
      const lightObj = new SphereGeometry(0.5);
      const material = new THREE.MeshPhongMaterial({
        color: 0xffff00,
        reflectivity: 1
      });
      const lightMesh = new THREE.Mesh(lightObj, material);
      this.helpers.push(lightMesh);
      this.threeScene.add(lightMesh);
      this.transformControls.attach(lightMesh);
      this.threeScene.add(this.transformControls);

      this.isControllingLight = true;
    } else if (light instanceof AmbientLight) {
      this.renderingScene.ia = light;
    }
  }

  public uploadObjectToScene(files: File[]): void {
    const reader = new FileReader();
    reader.onload = (): void => {
      const dataURL = reader.result;
      if (type[1] === "obj") {
        this.objectLoader.LoadModel(dataURL as ArrayBuffer);
      } else if (type[1] === "mtl") {
        this.objectLoader.LoadMaterial(dataURL as string);
      }
    };

    // @ts-ignore
    const type = (files[0].name as string).split(".");
    if (type[1] === "obj") {
      // @ts-ignore
      reader.readAsArrayBuffer(files[0]);
    } else if (type[1] === "mtl") {
      // @ts-ignore
      reader.readAsText(files[0]);
    }
  }

  public render(): void {
    this.orbitControls.update();
    this.renderer.render(this.threeScene, this.camera);
  }
}
