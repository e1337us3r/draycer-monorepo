import React from "react";
import history from "./history";
import firebase from "./auth/firebase";
import { Editor } from "draycer";
import {
  AmbientLight,
  Color,
  PointLight,
  MeshPhongMaterial,
  Mesh,
  SphereGeometry,
  BoxGeometry,
  ConeGeometry,
    Vector2
} from "three";
import * as axios from "axios";
import CONFIG from "../config";

class EditorUI extends React.Component {
  constructor() {
    super();

    this.state = {
      showResult: false
    };
  }
  componentDidMount() {
    //if (!firebase.auth().currentUser) history.push("/login");

    (async ()=> {
      this.imageCanvas = document.querySelector("#imageCanvas");
      this.editorCanvas = document.querySelector("#editorCanvas");
      this.WIDTH = this.imageCanvas.width;
      this.HEIGHT = this.imageCanvas.height;


      const mouse = new Vector2();
      this.editorCanvas.addEventListener( 'click', (event)=> {
        const rect = this.editorCanvas.getBoundingClientRect();
        const clientX = event.clientX - rect.left;
        const clientY = event.clientY - rect.top;

        mouse.x = ( clientX / this.editorCanvas.clientWidth) * 2 - 1;
        mouse.y = - ( clientY / this.editorCanvas.clientHeight ) * 2 + 1;
        this.EDITOR.selectObjects(mouse);
      }, false );

      this.EDITOR = new Editor();
      this.EDITOR.initialize(this.editorCanvas);

      this.EDITOR.addLightToScene(
        new AmbientLight(new Color(0.1, 0.1, 0.1), 0.8)
      );

      const animate = () => {
        requestAnimationFrame(animate);
        this.EDITOR.render();
      };

      animate();
    })()

  }

  renderScene = async () => {
    const scene = this.EDITOR.getRenderingScene().toJSON();
    scene.WIDTH = this.WIDTH;
    scene.HEIGHT = this.HEIGHT;

    await axios.post(CONFIG.serverUrl + "/scene", {scene});

    history.push("/tasks")
  };

  addSphere = () => {
    const object = new SphereGeometry(1, 20, 20);
    const material = new MeshPhongMaterial({
      color: 0x00ff00,
      reflectivity: 0.2
    });
    const sphere = new Mesh(object, material);
    sphere.position.set(0, 0, 0);
    this.EDITOR.addObjectToScene(sphere);
  };

  addCube = () => {
    const object = new BoxGeometry(1, 1, 1);

    const material = new MeshPhongMaterial({
      color: 0x00ff00,
      reflectivity: 0.2
    });
    const cube = new Mesh(object, material);
    cube.position.set(0, 0, 0);
    this.EDITOR.addObjectToScene(cube);
  };

  addPyramid = () => {
    const object = new ConeGeometry(1, 2, 5);

    const material = new MeshPhongMaterial({
      color: 0x00ff00,
      reflectivity: 0.2
    });
    const pyramid = new Mesh(object, material);
    pyramid.position.set(0, 0, 0);
    this.EDITOR.addObjectToScene(pyramid);
  };

  addLight = () => {
    const light = new PointLight(new Color(0.5, 0.5, 0.5), 0.8, 100);
    light.position.set(2, 2, 2);
    this.EDITOR.addLightToScene(light);
  };

  uploadSelectedModel = event => {
    this.EDITOR.uploadObjectToScene(event.target.files);
  };

  downloadRender = event => {
    event.target.href = this.imageCanvas.toDataURL("image/png");
  };
  openUploadDialog = () => {
    document.querySelector("#item-upload").click();
  };

  render() {
    return (
      <div>
        <div id="editor" className="container">
          <div className="row">
            <div id="stage" className="col-md-10">
              <canvas
                id="editorCanvas"
                width="900"
                height="600"
                hidden={this.state.showResult}
              />
              <canvas
                id="imageCanvas"
                width="900"
                height="600"
                hidden={!this.state.showResult}
              />
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
            <div className="row" style={{ padding: "15px" }}>
              <div className="col-md-4">
                <button
                  id="btn-render"
                  className="btn btn-secondary"
                  onClick={() => {
                    this.setState({showResult: false});
                    this.EDITOR.back();
                  }}
                  hidden={!this.state.showResult}
                >
                  Back
                </button>
              </div>
              <div className="col-md-4">
                <a
                  href="#"
                  className="btn btn-info"
                  id="btn-download"
                  download="result.png"
                  onClick={this.downloadRender}
                  hidden={!this.state.showResult}
                >
                  Download
                </a>
              </div>
              <div className="col-md-4">
                <button
                  id="btn-render"
                  className="btn btn-primary"
                  onClick={this.renderScene}
                  hidden={this.state.showResult}
                >
                  Render
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditorUI;
