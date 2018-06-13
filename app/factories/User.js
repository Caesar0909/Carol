import tsUserService from '../services/UserService';
import tsConstants from '../constants';

function User () {
    var dirtyFlag = false;

    var obj = {
        id: null,
        token: null,
        name: '',
        userName: '',
        language: 'en-US',
        timezone: undefined,
        tenantId: null,
        adminConnectorId: '0a0829172fc2433c9aa26460c31b78f0',
        subdomain: null,
        roles: null,
        changePassword: changePassword,
        update: update,
        authorize: authorize,
        unauthorize: unauthorize,
        markAsDirty: markAsDirty,
        hasUnsavedChanges: hasUnsavedChanges,
        isAuthenticated: isAuthenticated,
        isLoggedIn: isLoggedIn,
        addRole: addRole,
        getRole: getRole,
        isExplorer: isExplorer,
        isAdmin: isAdmin
    };

    return obj;

    function changePassword (currentPassword, newPassword, repeatedPassword) {

        var errorMsg = '';

        if (repeatedPassword !== newPassword) {
            errorMsg = 'Passwords do not match';
        }
        else if (currentPassword === newPassword) {
            errorMsg = 'The new password needs to be different from the current Password.';
        }
        else if (newPassword.length < 5) {
            errorMsg = 'The new password needs to have at least 5 characters.';
        }

        if (errorMsg) {
            return Promise.reject(errorMsg);
        }

        return tsUserService.updateUserPassword(this.id, { oldPassword: currentPassword, newPassword: newPassword});
    }

    function markAsDirty (value) {
        if (value === undefined) {
            value = true;
        }
        dirtyFlag = value;

        return value;
    }

    function hasUnsavedChanges () {
        return dirtyFlag;
    }

    function authorize (session) {
      /*
        obj.token = session['access_token'];
        tsCache.$set('token', obj.token);

        tsRestService.configure().token(obj.token);

        $state.disableGoLater(false);
      */
    }

    function unauthorize () {
      /*
        obj.token = null;
        obj.id = null;

        $state.goLater('login');

        $state.disableGoLater();
      */
    }

    function isAuthenticated () {
        return obj.token !== null;
    }

    function isLoggedIn () {
        return obj.id !== null && obj.token !== null;
    }

    function addRole (name, role) {
        if (!obj.roles) {
            obj.roles = {};
        }

        obj.roles[name] = role;
    }

    function getRole (name) {
        return obj.roles && obj.roles[name];
    }

    function isExplorer () {
        return getRole(tsConstants.ROLE_EXPLORER) && !isAdmin();
    }

    function isAdmin () {
        return getRole(tsConstants.ROLE_TENANTADMIN) || getRole(tsConstants.ROLE_CAROL_ADMIN);
    }

    function update (rawData) {

        obj.id = rawData.mdmId;
        obj.name = rawData.mdmName;
        obj.userName = rawData.mdmUserLogin;
        obj.tenantId = rawData.mdmTenantId;
        obj.roles = null;

        if (rawData.mdmRoleNames) {
            rawData.mdmRoleNames.forEach(function (role) {
                obj.addRole(role.toUpperCase(), true);
            });
        }

        // tsCache.$set('userName', obj.userName);
    }
}

export default new User();
