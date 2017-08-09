/*
 * Copyright 2017 Brigham Young University
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
"use strict";

const crypto = require('crypto');
const util    = require('./util');

function verifyEventHubInvocation(event_body, hmac_hash, hmac_secret) {
  try {
    let digest = crypto.createHmac('md5', hmac_secret).update(event_body).digest('hex');
    return digest === hmac_hash;
  } catch (e) {
    console.log(e);
    return false;
  }
}

function lambdaProxyResponse(error, data, callback) {
  if(error) {
    callback({
      statusCode: 400,
      headers: {},
      body: JSON.stringify(error)
    });
  }
  else {
    callback(null,{
      statusCode: 200,
      headers: {},
      body: JSON.stringify(data)
    });
  }
}


exports.handler = function(event,context,callback) {

  let header_X_Byu_Eventhub_Hmac_Md5 = event.headers['X-BYU-EventHub-Hmac-MD5'];
  util.getConfig().then(function (config) {
    verifyEventHubInvocation(event.body, header_X_Byu_Eventhub_Hmac_Md5, config.hmac_secret)
      .then(function (verified) {
        if (!verified) {
          callback(null, {
            statusCode: 403,
            headers: {},
            body: "Not Authorized"
          });
        }
        else {
          console.log("event: ", JSON.stringify(event));

          lambdaProxyResponse(null,"Success",callback);
        }
      });
  });
};