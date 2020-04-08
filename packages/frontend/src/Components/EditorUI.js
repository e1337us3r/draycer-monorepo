import React, { useEffect, useState, useRef } from "react";
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
    Vector2,
} from "three";
import axios from "axios";
import CONFIG from "../config";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import { Paper } from "@material-ui/core";
import CropDinIcon from "@material-ui/icons/CropDin";
import Brightness1Icon from "@material-ui/icons/Brightness1";
import ChangeHistoryIcon from "@material-ui/icons/ChangeHistory";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import TextureIcon from "@material-ui/icons/Texture";

const EditorUI = () => {
    const [showResult, setShowResult] = useState(false);
    const [selectedObject, setSelectedObject] = useState(null);
    const [imageCanvas, setImageCanvas] = useState();
    const [editorCanvas, setEditorCanvas] = useState();
    const [WIDTH, setWIDTH] = useState();
    const [HEIGHT, setHEIGHT] = useState();
    const [EDITOR, setEDITOR] = useState({});
    const editorRendered = useRef(false);

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
                        console.log(EDITOR.selectedObject.material);
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
            reflectivity: 0.2,
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
            reflectivity: 0.2,
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

    const uploadSelectedModel = (event) => {
        if (event.target.files) EDITOR.uploadObjectToScene(event.target.files);
    };

    const uploadSelectedTexture = (event) => {
        if (event.target.files[0])
            EDITOR.setTextureSelected(
                URL.createObjectURL(event.target.files[0])
            );
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
                    height: "100%",
                }}
            >
                <h2>Keyboard Shortcuts</h2>
                <div>
                    <h4>Object Transform</h4>
                    <p>'W': Translate</p>
                    <p>'E' = Rotate</p>
                    <p>'R' = Scale</p>
                    <p>'Del' = Delete</p>
                </div>
                <div>
                    <h4>Transform Controller</h4>
                    <p>'+' = Increase Controller Size</p>
                    <p>'-' = Decrease Controller Size</p>
                    <p>'Space' = Toggle Controller</p>
                    <p>'X' = Toggle X Dimension</p>
                    <p>'Y' = Toggle Y Dimension</p>
                    <p>'Z' = Toggle Z Dimension</p>
                </div>
            </Paper>
            <div
                id="editor"
                style={{
                    flex: "0 0 60%",
                    margin: "10px auto",
                    display: "flex",
                }}
            >
                <div style={{ margin: "0 auto" }}>
                    <div id="stage">
                        <canvas
                            id="editorCanvas"
                            width="1000"
                            height="600"
                            hidden={showResult}
                        />
                        <canvas
                            id="imageCanvas"
                            width="1000"
                            height="600"
                            hidden={!showResult}
                        />
                    </div>

                    <div style={{ padding: "15px" }}>
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
                                color="primary"
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
                                <Button
                                    hidden={showResult}
                                    onClick={() => renderScene(2)}
                                >
                                    Client & Server Render
                                </Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <Paper
                    id="toolbar"
                    style={{
                        flex: "0 0 20%",
                        margin: "10px auto",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "center",
                    }}
                >
                    <div>
                        <p>
                            <b>Primitive Objects;</b>
                        </p>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-evenly",
                            }}
                        >
                            <p onClick={addCube}>
                                <span>Cube: </span>
                                <CropDinIcon />
                            </p>
                            <p onClick={addSphere}>
                                <span>Sphere: </span>
                                <Brightness1Icon />
                            </p>
                            <p onClick={addPyramid}>
                                <span>Pyramid: </span>
                                <ChangeHistoryIcon />
                            </p>
                        </div>
                        <p>
                            <b>Light Sources</b>
                        </p>
                        <div>
                            <p onClick={addLight}>
                                <span>Add light: </span>
                                <Brightness7Icon />
                            </p>
                        </div>
                        <p>
                            <b>Scene</b>
                        </p>
                        <div>
                            <ButtonGroup variant="outlined" color="secondary">
                                <Button>Save Scene</Button>
                                <Button onClick={clickUploadLoadScene}>
                                    Load Scene
                                    <input
                                        type="file"
                                        name="files[]"
                                        id="load-scene"
                                        accept=".json"
                                        hidden={true}
                                    />
                                </Button>
                            </ButtonGroup>
                        </div>
                        <br />
                        <p>
                            <b>Model / Texture</b>
                        </p>
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
                        <ObjectProperties object={selectedObject} />
                    )}
                </Paper>
            </div>
        </div>
    );
};

const ObjectProperties = ({ object = {} }) => {
    const { map, color, reflectivity, refractivity, specular } = object;
    const properties = { map, color, reflectivity, refractivity, specular };
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
            }}
        >
            <h3>Object Details;</h3>
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <ul style={{ listStyleType: "none" }}>
                    {Object.keys(properties).map((key) => {
                        return (
                            <li
                                key={key}
                            >{formatProperties`${key}: ${properties[key]}`}</li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

const formatProperties = (strings, ...values) => {
    const outp = strings.map((str, ind) => {
        if (ind > 0) {
            if (
                typeof values[ind - 1] === "object" &&
                values[ind - 1] !== null
            ) {
                return Object.keys(values[ind - 1]).map(
                    (key) =>
                        key +
                        ": " +
                        Number(values[ind - 1][key]).toFixed(2) +
                        ", "
                );
            }
            return String(values[ind - 1]) + " ";
        }
        return str;
    });
    return outp;
};

export default EditorUI;
