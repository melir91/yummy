import React from 'react';
import {Route} from 'react-router-dom';
import './App.css';
import Navigation from './component/common/Navigation';
import Home from './component/common/Home';
import Users from './component/common/Users';
import SliderConfig from './component/common/SliderConfig';
import Account from './component/common/Account';
import Recipes from './component/common/Recipes';
import LoginForm from './component/forms/LoginForm';
import RegisterForm from './component/forms/RegisterForm';
import RecipeForm from './component/forms/RecipeForm';
import {NotificationContainer} from 'react-notifications';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Navigation />
        <NotificationContainer/>
        <Route path='/' exact component={Home} />
        <Route path='/account' component={Account} />
        <Route path='/slider' component={SliderConfig} />
        <Route path='/users' component={Users} />
        <Route path='/recipes' component={Recipes} />
        <Route path='/login' component={LoginForm} />
        <Route path='/register' component={RegisterForm} />
        <Route path='/create' component={RecipeForm} />
      </div>
    );
  }
}

export default App;
