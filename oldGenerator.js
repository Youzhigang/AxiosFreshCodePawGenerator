const AxiosGenerator = function() {
  this.generate = function(context, requests, options) {
    const request = requests[0];
    const config = {
      method: request.method,
      url: request.urlBase
      // ...extract(request, 'urlParameters', 'params'),
      // ...extract(request, 'headers'),
      // ...extract(request, 'httpBasicAuth', 'auth'),
      // ...extract(request, 'timeout'),
      // ...body(request),
    };
    const urlParams = extract(request, 'urlParameters', 'params').params || {};
    const reqBody = body(request).data || {};
    const hasBody = ['PUT', 'POST', 'PATCH'].indexOf(request.method) >= 0;

    const comment = `/**
${generateComments(urlParams, 'params')}
${generateComments(reqBody, 'data')}
 */
`;
    return (
      comment +
      `export function fName (params${hasBody ? ' ,data' : ''}) {\r\n` +
      `  return request({\r\n` +
      `    method: "${config.method}",\r\n` +
      `    url: "${config.url}",\r\n` +
      `    params: params${hasBody ? ',' : ''}\r\n` +
      `${hasBody ? '    data: data\r\n' : ''}` +
      `  })\r\n` +
      `}`
    );
  };
};

const isEmpty = value => {
  return value === undefined || value === null || (typeof value === 'object' && Object.keys(value).length === 0) || (typeof value === 'string' && value.trim().length === 0);
};

const extract = (request, pawKey, axiosKey = pawKey) => {
  if (request[pawKey] && !isEmpty(request[pawKey])) {
    return { [axiosKey]: request[pawKey] };
  } else {
    return {};
  }
};

const body = request => {
  if (['PUT', 'POST', 'PATCH'].indexOf(request.method) >= 0) {
    return { data: request.jsonBody || request.body || {} };
  } else {
    return {};
  }
};

const generateComments = (obj, type) => {
  console.log(obj, type);
  let ret = [];
  if (Object.keys(obj).length > 0) {
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      ret.push(` * @${type}.${key} ${typeof value}`);
    });
    return ret.join('\r\n');
  } else {
    return ` * @${type}`;
  }
};

AxiosGenerator.identifier = 'dev.yzg.codeGenerator';
AxiosGenerator.title = 'freshes Code Generator';
registerCodeGenerator(AxiosGenerator);
