import React, {Component} from 'react';

export default class Recipe extends Component {

    render = () => {
        return (
            <li data-target="#myCarousel" data-slide-to={this.props.index} className={this.props.index === 0 ? 'active' : ''}></li>
        );
    }
}