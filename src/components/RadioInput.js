import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
} from 'react-native';
import { colors } from '../Styles/appStyle';

const RadioInput = ({
    label,
    title1,
    title2,
    onSelectedType,
    error,
}) => {
    const [selectedValue, setValue] = useState('C');

    const handleSelected = (value) => {
        setValue(value);
        onSelectedType(value);
    };

    const RadioOption = ({ value, title }) => {
        const selected = selectedValue === value;

        return (
            <Pressable
                onPress={() => handleSelected(value)}
                style={styles.radioOption}
                android_ripple={{ color: '#e5e5e5' }}
            >
                <View
                    style={[
                        styles.radioOuter,
                        selected && styles.radioOuterSelected,
                    ]}
                >
                    {selected && <View style={styles.radioInner} />}
                </View>

                <Text style={styles.radioTitle}>{title}</Text>
            </Pressable>
        );
    };

    return (
        <View style={styles.wrapper}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View
                style={[
                    styles.inputContainer,
                    {
                        borderColor: error ? colors.red : colors.light,
                    },
                ]}
            >
                <RadioOption value="C" title={title1} />

                <RadioOption value="L" title={title2} />
            </View>

            {error && (
                <Text style={styles.error}> {error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 10,
    },
    label: {
        marginVertical: 3,
        fontSize: 15,
        color: colors.black,
    },

    inputContainer: {
        height: 55,
        backgroundColor: colors.light,
        flexDirection: 'row',
        paddingHorizontal: 10,
        borderWidth: 0.5,
        borderRadius: 6,
        alignItems: 'center',
    },

    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
        paddingVertical: 8,
    },

    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#777',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },

    radioOuterSelected: {
        borderColor: colors.blue,
    },

    radioInner: {
        width: 11,
        height: 11,
        borderRadius: 6,
        backgroundColor: colors.blue,
    },

    radioTitle: {
        fontSize: 15,
        color: colors.black,
    },

    error: {
        marginTop: 7,
        color: colors.red,
        fontSize: 12,
    },
});

export default RadioInput;