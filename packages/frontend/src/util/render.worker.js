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
    console.log("EVENT: SCENE_PARSED");

    for(const obj of parsedScene.children) {
      obj.matrixWorld = obj.matrix;
    }

    const camera = parsedScene.getObjectByName(Editor.NAME_CAMERA);
    // These attributes are missing from the exported camera obj and need to be set manually
    camera.matrixWorldInverse = camera.userData.matrixWorldInverse;

    console.log(parsedScene);

    const tracer = new RayTracer(
      parsedScene,
      width,
      height
    );

    for (let y = yStart; y < yEnd; y++) {
      const renders = [];
      for (let x = xStart; x < width; x++) {
        const color = tracer.tracedValueAtPixel(x, y);
        if (color.g > 255 || color.g < 0 )
          console.log(`X: ${x} Y: ${y} `, color);
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
