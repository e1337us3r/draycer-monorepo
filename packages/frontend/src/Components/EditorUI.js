import React, { useEffect, useState, useRef, useCallback } from "react";
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
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import { Paper, TextField, Popover, Tooltip } from "@material-ui/core";
import CropDinIcon from "@material-ui/icons/CropDin";
import Brightness1Icon from "@material-ui/icons/Brightness1";
import ChangeHistoryIcon from "@material-ui/icons/ChangeHistory";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import TextureIcon from "@material-ui/icons/Texture";
import styled from "styled-components";
import { SketchPicker } from "react-color";
import API from "../api/client";
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
          setSelectedObject(EDITOR.selectedObject);
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

    if (option > 0) await API.scene.create(sceneJson);

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
      shininess: 100,
      opacity: 0,
    });
    const sphere = new Mesh(object, material);
    setSelectedObject(sphere);
    sphere.position.set(0, 0, 0);
    EDITOR.addObjectToScene(sphere);
  };

  const addCube = () => {
    const object = new BoxGeometry(1, 1, 1);

    const material = new MeshPhongMaterial({
      color: 0x00ff00,
      reflectivity: 0,
      opacity: 1,
      shininess: 500,
    });
    const cube = new Mesh(object, material);
    setSelectedObject(cube);
    cube.position.set(0, 0, 0);
    EDITOR.addObjectToScene(cube);
  };

  const addPyramid = () => {
    const object = new ConeGeometry(1, 2, 5);

    const material = new MeshPhongMaterial({
      color: 0x00ff00,
      reflectivity: 0.2,
    });
    const pyramid = new Mesh(object, material);
    setSelectedObject(pyramid);
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
    light.position.set(8, 14, 8);
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

  const clickSaveScene = () => {
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
                <Tooltip title="Render the scene from your browser" arrow>
                  <Button
                    style={{ marginRight: "10px" }}
                    hidden={showResult}
                    onClick={() => renderScene(0)}
                  >
                    Client Render
                  </Button>
                </Tooltip>
                <Tooltip
                  title="Render the scene on the distributed servers of DRaycer"
                  arrow
                >
                  <Button
                    style={{ marginRight: "10px" }}
                    hidden={showResult}
                    onClick={() => renderScene(1)}
                  >
                    Server Render
                  </Button>
                </Tooltip>
                <Tooltip
                  title="Render using both your browser and the DRaycer servers"
                  arrow
                >
                  <Button hidden={showResult} onClick={() => renderScene(2)}>
                    Client & Server Render
                  </Button>
                </Tooltip>
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
              selectedObject={selectedObject}
              setSelectedObject={setSelectedObject}
            />
          )}
        </Paper>
      </div>
    </div>
  );
};

const ObjectProperties = ({ selectedObject, setSelectedObject }) => {
  const {
    shininess,
    color,
    reflectivity,
    refractionRatio,
    opacity,
  } = selectedObject.material;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [ObjColor, setObjColor] = useState(color);
  const [ObjRefraction, setObjRefraction] = useState(refractionRatio);
  const [ObjReflectivity, setObjReflectivity] = useState(reflectivity);
  const [ObjShininess, setObjShininess] = useState(shininess);
  const [ObjOpacity, setObjOpacity] = useState(opacity);

  useEffect(() => {
    if (selectedObject && selectedObject.material) {
      setObjColor(selectedObject.material.color);
      setObjRefraction(selectedObject.material.refractionRatio);
      setObjReflectivity(selectedObject.material.reflectivity);
      setObjShininess(selectedObject.material.shininess);
      setObjOpacity(selectedObject.material.opacity);
    }
  }, [selectedObject]);

  const handleObjectColor = (color) => {
    setObjColor(color.hex);
  };

  const submitProperties = useCallback(() => {
    const modifySelectedObject = (
      color,
      reflectivity,
      shininess,
      refractionRatio,
      opacity
    ) => {
      const ObjColor = new Color(color);
      if (selectedObject) {
        let temp = selectedObject;
        temp.material.color = ObjColor;
        temp.material.reflectivity = Number(reflectivity);
        temp.material.shininess = Number(shininess);
        temp.material.refractionRatio = Number(refractionRatio);
        temp.material.opacity = Number(opacity);
        setSelectedObject(temp);
        console.log(selectedObject);
      }
    };
    modifySelectedObject(
      ObjColor,
      ObjReflectivity,
      ObjShininess,
      ObjRefraction,
      ObjOpacity
    );
  }, [
    ObjColor,
    ObjReflectivity,
    ObjShininess,
    ObjRefraction,
    ObjOpacity,
    selectedObject,
    setSelectedObject,
  ]);

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
        <form
          style={{ display: "flex", flexDirection: "column" }}
          onSubmit={(e) => {
            e.preventDefault();
            submitProperties();
          }}
        >
          <Button
            style={{ margin: "5px" }}
            variant="outlined"
            onClick={(event) => setAnchorEl(event.currentTarget)}
            size="small"
            color="secondary"
          >
            Select color
          </Button>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
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
              onChangeComplete={handleObjectColor}
            />
          </Popover>

          <TextField
            style={{ margin: "5px" }}
            size="small"
            label="Reflectivity"
            InputProps={{
              inputProps: {
                max: 1,
                min: 0.0,
                step: 0.01,
              },
            }}
            type="number"
            value={ObjReflectivity}
            onChange={(e) => setObjReflectivity(e.currentTarget.value)}
          />
          <TextField
            style={{ margin: "5px" }}
            label="Shininess"
            type="number"
            InputProps={{
              inputProps: {
                max: 1000,
                min: 0,
              },
            }}
            size="small"
            value={ObjShininess}
            onChange={(e) => setObjShininess(e.currentTarget.value)}
          />
          <TextField
            style={{ margin: "5px" }}
            label="Refraction"
            type="number"
            InputProps={{
              inputProps: {
                max: 5,
                min: 0.0,
                step: 0.01,
              },
            }}
            size="small"
            value={ObjRefraction}
            onChange={(e) => setObjRefraction(e.currentTarget.value)}
          />
          <TextField
            style={{ margin: "5px" }}
            label="Opacity"
            type="number"
            InputProps={{
              inputProps: {
                max: 1,
                min: 0.0,
                step: 0.01,
              },
            }}
            size="small"
            value={ObjOpacity}
            onChange={(e) => setObjOpacity(e.currentTarget.value)}
          />
          <Button
            size="small"
            color="primary"
            variant="outlined"
            style={{ margin: "5px" }}
            type="submit"
          >
            Save
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditorUI;
