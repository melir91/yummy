import React, {Component} from 'react';
import {NotificationManager} from 'react-notifications';
import requester from '../../infrastructure/requester';

const ADMIN_ROLE_ID = '1752cdb5-511a-4de1-a506-4b8edea12bf4';

export default class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: []
        }
    }

    retrieveCustomers = () =>
        requester.get('user', '', 'kinvey')
            .then(response => {
                this.setState({
                    users: response
                })
            });

    componentDidMount = () => this.retrieveCustomers();

    deleteUser = (userId) => {
        requester.remove('user', userId, 'kinvey')
            .then(response => {
                NotificationManager.success('Please be careful when you delete users!', 'This user was deleted');
                this.retrieveCustomers();
            })
            .catch(response => NotificationManager.error(response.responseJSON.description, 'This user wasn\'t deleted'));
    }

    makeAdmin = (userId) => {
        const endpoint = userId + '/roles/' + ADMIN_ROLE_ID;
        requester.update('user', endpoint, 'kinvey')
            .then(response => {
                NotificationManager.success('Please be careful when you give permisions to users!', 'This user was promoted to admin');
                this.retrieveCustomers();
            })
            .catch(response => NotificationManager.error(response.responseJSON.description, 'Something get wrong'));
    }

    render() {
        return (
            <section id="MyAccount">
                <h1>Registered users</h1>

                <div id="MyInfo">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Nickname</th>
                                <th scope="col">ID</th>
                                <th scope="col">Role</th>
                                <th scope="col">Delete</th>
                                <th scope="col">Give access</th>
                            </tr>
                        </thead>
                        <tbody className="users">
                            {this.state.users.map((user, index) => {
                                return (
                                    <tr key={index} className={'roles' in user._kmd && user._kmd.roles[0].roleId === ADMIN_ROLE_ID ? 'admin' : ''}>
                                    <th scope="row">{index}</th>
                                        <td>{user.username}</td>
                                        <td>{user._id}</td>
                                        <td>{'roles' in user._kmd && user._kmd.roles[0].roleId === ADMIN_ROLE_ID ? 'Admin' : 'User'}</td>
                                        <td><button className="delete btn btn-danger" onClick={() => this.deleteUser(user._id)}>Delete</button></td>
                                        <td><button className="give-access btn btn-warning" onClick={() => this.makeAdmin(user._id)}>Make Admin</button></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        );
    }
}