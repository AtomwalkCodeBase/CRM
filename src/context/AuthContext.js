import React, { createContext, useState, useEffect } from 'react';
import { publicAxiosRequest } from "../services/httpMethod";
import { loginURL } from "../constants";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCompanyInfo, getProfileInfo } from '../services/authServices'
import { Alert } from 'react-native'
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [companyInfo, setCompanyInfo] = useState(null);
    const [dbName, setDbName] = useState(null);
    const [error, setError] = useState('');
    const [refs, setRefs] = useState(1);
    const [ismanagers, setIsmanagers] = useState(false);
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const username = await AsyncStorage.getItem('username');
                const password = await AsyncStorage.getItem('Password');
                if (token) {
                    setUserToken(token);
                    login(username, password);
                }
            } catch (error) {
                console.error('Failed to fetch the token:', error);
            }
        };

        fetchToken();

    }, []);
    const login = async (username, password) => {
        setIsLoading(true);
        let isError = false;
        if (!username.includes("@")) {
            try {
                const userDetailResponse = await axios.get(
                    `https://www.atomwalk.com/api/get_user_detail/?user_id=${username}`
                );
                username = userDetailResponse.data.username;
            } catch (error) {
                Alert.alert(
                    '❌ User not found for nick name',
                    '',
                    [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                    { cancelable: true }
                );
                isError = true
                setIsLoading(false);
                return
            }
        }
        try {
            const res = await publicAxiosRequest.post(loginURL, {
                username: username,
                password: password,
            });
            const userToken = res.data['key']
            AsyncStorage.setItem('userToken', userToken);
            AsyncStorage.setItem('Password', password);
            AsyncStorage.setItem('username', username);
            setUserToken(userToken);
            setError('')
        } catch (err) {
            isError = true
            setError(`Unable to Authenticate : ${err}`)
            Alert.alert(
                '❌ Incorrect E-mail ID or password',
                '',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: true }
            );
        }
        if (!isError) {
            getCompanyInfo().then((res) => {
                let comanyInfo = res.data;
                AsyncStorage.setItem('companyInfo', JSON.stringify(comanyInfo));
                let db_name = comanyInfo.db_name.substr(3)
                AsyncStorage.setItem('dbName', db_name);
                setCompanyInfo(comanyInfo);
                setDbName(db_name);
            })
                .catch((error) => {
                    console.log('ERROR', { error }, error.message);
                });
        }
        setIsLoading(false);
    }

    const logout = () => {
        setIsLoading(true);
        AsyncStorage.removeItem('userToken');
        AsyncStorage.removeItem('companyInfo');
        AsyncStorage.removeItem('dbName');
        setUserToken(null);
        setCompanyInfo([]);
        setDbName(null);
        setIsLoading(false);
        setError('')
    }
    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            let userToken = await AsyncStorage.getItem('userToken');
            setUserToken(userToken);

            let dbName = await AsyncStorage.getItem('dbName');
            setDbName(dbName);

            let companyInfo = await AsyncStorage.getItem('companyInfo');

            companyInfo = JSON.parse(companyInfo);
            // console.log('isLoggedin',companyInfo);
            if (companyInfo) {
                setCompanyInfo(companyInfo);
            }
            setError('');
            setIsLoading(false);
        } catch (e) {
            console.log(`Logged In Error ${e}`);
            setError(`Logged In Error ${e}`)
        }
    }


    return (
        <AuthContext.Provider value={{ login, logout, isLoading, userToken, companyInfo, dbName, error, setRefs, refs, setIsmanagers, ismanagers, setIsLoading }}>
            {children}
        </AuthContext.Provider>
    );
}