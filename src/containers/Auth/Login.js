import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";

// import * as actions from "../store/actions";
import * as actions from "../../store/actions";


import './Login.scss';
import { FormattedMessage } from 'react-intl';
import { handleLoginApi } from '../../services/userService';

// import adminService from '../services/adminService';
// import { divide } from 'lodash';

class Login extends Component {
    constructor(props) {
        super(props);
        this.btnLogin = React.createRef();
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
            errMessage: '',
        }
    }

    handleOnChangeUsername = (event) => {
        this.setState ({
            username: event.target.value
        })
    }

    handleOnChangePassword = (event) => {
        this.setState ({
            password: event.target.value
        })
    }

    handleLogin = async () => {
        this.setState({
            errMessage: ''
        })
        console.log("username: ", this.state.username, "password: ", this.state.password);
        console.log("allstate: ", this.state);
        try {
            let data = await handleLoginApi(this.state.username, this.state.password);
            if (data && data.errCode !== 0 ) {
                this.setState ({
                    errMessage: data.message
                })
            }
            if (data && data.errCode === 0) {
                this.props.userLoginSuccess(data.user)
                console.log('login succeeds', data.user)
            }
        } catch (error) {
            if(error.response) {
                if(error.response.data) {
                    this.setState ({
                        errMessage: error.response.data.message
                    })
                }
            }
            console.log(error.response)
        }
    }

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    handleKeyDown = (event) => {
        if(event.key === 'Enter' || event.keyCode === 13) {
            this.handleLogin();
        }
    }

    render() {

        return (
            <div className = "login-background">
                <div className = "login-container">
                    <div className = "login-content row">
                        <div className = "col-12 text-login">Login</div>
                        <div className = "col-12 form-group login-input">
                            <label>Username:</label>
                            <input type = "text" className ="form-control" placeholder = "Enter your usename"
                                   value = {this.state.username}
                                   onChange = {(event) => this.handleOnChangeUsername(event)}/>
                        </div>
                        <div className = "col-12 form-group login-input">
                            <label>Password:</label>
                            <div className = "custom-input-password">
                                <input type = {this.state.isShowPassword ? 'text' : 'password'} className = "form-control" placeholder = "Enter your password"
                                    value = {this.state.password}
                                    onChange = {(event) => this.handleOnChangePassword(event)}
                                    onKeyDown= {(event) => this.handleKeyDown(event)}/>
                                <span onClick = {() => {this.handleShowHidePassword()}}>
                                    <i className={this.state.isShowPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                                </span>
                            </div>
                        </div>
                        <div className = "col-12" style = {{color: 'red'}}>
                            {this.state.errMessage}
                        </div>
                        <div className = "col-12">
                            <button className = "btn-login" onClick = {() => {this.handleLogin()}}>Login</button>
                        </div>
                        <div className = "col-12">
                            <span className = "forgot-password">Forgot password !</span>
                        </div>
                        <div className ="col-12 text-center mt-3">
                            <span className = "text-other-login">Or login with:</span>
                        </div>
                        <div className = "col-12 social-login">
                            <i className="fab fa-google google"></i>
                            <i className="fab fa-facebook-f facebook"></i>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        // userLoginFail: () => dispatch(actions.adminLoginFail()),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
