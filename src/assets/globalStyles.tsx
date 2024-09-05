import {StyleSheet, Platform, Dimensions} from 'react-native';
import {scale} from './scale';
import commonColors from './colors';

export const defaultStyles = StyleSheet.create({
  //flex
  // color:#9aac25,color:#f2f2f2,
  // color:#cad400,color:#b7b7b7,
  // color:#eaf0cc,color:#707070,
  // color:#0f9ea6,color:#305063,
  // color:#ff6846,color:#053645,

  displayFlex: {
    display: 'flex',
  },

  flex1: {
    flex: 1,
  },

  flex2: {
    flex: 2,
  },

  flex3: {
    flex: 3,
  },

  flex5: {
    flex: 5,
  },

  flex7: {
    flex: 7,
  },

  flexGrow1: {
    flexGrow: 1,
  },

  flexDirectionRow: {
    flexDirection: 'row',
  },

  flexWrap: {
    flexWrap: 'wrap',
  },

  positionAbsolute: {
    position: 'absolute',
  },

  positionRelative: {
    position: 'relative',
  },

  justifyCenter: {
    justifyContent: 'center',
  },

  alignCenter: {
    alignItems: 'center',
  },

  alignSelfFlexEnd: {
    alignSelf: 'flex-end',
  },

  alignSelfFlexStart: {
    alignSelf: 'flex-start',
  },

  alignSelfCenter: {
    alignSelf: 'center',
  },

  contentCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  justifySpaceBetween: {
    justifyContent: 'space-between',
  },

  justifyspacearound: {
    justifyContent: 'space-around',
  },

  justifyFlexEnd: {
    justifyContent: 'flex-end',
  },

  // font types

  // new font
  LatoBold: {
    fontFamily: 'Lato-Bold',
  },

  LatoHeavy: {
    fontFamily: 'Lato-Heavy',
  },

  LatoItalic: {
    fontFamily: 'Lato-Italic',
  },

  LatoRegular: {
    fontFamily: 'Lato-Regular',
  },

  SFBold: {
    fontFamily: 'SFProDisplay-Bold',
  },

  SFSemiBold: {
    //fontFamily: 'SFProDisplay-Semibold',
  },

  SFTextSemiBold: {
    fontFamily: 'SFProText-Semibold',
  },

  SFRegular: {
    // fontFamily: 'SFProDisplay-Regular',
  },

  SFTextRegular: {
    fontFamily: 'SFProText-Regular',
  },

  SFMedium: {
    //fontFamily: 'SFProDisplay-Medium',
  },

  RobotoMedium: {
    fontFamily: 'Roboto-Medium',
  },

  SFTextMedium: {
    fontFamily: 'SFProText-Medium',
  },

  RobotoRegular: {
    // fontFamily: 'Roboto-Regular',
  },

  //font styles

  fontWeightBold: {
    fontWeight: 'bold',
  },

  letterSpacing2: {
    letterSpacing: 0.2,
  },

  // font sizes

  fontSize10: {
    fontSize: scale(10),
  },

  fontSize11: {
    fontSize: scale(11),
  },

  fontSize12: {
    fontSize: scale(12),
  },

  fontSize13: {
    fontSize: scale(13),
  },

  fontSize14: {
    fontSize: scale(14),
  },

  fontSize15: {
    fontSize: scale(15),
  },

  fontSize16: {
    fontSize: scale(16),
  },

  fontSize17: {
    fontSize: scale(17),
  },

  fontSize18: {
    fontSize: scale(18),
  },

  fontSize21: {
    fontSize: scale(21),
  },

  fontSize22: {
    fontSize: scale(22),
  },

  fontSize26: {
    fontSize: scale(26),
  },

  fontSize27: {
    fontSize: scale(27),
  },

  fontSize35: {
    fontSize: scale(35),
  },

  fontSize40: {
    fontSize: scale(40),
  },

  // font colors

  colorBlack: {
    color: commonColors.black,
  },

  colorWhite: {
    color: commonColors.white,
  },

  colorDarkGray: {
    color: commonColors.DarkGray,
  },

  colorDarkBlue: {
    color: commonColors.DarkBlue,
  },

  colorGray74788D: {
    color: commonColors.gray74788D,
  },

  // text alignments

  textCenter: {
    textAlign: 'center',
  },

  lineHeight30: {
    lineHeight: 30,
  },

  // background Colors
  bgColorLightGreen: {
    backgroundColor: commonColors.lightGreen,
  },
  bgColorLightGray: {
    backgroundColor: commonColors.lightGray,
  },

  bgColorDarkGray: {
    backgroundColor: commonColors.DarkGray,
  },

  bgColorWhite: {
    backgroundColor: commonColors.white,
  },

  bgColorlightRed: {
    backgroundColor: commonColors.lightRed,
  },

  inputBgColorGray: {
    backgroundColor: '#E5E4E2',
  },

  // border color
  borderColorDarkGray: {
    borderColor: commonColors.DarkGray,
  },
  borderColorLightGray: {
    borderColor: commonColors.lightGray,
  },

  // containers

  headerWrapper: {
    paddingLeft: scale(32),
    paddingRight: scale(32),
    paddingTop: scale(25),
  },

  detailsWrapper: {
    paddingLeft: scale(32),
    paddingRight: scale(32),
  },

  defaultPaddingTop: {
    paddingTop: scale(20),
  },

  defaultPaddingTopAndBottom: {
    paddingTop: scale(4),
    paddingBottom: scale(4),
  },

  containerPadding: {
    paddingLeft: scale(16),
    paddingRight: scale(16),
  },

  containerMargin: {
    marginLeft: scale(16),
    marginRight: scale(16),
  },

  containerHeader: {
    paddingLeft: scale(16),
    paddingRight: scale(16),
    paddingTop: scale(15),
    paddingBottom: scale(15),
  },

  // image
  resizeModeContain: {
    resizeMode: 'contain',
  },

  resizeModeCenter: {
    resizeMode: 'center',
  },

  resizeModeCover: {
    resizeMode: 'cover',
  },
  resizeModeStretch: {
    resizeMode: 'stretch',
  },
  textInputVerticalPadding: {
    paddingVertical: Platform.OS === 'ios' ? 14 : 8,
  },
});

export default defaultStyles;
