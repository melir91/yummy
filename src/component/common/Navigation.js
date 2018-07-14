import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import observer from '../../infrastructure/observer';

export default class Navigation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loginUser: null
        }

        observer.subscribe(observer.events.loginUser, this.setUserLoggedIn);
    }

    setUserLoggedIn = () => this.setState({ loginUser: true });

    logout = () => {
        this.setState({ loginUser: false});
        sessionStorage.clear();
    }

    render = () => {
        let authSection, navSection;

        navSection = <ul className="nav navbar-nav">
            <li><NavLink className="nav" to="/recipes">Recipes</NavLink></li>
        </ul>

        authSection = <ul className="nav navbar-nav navbar-right">
            <li><NavLink to="/register"><span className="glyphicon glyphicon-user"></span> Sign Up</NavLink></li>
            <li><NavLink to="/login"><span className="glyphicon glyphicon-log-in"></span> Login</NavLink></li>
        </ul>

        if (this.state.loginUser || (!sessionStorage.getItem('dummyUser') && sessionStorage.getItem('authtoken'))) {
            authSection = <ul className="nav navbar-nav navbar-right">
                <li>
                    <NavLink className="greeting" to="/account">
                    <span className="glyphicon glyphicon-user"></span> {sessionStorage.getItem('username')}
                    </NavLink></li>
                <li>
                    <NavLink id="linkMenuLogout" onClick={this.logout} to='/'>
                        <span className="glyphicon glyphicon-log-out"></span> Logout
                    </NavLink>
                </li>
            </ul>

            navSection = <ul className="nav navbar-nav">
                <li><NavLink className="nav" to="/recipes">Recipes</NavLink></li>
                <li><NavLink className="nav" to="/create">Create</NavLink></li>
            </ul>
        }

        if (this.state.loginUser || (!sessionStorage.getItem('dummyUser') && sessionStorage.getItem('authtoken'))) {
            navSection = <ul className="nav navbar-nav">
                <li><NavLink className="nav" to="/recipes">Recipes</NavLink></li>
                <li><NavLink className="nav" to="/create">Create</NavLink></li>
            </ul>
            if (sessionStorage.getItem('admin')) {
                navSection = <ul className="nav navbar-nav">
                    <li><NavLink className="nav" to="/recipes">Recipes</NavLink></li>
                    <li><NavLink className="nav" to="/users">Users</NavLink></li>
                    <li><NavLink className="nav" to="/slider">Slider</NavLink></li>
                    <li><NavLink className="nav" to="/create">Create</NavLink></li>
                </ul>
            }
        }

        return (
            <nav className="navbar navbar-light">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <NavLink className="navbar-brand" to="/">Yummy</NavLink>
                    </div>
                    {navSection}
                    {authSection}
                </div>
            </nav>
        );
    }
}