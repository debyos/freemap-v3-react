import { TileLayerProps } from 'react-leaflet';

import { Coords, DoneCallback, TileLayerOptions, TileLayer } from 'leaflet';

import { createTileLayerComponent } from '@react-leaflet/core';

type Props = TileLayerProps & { extraScales?: number[] };

class LScaledTileLayer extends TileLayer {
  extraScales;

  constructor(
    urlTemplate: string,
    extraScales?: number[],
    options?: TileLayerOptions,
  ) {
    super(urlTemplate, options);
    this.extraScales = extraScales;
  }

  createTile(coords: Coords, done: DoneCallback) {
    const img = super.createTile(coords, done) as HTMLImageElement;

    if (this.extraScales?.length) {
      img.srcset = `${img.src}, ${this.extraScales
        .map((es) => `${img.src}@${es}x ${es}x`) // TODO add support for extensions
        .join(', ')}`;
    }

    // TODO attempts for HDPI print, see https://github.com/FreemapSlovakia/freemap-v3-react/issues/458

    // const picture = DomUtil.create('picture') as HTMLPictureElement;
    // const printSource = DomUtil.create(
    //   'source',
    //   undefined,
    //   picture,
    // ) as HTMLSourceElement;

    // const screenSource = DomUtil.create(
    //   'source',
    //   undefined,
    //   picture,
    // ) as HTMLSourceElement;

    // picture.style.width = '256px';
    // picture.style.height = '256px';

    // const img = DomUtil.create('img', undefined, picture) as HTMLImageElement;

    // printSource.srcset = `https://outdoor.tiles.freemap.sk/${coords.z}/${coords.x}/${coords.y}@3x`;
    // printSource.media = 'print';

    // screenSource.srcset = `https://outdoor.tiles.freemap.sk/${coords.z}/${coords.x}/${coords.y}`;
    // screenSource.media = 'screen';

    // img.srcset = `https://outdoor.tiles.freemap.sk/${coords.z}/${coords.x}/${coords.y}, https://outdoor.tiles.freemap.sk/${coords.z}/${coords.x}/${coords.y}@2x 2x, https://outdoor.tiles.freemap.sk/${coords.z}/${coords.x}/${coords.y}@3x 3x`;
    // img.src = `https://outdoor.tiles.freemap.sk/${coords.z}/${coords.x}/${coords.y}`;

    return img;
  }
}

export const ScaledTileLayer = createTileLayerComponent<TileLayer, Props>(
  (props, context) => {
    const { url, extraScales, ...rest } = props;

    return {
      instance: new LScaledTileLayer(url, extraScales, rest),
      context,
    };
  },

  (instance, props, prevProps) => {
    if (props.url !== prevProps.url) {
      instance.setUrl(props.url);
    }
  },
);
