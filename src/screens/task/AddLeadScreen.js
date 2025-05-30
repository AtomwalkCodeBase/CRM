import { View, SafeAreaView, ScrollView, Text, Keyboard, Alert } from 'react-native'
import {React, useState, useEffect} from 'react'
import { CommonActions } from '@react-navigation/native';
import { colors } from '../../Styles/appStyle'
import  Loader  from '../../components/Loader'
import TxtInput  from '../../components/TxtInput'
import NewButton from "../../components/NewButton"
import DropDown2 from '../../components/DropDown'
import DateInput from '../../components/DateInput'
import CheckBoxInput from '../../components/CheckBoxInput'
import Header from '../../components/Header'; 
import { addLead, getTaskTypeList, imagetotext } from '../../services/productServices'
import ToastMsg from '../../components/ToastMsg';
import * as ImagePicker from "expo-image-picker";
  
const AddLeadScreen = ({route, navigation}) => {
    const [inputs, setInputs] = useState({
        name: '',
        company_name: '',
        task_name: route.params.task,
        mobile_number: '',
        email_id: '',
        add_task: route.params.task? 'Y': 'N',
        task_type: '',
        task_date: '',
        file_ref_num:'',
      });
      console.log(inputs,"uuhd")
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [taskTypeList, setTaskTypeList] = useState([]);
    const [dropDownData,setDropDownData]=useState([]);
    const companyKeywords = [
        "Enterprise", "Solution", "Consultants", "Pvt.Ltd.", "Pvt.Ltd", "Technology",
        "Inc.", "LLC", "Corp", "Limited", "Holdings", "Group", "Industries",
        "Associates", "Partners", "Services", "Co.", "S.A.", "PLC", "GmbH", "SARL",
        "Company", "Incorporated", "Corporation","Corporations", "Firm", "LLP", "AG", "Ltd.","Pvt","Ltd"
    ]; 
    const scan = route.params.scan;
    useEffect(()=>{
   if(scan){
    onBackPressed()
}
    },[scan])
    useEffect(() => {
        setLoading(true)
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
    const onSelect = (item) => {
        handleOnchange(item, 'task_type')
     }
    
     const onSelectDate = (date) => {
        handleOnchange(date, 'task_date')
     }
     
     const onCheckAddTask = (checked) => {
        if (checked) {
            handleOnchange('Y', 'add_task');
        } else{
            handleOnchange('N', 'add_task');
        }
     }
     const companyRegex = new RegExp(
        "\\b(" + companyKeywords.join("|").replace(/\./g, "\\.") + ")\\b", "i"
    );
    const isCompanyName = (line) => companyRegex.test(line);
    
    const validate = () => {
        Keyboard.dismiss();
        let isValid = true;

        if (!inputs.email_id && !inputs.mobile_number) {
            handleError('Please input either Email or Mobile No', 'mobile_number');
            isValid = false;
        } 
        else if (inputs.email_id && !inputs.email_id.match(/\S+@\S+\.\S+/)) {
            handleError('Please input a valid email', 'email_id');
            isValid = false;
        }

        if (!inputs.name) {
            handleError('Please enter a Lead name', 'name');
            isValid = false;
          }
      
        if (inputs.add_task == 'Y'){  
            if (!inputs.task_name) {

                handleError('Please input Todo', 'task_name');
                isValid = false;
          }
        }  
      
        if (isValid){
            handleLeadData()
        }  

    };// Function to perform OCR on the captured image and extract text
    const performOCR = (file) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('image_file', {
          uri: file.uri,
          name: file.fileName,
          type: file.mimeType,
        });
        imagetotext(formData).then((res) => {
            setLoading(false);
            ToastMsg('Lead Scan Successfully');
            const extractedText = res?.data?.text.filter(item => item.trim() !== "").join("\n");
            const ref_name = res?.data?.ref_num;
            const scandata = res?.data;   
                    // Assuming OCR returns a single block of text, we can process it
                    if (extractedText) {
                        // Call function to map the text to the form fields
                        mapExtractedTextToFields(extractedText,ref_name,scandata);
                        const options = extractedText.split("\n").map((item) => ({
                            label: item.trim(),
                            value: item.trim()
                        }));
                        setDropDownData(options)
                    }
            })
            .catch((error) => {
                setLoading(false);
                console.log('Add Lead ERROR', {error}, error.message);
                if (error.response.data.detail){
                    error.message = error.response.data.detail;
                    ToastMsg(error.response.data.detail, 'ERROR', 'error');
                }
            });
        
    };
    
    // Function to map extracted text to form fields
    const mapExtractedTextToFields = (text,num,scandata) => {
        const lines = text.split("\n").map(line => line.trim()).filter(line => line !== "");
        
        let name = "";
        let mobile_number = "";
        let email_id = "";
        let company_name = "";
    
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/;
        const phoneRegex = /(?:\+\d{1,3}[-.\s]?)?(?:\d{10,12}|\d{5}[-.\s]?\d{5})/;
        
        let firstString = "";  // Holds the first non-empty string for fallback
    
        lines.forEach(line => {
            if (emailRegex.test(line)) {
                email_id = emailRegex.exec(line)[0];
            } else if (phoneRegex.test(line) && mobile_number === "") {
                mobile_number = line.replace(/\D/g, '').trim();
            } else if (!name && line.match(/^[A-Za-z\s]+$/) && line.length < 30) {
                name = line;
            } else if (isCompanyName(line)) {
                company_name = line;
            }
            
            // Save the first meaningful string as a fallback name
            if (!firstString && !emailRegex.test(line) && !phoneRegex.test(line) && !isCompanyName(line)) {
                firstString = line;
            }
        });
    
        // Fallback: If no name was found, use the first meaningful string
        if (!name) {
            name = firstString;
        }
    
        setInputs(prevState => ({
            ...prevState,
            name:scandata?.f_data_list?.name[0]||name,
            mobile_number:scandata?.f_data_list?.mobile_number[0]|| mobile_number,
            email_id:scandata?.f_data_list?.email_id[0]|| email_id,
            company_name: scandata?.f_data_list?.company_name[0]||company_name,
            file_ref_num:num,
        }));
    };
    
    
    

    const onBackPressed = async () => {
        // Open the camera and capture a visiting card picture
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
            allowsMultipleSelection: false,
            quality: 1, // Set the quality to the highest
            exif: true, // Include EXIF data
        });
    
        // Check if the image was captured successfully
        if (!result.canceled) {
            // Perform OCR on the captured image
            performOCR(result.assets[0]);
    
            // Set the image URI (if needed)
            setImage(result.assets[0].uri);
        } else {
            // If no image is captured, go back to the previous screen
            navigation.pop();
        }
    };
    

    const handleLeadData = () => {
        setLoading(true);
        
        addLead(inputs).then((res) => {
            setLoading(false);
            ToastMsg('Lead Added Successfully');
            // delete todo
            navigation.dispatch(CommonActions.goBack())
            // navigation.navigate('Task');
            })
            .catch((error) => {
                setLoading(false);
                // console.log('Add Lead ERROR', {error}, error.message);
                if (error.response.data.detail){
                    error.message = error.response.data.detail;
                    ToastMsg(error.response.data.detail, 'ERROR', 'error');
                }
                // Alert.alert('Error', 'Something went wrong');
                
            });
        
    };

    const handleOnchange = (text, input) => {
        setInputs(prevState => ({...prevState, [input]: text}));
    };
    const handleError = (error, input) => {
        setErrors(prevState => ({...prevState, [input]: error}));
    };
  return (
    <SafeAreaView style={{backgroundColor: colors.white, flex: 1}}>
      <Loader visible={loading} /> 
      <Header 
            label='Add Lead'
            image=''
            icon='scan1'
            onPress={onBackPressed}
      /> 
       
      <ScrollView contentContainerStyle={{paddingTop: 5, paddingHorizontal: 10}}>
        <>
        <View style={{marginVertical: 10}}>
       {/* {dropDownData.length > 0 ?<DropDown2
                    inputvalue={inputs.name}
                    inputlabel="Enter Lead name"
                    data={dropDownData}
                    onSelect={onSelect}  
                />
           :  */}
           <TxtInput
                onChangeText={text => handleOnchange(text, 'name')}
                onFocus={() => handleError(null, 'name')}
                iconName="account-outline"
                label="Lead/ Opportunity Details"
                placeholder="Enter Lead name"
                error={errors.name}
                defaultValue={inputs.name}
            />
            <TxtInput
                onChangeText={text => handleOnchange(text, 'company_name')}
                onFocus={() => handleError(null, 'company_name')}
                iconName="account-multiple"
                label=""
                placeholder="Enter company name"
                error={errors.name}
                defaultValue={inputs.company_name}
            />
            <TxtInput
                keyboardType="numeric"
                onChangeText={text => handleOnchange(text, 'mobile_number')}
                onFocus={() => handleError(null, 'mobile_number')}
                iconName="phone-outline"
                label="Mobile No"
                placeholder="Enter party mobile no"
                error={errors.mobile_number}
                defaultValue={inputs.mobile_number}
            />
            <TxtInput
                onChangeText={text => handleOnchange(text, 'email_id')}
                onFocus={() => handleError(null, 'email_id')}
                iconName="email-outline"
                label="Email"
                placeholder="Enter party email id"
                error={errors.email_id}
                defaultValue={inputs.email_id}
            />
            <CheckBoxInput 
            label=''
            title="Add a Task for Lead?"
            onCheckAddTask={onCheckAddTask}
            checked={inputs.add_task == 'Y'?true:false}
            error=''
            />
            <TxtInput
                onChangeText={text => handleOnchange(text, 'task_name')}
                onFocus={() => handleError(null, 'task_name')}
                iconName="check-circle"
                label="Task Detail"
                placeholder="Enter Task name"
                error={errors.task_name}
                defaultValue={inputs.task_name}
            />
            <DropDown2 
            inputvalue={inputs.task_type}
            inputlabel=""
            data={taskTypeList}
            onSelect={onSelect}  
            />
            <DateInput 
            label=""
            iconName='calendar-account'
            taskDate={inputs.task_date}
            onSelectDate={onSelectDate}
            error=''
            />
            
            <NewButton title="Add Lead" onPress={validate} />
        </View>
        </>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddLeadScreen