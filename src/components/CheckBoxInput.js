import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { colors } from '../Styles/appStyle';

const CheckBoxInput = ({
  label,
  title,
  onCheckAddTask,
  checked,
  error
}) => {

  const [isChecked, setIsChecked] = useState(checked == null ? true : checked);

  useEffect(() => {
    if (checked != null) {
      setIsChecked(checked);
    }
  }, [checked]);

  const handleIsChecked = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onCheckAddTask(newValue);
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
        <Pressable
          onPress={handleIsChecked}
          style={styles.checkboxRow}
          android_ripple={{ color: '#e5e5e5' }}
        >
          <View
            style={[
              styles.checkbox,
              isChecked && styles.checkboxChecked,
            ]}
          >
            {isChecked && (<Text style={styles.checkmark}>✓</Text>)}
          </View>

          <Text style={styles.title}>{title}</Text>
        </Pressable>
      </View>

      {error && (
        <Text style={styles.error}>
          {error}
        </Text>
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
    fontSize: 12,
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

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: '#777',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#fff',
  },

  checkboxChecked: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },

  checkmark: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 19,
  },

  title: {
    fontSize: 15,
    color: colors.black,
    flex: 1,
  },

  error: {
    marginTop: 7,
    color: colors.red,
    fontSize: 12,
  },
});

export default CheckBoxInput;
