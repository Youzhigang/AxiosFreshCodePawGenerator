const Mustache = require('./mustache');
const codeGenerator = function() {
  // eslint-disable-next-line no-unused-vars
  this.generate = function(context, requests, options) {
    const request = requests[0];
    
    const config = {
      method: request.method,
      url: request.urlBase
    };
    const urlParams = extract(request, 'urlParameters', 'params').params || {};
    const reqBody = body(request).data || {};
    config.hasBody = ['PUT', 'POST', 'PATCH'].indexOf(request.method) >= 0;
    config.urlParamsComments = generateComments(urlParams, 'params')
    config.bodyComments = generateComments(reqBody, 'data')
    // eslint-disable-next-line no-undef
    const template = readFile("code.mustache");
    return Mustache.render(template, config)
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

  if (typeof obj === 'string') {
    obj = JSON.parse(obj)
  }
  let ret = [];
  if (Object.keys(obj).length > 0) {
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      ret.push(`@${type}.${key} ${typeof value}`);
    });
    return ret;
  } else {
    return [];
  }
};

codeGenerator.identifier = 'dev.yzg.codeGenerator';
codeGenerator.title = 'freshes Code Generator';
// eslint-disable-next-line no-undef
registerCodeGenerator(codeGenerator);
