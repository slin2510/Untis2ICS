import WebUntis from "webuntis";
import axios from "axios";
import HttpsProxyAgent from "https-proxy-agent";

export class Untis extends WebUntis {
  constructor(
    school,
    username,
    password,
    url,
    identity = "Awesome",
    disableUserAgent = false
  ) {
    super(school, username, password, url, identity, disableUserAgent);
    const additionalHeaders = {};

    if (!disableUserAgent) {
      additionalHeaders["User-Agent"] =
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.79 Safari/537.36";
    }
    if (process.env.https_proxy != "" && process.env.https_proxy != undefined) {
      var httpsagent = new HttpsProxyAgent.HttpsProxyAgent(
        process.env.https_proxy
      );
      this.axios = axios.create({
        baseURL: this.baseurl,
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          "X-Requested-With": "XMLHttpRequest",
          ...additionalHeaders,
        },
        httpsAgent: httpsagent,
        proxy: false,
        rejectUnauthorized: false,
        validateStatus: function (status) {
          return status >= 200 && status < 303; // default
        },
      });
    } else {
      this.axios = axios.create({
        baseURL: this.baseurl,
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          "X-Requested-With": "XMLHttpRequest",
          ...additionalHeaders,
        },
        proxy: false,
        rejectUnauthorized: false,
        validateStatus: function (status) {
          return status >= 200 && status < 303; // default
        },
      });
    }
  }
}
