import { View, ScrollView, Keyboard, Alert, StatusBar } from 'react-native';
import { React, useState } from 'react';
import { colors } from '../../Styles/appStyle';
import Loader from '../../components/Loader';
import NewButton from "../../components/NewButton";
import TxtInput from '../../components/TxtInput';
import DropDown from '../../components/DropDown';
import DateInput from '../../components/DateInput';
import Header from '../../components/Header';
import { addTask } from '../../services/productServices';
import ToastMsg from '../../components/ToastMsg';
import { SafeAreaView } from 'react-native-safe-area-context';

const data = [
    { label: 'Meeting', value: 'MEETING' },
    { label: 'Call', value: 'CALL' },
    { label: 'Email', value: 'EMAIL' },
    { label: 'Follow up', value: 'FOLLOW' },
    { label: 'Customer Ticket', value: 'TICKET' },
    { label: 'Send Document', value: 'SUBMIT' },
    { label: 'Customer Demo', value: 'DEMO' },
    { label: 'Project Alert', value: 'ALERT' },
    { label: 'Misc. Task', value: 'MISC' },
];

const AddCustomerTask = ({ route, navigation }) => {
    const [inputs, setInputs] = useState({
        name: '',
        selected_type: route.params.selected_type,
        customer_id: route.params.customer_id,
        task_type: '',
        task_date: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const onSelect = (item) => {
        handleOnchange(item, 'task_type')
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
            handleError('Please input Task Name', 'name');
            isValid = false;
        }

        if (isValid) {
            handleTaskData()
        }

    };

    const handleTaskData = () => {
        setLoading(true);

        addTask(inputs).then((res) => {
            setLoading(false);
            ToastMsg('Task Added Successfully');
            // delete todo
            // navigation.pop();
            navigation.navigate(route.params.selected_type == 'L' ? 'LeadScreen' : 'CustomerScreen', { Company_name: route.params?.Company_name });
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
                            />

                            <DropDown
                                inputvalue={inputs.task_type}
                                inputlabel=""
                                data={data}
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

export default AddCustomerTask