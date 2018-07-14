import React, {Component} from 'react';
import Formsy from 'formsy-react';
import MyInput from '../common/MyInput';
import {NotificationManager} from 'react-notifications';
import requester from '../../infrastructure/requester';
import observer from '../../infrastructure/observer';

const ADMIN_ROLE_ID = '1752cdb5-511a-4de1-a506-4b8edea12bf4';

export default class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }
    disableButton = () => this.setState({ canSubmit: false });
    enableButton = () => this.setState({ canSubmit: true });

    handleSubmit = formData => {
        const data = {
            username: formData.username,
            password: formData.password
        }
        requester.post('user', 'login', 'basic', data)
            .then(response => {
                observer.trigger(observer.events.loginUser, true);
                sessionStorage.removeItem('dummyUser');
                sessionStorage.setItem('authtoken', response._kmd.authtoken);
                sessionStorage.setItem('userID', response._id);
                sessionStorage.setItem('username', response.username);
                if ('roles' in response._kmd && response._kmd.roles[0].roleId === ADMIN_ROLE_ID) {
                    sessionStorage.setItem('admin', true);
                }
                NotificationManager.success('Now you can add recipes', 'You successfully logged in');
                this.props.history.push('/recipes');
            })
            .catch(response => {
                this.setState({username: '', password: ''})
                NotificationManager.error(response.responseJSON.description, 'Access denied')
            });
    }

    render = () => {
        return (
            <Formsy id="loginForm" onValidSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton}>
                <h2>Sign In</h2>
                <label>Username:</label>
                <MyInput 
                    name="username" 
                    type="text" 
                    value={this.state.username}
                    required 
                    validations={{
                        minLength: 3,
                        isAlpha: true
                    }}
                    validationErrors={{
                        minLength: 'At least 3 characters required',
                        isAlpha: 'Only letters are allowed'
                    }}
                />
                <label>Password:</label>
                <MyInput 
                    name="password" 
                    type="password" 
                    value={this.state.password} 
                    required
                    validations={{
                        minLength: 6, 
                        isAlphanumeric: true
                    }}
                    validationErrors={{
                        minLength: 'At least 6 characters required',
                        isAlphanumeric: 'Only letters/numbers are allowed'
                    }}
                />
                <button id="btnLogin" type="submit" className="btn btn-primary" disabled={!this.state.canSubmit}>Login</button>
            </Formsy>
        );
    }
}