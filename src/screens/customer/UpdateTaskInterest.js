import { View, ScrollView, Keyboard, Text, StatusBar } from 'react-native';
import { React, useState, useEffect } from 'react';
import { colors } from '../../Styles/appStyle';
import Loader from '../../components/Loader';
import NewButton from "../../components/NewButton";
import TxtInput from '../../components/TxtInput';
import DropDown from '../../components/DropDown';
import DateInput from '../../components/DateInput';
import Header from '../../components/Header';
import { updateTaskInterest, getProductCategoryList, getVariationNameList } from '../../services/productServices';
import ToastMsg from '../../components/ToastMsg';
import { SafeAreaView } from 'react-native-safe-area-context';

const UpdateTaskInterest = ({ route, navigation }) => {
    const [inputs, setInputs] = useState({
        id: route.params.id,
        task_id: route.params.task_id,
        customer_id: route.params.customer_id,
        lead_id: route.params.lead_id ? route.params.lead_id : "",
        category_id: route.params.category_id,
        variation_name_id: route.params.variation_name_id,
        variation_value: route.params.variation_value,
        variation_name_1_id: route.params.variation_name_1_id ? route.params.variation_name_1_id : '',
        variation_value_1: route.params.variation_value_1 ? route.params.variation_value_1 : '',
        variation_name_2_id: route.params.variation_name_2_id ? route.params.variation_name_2_id : '',
        variation_value_2: route.params.variation_value_2 ? route.params.variation_value_2 : '',
        product_info: route.params.product_info,
        due_date: route.params.due_date,
        call_mode: route.params.task_id ? 'T' : route.params.customer_id ? 'C' : 'L',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [variationNames, setVariationNames] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [releteddrop, setReleteddrop] = useState([]);
    const [variationValues, setVariationValues] = useState({}); // To store options for each variation dropdown
    const [callMode, setCallMode] = useState(route.params.call_mode || '');
    const [screen, setScreen] = useState(route.params.screen || '');
    const subTitle = callMode === 'L' ? `LEAD - ${route.params.name}` : `CUSTOMER: ${route.params.name}`;
    const pageTitle = route.params.task_name ? `Interest For Task: ${route.params.task_name}` : '';

    useEffect(() => {
        setLoading(true);
        // Fetch variation names
        getVariationNameList()
            .then((response) => {
                setReleteddrop(response.data);
                const variationList = response.data.map((item) => ({
                    value: item.id,
                    label: item.name,
                }));
                //data fetch
                setVariationNames(variationList);
                if (inputs.variation_name_id) {
                    handleVariationChange(inputs.variation_name_id, 'variation_value');
                }
                if (inputs.variation_name_1_id) {
                    handleVariationChange(inputs.variation_name_1_id, 'variation_value_1');
                }
                if (inputs.variation_name_2_id) {
                    handleVariationChange(inputs.variation_name_2_id, 'variation_value_2');
                }
            })
            .catch((error) => console.log('error', error));
        // Fetch product categories
        getProductCategoryList()
            .then((response) => {
                const categoryList = response.data.map((item) => ({
                    value: item.id,
                    label: item.name,
                }));
                setCategoryData(categoryList);
            })
            .catch((error) => console.log('error', error));
        setLoading(false);
    }, []);

    // Updates the variation value dropdown based on selected variation name
    const handleVariationChange = (variationNameId, variationValueKey) => {
        const selectedVariation = releteddrop.find((item) => item.id === variationNameId);
        if (selectedVariation) {
            setVariationValues((prevState) => ({
                ...prevState,
                [variationValueKey]: selectedVariation.v_list.map((v) => ({
                    value: v[0],
                    label: v[1],
                })),
            }));
        } else {
            setVariationValues((prevState) => ({
                ...prevState,
                [variationValueKey]: [],
            }));
        }
    };

    const onSelectCategory = (item) => handleOnchange(item, 'category_id');
    const onSelectVariationName = (item) => {
        handleOnchange(item, 'variation_name_id');
        handleVariationChange(item, 'variation_value');
    };
    const onSelectVariationName_1 = (item) => {
        handleOnchange(item, 'variation_name_1_id');
        handleVariationChange(item, 'variation_value_1');
    };
    const onSelectVariationName_2 = (item) => {
        handleOnchange(item, 'variation_name_2_id');
        handleVariationChange(item, 'variation_value_2');
    };

    const onSelectDate = (date) => handleOnchange(date, 'due_date');
    const validate = () => {
        Keyboard.dismiss();
        let isValid = true;

        if (!inputs.category_id) {
            handleError('Please select a product category', 'category_id');
            isValid = false;
        }
        if (!inputs.variation_name_id) {
            handleError('Please select a variation name', 'variation_name_id');
            isValid = false;
        }
        if (!inputs.variation_value) {
            handleError('Please enter variation value', 'variation_value');
            isValid = false;
        }
        if (isValid) {
            handleTaskInterest();
        }
    };

    const handleTaskInterest = () => {
        setLoading(true);
        updateTaskInterest(inputs)
            .then((res) => {
                setLoading(false);
                ToastMsg(route.params.task_name ? `Updated Interest for : ${route.params.task_name}` : 'Product Interest Updated');
                if (screen === 'UpdateTaskInterest') {
                    navigation.push('TaskInterest', {
                        task_id: inputs.task_id,
                        screen: 'TaskInterest',
                        name: route.params.name || '',
                        task_name: route.params.task_name || '',
                        call_mode: callMode,
                    });
                } else if (callMode === 'L') {
                    navigation.navigate('LeadScreen', { Company_name: route?.params?.company_name });
                } else if (callMode === 'C') {
                    navigation.navigate('CustomerScreen');
                }
                else {
                    navigation.pop('');
                }
            })
            .catch((error) => {
                setLoading(false);
                const errorMessage = error.response?.data?.detail || 'Product Interest Update Failed';
                ToastMsg(errorMessage, 'ERROR', 'error');
            });
    };

    const handleOnchange = (text, input) => {
        setInputs((prevState) => ({ ...prevState, [input]: text }));
    };
    const handleError = (error, input) => {
        setErrors((prevState) => ({ ...prevState, [input]: error }));
    };
    useEffect(() => {
        if (inputs.variation_name_id) {
            handleVariationChange(inputs.variation_name_id, 'variation_value');
        }
        if (inputs.variation_name_1_id) {
            handleVariationChange(inputs.variation_name_1_id, 'variation_value_1');
        }
        if (inputs.variation_name_2_id) {
            handleVariationChange(inputs.variation_name_2_id, 'variation_value_2');
        }
    }, [inputs.variation_name_id, inputs.variation_name_1_id, inputs.variation_name_2_id, releteddrop]); // Add releteddrop as a dependency

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#4285f4' }} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="light-content" backgroundColor="#4285f4" />
            <View style={{ flex: 1, backgroundColor: colors.white }}>
                <Loader visible={loading} />
                <Header label={inputs.id ? 'Update Interest' : 'Create Interest'} image="" icon="arrow-left" onPress={() => navigation.pop()} subTitle={subTitle} />
                {pageTitle && <Text style={{ fontSize: 15, paddingLeft: 20, color: colors.navyblue, fontStyle: 'italic' }}>{pageTitle}</Text>}
                <ScrollView contentContainerStyle={{ paddingTop: pageTitle ? 10 : 0, paddingHorizontal: 10 }}>
                    <View style={{ marginVertical: 10 }}>
                        <DropDown inputvalue={inputs.category_id} inputlabel="Product Category" placeholder="Category" data={categoryData} onSelect={onSelectCategory} />
                        {variationNames && (
                            <View style={{ marginHorizontal: 15, padding: 15, marginVertical: 5, backgroundColor: colors.grey, borderRadius: 10 }}>
                                <DropDown inputvalue={inputs.variation_name_id} placeholder="Variation Name" data={variationNames} onSelect={onSelectVariationName} />
                                <DropDown inputvalue={inputs.variation_value} placeholder="Variation Value" data={variationValues['variation_value'] || []} onSelect={(item) => handleOnchange(item, 'variation_value')} />
                                <DropDown inputvalue={inputs.variation_name_1_id} placeholder="Variation Name" data={variationNames} onSelect={onSelectVariationName_1} />
                                <DropDown inputvalue={inputs.variation_value_1} placeholder="Variation Value" data={variationValues['variation_value_1'] || []} onSelect={(item) => handleOnchange(item, 'variation_value_1')} />
                                <DropDown inputvalue={inputs.variation_name_2_id} placeholder="Variation Name" data={variationNames} onSelect={onSelectVariationName_2} />
                                <DropDown inputvalue={inputs.variation_value_2} placeholder="Variation Value" data={variationValues['variation_value_2'] || []} onSelect={(item) => handleOnchange(item, 'variation_value_2')} />
                            </View>
                        )}
                        <TxtInput onChangeText={(text) => handleOnchange(text, 'product_info')} onFocus={() => handleError(null, 'product_info')} iconName="information" label="Additional Information" placeholder="Additional info if any.." defaultValue={inputs.product_info} error={errors.product_info} />
                        <DateInput label="Due Date" iconName="calendar-account" date={inputs.due_date} onSelectDate={onSelectDate} error="" />
                        <NewButton title={inputs.id ? 'Update Interest' : 'Add Interest'} onPress={validate} />
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default UpdateTaskInterest;
