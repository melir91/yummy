import React, {Component} from 'react';
import Formsy from 'formsy-react';
import MyInput from '../common/MyInput';
import requester from '../../infrastructure/requester';
import {NotificationManager} from 'react-notifications';

export default class EditForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.recipe.name,
            image: props.recipe.image,
            ingredients: props.recipe.ingredients,
            directions: props.recipe.directions
        };
    }
    disableButton = () => this.setState({ canSubmit: false });
    enableButton = () => this.setState({ canSubmit: true });

    handleSubmit = formData => {
        const endpoint = 'recipes/' + this.props.recipe._id;
        const data = {
            name: formData.name,
            image: formData.image,
            ingredients: formData.ingredients,
            directions: formData.directions
        }
        requester.update('appdata', endpoint, 'kinvey', data)
            .then(response => {
                NotificationManager.success('You can add a new one any time', 'This recipe was updated');
                this.props.closeModal();
                this.props.updateRecipes();
            })
            .catch(response => NotificationManager.error(response.responseJSON.description, 'Recipe edit failed'));
    }

    render = () => {
        return (
            <Formsy id="createPostForm" className="submitForm" onValidSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton}>
                <label>Recipe name:</label>
                <MyInput
                    name="name"
                    type="text"
                    required
                    value={this.state.name}
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
                    value={this.state.ingredients}
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
                    value={this.state.image}
                    validations={{isUrl: true}}
                    validationErrors={{isUrl: 'Please enter a valid URL'}}
                />
                <label>Directions (optional):</label>
                <div className="form-group">
                    <MyInput value={this.state.directions} type="textarea" name="directions" className="form-control"></MyInput>
                </div>
                <button id="btnCreate" type="submit" className="btn btn-primary" disabled={!this.state.canSubmit}>Submit</button>
            </Formsy>
        );
    }
}