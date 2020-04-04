import {
  AmbientLight,
  Light,
  PerspectiveCamera,
  PointLight,
  WebGLRenderer,
  Object3D,
  SphereGeometry,
  Scene,
  Vector2,
  Raycaster,
  GridHelper,
  PCFShadowMap,
  MeshPhongMaterial,
  Mesh,
  Math as ThreeMath,
  TextureLoader,
    Color
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
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

      // These attributes are missing from the exported camera obj and need to be set manually
      this.camera.matrixWorld = this.camera.matrix;
      this.camera.matrixWorldInverse = this.camera.userData.matrixWorldInverse;
    } else {
      this.camera = new PerspectiveCamera(
        75,
        this.editorCanvas.width / this.editorCanvas.height,
        0.1,
        1000
      );

      this.camera.name = Editor.NAME_CAMERA;
      this.scene.add(this.camera);
    }

    this.renderer = new WebGLRenderer({
      antialias: true,
      canvas: this.editorCanvas
    });

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFShadowMap;

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

    const gridHelper = new GridHelper(5, 10);
    this.scene.add(gridHelper);
    this.helpers.push(gridHelper);

    this.orbitControls.update();

    this.transformControls = new TransformControls(
      this.camera,
      this.renderer.domElement
    );
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
        object.light.position.set(
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
        case 87: // W
          this.transformControls.setMode("translate");
          break;
        case 69: // E
          this.transformControls.setMode("rotate");
          break;
        case 82: // R
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

    return this.scene;
  }

  public getRenderingSceneThree(): Scene {
    return this.scene;
  }

  public addObjectToScene(object: Object3D): void {
    this.scene.add(object);

    this.attachTransformController(object);
  }

  public addLightToScene(light: Light): void {
    if (light instanceof PointLight) {
      light.name = Editor.NAME_LIGHT;

      // Add temp object to control light position
      const lightObj = new SphereGeometry(0.2);
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

  public setTextureDefault(): void {
    // eslint-disable-next-line eqeqeq
    if (this.selectedObject == undefined) {
      return;
    }

    const defaultTex = this.textureLoader.load(
      "https://images.designtrends.com/wp-content/uploads/2016/09/17145735/Soccer-ball-Texture1.jpg"
    );

    this.selectedObject.traverse(childObj => {
      if (!(childObj instanceof Mesh)) {
        return;
      }
      (childObj.material as MeshPhongMaterial).map = defaultTex;
      (childObj.material as MeshPhongMaterial).color = new Color(1, 1, 1);
      (childObj.material as MeshPhongMaterial).needsUpdate = true;
    });
  }

  public selectObjects(mouseClickedPosition: Vector2): void {
    this.rayCaster.setFromCamera(mouseClickedPosition, this.camera);

    const objects = this.scene.children.filter((value: any) => {
      if (!(value instanceof GridHelper)) {
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
