import React, {Component} from 'react';
import {NotificationManager} from 'react-notifications';
import requester from '../../infrastructure/requester';
import Image from '../common/SliderConfigImage';

export default class SLiderConfig extends Component {
    constructor(props) {
        super(props);

        this.state = {
            recipes: []
        };
    }

    getRecipes = () => {
        requester.get('appdata', 'recipes', 'kinvey')
            .then(response => {
                this.setState({recipes: response});
            })
    }

    modifySlider = (clickedRecipe) => {
        const endpoint = 'recipes/' + clickedRecipe._id;
        const status = clickedRecipe.slider ? '' : true;
        let data = {
            name: clickedRecipe.name,
            image: clickedRecipe.image,
            ingredients: clickedRecipe.ingredients,
            directions: clickedRecipe.directions
        }

        if (status) {
            data = {
                slider: status,
                name: clickedRecipe.name,
                image: clickedRecipe.image,
                ingredients: clickedRecipe.ingredients,
                directions: clickedRecipe.directions
            }
        }

        requester.update('appdata', endpoint, 'kinvey', data)
            .then(response => {
                if (status) {
                    NotificationManager.success('You can check the homepage for your changes', 'This recipe was added to Slider');
                } else {
                    NotificationManager.success('You can check the homepage for your changes', 'This recipe was removed from Slider');
                }
                this.getRecipes();
            })
            .catch(response => NotificationManager.error(response.responseJSON.description, 'Slider update failed'));
    }

    componentDidMount = () => this.getRecipes();


    render = () => (
        <div>
            <h1>Slider Configuration</h1>
            <section id="SlideConfig" className="container">
                {this.state.recipes.map( (r) => <Image key={r._id} {...r} modify={this.modifySlider} />)}
            </section>
        </div>
    );
}