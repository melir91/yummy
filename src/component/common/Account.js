import React, {Component} from 'react';
import Formsy from 'formsy-react';
import MyInput from '../common/MyInput';
import {Redirect} from 'react-router-dom';
import {NotificationManager} from 'react-notifications';
import requester from '../../infrastructure/requester';

export default class Account extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    disableButton = () => this.setState({ canSubmit: false });
    enableButton = () => this.setState({ canSubmit: true });

    retrieveCustomer = () =>
        requester.get('user', '', 'kinvey')
            .then(response => {this.setState({username: response[0].username})});

    handleSubmit = formData => {
        const data = {
            username: formData.username,
            password: formData.password
        }
        const endpoint = sessionStorage.getItem('userID');
        requester.update('user', endpoint, 'kinvey', data)
            .then(response => {
                console.log(response);
                this.setState({password: '', repeatPass: ''})
                sessionStorage.setItem('authtoken', response._kmd.authtoken);
                NotificationManager.success('You successfully changed your password', 'Password changed');
            })
            .catch(response => {
                this.setState({password: '', repeatPass: ''})
                NotificationManager.error(response.responseJSON.description, 'Password change failed')
            });
    }

    componentDidMount = () => this.retrieveCustomer();

    render = () => {
        if ((sessionStorage.getItem('dummyUser') || !sessionStorage.getItem('authtoken'))) {
            return <Redirect to='/' />
        } else {
            return (
                <Formsy id="registerForm" onValidSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton}>
                    <h2>Change your password</h2>
                    <label>Username:</label>
                    <MyInput
                        name="username"
                        type="text"
                        value={this.state.username}
                        disabled="true"
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
                    <button id="btnRegister" type="submit" className="btn btn-primary" disabled={!this.state.canSubmit}>Update</button>
                </Formsy>
            );
        }
    }
}