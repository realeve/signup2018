import { axios } from './axios';

/**
*   @database: { 微信开发 }
*   @desc:     { 造币节报名 } 
    const { sid, user, mobile, prov, city, area, detail, openid, rec_time, idcard } = params;
*/
export const addCbpmSignup613 = (params) =>
  axios({
    url: '/175/b9f52b2e32.json',
    params
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 是否已报名 }
 */
export const getCbpmSignup613ByOpenid = (openid) =>
  axios({
    url: '/176/ebb4edf994.json',
    params: {
      openid
    }
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 当前报名人数 }
 */
export const getCbpmSignup613 = () =>
  axios({
    url: '/177/b94fb5f645.json'
  });
