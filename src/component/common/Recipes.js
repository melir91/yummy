import React, {Component} from 'react';
import {NotificationManager} from 'react-notifications';
import requester from '../../infrastructure/requester';
import Recipe from './Recipe';
import EditForm from '../forms/EditForm';

const NO_IMG_URL = 'http://sdi-total.com/cms/wp-content/themes/SDI/img/noimage.png';

export default class Recipes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            recipes: [],
            modal: ''
        }
    }

    getRecipes = () => {
        if (sessionStorage.getItem('authtoken')) {
            requester.get('appdata', 'recipes', 'kinvey')
                .then(response => {
                    this.setState({recipes: response});
                })
        } else {
            this.authUser();
        }
    }

    renderDetailsModal = recipe => {
        const ingredients = recipe.props.ingredients;
        const ingredientsArr = ingredients.split(';');
        const image = recipe.props.image || NO_IMG_URL;
        const modal = <div className="container">
            <div className="modal fade in show" id="myModal" role="dialog">
                <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" onClick={this.closeModal}>&times;</button>
                        <h4 className="modal-title">{recipe.props.name}</h4>
                    </div>
                    <div className="modal-body">
                        <img src={image} alt="recipe" />
                        <div className="details">
                            <ul>
                                {ingredientsArr.map( (e, i) => <li key={i}>{e}</li>)}
                            </ul>
                            <p className="directions">{recipe.props.directions}</p>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" onClick={this.closeModal}>Close</button>
                    </div>
                </div>
                </div>
            </div>
        </div>
        this.setState({modal});
    }

    renderEditModal = recipe => {
        const modal = <div className="container">
            <div className="modal fade in show" id="myModal" role="dialog">
                <div className="modal-dialog modal-sm"  >
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" onClick={this.closeModal}>&times;</button>
                        <h4 className="modal-title">Edit recipe</h4>
                    </div>
                    <div className="modal-body">
                        <EditForm recipe={recipe.props} closeModal={this.closeModal} updateRecipes={this.getRecipes}/>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" onClick={this.closeModal}>Close</button>
                    </div>
                </div>
                </div>
            </div>
        </div>

        this.setState({modal})
    }

    closeModal = () => this.setState({modal: ''});

    deleteRecipe = (id) => {
        const endpoint = 'recipes/' + id
        requester.remove('appdata', endpoint, 'kinvey')
            .then(response => {
                NotificationManager.info('You can add a new one any time', 'This recipe was removed');
                this.getRecipes();
            })
            .catch(response => NotificationManager.error(response.responseJSON.description, 'This recipe wasn\'t removed'));
    }

    authUser = () => {
        requester.post('user', 'login', 'basic', {username: 'guest', password: 'password'})
            .then(response => {
                sessionStorage.setItem('dummyUser', true);
                sessionStorage.setItem('authtoken', response._kmd.authtoken);
                this.getRecipes();
            })

    }

    componentDidMount = () => this.getRecipes();

    render = () => (
        <section id="Recipes" className="container">
            {this.state.modal}
            {this.state.recipes.map( (r) => <Recipe key={r._id} {...r} modal={this.renderDetailsModal} edit={this.renderEditModal} delete={this.deleteRecipe} />)}
        </section>
    );
}