import React from "react";
import { Text, KeyboardTypeOptions } from "react-native";
import { TextInput } from "react-native-paper";

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  keyboardType?: KeyboardTypeOptions; 
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  secureTextEntry?: boolean;
  right?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  editable = true,
  secureTextEntry = false,
  right,
}) => {
  return (
    <TextInput
      label={<Text style={{ fontSize: 22, color: "#3F72AF" }}>{label}</Text>}
      mode="outlined"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      editable={editable}
      multiline={multiline}
      numberOfLines={numberOfLines}
      secureTextEntry={secureTextEntry}
      right={right}
      style={{
        marginBottom: 16,
        backgroundColor: "white",
        textAlignVertical: multiline ? "top" : "center",
      }}
      theme={{ roundness: 10 }}
    />
  );
};

export default InputField;
