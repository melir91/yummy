import $ from 'jquery';

const kinveyBaseUrl = "https://baas.kinvey.com/";
const kinveyAppKey = "kid_BJt8-tQm7";
const kinveyMasterSecret = "b56d2b887c5649068b6a6883136366a8";
const kinveyAppSecret = "945eb41a46674beda3f3c4442f6726b7";

// Creates the authentication header
function makeAuth(type) {
    if (type === 'basic') {
        return 'Basic ' + btoa(kinveyAppKey + ':' + kinveyAppSecret);
    } else if (type === 'master') {
        return 'Basic ' + btoa(kinveyAppKey + ':' + kinveyMasterSecret);
    } else {
        return 'Kinvey ' + sessionStorage.getItem('authtoken');
    }
}

// Creates request object to kinvey
function makeRequest(method, module, endpoint, auth) {
    return {
        method,
        url: kinveyBaseUrl + module + '/' + kinveyAppKey + '/' + endpoint,
        headers: {
            'Authorization': makeAuth(auth)
        }
    };
}

// Function to return GET promise
function get (module, endpoint, auth) {
    return $.ajax(makeRequest('GET', module, endpoint, auth));
}

// Function to return POST promise
function post (module, endpoint, auth, data) {
    let req = makeRequest('POST', module, endpoint, auth);
    req.data = data;
    return $.ajax(req);
}

// Function to return PUT promise
function update (module, endpoint, auth, data) {
    let req = makeRequest('PUT', module, endpoint, auth);
    req.data = data;
    return $.ajax(req);
}

// Function to return DELETE promise
function remove (module, endpoint, auth) {
    return $.ajax(makeRequest('DELETE', module, endpoint, auth));
}

export default {
    get,
    post,
    update,
    remove
}
