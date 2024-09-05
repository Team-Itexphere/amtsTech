export let accessToken = '';
export let refreshToken = '';

/////////////////////-- accessToken --/////////////////////
export const setAccessToken = (token: string) => {
  // console.log('acc token ::', token);
  accessToken = token;
};

export const getAccessToken = () => {
  return accessToken;
};

/////////////////////-- refreshToken --/////////////////////
export const setRefreshToken = (token: string) => {
  // console.log('refresh token ::', token);
  refreshToken = token;
};

export const getRefreshToken = () => {
  return refreshToken;
};
