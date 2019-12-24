import * as THREE from "three";
import {
  AmbientLight,
  Light,
  PerspectiveCamera,
  PointLight,
  WebGLRenderer,
  Object3D,
  SphereGeometry, Scene
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import ObjectUploader from "./ObjectUploader";

export default class Editor {
  public static NAME_AMBIENT = "ambient";
  public static NAME_LIGHT = "light";
  public static NAME_CAMERA = "camera";

  private editorCanvas: HTMLCanvasElement;
  private scene: Scene;
  private orbitControls: OrbitControls;
  private transformControls: TransformControls;
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private helpers: Object3D[] = [];
  private objectLoader: ObjectUploader;

  public initialize(): void {
    this.editorCanvas = document.querySelector("#editorCanvas");
    this.scene = new THREE.Scene();
    this.objectLoader = new ObjectUploader(this);

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.editorCanvas.width / this.editorCanvas.height,
      0.1,
      1000
    );

    this.camera.name = Editor.NAME_CAMERA;

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
    this.scene.add(gridHelper);
    this.helpers.push(gridHelper);

    this.orbitControls.update();

    this.transformControls = new TransformControls(
      this.camera,
      this.renderer.domElement
    );

    // Prevent camera and transfrom controls from interviening
    this.transformControls.addEventListener("dragging-changed", event => {
      this.orbitControls.enabled = !event.value;
    });
  }

  public back(): void {
    this.scene.add(...this.helpers)
  }

  public getRenderingScene(): Scene {
    // These object are for setting up the scene, should not be rendered
    this.scene.remove(...this.helpers);
    this.scene.remove(this.transformControls);
    console.log(this.scene.children);
    return this.scene;
  }

  public getRenderingSceneThree(): THREE.Scene {
    return this.scene;
  }

  public addObjectToScene(object: Object3D): void {
    this.scene.add(object);
    this.transformControls.attach(object);
    this.scene.add(this.transformControls);
  }

  public addLightToScene(light: Light): void {
    if (light instanceof PointLight) {
      light.name = Editor.NAME_LIGHT;

      // Add temp object to control light position
      const lightObj = new SphereGeometry(0.2);
      const material = new THREE.MeshPhongMaterial({
        color: 0xffff00,
        reflectivity: 1
      });
      const lightMesh = new THREE.Mesh(lightObj, material);
      this.helpers.push(lightMesh);
      this.scene.add(lightMesh);
      this.transformControls.attach(lightMesh);
      this.scene.add(this.transformControls);

    } else if (light instanceof AmbientLight) {
      light.name = Editor.NAME_AMBIENT;
    }

    this.scene.add(light);
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
    this.renderer.render(this.scene, this.camera);
  }
}
