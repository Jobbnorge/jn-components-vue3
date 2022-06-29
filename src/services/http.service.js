import axios from "axios";

export class HttpService {
  constructor(baseURL) {
    this.axios = axios.create({
      baseURL: baseURL || process.env.VUE_APP_URLS_APIBASE,
      crossDomain: true,
      withCredentials: true,
    });

    this.axios.interceptors.response.use(
      this.successInterceptor,
      this.errorInterceptor
    );
  }

  get(url, config) {
    return this.axios.get(url, config);
  }

  getFile(url) {
    return this.axios.get(url, {
      responseType: "blob",
    });
  }

  post(url, data) {
    return this.axios.post(url, data);
  }
  
  postPDF(url, data) {
    return this.axios.post(url, data, {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/pdf",
      },
    });
  }

  put(url, data) {
    return this.axios.put(url, data);
  }

  delete(url) {
    return this.axios.delete(url);
  }
}

export const httpService = new HttpService();
