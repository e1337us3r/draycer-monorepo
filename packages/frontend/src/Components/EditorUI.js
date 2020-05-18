import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Editor, RayTracer, Image, SceneLoader } from "draycer";
import {
  Color,
  PointLight,
  DirectionalLight,
  MeshPhongMaterial,
  Mesh,
  SphereGeometry,
  BoxGeometry,
  ConeGeometry,
  Vector2,
} from "three";
import axios from "axios";
import CONFIG from "../config";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import { Paper, TextField, Popover } from "@material-ui/core";
import CropDinIcon from "@material-ui/icons/CropDin";
import Brightness1Icon from "@material-ui/icons/Brightness1";
import ChangeHistoryIcon from "@material-ui/icons/ChangeHistory";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import TextureIcon from "@material-ui/icons/Texture";
import styled from "styled-components";
import { SketchPicker } from "react-color";
const P = styled.p`
  color: #539ffe;
`;

const EditorUI = () => {
  const [showResult, setShowResult] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [imageCanvas, setImageCanvas] = useState();
  const [editorCanvas, setEditorCanvas] = useState();
  const [WIDTH, setWIDTH] = useState();
  const [HEIGHT, setHEIGHT] = useState();
  const [EDITOR, setEDITOR] = useState({});
  const editorRendered = useRef(false);
  const history = useHistory();

  useEffect(() => {
    setImageCanvas(document.querySelector("#imageCanvas"));
    setEditorCanvas(document.querySelector("#editorCanvas"));
    setEDITOR(new Editor());
  }, []);

  useEffect(() => {
    const setCanvas = async () => {
      setWIDTH(imageCanvas.width);
      setHEIGHT(imageCanvas.height);

      const mouse = new Vector2();
      editorCanvas.addEventListener(
        "click",
        (event) => {
          const rect = editorCanvas.getBoundingClientRect();
          const clientX = event.clientX - rect.left;
          const clientY = event.clientY - rect.top;
          mouse.x = (clientX / editorCanvas.clientWidth) * 2 - 1;
          mouse.y = -(clientY / editorCanvas.clientHeight) * 2 + 1;
          EDITOR.selectObjects(mouse);
          if (editorRendered.current && EDITOR?.selectedObject) {
            setSelectedObject(EDITOR.selectedObject.material);
            console.log("test", EDITOR.selectedObject);
          }
        },
        false
      );

      EDITOR.initialize(editorCanvas);

      const animate = () => {
        requestAnimationFrame(animate);
        EDITOR.render();
      };

      animate();
    };
    if (imageCanvas) {
      setCanvas();
      editorRendered.current = true;
    }
  }, [EDITOR, editorCanvas, imageCanvas]);

  const renderScene = async (option) => {
    const scene = EDITOR.getRenderingScene();
    console.log(scene);
    const sceneJson = scene.toJSON();
    sceneJson.WIDTH = WIDTH;
    sceneJson.HEIGHT = HEIGHT;

    if (option > 0)
      await axios.post(CONFIG.serverUrl + "/scene", { scene: sceneJson });

    if (option === 1) history.push("/tasks");
    else {
      const tracer = new RayTracer(scene, WIDTH, HEIGHT);
      await tracer.loadTextures();
      const image = new Image(imageCanvas);
      for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
          image.putPixel(x, y, tracer.tracedValueAtPixel(x, y));
        }
        image.renderInto(imageCanvas);
      }

      setShowResult(true);
    }
  };

  const addSphere = () => {
    const object = new SphereGeometry(1, 20, 20);
    const material = new MeshPhongMaterial({
      color: 0x00ff00,
      reflectivity: 0,
      refractionRatio: 1.5,
      shininess: 500
    });
    setSelectedObject(material);
    const sphere = new Mesh(object, material);
    sphere.position.set(0, 0, 0);
    EDITOR.addObjectToScene(sphere);
  };

  const addCube = () => {
    const object = new BoxGeometry(1, 1, 1);

    const material = new MeshPhongMaterial({
      color: 0x00ff00,
      reflectivity: 0,
      shininess: 500
    });
    setSelectedObject(material);
    console.log(material);
    const cube = new Mesh(object, material);
    cube.position.set(0, 0, 0);
    EDITOR.addObjectToScene(cube);
  };

  const addPyramid = () => {
    const object = new ConeGeometry(1, 2, 5);

    const material = new MeshPhongMaterial({
      color: 0x00ff00,
      reflectivity: 0.2,
    });
    setSelectedObject(material);
    const pyramid = new Mesh(object, material);
    pyramid.position.set(0, 0, 0);
    EDITOR.addObjectToScene(pyramid);
  };

  const addLight = () => {
    const light = new PointLight(new Color(0.5, 0.5, 0.5), 0.8, 100);
    light.position.set(2, 2, 2);
    EDITOR.addLightToScene(light);
  };

  const addDirectionalLight = () => {
    const light = new DirectionalLight(new Color(0.5, 0.5, 0.5), 0.8);
    light.position.set(2, 2, 2);
    EDITOR.addLightToScene(light);
  };

  const uploadSelectedModel = (event) => {
    //if (event.target.files) EDITOR.uploadObjectToScene(event.target.files);
    if (event.target.files[0]) {
      EDITOR.uploadObject(URL.createObjectURL(event.target.files[0]));
    }
  };

  const uploadSelectedTexture = (event) => {
    if (event.target.files[0])
      EDITOR.setTextureSelected(URL.createObjectURL(event.target.files[0]));
  };

  const setSelectedObjectColor = (color) => {
    const ObjColor = new Color(color);

    if (
      EDITOR.selectedObject &&
      color !== EDITOR.selectedObject.material.color
    ) {
      EDITOR.selectedObject.material.color = ObjColor;
    }
  };

  const uploadScene = (event) => {
    if (event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const scene = JSON.parse(event.target.result);

        const parsedScene = await SceneLoader.load(scene);
        EDITOR.initialize(editorCanvas, parsedScene);

        const animate = () => {
          requestAnimationFrame(animate);
          EDITOR.render();
        };

        animate();
      };
      reader.readAsText(event.target.files[0]);
    }
  };

  const clickSaveScene = (event) => {
    const fileData = JSON.stringify(EDITOR.getRenderingScene().toJSON()); // convert function outp to json string
    const blob = new Blob([fileData], { type: "text/plain" }); // create the object file type
    const url = URL.createObjectURL(blob); // bunu daha once kullanmistik zaten
    const link = document.createElement("a"); // create an element <a> that will be executed with the click function
    link.download = "editor-output.json";
    link.href = url;
    link.click();
  };

  const downloadRender = (event) => {
    event.target.href = imageCanvas.toDataURL("image/png");
  };
  const openUploadDialog = () => {
    document.querySelector("#item-upload").click();
  };

  const clickUploadSelectedTexture = () => {
    document.querySelector("#texture-upload").click();
  };

  const clickUploadLoadScene = () => {
    document.querySelector("#load-scene").click();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        padding: "15px",
      }}
    >
      <Paper
        style={{
          flex: "0 0 20%",
          textAlign: "center",
          marginTop: "10px",
          padding: "5px",
          height: "100%",
        }}
      >
        <P style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
          Keyboard Shortcuts
        </P>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <P style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            Object Transform
          </P>
          <P>
            <span style={{ color: "#f48fb1" }}>'T'</span> = Translate
          </P>
          <P>
            <span style={{ color: "#f48fb1" }}>'R'</span> = Rotate
          </P>
          <P>
            <span style={{ color: "#f48fb1" }}>'S'</span> = Scale
          </P>
          <P>
            <span style={{ color: "#f48fb1" }}>'Del'</span> = Delete
          </P>
        </div>
        <div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <P style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
              Transform Controller
            </P>
            <P>
              <span style={{ color: "#f48fb1" }}>'+'</span> = Increase
              Controller Size
            </P>
            <P>
              <span style={{ color: "#f48fb1" }}>'-'</span> = Decrease
              Controller Size
            </P>
            <P>
              <span style={{ color: "#f48fb1" }}>'Space'</span> = Toggle
              Controller
            </P>
            <P>
              <span style={{ color: "#f48fb1" }}>'X'</span> = Toggle X Dimension
            </P>
            <P>
              <span style={{ color: "#f48fb1" }}>'Y'</span> = Toggle Y Dimension
            </P>
            <P>
              <span style={{ color: "#f48fb1" }}>'Z'</span> = Toggle Z Dimension
            </P>
          </div>
        </div>
      </Paper>
      <div
        id="editor"
        style={{
          margin: "10px auto",
          display: "flex",
        }}
      >
        <div
          style={{
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div id="stage">
            <canvas
              id="editorCanvas"
              width="800"
              height="600"
              hidden={showResult}
            />
            <canvas
              id="imageCanvas"
              width="800"
              height="600"
              hidden={!showResult}
            />
          </div>

          <div
            style={{
              padding: "15px",
            }}
          >
            <div>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setShowResult(false);
                  EDITOR.back();
                }}
                hidden={!showResult}
              >
                Back
              </Button>
            </div>
            <div>
              <a
                href="#"
                id="btn-download"
                download="result.png"
                onClick={downloadRender}
                hidden={!showResult}
              >
                Download
              </a>
            </div>
            <div>
              <ButtonGroup
                variant="contained"
                color="secondary"
                aria-label="contained primary button group"
                style={{ maxHeight: "75px" }}
              >
                <Button
                  style={{ marginRight: "10px" }}
                  hidden={showResult}
                  onClick={() => renderScene(0)}
                >
                  Client Render
                </Button>
                <Button
                  style={{ marginRight: "10px" }}
                  hidden={showResult}
                  onClick={() => renderScene(1)}
                >
                  Server Render
                </Button>
                <Button hidden={showResult} onClick={() => renderScene(2)}>
                  Client & Server Render
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Paper
          style={{
            flex: "0 0 20%",
            margin: "10px auto",
            padding: "5px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <div>
            <P style={{ fontSize: "1.3rem" }}>
              <b>Primitive Objects</b>
            </P>
            <ButtonGroup
              style={{
                display: "flex",
                flexDirection: "row wrap",
                justifyContent: "space-evenly",
              }}
            >
              <Button onClick={addCube}>
                <span>Cube: </span>
                <CropDinIcon />
              </Button>
              <Button onClick={addSphere}>
                <span>Sphere: </span>
                <Brightness1Icon />
              </Button>
              <Button onClick={addPyramid}>
                <span>Pyramid: </span>
                <ChangeHistoryIcon />
              </Button>
            </ButtonGroup>
            <br />
            <P style={{ fontSize: "1.3rem" }}>
              <b>Light Sources</b>
            </P>
            <ButtonGroup
              style={{
                display: "flex",
                flexDirection: "row wrap",
                justifyContent: "space-evenly",
              }}
            >
              <Button variant="outlined" color="primary" onClick={addLight}>
                <span>Point Light: </span>
                <Brightness7Icon />
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={addDirectionalLight}
              >
                <span>Directional Light: </span>
                <Brightness7Icon />
              </Button>
            </ButtonGroup>
            <br />
            <P style={{ fontSize: "1.3rem" }}>
              <b>Scene</b>
            </P>
            <div>
              <ButtonGroup variant="outlined" color="secondary">
                <Button onClick={clickSaveScene}>Save Scene</Button>
                <Button onClick={clickUploadLoadScene}>
                  Load Scene
                  <input
                    type="file"
                    name="files[]"
                    id="load-scene"
                    accept=".json"
                    hidden={true}
                    onChange={uploadScene}
                  />
                </Button>
              </ButtonGroup>
            </div>
            <br />
            <P style={{ fontSize: "1.3rem" }}>
              <b>Model / Texture</b>
            </P>
            <div
              style={{
                display: "flex",
                flexDirection: "column wrap",
                justifyContent: "space-evenly",
              }}
            >
              <ButtonGroup>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={openUploadDialog}
                >
                  <input
                    type="file"
                    name="files[]"
                    id="item-upload"
                    accept=".obj"
                    hidden={true}
                    onChange={uploadSelectedModel}
                  />
                  <span>Upload model: </span>
                  <CloudUploadIcon />
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={clickUploadSelectedTexture}
                >
                  <input
                    type="file"
                    name="files[]"
                    id="texture-upload"
                    hidden={true}
                    accept="image/*"
                    onChange={uploadSelectedTexture}
                  />
                  <span>Upload texture: </span>

                  <TextureIcon />
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </Paper>
        <Paper>
          {selectedObject && (
            <ObjectProperties
              setColor={setSelectedObjectColor}
              object={selectedObject}
            />
          )}
        </Paper>
      </div>
    </div>
  );
};

const ObjectProperties = ({ object = {}, setColor }) => {
  const { map, color, reflectivity, refractionRatio, specular } = object;
  //   const properties = { map, color, reflectivity, refractionRatio, specular };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [ObjColor, setObjColor] = useState(color);

  const handleChangeComplete = (color, event) => {
    setObjColor(color.hex);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setColor(ObjColor);
  }, [ObjColor, setColor]);

  const open = Boolean(anchorEl);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <P style={{ fontSize: "1.3rem" }}>
        <b>Object Details</b>
      </P>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <ul style={{ listStyleType: "none" }}>
          <li key={color}>
            Color:
            <Button
              style={{ marginLeft: "5px" }}
              variant="contained"
              onClick={handleClick}
              size="small"
              color="primary"
            >
              Select color
            </Button>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <SketchPicker
                color={ObjColor}
                onChangeComplete={handleChangeComplete}
              />
            </Popover>
          </li>
          <li key={reflectivity}>
            Reflectivity:{" "}
            <TextField
              style={{ width: "10%", marginLeft: "5px" }}
              size="small"
              value={reflectivity}
            />
          </li>
          <li key={refractionRatio}>
            Refraction ratio:{" "}
            <TextField
              style={{ width: "10%", marginLeft: "5px" }}
              size="small"
              value={refractionRatio}
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EditorUI;
