/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField, useTheme } from "@aws-amplify/ui-react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { Restaurant } from "../models";
import { fetchByPath, validateField } from "./utils";
import { DataStore } from "aws-amplify";
export default function CreateRestaurant(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const { tokens } = useTheme();
  const initialValues = {
    Name: "",
    adminSub: "",
    contactNumber: "",
  };
  const [Name, setName] = React.useState(initialValues.Name);
  const [adminSub, setAdminSub] = React.useState(initialValues.adminSub);
  const [contactNumber, setContactNumber] = React.useState(
    initialValues.contactNumber
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setName(initialValues.Name);
    setAdminSub(initialValues.adminSub);
    setContactNumber(initialValues.contactNumber);
    setErrors({});
  };
  const validations = {
    Name: [{ type: "Required" }],
    adminSub: [{ type: "Required" }],
    contactNumber: [{ type: "Phone" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding={tokens.space.medium.value}
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          Name,
          adminSub,
          contactNumber,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await DataStore.save(new Restaurant(modelFields));
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "CreateRestaurant")}
      {...rest}
    >
      <TextField
        label="Name"
        isRequired={true}
        isReadOnly={false}
        value={Name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Name: value,
              adminSub,
              contactNumber,
            };
            const result = onChange(modelFields);
            value = result?.Name ?? value;
          }
          if (errors.Name?.hasError) {
            runValidationTasks("Name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("Name", Name)}
        errorMessage={errors.Name?.errorMessage}
        hasError={errors.Name?.hasError}
        {...getOverrideProps(overrides, "Name")}
      ></TextField>
      <TextField
        label="Admin sub"
        isRequired={true}
        isReadOnly={false}
        value={adminSub}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Name,
              adminSub: value,
              contactNumber,
            };
            const result = onChange(modelFields);
            value = result?.adminSub ?? value;
          }
          if (errors.adminSub?.hasError) {
            runValidationTasks("adminSub", value);
          }
          setAdminSub(value);
        }}
        onBlur={() => runValidationTasks("adminSub", adminSub)}
        errorMessage={errors.adminSub?.errorMessage}
        hasError={errors.adminSub?.hasError}
        {...getOverrideProps(overrides, "adminSub")}
      ></TextField>
      <TextField
        label="Contact number"
        isRequired={false}
        isReadOnly={false}
        type="tel"
        value={contactNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              Name,
              adminSub,
              contactNumber: value,
            };
            const result = onChange(modelFields);
            value = result?.contactNumber ?? value;
          }
          if (errors.contactNumber?.hasError) {
            runValidationTasks("contactNumber", value);
          }
          setContactNumber(value);
        }}
        onBlur={() => runValidationTasks("contactNumber", contactNumber)}
        errorMessage={errors.contactNumber?.errorMessage}
        hasError={errors.contactNumber?.hasError}
        {...getOverrideProps(overrides, "contactNumber")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
