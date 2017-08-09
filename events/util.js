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

const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(Promise);
const ssm = new AWS.SSM({apiVersion: '2014-11-06'});

var config = {};

exports.getConfig = function () {
  if(config.hmac_secret) {
    return new Promise.resolve(config);
  }
  else {
    let params = {
      Names: [
        'ces-student-agent-events-'+process.env.HANDEL_ENVIRONMENT_NAME.toUpperCase()+'-hmacsecret',
        'ces-student-agent-events-'+process.env.HANDEL_ENVIRONMENT_NAME.toUpperCase()+'-client_id',
        'ces-student-agent-events-'+process.env.HANDEL_ENVIRONMENT_NAME.toUpperCase()+'-client_secret'
      ],
      WithDecryption: true
    };
    return ssm.getParameters(params).promise()
      .then(response => {
        config.hmac_secret   = response.Parameters[0].Value;
        config.client_id     = response.Parameters[1].Value;
        config.client_secret = response.Parameters[2].Value;
      })
      .catch(function (error) {
        console.log(error);
        return {};
      });
  }
};
