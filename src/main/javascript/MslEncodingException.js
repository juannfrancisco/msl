/**
 * Copyright (c) 2012-2014 Netflix, Inc.  All rights reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Thrown when an encoding exception occurs within the Message Security Layer.
 *
 * @author Wesley Miaw <wmiaw@netflix.com>
 */
var MslEncodingException = MslException.extend({
    /**
     * Construct a new MSL encoding exception with the specified error, details,
     * and cause.
     *
     * @param {MslError} error the error.
     * @param {string} details the details text. May be null or undefined.
     * @param {Error} cause the cause. May be null or undefined.
     * @constructor
     */
    init: function init(error, details, cause) {
        init.base.call(this, error, details, cause);

        // The properties.
        var props = {
            name: { value: "MslEncodingException", writable: false, configurable: true }
        };
        Object.defineProperties(this, props);
    },
});
