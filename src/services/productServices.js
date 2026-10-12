import { authAxios, authAxiosFilePost, authAxiosPost } from "./httpMethod";
import { addLeadURL, getCustomerListURL, getLeadListURL, getLeadDataListURL, getCustomerDetailListURL, UpdateGeoLocation, getfiletotext, productListURL } from "../constants";
import { getTaskInterestListURL, getVariationNameListURL, getProductCategoryListURL } from '../constants';
import { getOrderListURL, updateTaskInterestURL, getLeadStatusListURL, getTaskTypeListURL } from '../constants';
import { addTaskURL, updateTaskURL, userTaskListURL, getUserListURL, updateLeadStatusURL } from "../constants";


// export const login = async (dispatch, username, password) => {
export function getUserTasks(task_type, customer_id, lead_id) {
    let data = {};
    if (task_type) {
        data['task_type'] = task_type;
    }
    if (customer_id) {
        data['customer_id'] = customer_id;
    }
    if (lead_id) {
        data['lead_id'] = lead_id;
    }

    // console.log('getUserTasks', task_type, userTaskListURL, data)
    return authAxios(userTaskListURL, data)
}

export function getTaskInterest(task_id, customer_id, lead_id) {
    let data = {};
    if (task_id) {
        data['task_id'] = task_id;
        data['customer_id'] = ''
        data['lead_id'] = ''
    }
    else if (customer_id) {
        data['customer_id'] = customer_id;
        data['task_id'] = ''
        data['lead_id'] = ''
    }
    else if (lead_id) {
        data['lead_id'] = lead_id;
        data['customer_id'] = ''
        data['task_id'] = ''
    }

    // console.log('getTaskInterest', task_id, lead_id, customer_id, data)
    return authAxios(getTaskInterestListURL, data)
}


export function addLead(lead_data) {
    // console.log(lead_data)
    return authAxiosPost(addLeadURL, { 'lead_data': lead_data });
}

export function addTask(task_data) {
    // console.log(task_data)
    return authAxiosPost(addTaskURL, { 'task_data': task_data });
}

export function getCustomerList(name) {
    // console.log('getCustomerList', name)
    return authAxios(getCustomerListURL)
}

export function getCustomerDetailList() {
    // console.log('getCustomerDetailList')
    return authAxios(getCustomerDetailListURL)
}

export function getLeadList(name) {
    // console.log('getLeadList', name)
    return authAxios(getLeadListURL)
}

export function getLeadDataList(name) {
    // console.log('getLeadList', name)
    return authAxios(getLeadDataListURL)
}
export function getproductlist(name) {
    // console.log('getLeadList', name)
    return authAxios(productListURL)
}

export function getCustomerLeadList(s_type, name) {
    // console.log('getCustomerLeadList', s_type, name, getCustomerListURL)

    if (s_type == 'C') {
        return authAxios(getCustomerListURL);
    }
    else {
        return authAxios(getLeadListURL)
    }

}

export function getVariationNameList() {
    // console.log('getVariationNameList')
    return authAxios(getVariationNameListURL)
}


export function getLeadStatusList() {
    // console.log('getLeadStatusList')
    return authAxios(getLeadStatusListURL)
}

export function getTaskTypeList() {
    // console.log('getTaskTypeList')
    return authAxios(getTaskTypeListURL)
}

export function getProductCategoryList() {
    // console.log('getProductCategoryList')
    return authAxios(getProductCategoryListURL)
}

export function updateTaskInterest(task_interest_data, is_delete = 'N') {
    // console.log('updateTaskInterest', task_interest_data)
    let data = {};
    data['task_interest_data'] = task_interest_data
    data['is_delete'] = is_delete;

    return authAxiosPost(updateTaskInterestURL, data);
}

export function updateLeadStatus(status_data) {
    // console.log('updateLeadStatus', status_data)
    let data = {};
    data['status_data'] = status_data

    return authAxiosPost(updateLeadStatusURL, data);
}
export function UpdateGeoLocations(location_data) {
    let data = {};
    data['task_location_data'] = location_data

    return authAxiosPost(UpdateGeoLocation, data);
}

export function getOrderList(cust_id) {
    let data = {};
    if (cust_id) {
        data['customer_id'] = cust_id;
    }

    // console.log('getOrderList', cust_id, data)
    return authAxios(getOrderListURL, data)
}

export function updateTask(task_data, is_completed = 'N', assign_user = 'N') {
    // console.log('updateTask', task_data, is_completed, assign_user)
    let data = {};
    data['task_data'] = task_data
    data['is_completed'] = is_completed;
    data['assign_user'] = assign_user;

    return authAxiosPost(updateTaskURL, data);
}

export function getUserList() {
    // console.log('getUserList')
    return authAxios(getUserListURL)
}
export function imagetotext(Uri) {
    let data = {};
    data = Uri
    return authAxiosFilePost(getfiletotext, data);
}