import { TextureLoader, Texture } from "three";

export default class LoadTexture {
  private textureLoader: TextureLoader;
  public constructor() {
    this.textureLoader = new TextureLoader();
  }

  public getTextureByURL(url: string): Texture {
    return this.textureLoader.load(url);
  }

  public getTextureLoading(path: string): Texture {
    return this.textureLoader.load(path);
  }
}
