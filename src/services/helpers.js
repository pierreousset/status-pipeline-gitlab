import req from 'superagent';
import config from '../config';

const { API, TOKEN, REF_PIPELINE } = config;

export const get = id => req.get(`${API}${id}/pipelines?ref=${REF_PIPELINE}`).set('PRIVATE-TOKEN', TOKEN);