import {Dimensions} from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const margin = 8;
const marginHorizontal = 20;
const marginVertical = 14;
const borderRadiusMin = 0
const borderRadiusMax = 0

export default {
    borderRadiusMin,
    borderRadiusMax,
    window: {
        width,
        height,
        margin,
        marginHorizontal,
        marginVertical,
        borderRadiusMin,
        borderRadiusMax,
    },
    isSmallDevice: width < 375,
};
