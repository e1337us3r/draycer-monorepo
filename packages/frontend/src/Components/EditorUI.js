import React from "react";
import history from "./history";
import firebase from "./auth/firebase";
import { Editor, RayTracer, Image } from "draycer";
import {
  Color,
  PointLight,
  MeshPhongMaterial,
  Mesh,
  SphereGeometry,
  BoxGeometry,
  ConeGeometry,
  Vector2, DirectionalLight
} from "three";
import axios from "axios";
import CONFIG from "../config";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";

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

      const animate = () => {
        requestAnimationFrame(animate);
        this.EDITOR.render();
      };

      animate();
    })()

  }

  renderScene = async (option) => {

    const scene = this.EDITOR.getRenderingScene();
    console.log(scene);
    const sceneJson = scene.toJSON();
    sceneJson.WIDTH = this.WIDTH;
    sceneJson.HEIGHT = this.HEIGHT;

    if (option > 0)
    await axios.post(CONFIG.serverUrl + "/scene", {scene: sceneJson});

    if (option === 1)
      history.push("/tasks");
    else {
      const tracer = new RayTracer(
        scene,
        this.WIDTH,
        this.HEIGHT
      );
      await tracer.loadTextures();
      const image = new Image(this.imageCanvas);
      for (let y = 0; y < this.HEIGHT; y++) {
        for (let x = 0; x < this.WIDTH; x++) {
          image.putPixel(
            x,
            y,
            tracer.tracedValueAtPixel(x, y)
          );
        }
        image.renderInto(this.imageCanvas);
      }

      this.setState({showResult : true})
    }

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
    if (event.target.files)
    this.EDITOR.uploadObjectToScene(event.target.files);
  };

  uploadSelectedTexture = event =>{
    if (event.target.files[0])
        this.EDITOR.setTextureSelected(URL.createObjectURL(event.target.files[0]));
    };
  
  downloadRender = event => {
    event.target.href = this.imageCanvas.toDataURL("image/png");
  };
  openUploadDialog = () => {
    document.querySelector("#item-upload").click();
  };

  clickUploadSelectedTexture = () => {
    document.querySelector("#texture-upload").click();
  }

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

             <input
               type="file"
               name="files[]"
               id="texture-upload"
               hidden={true}
                accept="image/*"
                onChange={this.uploadSelectedTexture}
            />

                <div className="col-md-4">
                  <i
                    id="item-texture"
                    className="material-icons-outlined item"
                    onClick={this.clickUploadSelectedTexture}
                  >
                    texture{" "}
                  </i>
                </div>
          
              </div>
            </div>
            <div className="row col-md-10" style={{ padding: "15px" }}>
              <div className="col-md-4">
                <button
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
                <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group" style={{maxHeight: "75px"}}>
                  <Button
                    style={{marginRight: "10px"}}
                    hidden={this.state.showResult}
                    onClick={() => this.renderScene(0)}>Client Render</Button>
                  <Button
                    style={{marginRight: "10px"}}
                    hidden={this.state.showResult}
                    onClick={() => this.renderScene(1)}>Server Render</Button>
                  <Button
                    hidden={this.state.showResult}
                    onClick={() => this.renderScene(2)}>Client & Server Render</Button>
                </ButtonGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditorUI;
