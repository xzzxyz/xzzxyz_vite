import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';

const alovaInstance = createAlova({
    requestAdapter: adapterFetch(),
    responded: res => res.json()
});



const get = async (...args) => await alovaInstance.Get(...args)
export { get }