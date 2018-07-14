import React, {Component} from 'react';

export default class Recipe extends Component {

    render = () => {
        return (
            <div className={this.props.index === 0 ? 'item active' : 'item'}>
                <img src={this.props.image} alt={this.props.name}/>
                <div className="carousel-caption">
                    <h3>{this.props.name}</h3>
                </div>
            </div>
        );
    }
}