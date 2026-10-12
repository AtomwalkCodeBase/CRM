import { Alert, StatusBar, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import ListItems from '../../components/ListItems';
import InputModal from '../../components/InputModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ToastMsg from '../../components/ToastMsg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../Styles/appStyle';

const TodoScreen = ({ navigation }) => {
    const [todos, setTodos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [todoInputValue, setTodoInputValue] = useState();

    useEffect(() => {
        getTodosFromUserDevice();
    }, []);

    useEffect(() => {
        saveTodoToUserDevice(todos);
    }, [todos]);

    const getTodosFromUserDevice = async () => {
        try {
            const todos = await AsyncStorage.getItem('todos');
            if (todos != null) {
                setTodos(JSON.parse(todos));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const saveTodoToUserDevice = async (todos) => {
        try {
            const stringifyTodos = JSON.stringify(todos);
            await AsyncStorage.setItem('todos', stringifyTodos);
        } catch (error) {
            console.log(error);
        }
    };
    // function to add todos

    const handleAddTodo = (todo) => {
        if (!todo.title) {
            Alert.alert('Please input todo')
        } else {
            const newTodos = [...todos, todo];
            setTodos(newTodos);
            setModalVisible(false);
            ToastMsg('Todo added successfully');
        }
    }


    const [todoToBeEdited, setTodoToBeEdited] = useState(null);
    const handleTriggerEdit = (item) => {
        setTodoToBeEdited(item);
        setModalVisible(true);
        setTodoInputValue(item.title);

    }

    const handleEditTodo = (editedTodo) => {
        if (!editedTodo.title) {
            Alert.alert('Please input todo')
        } else {

            const newTodos = [...todos];
            const todoIndex = todos.findIndex((todo) => todo.key === editedTodo.key);
            newTodos.splice(todoIndex, 1, editedTodo);
            setTodos(newTodos);
            setModalVisible(false);
            setTodoToBeEdited(null);
        }
    }
    const onBackPressed = () => {
        setModalVisible(true)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#4285f4' }} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="light-content" backgroundColor="#4285f4" />
            <View style={{ flex: 1, backgroundColor: colors.white }}>
                <Header
                    label='Todos'
                    image=''
                    // icon='squared-plus'
                    onPress={onBackPressed}
                />
                <ListItems
                    todos={todos}
                    setTodos={setTodos}
                    handleTriggerEdit={handleTriggerEdit}
                    navigation={navigation}
                />
                <InputModal
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    todoInputValue={todoInputValue}
                    setTodoInputValue={setTodoInputValue}
                    handleAddTodo={handleAddTodo}
                    todoToBeEdited={todoToBeEdited}
                    setTodoToBeEdited={setTodoToBeEdited}
                    handleEditTodo={handleEditTodo}
                    todos={todos}
                />
            </View>
        </SafeAreaView>
    )

}

export default TodoScreen