import React, {Component} from 'react';

const NO_IMG_URL = 'http://sdi-total.com/cms/wp-content/themes/SDI/img/noimage.png';

export default class SliderConfigImage extends Component {

    render = () => {

        const image = this.props.image || NO_IMG_URL;

        return (
            <article className={this.props.slider ? 'recipe active' : 'recipe'}>
                <img src={image} alt="recipe" onClick={() => this.props.modify(this.props)} />
            </article>
        );
    }
}