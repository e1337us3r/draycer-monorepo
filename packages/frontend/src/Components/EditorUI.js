import React from "react";
import history from "./history";
import firebase from "./auth/firebase";
import { RayTracer, Image, Editor, Utils } from "draycer";
import {
  AmbientLight,
  Color,
  PointLight,
  MeshPhongMaterial,
  Mesh,
  SphereGeometry,
  CylinderGeometry,
  BoxGeometry
} from "three";

class EditorUI extends React.Component {
  constructor() {
    super();

    this.addSphere = this.addSphere.bind(this);
    this.addLight = this.addLight.bind(this);
    this.renderScene = this.renderScene.bind(this);
    this.addCube = this.addCube.bind(this);
    this.addPyramid = this.addPyramid.bind(this);
  }
  componentDidMount() {
    //if (!firebase.auth().currentUser) history.push("/login");

    this.imageCanvas = document.querySelector("#imageCanvas");
    this.editorCanvas = document.querySelector("#editorCanvas");
    this.WIDTH = this.imageCanvas.width;
    this.HEIGHT = this.imageCanvas.height;

    this.EDITOR = new Editor();
    this.EDITOR.initialize();

    this.EDITOR.addLightToScene(
      new AmbientLight(new Color(0.1, 0.1, 0.1), 0.5)
    );

    const animate = () => {
      requestAnimationFrame(animate);
      this.EDITOR.render();
    };
    animate();
  }

  renderScene() {
    const tracer = new RayTracer(
      this.EDITOR.getRenderingScene(),
      this.EDITOR.getRenderingSceneThree(),
      this.WIDTH,
      this.HEIGHT
    );
    this.editorCanvas.style.display = "none";
    this.imageCanvas.style.display = "block";
    const image = new Image(this.imageCanvas);
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        image.putPixel(
          x,
          y,
          Utils.imageColorFromColor(tracer.tracedValueAtPixel(x, y))
        );
      }
    }
    image.renderInto(this.imageCanvas);
  }

  addSphere() {
    const object = new SphereGeometry(1, 20, 20);
    const material = new MeshPhongMaterial({
      color: 0x00ff00,
      reflectivity: 0.5
    });
    const sphere = new Mesh(object, material);
    sphere.position.set(0, 0, 0);
    console.log(sphere);
    this.EDITOR.addObjectToScene(sphere);
  }

  addCube() {
    const object = new BoxGeometry(1, 1, 1);

    const material = new MeshPhongMaterial({
      color: 0x00ff00,
      reflectivity: 1
    });
    const cube = new Mesh(object, material);
    cube.position.set(0, 0, 0);
    this.EDITOR.addObjectToScene(cube);
  }

  addPyramid() {
    const object = new CylinderGeometry(0, 2, 2, 4, 1);

    const material = new MeshPhongMaterial({
      color: 0x00ff00,
      reflectivity: 1
    });
    const pyramid = new Mesh(object, material);
    pyramid.position.set(0, 0, 0);
    this.EDITOR.addObjectToScene(pyramid);
  }

  addLight() {
    const light = new PointLight(new Color(0.5, 0.5, 0.5), 0.8, 100);
    light.position.set(2, 2, 2);
    this.EDITOR.addLightToScene(light);
  }

  uploadSelectedModel(event) {
    this.EDITOR.uploadObjectToScene(event.target.files);
  }

  downloadRender(event) {
    event.target.href = this.imageCanvas.toDataURL("image/png");
  }
  openUploadDialog() {
    document.querySelector("#item-upload").click();
  }

  render() {
    return (
      <div>
        <div id="editor" className="container">
          <div className="row">
            <div id="stage" className="col-md-10">
              <canvas id="editorCanvas" width="900" height="600" />
              <canvas id="imageCanvas" width="900" height="600" />
            </div>
            <div id="toolbar" className="col-md-2">
              <div className="row">
                <div className="col-md-4 ">
                  <i
                    className="material-icons-outlined item"
                    onClick={this.addCube}
                  >
                    crop_din{" "}
                  </i>
                </div>
                <div className="col-md-4">
                  <i
                    id="item-sphere"
                    className="material-icons-outlined item"
                    onClick={this.addSphere}
                  >
                    brightness_1
                  </i>
                </div>
                <div className="col-md-4">
                  <i
                    className="material-icons-outlined item"
                    onClick={this.addPyramid}
                  >
                    change_history{" "}
                  </i>
                </div>
                <div className="col-md-4">
                  <input
                    type="file"
                    name="files[]"
                    id="item-upload"
                    accept=".obj"
                    hidden={true}
                    onChange={this.uploadSelectedModel}
                  />

                  <i
                    className="material-icons-outlined item"
                    id="item-upload-button"
                    title="Upload obj file"
                    onClick={this.openUploadDialog}
                  >
                    cloud_upload{" "}
                  </i>
                </div>
                <div className="col-md-4">
                  <i
                    id="item-light"
                    className="material-icons-outlined item"
                    onClick={this.addLight}
                  >
                    wb_incandescent{" "}
                  </i>
                </div>
              </div>
            </div>
          </div>
          <button
            id="btn-render"
            className="btn btn-primary"
            onClick={this.renderScene}
          >
            Render
          </button>
          <a
            href="#"
            className="btn btn-primary"
            id="btn-download"
            download="result.png"
            onClick={this.downloadRender}
          >
            Download
          </a>
        </div>
      </div>
    );
  }
}

export default EditorUI;
