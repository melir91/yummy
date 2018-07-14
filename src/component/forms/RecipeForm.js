import React, {Component} from 'react';
import Formsy from 'formsy-react';
import MyInput from '../common/MyInput';
import requester from '../../infrastructure/requester';
import {NotificationManager} from 'react-notifications';
import {Redirect} from 'react-router-dom';

export default class RecipeForm extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }
    disableButton = () => this.setState({ canSubmit: false });
    enableButton = () => this.setState({ canSubmit: true });

    handleSubmit = formData => {
        const data = {
            name: formData.name,
            image: formData.image,
            ingredients: formData.ingredients,
            directions: formData.directions
        }
        requester.post('appdata', 'recipes', 'kinvey', data)
            .then(response => {
                NotificationManager.success('Now you can see your posted recipe', 'You successfully submit a recipe');
                this.props.history.push('/recipes');
            })
            .catch(response => NotificationManager.error(response.responseJSON.description, 'Recipe submit failed'));
    }

    render = () => {
        if ((sessionStorage.getItem('dummyUser') || !sessionStorage.getItem('authtoken'))) {
            return <Redirect to='/' />
        } else {
            return (
                <Formsy id="createPostForm" className="submitForm" onValidSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton}>
                    <h2>Create recipe</h2>
                    <label>Recipe name:</label>
                    <MyInput 
                        name="name" 
                        type="text"
                        required 
                        validations={{
                            minLength: 3,
                            matchRegexp: /^[a-zA-Z\s]*$/
                            }}
                        validationErrors={{
                            minLength: 'At least 3 characters required',
                            matchRegexp: 'Only letters and spaces are allowed'
                        }}
                    />
                    <label>Ingredients:</label>
                    <small className="form-text text-muted"> Separate them with semicolons</small>
                    <MyInput 
                        name="ingredients" 
                        type="text"
                        required
                        validations={{
                            minLength: 20
                        }}
                        validationErrors={{
                            minLength: 'At least 20 characters required'
                        }}
                    />
                    <label>Image url (optional):</label>
                    <MyInput 
                        name="image" 
                        type="text"
                        validations={{isUrl: true}}
                        validationErrors={{isUrl: 'Please enter a valid URL'}}
                    />
                    <label>Directions (optional):</label>
                    <div className="form-group">
                        <MyInput type="textarea" name="directions" className="form-control"></MyInput>
                    </div>
                    <button id="btnCreate" type="submit" className="btn btn-primary" disabled={!this.state.canSubmit}>Submit</button>
                </Formsy>
            );
        }
    }
}