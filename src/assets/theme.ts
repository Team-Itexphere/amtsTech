import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export const COLORS = {
    primary: "#FF6C44", //- orange
    primary10: "#FEFCFB",
    primary20: "#FFF5F2",
    primary30: "#FFEAE3",
    primary40: "#FFD9CC",
    primary50: "#FFCAB8",
    primary60: "#FFB9A3",
    primary70: "#FCA68F",
    primary80: "#F18E73",
    primary90: "#F35E35",
    primary100: "#D3461C",

    orange: "#FFA133",
    lightOrange: "#FFA133",
    lightOrange2: "#FDDED4",
    lightOrange3: '#FFD9AD',

    green: "#27AE60",
    red: "#FF1717",

    blue: '#0064C0',
    darkBlue: "#111A2C",
    dark60: 'rgba(13, 15, 35, 0.6)',

    gray: "#898B9A",
    gray1: '#838383',
    gray2: "#BBBDC1",
    gray3: '#CFD0D7',

    lightGrey: 'rgba(247, 247, 247, 1)',
    lightGray1: "#DDDDDD",
    lightGray2: "#F5F5F8",
    darkGray: "#525C67",
    darkGray2: "#757D85",

    white2: "#FBFBFB",
    white: '#FFFFFF',
    black: "#000000",

    transparent: 'transparent',
    transparentBlack1: "rgba(0, 0, 0, 0.1)",
    transparentBlack7: "rgba(0, 0, 0, 0.7)",
    transparentWhite1: 'rgba(255, 255, 255, 0.5)',
    transparentPrimray: 'rgba(227, 120, 75, 0.4)',

    // Secondary
    secondary: 'rgba(161, 219, 245, 1)',
    secondary80: 'rgba(161, 219, 245, 0.8)',
    secondary60: 'rgba(161, 219, 245, 0.6)',
    secondary20: 'rgba(161, 219, 245, 0.2)',
    secondary08: 'rgba(161, 219, 245, 0.08)',

};
export const SIZES = {
    // global sizes
    none: 0,
    small: 5,
    base: 8,
    font: 14,
    radius: 12,
    padding: 24,

    // font sizes
    largeTitle: 40,
    h1: 30,
    h2: 22,
    h3: 16,
    h4: 14,
    h5: 12,
    body1: 30,
    body2: 22,
    body3: 16,
    body4: 14,
    body5: 12,

    // app dimensions
    width,
    height
};
export const FONTS = {
    largeTitle: { fontFamily: "Poppins-Black", fontSize: SIZES.largeTitle, color: COLORS.gray1 },
    h1: { fontFamily: "Poppins-Bold", fontSize: SIZES.h1, lineHeight: 36, color: COLORS.gray1 },
    h2: { fontFamily: "Poppins-Bold", fontSize: SIZES.h2, lineHeight: 30, color: COLORS.gray1 },
    h3: { fontFamily: "Poppins-SemiBold", fontSize: SIZES.h3, lineHeight: 22, color: COLORS.gray1 },
    h4: { fontFamily: "Poppins-SemiBold", fontSize: SIZES.h4, lineHeight: 22, color: COLORS.gray1 },
    h5: { fontFamily: "Poppins-SemiBold", fontSize: SIZES.h5, lineHeight: 22, color: COLORS.gray1 },
    body1: { fontFamily: "Poppins-Regular", fontSize: SIZES.body1, lineHeight: 36, color: COLORS.gray1 },
    body2: { fontFamily: "Poppins-Regular", fontSize: SIZES.body2, lineHeight: 30, color: COLORS.gray1 },
    body3: { fontFamily: "Poppins-Regular", fontSize: SIZES.body3, lineHeight: 22, color: COLORS.gray1 },
    body4: { fontFamily: "Poppins-Regular", fontSize: SIZES.body4, lineHeight: 22, color: COLORS.gray1 },
    body5: { fontFamily: "Poppins-Regular", fontSize: SIZES.body5, lineHeight: 22, color: COLORS.gray1 },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
