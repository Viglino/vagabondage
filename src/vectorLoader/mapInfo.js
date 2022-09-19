import vtMap, { vtLoader } from './vtMap'

const mapInfo = {};

/** Get info around coordinates
 * @param {number} [around=20] pixel around
 * @param {ol/Coordinate} [coord] default current position
 * @return {object}
 */
mapInfo.getAround = function(around=20, coord) {
  if (!coord) coord = vtMap.getView().getCenter();
  const pixel = vtMap.getPixelFromCoordinate(coord);
  const features = vtMap.getFeaturesAtPixel(pixel, { hitTolerance: around });
  if (vtMap.get('targetDiv')) {
    vtMap.get('targetDiv').style.width = vtMap.get('targetDiv').style.height = (2*around)+'px';
  } 
  return getFeaturesProp(features);
}

/** Fibnd all features around position
 */
mapInfo.findAround = function(around=1000, coord, cback) {
  vtLoader.getFeaturesInExtent(
    coord, {
      tolerance: around
    }, (features) => {
      cback(getFeaturesProp(features))
    }
  );
}


// Get features by layer/ nature
function getFeaturesProp(features) {
  const done = {};
  // Get info / nature
  const result = {}
  features.forEach(f => {
    const p = f.getProperties();
    // Only if not done
    if (!done[f.get('cleabs')]) {
      done[f.get('cleabs')] = true;
      const id = p.layer + (p.nature ? '-' + p.nature : '');
      p.original = f;
      if (!result[id]) result[id] = [];
      result[id].push(p);
    } else {
//      console.log(f)
    }
  })
  return result;
}

/** Get features at pixel
 * @param {ol/Pixel} [pixel] pixel coords, default the map view center
 * @returns {object}
 */
mapInfo.getFeaturesAtPixel = function(pixel) {
  if (pixel) {
    pixel = vtMap.getPixelFromCoordinate(vtMap.getView().getCenter());
  }
  const features = vtMap.getFeaturesAtPixel(pixel);
  return getFeaturesProp(features);
}

/** Get features at pixel
 * @param {ol/Coordinate} coord
 * @returns {object}
 */
mapInfo.getFeaturesAtCoord = function(coord) {
  const pixel = vtMap.getPixelFromCoordinate(coord);
  const features = vtMap.getFeaturesAtPixel(pixel);
  return getFeaturesProp(features);
}

/** Show info on click
 */
vtMap.on('click', e => {
  const info = getFeaturesProp(vtMap.getFeaturesAtPixel(e.pixel));
  if (info.length) {
    console.clear();
    console.table(info);
  }
})

export default mapInfo
