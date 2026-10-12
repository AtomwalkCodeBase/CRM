import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PinPopup = ({ navigation }) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    useEffect(() => {
        const checkPopupPreference = async () => {
            try {
                const hasDeclinedPopup = await AsyncStorage.getItem('declinePinSetup');
                const userPin = await AsyncStorage.getItem('userPin');

                if (!hasDeclinedPopup && !userPin) {
                    setIsPopupVisible(true);
                }
            } catch (error) {
                console.log('Error checking PIN preference:', error);
            }
        };

        checkPopupPreference();
    }, []);

    const handleYes = () => {
        setIsPopupVisible(false);

        // Navigate to PinSetup screen
        navigation();
    };

    const handleNo = async () => {
        try {
            await AsyncStorage.setItem('declinePinSetup', 'true');
            setIsPopupVisible(false);
        } catch (error) {
            console.log('Error saving PIN preference:', error);
        }
    };

    const handleClose = () => {
        setIsPopupVisible(false);
    };

    return (
        <Modal
            visible={isPopupVisible}
            transparent={true}
            animationType="fade"
            statusBarTranslucent={true}
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>

                <View style={styles.popupContainer}>

                    <TouchableOpacity style={styles.closeButton} onPress={handleClose} activeOpacity={0.7}>
                        <Text style={styles.closeText}>X</Text>
                    </TouchableOpacity>

                    <Image
                        source={require('../../assets/images/pin.png')}
                        style={styles.icon}
                        resizeMode="contain"
                    />
                    <Text style={styles.message}>
                        Would you like to set your PIN?
                    </Text>

                    <View style={styles.buttonContainer}>

                        <TouchableOpacity style={styles.yesButton} onPress={handleYes} activeOpacity={0.8}>
                            <Text style={styles.buttonText}> YES </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.noButton} onPress={handleNo} activeOpacity={0.8}>
                            <Text style={styles.buttonText}> NO</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    popupContainer: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingVertical: 16,
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
    },
    closeText: {
        fontSize: 20,
        color: '#000000',
    },
    icon: {
        width: 50,
        height: 50,
        marginBottom: 20,
    },
    message: {
        fontSize: 16,
        color: '#111111',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '500',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    yesButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },

    noButton: {
        backgroundColor: '#F44336',
        padding: 10,
        borderRadius: 5,
    },

    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default PinPopup;