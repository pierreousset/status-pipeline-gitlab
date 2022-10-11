import { get } from '../helpers';

const getStatus = id => {
  return get(id)
    .then(res => res.body)
    .catch(error => { throw new Error(error); });
}

export default  getStatus;