import util from './util';

export default {
  async list(params) {
    return util.request({
      params,
      url: '/api/list',
    });
  },

  async detail(deviceId) {
    const url = `/api/device/${deviceId}`;
    return util.request({
      url,
    });
  },

  async deletion(deviceId) {
    const url = `/api/device/${deviceId}`;
    return util.request({
      method: 'delete',
      url,
    });
  },

  async control(data) {
    const url = '/api/sendControl';
    return util.request({
      url,
      method: 'post',
      data,
    });
  },

  async ascii(data) {
    const url = '/api/sendAscii';
    return util.request({
      url,
      method: 'post',
      data,
    });
  },

  async statByField(params) {
    const url = '/api/statByField';
    return util.request({
      url,
      params,
    });
  },

  async events(params) {
    const url = '/api/event/list';
    return util.request({ url, params });
  },
};
