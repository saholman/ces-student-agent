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
const byuRequest    = require('byu-request');

exports.enrichEventData = function (event) {
  // Invoke secure_url to retrieve student data
  event.event_body.byu_id = "123456789";
};
exports.parseEventIntoxAPIStatement = function (event) {
  let renderedStatement = {};
  let now = new Date();
  if(argv.e === "Enrolled In Course") {
    renderedStatement = {
      "timestamp": now.toISOString(),
      "actor":{
        "account":{
          "homePage":"http://byu.edu/",
          "name":event.byu_id
        }
      },
      "verb":{
        "id":"http://adlnet.gov/expapi/verbs/registered",
        "display":{
          "en-US":"registered"
        }
      },
      "object":{
        "id":"http://api.byu.edu/classes/20175,06387,001,001",
        "definition":{
          "name":{
            "en-US":"MATH 110"
          },
          "description":{
            "en-US":"College Algebra"
          },
          "type": "http://adlnet.gov/expapi/activities/course",
          "extensions": {
            "http://byu.edu/expapi/extensions/institution": "BYU",
            "http://byu.edu/expapi/extensions/year_term": "20175",
            "http://byu.edu/expapi/extensions/curriculum_id": "06387",
            "http://byu.edu/expapi/extensions/title_code": "001",
            "http://byu.edu/expapi/extensions/section_number": "001",
            "http://byu.edu/expapi/extensions/subject_area": "MATH",
            "http://byu.edu/expapi/extensions/catalog_number": "110",
            "http://byu.edu/expapi/extensions/catalog_suffix": "",
            "http://byu.edu/expapi/extensions/course_title": "College Algebra",
            "http://byu.edu/expapi/extensions/section_type": "DAY",
            "http://byu.edu/expapi/extensions/credit_hours": 3.0,
            "http://byu.edu/expapi/extensions/audit": false,
            "http://byu.edu/expapi/extensions/instructors": [
              {
                "id": "123456789",
                "name": "Billy Jones",
                "type": "Primary"
              }
            ]
          }
        }
      },
      "context":{
        "contextActivities":{
          "category": [
            {
              "id": "https://byu.edu/expapi/ces"
            }
          ]
        }
      }
    };
  }
};