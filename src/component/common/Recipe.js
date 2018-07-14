import React, {Component} from 'react';

const NO_IMG_URL = 'https://www.tabithaknowel.com/integrated/uploads/2017/05/noPhotoFound.png';

export default class Recipe extends Component {

    transferViewData = (recipe) => this.props.modal(recipe);
    transferEditData = (recipe) => this.props.edit(recipe);

    render = () => {

        const image = this.props.image || NO_IMG_URL;
        const viewBtn = <li><button className="edit btn btn-success" onClick={() => this.transferViewData(this)}>Details</button></li>
        const editBtn = <li><button className="edit btn btn-warning" onClick={() => this.transferEditData(this)}>Edit</button></li>
        const deleteBtn = <li><button className="delete btn btn-danger" onClick={() => this.props.delete(this.props._id)}>Delete</button></li>

        let controls = <ul className="full-width">{viewBtn}</ul>

        if (sessionStorage.getItem('userID') === this.props._acl.creator || sessionStorage.getItem('admin')) {
            controls = <ul>{viewBtn}{editBtn}{deleteBtn}</ul>
        }

        return (
            <article className="recipe">
                <img src={image} alt="recipe" />
                <div className="details">
                    <h4>{this.props.name}</h4>
                    <div className="controls">
                        {controls}
                    </div>
                </div>
            </article>
        );
    }
}