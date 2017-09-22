// TODO THIS can be extracted to a lib
import requester   from 'request';
import concat      from 'concat-stream';
import Logger      from './logger';

const errorResponse = { error: true };

class RestClient {
  constructor(targetUrl) {
    this.targetUrl = targetUrl;
  }

  async post(payload) {
    requester.post(
      {
        url: this.targetUrl,
        json: payload,
        // headers: assembleRelayRequestHeaders(request)
      }
    ).on('response', (response) => {
      Logger.info(`on.response::statusCode: ${response.statusCode}`);
      return this.streamResponse(response);
    }).on('error', (error) => {
      Logger.error(`on.error: ${error.message}`);
      return errorResponse;
    });
  }

  async streamResponse(response) {
    function onEnd(responseBuffer) {
      const payload = responseBuffer.toString();
      if (response.statusCode === 200) {
        try {
          return JSON.parse(payload);
        } catch (error) {
          Logger.error(`Failed while streaming response - ${error.message}`);
          return errorResponse;
        }
      } else {
        Logger.error(`Failed while streaming response - statusCode: ${response.statusCode}`, payload);
        return errorResponse;
      }
    }

    const concatStream = concat(onEnd);
    response.pipe(concatStream);
  }
}
export default RestClient;
