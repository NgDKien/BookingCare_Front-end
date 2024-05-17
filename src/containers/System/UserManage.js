import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUsers, createNewUserService, deleteUserService, editUserService } from '../../services/userService';
import ModalUser from './ModalUser';
import {emitter} from '../../utils/emitter';
import ModalEditUser from './ModalEditUser';
class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEdit: {}
        }
    }

    async componentDidMount() {
        await this.getAllUsersFromReact();
    }

    handleAddNewUser = () => {
        this.setState ({
            isOpenModalUser: true,
        })
    }

    toggleUserModal = () => {
        this.setState ({
            isOpenModalUser: !this.state.isOpenModalUser,
        })
    }

    toggleUserEditModal = () => {
        this.setState ({
            isOpenModalEditUser: !this.state.isOpenModalEditUser,
        })
    }

    getAllUsersFromReact = async () => {
        let response = await getAllUsers('ALL');
        if(response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users   
            })

        }
    }

    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data);
            if(response && response.errCode !== 0) {
                alert (response.errMessage)
            } else {
                //render lại ra view react
                await this.getAllUsersFromReact();
                this.setState({
                    isOpenModalUser: false
                })
                //bắn event
                emitter.emit('EVENT_CLEAR_MODAL_DATA')
            }
        } catch(e) {
            console.log(e)
        }
    }

    handleDeleteUser = async (user) => {
        console.log('delete', user)
        try {
            let res = await deleteUserService(user.id);
            if (res && res.errCode === 0) {
                //render lại ra view
                await this.getAllUsersFromReact();
            } else {
                alert(res.errMessage)
            }
        } catch(e) {
            console.log(e);
        }
    }

    handleEditUser = (user) => {
        console.log('check edit', user)
        this.setState ({
            isOpenModalEditUser: true,
            userEdit: user
        })
    }

    doEditUser = async (user) => {
        try {
            let res = await editUserService(user);
            if (res && res.errCode === 0) {
                this.setState ({
                    isOpenModalEditUser: false
                })
                await this.getAllUsersFromReact()
            } else {
                alert (res.errCode)
            }
        } catch(e) {
            console.log(e)
        }

    }

    render() {
        let arrUsers = this.state.arrUsers;
        return (
            <div className="users-container">
                <ModalUser
                    isOpen = {this.state.isOpenModalUser}
                    toggleFromParent = {this.toggleUserModal}
                    createNewUser = {this.createNewUser}
                
                />
                { this.state.isOpenModalEditUser &&
                    <ModalEditUser
                        isOpen = {this.state.isOpenModalEditUser}
                        toggleFromParent = {this.toggleUserEditModal}
                        currentUser = {this.state.userEdit}
                        editUser = {this.doEditUser}
                    />
                }
                <div className ="title text-center">Manage users react</div>
                <div className = "mx-1">
                    <button className = "btn btn-primary px-3"
                    onClick = {() => this.handleAddNewUser()}>Add new user</button>
                </div>
                <div className = "users-table mt-3 mx-1">
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th>Email</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Address</th>
                                <th>Action</th>
                            </tr>
                            { arrUsers && arrUsers.map((item, index) => {
                                console.log('check map', item, index)
                                return (
                                    <tr>
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>
                                            <button onClick = {() => {this.handleEditUser(item)}}>Edit</button>
                                            <button onClick = {() => {this.handleDeleteUser(item)}}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })
                            }
                        </tbody> 
                    </table>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
