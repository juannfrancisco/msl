/**
 * Copyright (c) 2014 Netflix, Inc.  All rights reserved.
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
 * Test user ID token authentication factory.
 * 
 * @author Wesley Miaw <wmiaw@netflix.com>
 */
var MockUserIdTokenAuthenticationFactory = UserAuthenticationFactory.extend({
    /**
     * Create a new test user ID token authentication factory. By default no
     * tokens are accepted.
     */
    init: function init() {
        init.base.call(this, UserAuthenticationScheme.USER_ID_TOKEN);
        
        // The properties.
        var props = {
            masterToken: { value: null, writable: true, configurable: false },
            userIdToken: { value: null, writable: true, configurable: false },
        };
        Object.defineProperties(this, props);
    },

    /**
     * <p>Set the master token and user ID token pair to accept. The user ID
     * token must be bound to the master token.</p>
     * 
     * @param {MasterToken} masterToken the master token to accept.
     * @param {UserIdToken} userIdToken the user ID token to accept.
     */
    setTokens: function setTOkens(masterToken, userIdToken) {
        if (!userIdToken.isBoundTo(masterToken))
            throw new MslInternalException("The user ID token must be bound to the master token.");
        this.masterToken = masterToken;
        this.userIdToken = userIdToken;
    },

    /** @inheritDoc */
    createData: function createData(ctx, masterToken, userAuthJO, callback) {
        UserIdTokenAuthenticationData$parse(ctx, userAuthJO, callback);
    },

    /** @inheritDoc */
    authenticate: function authentication(ctx, identity, data, userIdToken) {
        // Make sure we have the right kind of user authentication data.
        if (!(data instanceof UserIdTokenAuthenticationData))
            throw new MslInternalException("Incorrect authentication data type " + data + ".");
        var uitad = data;
        
        // Extract and check master token.
        var uitadMasterToken = uitad.masterToken;
        var uitadIdentity = uitadMasterToken.identity;
        if (!uitadIdentity)
            throw new MslUserAuthException(MslError.USERAUTH_MASTERTOKEN_NOT_DECRYPTED).setUser(uitad);
        if (identity != uitadIdentity)
            throw new MslUserAuthException(MslError.USERAUTH_ENTITY_MISMATCH, "entity identity " + identity + "; uad identity " + uitadIdentity).setUser(uitad);
        
        // Authenticate the user.
        var uitadUserIdToken = uitad.userIdToken;
        var user = uitadUserIdToken.user;
        if (!user)
            throw new MslUserAuthException(MslError.USERAUTH_USERIDTOKEN_NOT_DECRYPTED).setUser(uitad);
        
        // Verify the user.
        if (!uitadMasterToken.equals(masterToken) ||
            !uitadUserIdToken.equals(userIdToken))
        {
            throw new MslUserAuthException(MslError.USERAUTH_ENTITYUSER_INCORRECT_DATA, "Authentication scheme " + this.scheme.name + " not permitted for entity " + identity + ".").setUser(data);
        }
        
        // If a user ID token was provided validate the user identities.
        if (userIdToken) {
            var uitUser = userIdToken.user;
            if (!user.equals(uitUser))
                throw new MslUserAuthException(MslError.USERIDTOKEN_USERAUTH_DATA_MISMATCH, "uad user " + user + "; uit user " + uitUser).setUser(uitad);
        }
        
        // Return the user.
        return user;
    },
});