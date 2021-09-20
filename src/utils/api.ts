import axios from "./http";
export class Request {
  get(url: string, data?: object) {
    console.log(data);
    
    return axios.get(url, {
      params: data
    })
  }
  post(url: string, data?: object, config?: object) {
    return axios.post(url, data, config);
  }
  formPost(url: string, data?: object) {
    data && (data = data instanceof FormData ? data : dataToFormData(data))
    return axios.post(url, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

const request = new Request()
function dataToFormData(data?: object) {
  if (data == null) {
    return new FormData();
  }
  if (data instanceof FormData) {
    return data;
  }
  let formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, (<any>data)[key]);
  });
  return formData;
}
export default request