import vtMap from './vtMap'

const mapInfo = {};

/** Get info
 * @param {number} around pixel around
 * @param {ol/Coordinate} coord
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

//
function getFeaturesProp(features) {
  // Get info / nature
  const result = {}
  features.forEach(f => {
    const p = f.getProperties()
    const id = p.layer + (p.nature ? '-' + p.nature : '');
    // p.original = f;
    if (!result[id]) result[id] = [];
    result[id].push(p);
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
