import React, {Component} from 'react';
import Formsy from 'formsy-react';
import MyInput from '../common/MyInput';
import {NotificationManager} from 'react-notifications';
import requester from '../../infrastructure/requester';
import observer from '../../infrastructure/observer';

export default class RegisterForm extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    disableButton = () => this.setState({ canSubmit: false });
    enableButton = () => this.setState({ canSubmit: true });

    loginUser = formData => {
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
                NotificationManager.success('Now you can add recipes', 'You successfully logged in');
                this.props.history.push('/recipes');
            })
            .catch(response => NotificationManager.error(response.responseJSON.description, 'Access denied'));
    }

    handleSubmit = formData => {
        const data = {
            username: formData.username,
            password: formData.password
        }
        requester.post('user', '', 'basic', data)
            .then(response => {
                NotificationManager.success('You successfully register', 'Congrats!');
                this.loginUser(formData);
            })
            .catch(response => {
                this.setState({username: '', password: '', repeatPass: ''})
                NotificationManager.error(response.responseJSON.description, 'Registration failed')
            });
    }

    render = () => {
        return (
            <Formsy id="registerForm" onValidSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton}>
                <h2>Register</h2>
                <label>Username:</label>
                <MyInput
                    name="username"
                    type="text"
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
                    required 
                    validations={{
                        minLength: 6, 
                        isAlphanumeric: true
                    }}
                    validationErrors={{
                        minLength: 'At least 6 characters required',
                        isAlpha: 'Only letters/numbers are allowed'
                    }}
                />
                <label>Repeat Password:</label>
                <MyInput 
                    name="repeatPass" 
                    type="password"
                    required 
                    validations={{
                        minLength: 6, 
                        isAlphanumeric: true,
                        equalsField: 'password'
                    }}
                    validationErrors={{
                        minLength: 'At least 6 characters required',
                        isAlpha: 'Only letters/numbers are allowed',
                        equalsField: 'Password did not match'
                    }}
                />
                <button id="btnRegister" type="submit" className="btn btn-primary" disabled={!this.state.canSubmit}>Register</button>
            </Formsy>
        );
    }
}