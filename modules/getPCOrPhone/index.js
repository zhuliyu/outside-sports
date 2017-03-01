/**
 * Created by e on 17/2/26.
 */
exports.getPCorPhone = (deviceAgent) => {
    if (deviceAgent.indexOf('Android') !== -1 || deviceAgent.indexOf('iphone') !== -1 || deviceAgent.indexOf('ipad') !== -1 || deviceAgent.indexOf('ipod') !== -1) {
        return false;
    }
    return true;
}