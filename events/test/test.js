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
const expect      = require('chai').expect;
const events      = require('../events');

describe('events', function () {
  it('should generate \'registered\' xAPI statement from \'Enrolled In Course\' event', function() {
    let event = {
      "event_header": {
        "domain": "edu.byu",
        "entity": "AIM-EH-REGISTRATION",
        "event_type": "Add Class",
        "event_id": "f821baac-1239-4979-b825-5bca4476d372",
        "event_dt": "2017-06-16T19:57:57.00Z"
      },
      "event_body": {
        "year_term": "20175",
        "curriculum_id": "12576",
        "title_code": "000",
        "section_number": "017",
        "credit_hours": "2.0",
        "grade": "",
        "class_repeated": "N",
        "dept_name": "REL A",
        "catalog_number": "275",
        "catalog_suffix": "",
        "date_time_updated": "16 Jun 2017 13:57:57",
        "secure_url": "https://api.byu.edu:443/domains/legacy/academic/registration/studentlog/v1/LOGID/129318790",
        "secure_url_wso2": "https://api.byu.edu:443/domains/legacy/academic/registration/studentlog/v1/LOGID/129318790"
      }
    };
    let xAPIStatement = events.parseEventIntoxAPIStatement(event);
    expect(xAPIStatement).to.equal({

    });
  });
});