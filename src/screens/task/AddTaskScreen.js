import { View, ScrollView, Text, Keyboard, Alert, StatusBar } from 'react-native';
import { React, useState, useEffect } from 'react';
import { colors } from '../../Styles/appStyle';
import Loader from '../../components/Loader';
import NewButton from "../../components/NewButton";
import TxtInput from '../../components/TxtInput';
import DropDown from '../../components/DropDown';
import DateInput from '../../components/DateInput';
import RadioInput from '../../components/RadioInput';
import Header from '../../components/Header';
import { addTask, getCustomerLeadList, getTaskTypeList } from '../../services/productServices';
import ToastMsg from '../../components/ToastMsg';
import { SafeAreaView } from 'react-native-safe-area-context';

const AddTaskScreen = ({ route, navigation }) => {
    const [inputs, setInputs] = useState({
        name: route.params.task,
        selected_type: 'C',
        customer_id: '',
        task_type: '',
        task_date: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [customerData, setCustomerData] = useState([]);
    const [taskTypeList, setTaskTypeList] = useState([]);

    const onSelect = (item) => {
        handleOnchange(item, 'task_type')
    }

    const onSelectDate = (date) => {
        handleOnchange(date, 'task_date')
    }

    const onSelectCustomer = (date) => {
        handleOnchange(date, 'customer_id')
    }

    const onSelectedType = (selectedType) => {
        if (selectedType == 'C') {
            handleOnchange('C', 'selected_type');

        } else {
            handleOnchange('L', 'selected_type');
        }

        getCustomerLeadList(selectedType, '').then(response => {
            // console.log(JSON.stringify(response.data));
            var count = Object.keys(response.data).length;
            let customerList = [];
            for (var i = 0; i < count; i++) {
                customerList.push({
                    value: response.data[i].id,
                    label: response.data[i].name,
                });
            }
            setCustomerData(customerList);
        })
            .catch(error => {
                console.log(error);
            });

    }

    const onBackPressed = () => {
        navigation.pop();
    }

    useEffect(() => {
        setLoading(true)
        onSelectedType('C');

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

    const validate = () => {
        Keyboard.dismiss();
        let isValid = true;

        if (!inputs.name) {
            handleError('Please input Task Name', 'name');
            isValid = false;
        }

        if (isValid) {
            handleTaskData()
        }

    };

    const handleTaskData = async () => {
        setLoading(true);

        await addTask(inputs).then((res) => {
            setLoading(false);
            ToastMsg('Task Added Successfully');
            // delete todo
            navigation.navigate('TaskSreen', { refresh: inputs });
            // navigation.navigate('Task');
        })
            .catch((error) => {
                setLoading(false);
                // console.log('Add Task ERROR', {error}, error.message);
                if (error.response.data.detail) {
                    error.message = error.response.data.detail;
                    ToastMsg(error.response.data.detail, 'ERROR', 'error');
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
                    label='Create Task'
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
                                iconName="account-outline"
                                label="Task Name"
                                placeholder="Enter Task detail"
                                error={errors.name}
                                defaultValue={inputs.name}
                            />
                            <RadioInput
                                label={'Task For : ' + (inputs.selected_type === 'C' ? "Customer" : "Lead")}
                                title1="Customer"
                                title2="Lead"
                                onSelectedType={onSelectedType}
                                error=''
                            />
                            <DropDown
                                inputvalue={inputs.customer_id}
                                inputlabel="Customer/ Lead"
                                data={customerData}
                                onSelect={onSelectCustomer}
                            />

                            <DropDown
                                inputvalue={inputs.task_type}
                                inputlabel=""
                                data={taskTypeList}
                                onSelect={onSelect}
                            />
                            <DateInput
                                label="Task Date"
                                iconName='calendar-account'
                                taskDate={inputs.task_date}
                                onSelectDate={onSelectDate}
                                error=''
                            />

                            <NewButton title="Add Task" onPress={validate} />
                        </View>
                    </>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default AddTaskScreen