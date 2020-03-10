import {RayTracer, SceneLoader, Editor} from "draycer";

  onmessage = function ({data}) {
    if (data.what === "START_RENDER")
      (async () => {
        await startRender(data.job);
      })()
  };

  async function startRender({
                               scene,
                               xStart,
                               yStart,
                               yEnd,
                               height,
                               width,
                               id
                             }) {


    const parsedScene = await SceneLoader.load(scene);

    const camera = parsedScene.getObjectByName(Editor.NAME_CAMERA);
    // These attributes are missing from the exported camera obj and need to be set manually
    camera.matrixWorld = camera.matrix;
    camera.matrixWorldInverse = camera.userData.matrixWorldInverse;

    console.log("EVENT: SCENE_PARSED");

    const tracer = new RayTracer(
      parsedScene,
      width,
      height
    );

    for (let y = yStart; y < yEnd; y++) {
      const renders = [];
      for (let x = xStart; x < width; x++) {
        const color = tracer.tracedValueAtPixel(x, y);
        renders.push({
          coord: {x, y},
          color
        });
      }

      postMessage({
        what: "ROW_RENDERED",
        renders,
        id,
        y
      });
    }

    console.log("EVENT: RENDER_COMPLETED id= ", id);
    postMessage({
      what: "RENDER_COMPLETED",
      id
    });
  }
