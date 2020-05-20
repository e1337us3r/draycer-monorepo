import {
  AmbientLight,
  Color,
  GridHelper,
  Light,
  Math as ThreeMath,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  PCFShadowMap,
  PerspectiveCamera,
  Raycaster,
  Scene,
  SphereGeometry,
  TextureLoader,
  Vector2,
  WebGLRenderer,
  LinearFilter,
  BackSide,
  BoxBufferGeometry,
  ShaderMaterial,
  ShaderLib,
  MeshBasicMaterial,
  DirectionalLight,
  ConeGeometry,
  DirectionalLightHelper,
  Vector3
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";
import ObjectUploader from "./ObjectUploader";

export default class Editor {
  public static NAME_AMBIENT = "ambient";
  public static NAME_LIGHT = "light";
  public static NAME_CAMERA = "camera";
  public static NAME_LIGHT_HELPER = "light_helper";

  private editorCanvas: HTMLCanvasElement;
  private scene: Scene;
  private orbitControls: OrbitControls;
  private transformControls: TransformControls;
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private helpers: Object3D[] = [];
  private objectLoader: ObjectUploader;
  private textureLoader: TextureLoader;
  private selectedObject: Object3D;
  private rayCaster: Raycaster;
  private skybox: Mesh;

  public initialize(editorCanvas: HTMLCanvasElement, scene?: Scene): void {
    this.editorCanvas = editorCanvas;
    this.scene = scene ? scene : new Scene();
    this.objectLoader = new ObjectUploader(this);
    this.textureLoader = new TextureLoader();
    this.rayCaster = new Raycaster();
    if (scene) {
      this.camera = scene.getObjectByName(
        Editor.NAME_CAMERA
      ) as PerspectiveCamera;

      scene.remove(this.camera);
    }

    this.camera = new PerspectiveCamera(
      75,
      this.editorCanvas.width / this.editorCanvas.height,
      0.1,
      1000
    );

    this.camera.name = Editor.NAME_CAMERA;
    this.scene.add(this.camera);

    // Camera controls does not work without this line
    this.camera.position.set(-5, 5, 5);
    this.setUpRenderer();
    this.addSkybox(
      "https://cors-anywhere.herokuapp.com/https://wallpaperaccess.com/full/945996.jpg"
    );
    this.setUpGridHelper();
    this.setUpControls();
  }

  private setUpGridHelper(): void {
    const gridHelper = new GridHelper(5, 10);
    gridHelper.material = new MeshBasicMaterial({ color: new Color(0, 0, 0) });
    this.scene.add(gridHelper);
    this.helpers.push(gridHelper);
  }

  private setUpControls(): void {
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    this.orbitControls.update();

    this.transformControls = new TransformControls(
      this.camera,
      this.renderer.domElement
    );
  }

  private setUpRenderer(): void {
    const renderer = new WebGLRenderer({
      antialias: true,
      canvas: this.editorCanvas
    });

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap;

    const gl = this.editorCanvas.getContext("webgl");
    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    // Near things obscure far things
    gl.depthFunc(gl.LEQUAL);
    // Clear the color as well as the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.renderer = renderer;
  }

  public addSkybox(imgUrl: string): void {
    const texture = this.textureLoader.load(imgUrl);
    texture.magFilter = LinearFilter;
    texture.minFilter = LinearFilter;

    const shader = ShaderLib.equirect;
    const material = new ShaderMaterial({
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      depthWrite: false,
      side: BackSide
    });
    material.uniforms.tEquirect.value = texture;
    const plane = new BoxBufferGeometry(20, 20, 20);
    this.skybox = new Mesh(plane, material);
    this.helpers.push(this.skybox);
    this.scene.add(this.skybox);
  }

  public attachTransformController(object: Object3D): void {
    this.scene.remove(this.transformControls);
    this.transformControls.detach();
    this.transformControls.dispose();

    this.transformControls = new TransformControls(
      this.camera,
      this.renderer.domElement
    );

    // Prevent camera and transfrom controls from interviening
    this.transformControls.addEventListener("dragging-changed", event => {
      this.orbitControls.enabled = !event.value;

      if (object.name === Editor.NAME_LIGHT_HELPER) {
        // @ts-ignore
        const light = object.light;
        light.position.set(
          object.position.x,
          object.position.y,
          object.position.z
        );
      }
    });

    this.transformControls.attach(object);
    this.scene.add(this.transformControls);

    // @ts-ignore
    window.addEventListener("keydown", event => {
      switch (event.keyCode) {
        case 81: // Q
          this.transformControls.setSpace(
            this.transformControls.space === "local" ? "world" : "local"
          );
          break;
        case 17: // Ctrl
          this.transformControls.setTranslationSnap(100);
          this.transformControls.setRotationSnap(ThreeMath.degToRad(15));
          break;
        case 84: // T
          this.transformControls.setMode("translate");
          break;
        case 82: // R
          this.transformControls.setMode("rotate");
          break;
        case 83: // S
          this.transformControls.setMode("scale");
          break;
        case 187:
        case 107: // +, =, num+
          this.transformControls.setSize(this.transformControls.size + 0.1);
          break;
        case 189:
        case 109: // -, _, num-
          this.transformControls.setSize(
            Math.max(this.transformControls.size - 0.1, 0.1)
          );
          break;
        case 88: // X
          this.transformControls.showX = !this.transformControls.showX;
          break;
        case 89: // Y
          this.transformControls.showY = !this.transformControls.showY;
          break;
        case 90: // Z
          this.transformControls.showZ = !this.transformControls.showZ;
          break;
        case 32: // Spacebar
          this.transformControls.enabled = !this.transformControls.enabled;
          break;
        case 46: // Delete
          this.transformControls.detach();
          this.scene.remove(this.selectedObject);
          break;
      }
    });
  }

  public back(): void {
    this.scene.add(...this.helpers);
  }

  public getRenderingScene(): Scene {
    // These object are for setting up the scene, should not be rendered
    this.scene.remove(...this.helpers);
    this.scene.remove(this.transformControls);

    // This attribute does not get exported when toJSON() is called
    // So it needs to be added manually
    this.camera.userData.matrixWorldInverse = this.camera.matrixWorldInverse;

    // These properties are not saved in toJSON method so they have to be manually saved
    for (const child of this.scene.children) {
      // @ts-ignore
      if (child.material) {
        // @ts-ignore
        child.userData.reflectivity = child.material.reflectivity;
        // @ts-ignore
        child.userData.refractionRatio = child.material.refractionRatio;
      }
    }

    return this.scene;
  }

  public getRenderingSceneThree(): Scene {
    return this.scene;
  }

  public addObjectToScene(object: Object3D): void {
    this.scene.add(object);

    this.selectedObject = object;
    this.attachTransformController(object);
  }

  public addLightToScene(light: Light): void {
    if (light instanceof AmbientLight) {
      light.name = Editor.NAME_AMBIENT;
    } else {
      light.name = Editor.NAME_LIGHT;

      // Add temp object to control light position
      let lightObj: any = new SphereGeometry(0.2);

      if (light instanceof DirectionalLight) {
        lightObj = new ConeGeometry(0.5, 1, 2.5);

        const helper = new DirectionalLightHelper(light, 5, new Color(0, 0, 0));
        this.helpers.push(helper);
        this.addObjectToScene(helper);
      }

      const material = new MeshPhongMaterial({
        color: 0xffff00,
        reflectivity: 1
      });
      const lightMesh = new Mesh(lightObj, material);

      // Add light to mesh so that it can later be associated
      // @ts-ignore
      lightMesh.light = light;
      lightMesh.name = Editor.NAME_LIGHT_HELPER;

      this.helpers.push(lightMesh);

      this.addObjectToScene(lightMesh);
    }

    this.scene.add(light);
  }

  public uploadObject(path: string): void {
    const objLoader = new OBJLoader2();
    objLoader.load(path, object3d => {
      object3d.position.set(0, 0, 0);
      const material = new MeshPhongMaterial({
        color: 0x00ff00,
        reflectivity: 1
      });
      (object3d.children[0] as Mesh).material = material;
      this.addObjectToScene(object3d.children[0]);
    });
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
    const type = files[0].name.split(".");
    if (type[1] === "obj") {
      // @ts-ignore
      reader.readAsArrayBuffer(files[0]);
    } else if (type[1] === "mtl") {
      // @ts-ignore
      reader.readAsText(files[0]);
    }
  }

  // Public uploadTexture(files: File[]): void {
  // This.textureLoader.getTextureLoading()
  // }

  public setTextureSelected(path: string): void {
    if (!(this.selectedObject instanceof Mesh)) {
      return;
    }
    const texture = this.textureLoader.load(path);

    this.selectedObject.traverse(childObj => {
      if (!(childObj instanceof Mesh)) {
        return;
      }
      (childObj.material as MeshPhongMaterial).map = texture;
      (childObj.material as MeshPhongMaterial).color = new Color(1, 1, 1);
      (childObj.material as MeshPhongMaterial).needsUpdate = true;
    });
  }

  public selectObjects(mouseClickedPosition: Vector2): void {
    this.rayCaster.setFromCamera(mouseClickedPosition, this.camera);

    const objects = this.scene.children.filter((value: any) => {
      if (!(value instanceof GridHelper || value === this.skybox)) {
        return value;
      }
    });

    const intersects = this.rayCaster.intersectObjects(objects)[0];

    if (intersects !== undefined) {
      this.selectedObject = intersects.object;
      this.attachTransformController(intersects.object);
    }
  }

  public render(): void {
    this.orbitControls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
