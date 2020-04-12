import {RayTracer, SceneLoader, Editor, Color} from "draycer";

const renderers = {};

  onmessage = function ({data}) {
    if (data.what === "RENDER_BLOCK")
      (async () => {
        await startRender(data.job);
      })()
  };

  async function startRender({
                               scene,
                               xStart,
                               yStart,
                               yEnd,
                               xEnd,
                               height,
                               width,
                               jobId,
                               blockId
                             }) {
    let renderer = renderers[jobId];
    if (renderer == undefined) {
      const parsedScene = await SceneLoader.load(scene);
      console.log("EVENT: SCENE_PARSED");

      for(const obj of parsedScene.children) {
        obj.matrixWorld = obj.matrix;
      }

      const camera = parsedScene.getObjectByName(Editor.NAME_CAMERA);
      // These attributes are missing from the exported camera obj and need to be set manually
      camera.matrixWorldInverse = camera.userData.matrixWorldInverse;

      renderer = new RayTracer(
        parsedScene,
        width,
        height
      );

      renderers[jobId] = renderer;
    }


    const renders = [];

    for (let y = yStart; y < yEnd; y++) {
      for (let x = xStart; x < xEnd; x++) {
        const color = renderer.tracedValueAtPixel(x, y);
        renders.push({
          coord: {x, y},
          color
        });
      }

    }


    postMessage({
      what: "BLOCK_RENDERED",
      renders,
      jobId,
      blockId
    });

  }
