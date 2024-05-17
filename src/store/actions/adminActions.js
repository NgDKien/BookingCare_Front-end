import actionTypes from './actionTypes';
import { getAllCodeService, getAllDoctors } from '../../services/userService';
import { createNewUserService } from '../../services/userService';
import {getAllUsers, deleteUserService, editUserService, getTopDoctorHomeService, saveDetailDoctorService, getAllSpecialty, getAllClinic} from "../../services/userService"
import {toast} from "react-toastify";

//Gender
export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try{
            dispatch({type: actionTypes.FETCH_GENDER_START})
            let res = await getAllCodeService("GENDER");
            if(res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data));
            } else {
                dispatch(fetchGenderFailed());
            }
        }catch(e) {
            dispatch(fetchGenderFailed());
            console.log('fetchGenderFailed', e)
        }
    }
    
}
export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})
export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAIDED
})
//Position
export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try{
            let res = await getAllCodeService("POSITION");
            if(res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data));
            } else {
                dispatch(fetchPositionFailed());
            }
        }catch(e) {
            dispatch(fetchPositionFailed());
            console.log('fetchPositionFailed', e)
        }
    }
    
}
export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})
export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAIDED
})
//Role
export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try{
            let res = await getAllCodeService("ROLE");
            if(res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data));
            } else {
                dispatch(fetchRoleFailed());
            }
        }catch(e) {
            dispatch(fetchRoleFailed());
            console.log('fetchRoleFailed', e)
        }
    }
    
}
export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})
export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAIDED
})

//Create 
export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try{
            let res = await createNewUserService(data) ;
            if(res && res.errCode === 0) {
                toast.success("Create a new user succeed!");
                dispatch(saveUserSuccess(res.data));
                dispatch(fetchAllUsersStart());
            } else {
                dispatch(saveUserFailed());
            }
        }catch(e) {
            dispatch(saveUserFailed());
            console.log('saveRoleFailed', e)
        }
    }
}

export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS
})
export const saveUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED
})

//Read
export const fetchAllUsersStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllUsers("ALL");
            if (res && res.errCode === 0) {
                dispatch(fetchAllUsersSuccess(res.users.reverse()))
            } else {
                toast.error("Fetch all users error!");
                dispatch(fetchAllUsersFailed());
            }
        } catch (e) {
            toast.error("Fetch all users error!");
            dispatch(fetchAllUsersFailed());
            console.log("fetchAllUsersFailed", e)
        }
    }
}

export const fetchAllUsersSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: data
})
export const fetchAllUsersFailed = (data) => ({
    type: actionTypes.FETCH_ALL_USERS_FAILED
})

//Delete 
export const deleteAUser = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserService(userId);
            if (res && res.errCode === 0) {
                toast.success("Delete succeed!");
                dispatch(deleteUserSuccess())
                dispatch(fetchAllUsersStart());
            } else {
                toast.error("Fetch all users error!");
                dispatch(deleteUserFailed());
            }
        } catch (e) {
            toast.error("Delete users error!");
            dispatch(deleteUserFailed());
            console.log("saveUsersFailed", e)
        }
    }
}
export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS
})
export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED
})

//Edit
export const editAUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUserService(data);
            if (res && res.errCode === 0) {
                toast.success("Update succeed!");
                dispatch(editUserSuccess())
                dispatch(fetchAllUsersStart());
            } else {
                toast.error("Update all users error!");
                dispatch(editUserFailed());
            }
        } catch (e) {
            toast.error("Update users error!");
            dispatch(editUserFailed());
            console.log("editUserFailed", e)
        }
    }
}
export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS
})
export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED
})

//fetch (read) doctor 
export const fetchTopDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getTopDoctorHomeService('');
            if(res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
                    dataDoctors: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_FAILED, 
                })
            }
        } catch (e) {
            console.log('FETCH_TOP_DOCTORS_FAILED: ', e)
            dispatch({
                type: actionTypes.FETCH_TOP_DOCTORS_FAILED,
            })
        }
    }
}

//fetch all doctor
export const fetchAllDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllDoctors();
            if(res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
                    dataDr: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_FAILED, 
                })
            }
        } catch (e) {
            console.log('FETCH_ALL_DOCTORS_FAILED: ', e)
            dispatch({
                type: actionTypes.FETCH_ALL_DOCTORS_FAILED,
            })
        }
    }
}

//save doctor infor
export const saveDetailDoctor = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveDetailDoctorService(data);
            if(res && res.errCode === 0) {
                toast.success("Save succeed!");
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
                })
            } else {
                toast.error("Save error!");

                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED, 
                })
            }
        } catch (e) {
            toast.error("Save error!");
            console.log('SAVE_DETAIL_DOCTOR_FAILED: ', e)
            dispatch({
                type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
            })
        }
    }
}

//FETCH SCHEDULE
export const fetchAllScheduleTime = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("TIME");
            if(res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
                    dataTime: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED, 
                })
            }
        } catch (e) {
            console.log('FETCH_ALLCODE_SCHEDULE_TIME_FAILED: ', e)
            dispatch({
                type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
            })
        }
    }
}

export const getRequiredDoctorInfor = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_START})
            let resPrice = await getAllCodeService("PRICE");
            let resPayment = await getAllCodeService("PAYMENT");
            let resProvince = await getAllCodeService("PROVINCE");
            let resSpecialty = await getAllSpecialty();
            let resClinic = await getAllClinic();
            if(resPrice && resPrice.errCode === 0
                && resPayment && resPayment.errCode === 0
                && resProvince && resProvince.errCode === 0
                && resSpecialty && resSpecialty.errCode === 0
                && resClinic && resClinic.errCode === 0){
                let data = {
                    resPrice: resPrice.data,
                    resPayment: resPayment.data,
                    resProvince: resProvince.data,
                    resSpecialty: resSpecialty.data,
                    resClinic: resClinic.data
                }
                dispatch(fetchRequiredDoctorInforSuccess(data));
            } else {
                dispatch(fetchRequiredDoctorInforFailed());
            }
        } catch (e) {
            console.log('fetchRequiredDoctorInforFailed: ', e)
            dispatch(fetchRequiredDoctorInforFailed());
        }
    }
}

export const fetchRequiredDoctorInforSuccess = (allRequiredData) => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS,
    data: allRequiredData
})

export const fetchRequiredDoctorInforFailed = () => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILDED,
})