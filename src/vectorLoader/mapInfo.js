import vtMap from './vtMap'

const mapInfo = {};

/** Get info
 * @param {number} around pixel around
 * @param {ol/Coordinate} coord
 */
mapInfo.getAround = function(around=20, coord) {
  if (!coord) coord = vtMap.getView().getCenter();
  const pixel = vtMap.getPixelFromCoordinate(coord);
  const features = vtMap.getFeaturesAtPixel(pixel, { hitTolerance: around });
  vtMap.get('targetDiv').style.width = vtMap.get('targetDiv').style.height = (2*around)+'px';
  return getFeaturesProp(features);
}

//
function getFeaturesProp(features) {
  const info = [];
  features.forEach(f => {
    const p = f.getProperties()
    delete p.niveau;
    delete p.territoire;
    delete p.txt_typo;
    delete p.terminaison;
    delete p.alti_sol;
    delete p.rotation;
    info.push(p)
  })
  return info;
}

mapInfo.getFeaturesAtPixel = function(pixel) {
  if (pixel) {
    pixel = vtMap.getPixelFromCoordinate(vtMap.getView().getCenter());
  }
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
