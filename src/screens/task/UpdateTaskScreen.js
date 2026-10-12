import { View, ScrollView, Keyboard, Alert, StatusBar } from 'react-native';
import { React, useState, useEffect } from 'react';
import { colors } from '../../Styles/appStyle';
import Loader from '../../components/Loader';
import CustomButton from '../../components/CustomButton';
import TxtInput from '../../components/TxtInput';
import DropDown from '../../components/DropDown';
import DateInput from '../../components/DateInput';
import TimeInput from '../../components/TimeInput';
import Header from '../../components/Header';
import { updateTask, getUserList, getTaskTypeList } from '../../services/productServices';

import ToastMsg from '../../components/ToastMsg';
import { SafeAreaView } from 'react-native-safe-area-context';

const UpdateTaskScreen = ({ route, navigation }) => {
    // console.log('PARAMS', route.params)
    const [inputs, setInputs] = useState({
        id: route.params.id,
        name: route.params.name,
        task_type: route.params.task_type,
        task_date: route.params.task_date,
        start_time: route.params.start_time,
        curr_user: route.params.curr_user ? route.params.curr_user : '',
        remarks: route.params.remarks,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [UserData, setUserData] = useState([]);
    const [callMode, setCallMode] = useState(route.params.callMode ? route.params.callMode : '')
    const [screen, setScreen] = useState(route.params.screen ? route.params.screen : 'TaskDetail')
    const [taskTypeList, setTaskTypeList] = useState([]);

    useEffect(() => {
        setLoading(true)
        if (callMode == 'AssignUser') {
            getUserList().then(response => {
                // console.log(JSON.stringify(response.data));
                var count = Object.keys(response.data).length;
                let userList = [];
                for (var i = 0; i < count; i++) {
                    userList.push({
                        value: response.data[i].id,
                        label: response.data[i].user_name,
                    });
                }
                setUserData(userList);
            })
                .catch(error => {
                    console.log(error);
                });
        }

        getTaskTypeList().then((response) => {
            var count = Object.keys(response.data).length;
            let dataList = [];
            for (var i = 0; i < count; i++) {
                dataList.push({
                    value: response.data[i][0],
                    label: response.data[i][1],
                });
            }
            // console.log(dataList)
            setTaskTypeList(dataList);

        })
            .catch((error) => {
                console.log('error', error)
            });

        setLoading(false);

    }, []);

    const onSelectTaskType = (item) => {
        handleOnchange(item, 'task_type')
    }

    const onSelectCurrUser = (item) => {
        handleOnchange(item, 'curr_user')
    }

    const onSelectTime = (time) => {
        handleOnchange(time, 'start_time')
    }

    const onSelectDate = (date) => {
        handleOnchange(date, 'task_date')
    }

    const onBackPressed = () => {
        navigation.pop();
    }

    const validate = () => {
        Keyboard.dismiss();
        let isValid = true;

        if (!inputs.name) {
            handleError('Please select a Task name', 'name');
            isValid = false;
        }

        if (!inputs.task_type) {
            handleError('Please select a task type', 'task_type');
            isValid = false;
        }

        if (isValid) {
            handleTaskUpdate()
        }

    };

    const handleTaskUpdate = () => {
        setLoading(true);
        let assign_user = ''
        let is_completed = ''

        callMode == 'AssignUser' ? assign_user = 'Y' : assign_user = 'N'
        callMode == 'MarkCompleted' ? is_completed = 'Y' : is_completed = 'N'

        updateTask(inputs, is_completed, assign_user).then((res) => {
            setLoading(false);
            ToastMsg('Task deatils Updated');
            if (screen == 'LeadTaskDetail') {
                navigation.navigate('LeadScreen');
            } else if (screen == 'CustTaskDetail') {
                navigation.navigate('CustomerScreen');
            } else {
                navigation.push('TaskSreen');
            }
            // navigation.navigate('Task');
        })
            .catch((error) => {
                setLoading(false);

                if (error.response.data.detail) {
                    error.message = error.response.data.detail;
                    ToastMsg(error.response.data.detail, 'ERROR', 'error');
                } else {
                    ToastMsg('Task update Failed', 'ERROR', 'error');
                }
                // Alert.alert('Error', 'Something went wrong');

            });

    };


    const handleOnchange = (text, input) => {
        setInputs(prevState => ({ ...prevState, [input]: text }));
    };
    const handleError = (error, input) => {
        setErrors(prevState => ({ ...prevState, [input]: error }));
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#4285f4' }} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="light-content" backgroundColor="#4285f4" />
            <View style={{ flex: 1, backgroundColor: colors.white }}>
                <Loader visible={loading} />
                <Header
                    label={inputs.id ? 'Update Task' : 'Create Task'}
                    image=''
                    icon='arrow-left'
                    onPress={onBackPressed}

                />
                <ScrollView contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 10 }}>
                    <>
                        <View style={{ marginVertical: 20 }}>
                            <TxtInput
                                onChangeText={text => handleOnchange(text, 'name')}
                                onFocus={() => handleError(null, 'name')}
                                iconName="file-document-edit"
                                label="Task Name"
                                placeholder="Enter Task name"
                                defaultValue={inputs.name}
                                editable={callMode == 'Update' ? true : false}
                                error={errors.name}
                            />

                            {callMode == 'Update' ? <DropDown
                                inputvalue={inputs.task_type}
                                inputlabel="Task Type"
                                data={taskTypeList}
                                onSelect={onSelectTaskType}
                            /> : <></>}

                            {callMode == 'AssignUser' ? <DropDown
                                inputvalue={inputs.curr_user}
                                inputlabel="Assign to user"
                                data={UserData}
                                onSelect={onSelectCurrUser}
                            /> : <></>}


                            {callMode == 'Update' ? <DateInput
                                label="Task Date"
                                iconName='calendar'
                                date={inputs.task_date}
                                onSelectDate={onSelectDate}
                                error=''
                            /> : <></>}

                            {callMode == 'Update' ? <TimeInput
                                label="Start Time"
                                time={inputs.start_time}
                                onSelectTime={onSelectTime}
                                error=''
                            /> : <></>}

                            <TxtInput
                                onChangeText={text => handleOnchange(text, 'remarks')}
                                onFocus={() => handleError(null, 'remarks')}
                                iconName="information-outline"
                                label="Remarks"
                                placeholder="Remarks if any.."
                                defaultValue={inputs.remarks}
                                error={errors.remarks}
                            />
                            <CustomButton
                                onPress={validate}
                                text={(callMode == 'Update') ? 'Update Task' : (callMode == 'AssignUser') ? 'Assign To User' : 'Mark Completed'}
                                bgColor={(callMode == 'Update') ? colors.secondary : (callMode == 'AssignUser') ? colors.red : colors.green}
                                icon={(callMode == 'bag') ? 'edit' : (callMode == 'AssignUser') ? 'assignment-ind' : 'done-all'}

                            />
                        </View>
                    </>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default UpdateTaskScreen