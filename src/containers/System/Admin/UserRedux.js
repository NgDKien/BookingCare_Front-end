import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import {languages, CRUD_ACTIONS, CommonUtils} from "../../../utils";
import * as actions from"../../../store/actions";
import './UserRedux.scss';
import TableManageUser from './TableManageUser';
import { dispatch } from '../../../redux';

class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgURL: '',
            
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            position: '',
            role: '',
            avatar: '',

            action: '',
            userEditId: ''
        }
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
        // try {
        //     let res = await getAllCodeService('gender')
        //     if(res && res.errCode === 0) {
        //         this.setState({
        //             genderArr: res.data
        //         })
        //     }
        //     console.log('asjaskj', res)
        // }catch(e) {
        //     console.log(e);
        // }
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.genderRedux !== this.props.genderRedux) {
            //Gán default dropdown cho gender
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''
            })
        }
        if(prevProps.roleRedux !== this.props.roleRedux) {
            //Gán default dropdown cho role
            let arrRoles = this.props.roleRedux;
            this.setState({
                roleArr: arrRoles,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : '',
            })
        }
        if(prevProps.positionRedux !== this.props.positionRedux) {
            //Gán default dropdown cho position
            let arrPositions = this.props.positionRedux;
            this.setState({
                positionArr: arrPositions,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : '',
            })
        }
        //Khi có sự thay đổi về list user
        if (prevProps.listUsers !== this.props.listUsers) {
            //Gán default cho 3 dropdown khi tạo mới người dùng
            let arrGenders = this.props.genderRedux;
            let arrRoles = this.props.roleRedux;
            let arrPositions = this.props.positionRedux;
            this.setState ({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : '',
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : '',
                avatar: '',   
                action: CRUD_ACTIONS.CREATE,
                previewImgURL: '',
            })
        }
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if(file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState ({
                previewImgURL: objectUrl,
                avatar: base64
            })
        }
    }

    onChangeInput = (event, id) => {
        let copyState = {...this.state}
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }

    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if(isValid === false) return;
        
        let {action} = this.state;
        if(action === CRUD_ACTIONS.CREATE) {
            //fire create user action
            this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                gender: this.state.gender,
                roleId: this.state.role,
                phoneNumber: this.state.phoneNumber,
                positionId: this.state.position,
                avatar: this.state.avatar,
            })
        }
        if (action === CRUD_ACTIONS.EDIT) {
            //fire edit user action
            this.props.editAUserRedux ({
                id: this.state.userEditId,
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                gender: this.state.gender,
                roleId: this.state.role,
                phoneNumber: this.state.phoneNumber,
                positionId: this.state.position,
                avatar: this.state.avatar,
            })
        }
    }

    //Validate form
    checkValidateInput = () => {
        let isValid = true;
        let arrCheck = ['email', 'password', 
            'firstName', 'lastName', 'phoneNumber', 'address']
        for (let i = 0; i < arrCheck.length; i++) {
            if(!this.state[arrCheck[i]]) {
                isValid = false;
                alert('missing'+arrCheck[i])
                break;
            }
        }
        return isValid;
    }

    handleEditUserFromParent = (user) => {
        let imageBase64 = '';
        if (user.image) {
            imageBase64 = new Buffer(user.image, 'base64').toString('binary');
        }
        this.setState ({
            email: user.email,
            password: 'hardcode',
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            gender: user.gender,
            role: user.roleId,
            position: user.positionId,
            avatar: '',
            previewImgURL: imageBase64,  
            action: CRUD_ACTIONS.EDIT ,
            userEditId: user.id
        })
    }

    render() {
        let genders = this.state.genderArr;
        let language = this.props.language;
        let isGetGender = this.props.isLoadingGender;
        let roles = this.state.roleArr;
        let positions = this.state.positionArr;

        //let email = this.state.email
        let {email, password, 
            firstName, lastName, phoneNumber,
            address, gender, 
            position, role, avatar} = this.state;
        return (
            <div className ="user-redux-container">
                <div className = "title">
                    React-Redux 
                </div>
                <div className="user-redux-body" >
                    <div className = "container">
                        <div className = "row">
                            <div className = "col-12 my-3"><FormattedMessage id = "manage-user.add"/></div>
                            <div className = "col-12">{isGetGender === true ? "Loading genders" : ''}</div>
                            <div className = "col-3">
                                <label><FormattedMessage id = "manage-user.email"/></label>
                                <input className = "form-control"type = "email"
                                       value = {email}
                                       onChange = {((event) => {this.onChangeInput(event, 'email')})}
                                       disabled = {this.state.action === CRUD_ACTIONS.EDIT ? true : false}/>
                            </div>
                            <div className = "col-3">
                                <label><FormattedMessage id = "manage-user.password"/></label>
                                <input className = "form-control"type = "password"
                                       value = {password}
                                       onChange = {((event) => {this.onChangeInput(event, 'password')})}
                                       disabled = {this.state.action === CRUD_ACTIONS.EDIT ? true : false}/>
                            </div>
                            <div className = "col-3">
                                <label><FormattedMessage id = "manage-user.firstname"/></label>
                                <input className = "form-control"type = "text"
                                       value = {firstName}
                                       onChange = {((event) => {this.onChangeInput(event, 'firstName')})}/>
                            </div>
                            <div className = "col-3">
                                <label><FormattedMessage id = "manage-user.lastname"/></label>
                                <input className = "form-control"type = "text"
                                       value = {lastName}
                                       onChange = {((event) => {this.onChangeInput(event, 'lastName')})}/>
                            </div>
                            <div className = "col-3">
                                <label><FormattedMessage id = "manage-user.phonenumber"/></label>
                                <input className = "form-control"type = "text"
                                       value = {phoneNumber}
                                       onChange = {((event) => {this.onChangeInput(event, 'phoneNumber')})}/>
                            </div>
                            <div className = "col-9">
                                <label><FormattedMessage id = "manage-user.address"/></label>
                                <input className = "form-control"type = "text"
                                       value = {address}
                                       onChange = {((event) => {this.onChangeInput(event, 'address')})}/>
                            </div>
                            <div className = "col-3">
                                <label><FormattedMessage id = "manage-user.gender"/></label>
                                <select className = "form-control" onChange = {(event) => {this.onChangeInput(event, 'gender')}}
                                value = {gender}>
                                    {genders && genders.length > 0 && genders.map((item, index) => {
                                        return (
                                            <option key = {index} value = {item.keyMap}>{language === languages.VI ? item.valueVi : item.valueEn}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className = "col-3">
                                <label><FormattedMessage id = "manage-user.position" /></label>
                                <select className = "form-control"
                                    onChange = {(event) => {this.onChangeInput(event, 'position')}}
                                    value = {position}>
                                    {positions && positions.length > 0 && positions.map((item, index) => {
                                        return(
                                            <option key = {index} value = {item.keyMap}>{language === languages.VI ? item.valueVi : item.valueEn}</option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className = "col-3">
                                <label><FormattedMessage id = "manage-user.role"/></label>
                                <select className = "form-control"
                                    onChange = {(event) => {this.onChangeInput(event, 'role')}}
                                    value = {role}>
                                    {roles && roles.length > 0 && roles.map((item, index) => {
                                        return(
                                            <option key = {index} value = {item.keyMap}>{language === languages.VI ? item.valueVi : item.valueEn}</option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className = "col-3">
                                <label><FormattedMessage id = "manage-user.img"/></label>
                                <div className = "preview-img-container">
                                    <input 
                                        id = "previewImg" 
                                        type = "file" 
                                        hidden
                                        onChange = {(event) => this.handleOnChangeImage(event)}
                                    />
                                    <label className = "label-upload" htmlFor = "previewImg">Tải ảnh<i className ="fas fa-upload"></i></label>
                                    <div className = "preview-image" style = {{ backgroundImage: `url(${this.state.previewImgURL})`}}></div>
                                </div>
                            </div>
                            <div className = "col-12 mt-3">
                                <button className = {this.state.action === CRUD_ACTIONS.EDIT ? "btn btn-warning" : "btn btn-primary"}
                                    onClick = {() => this.handleSaveUser()}>
                                        {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id = "manage-user.edit"/> 
                                            : <FormattedMessage id = "manage-user.save"/>}
                                </button>
                            </div>

                            <div className = "col-12 mb-5">
                                <TableManageUser
                                    handleEditUserFromParentKey = {this.handleEditUserFromParent}
                                    action = {this.state.action}
                                />
                            </div>
                        </div>     
                    </div>
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        isLoadingGender: state.admin.isLoadingGender,
        roleRedux: state.admin.roles,
        positionRedux: state.admin.positions,
        listUsers: state.admin.users,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        editAUserRedux: (data) => dispatch(actions.editAUser(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
