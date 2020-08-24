import axios from 'axios';
import MD5 from 'crypto-js/md5';
import { Message } from '@alifd/next';
import { createHashHistory } from 'history';

const appKey = 'test';
const secretKey = 'test';

const handleResponse = (response) => {
  if (response.status !== 200) {
    const error = new Error(response.statusText || '后端接口异常');
    return { error };
  }

  const { data } = response;
  if (data && data.errors) {
    const error = data.errors;
    return { error };
  } else if (data) {
    return { data };
  }
  return response;
};

function showError(errorMessage) {
  Message.show({
    type: 'error',
    title: '错误消息',
    content: errorMessage,
  });
}

export default {
  async request(options) {
    const requestTime = Math.round(new Date().getTime() / 1000);
    const sign = MD5(`${secretKey}${requestTime}${options.url}${secretKey}`).toString();
    const params = {
      ...options.params || {},
      appKey,
      requestTime,
      sign,
    };
    try {
      const response = await axios({ ...options, params });
      const { data, error } = handleResponse(response);
      if (error) {
        throw error;
      } else {
        return { response, data };
      }
    } catch (error) {
      showError(error.message);
      createHashHistory().push('/user/login');
      console.error(error);
      throw error;
    }
  },
};
