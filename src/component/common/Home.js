import React, {Component} from 'react';
import Dot from '../slider/Dot';
import Slide from '../slider/Slide';
import requester from '../../infrastructure/requester';

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            slider: [],
        }
    }

    getSlider = () => {
        const endpoint = 'recipes?query={"slider": "true"}';
        if (sessionStorage.getItem('authtoken')) {
            requester.get('appdata', endpoint, 'kinvey')
                .then(response => {
                    this.setState({slider: response});
                })
        } else {
            this.authUser();
        }
    }

    authUser = () => {
        requester.post('user', 'login', 'basic', {username: 'guest', password: 'password'})
            .then(response => {
                sessionStorage.setItem('dummyUser', true);
                sessionStorage.setItem('authtoken', response._kmd.authtoken);
                this.getSlider();
            })

    }

    componentDidMount = () => this.getSlider();

    render = () => {
        return (
            <div id="myCarousel" className="carousel slide" data-ride="carousel">
                <ol className="carousel-indicators">
                    {this.state.slider.map( (slide, index) => <Dot key={index} index={index} />)}
                </ol>

                <div className="carousel-inner">
                    {this.state.slider.map( (slide, index) => <Slide key={index} index={index} {...slide} />)}
                </div>

                <a className="left carousel-control" href="#myCarousel" data-slide="prev">
                    <span className="glyphicon glyphicon-chevron-left"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="right carousel-control" href="#myCarousel" data-slide="next">
                    <span className="glyphicon glyphicon-chevron-right"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>
        );
    }
}