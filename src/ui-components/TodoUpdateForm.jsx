/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SwitchField,
  TextField,
} from "@aws-amplify/ui-react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { Todo } from "../models";
import { fetchByPath, validateField } from "./utils";
import { DataStore } from "aws-amplify";
export default function TodoUpdateForm(props) {
  const {
    id: idProp,
    todo: todoModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    task: "",
    isCompleted: false,
  };
  const [task, setTask] = React.useState(initialValues.task);
  const [isCompleted, setIsCompleted] = React.useState(
    initialValues.isCompleted
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = todoRecord
      ? { ...initialValues, ...todoRecord }
      : initialValues;
    setTask(cleanValues.task);
    setIsCompleted(cleanValues.isCompleted);
    setErrors({});
  };
  const [todoRecord, setTodoRecord] = React.useState(todoModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? await DataStore.query(Todo, idProp)
        : todoModelProp;
      setTodoRecord(record);
    };
    queryData();
  }, [idProp, todoModelProp]);
  React.useEffect(resetStateValues, [todoRecord]);
  const validations = {
    task: [{ type: "Required" }],
    isCompleted: [{ type: "Required" }],
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
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          task,
          isCompleted,
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
            if (typeof value === "string" && value.trim() === "") {
              modelFields[key] = undefined;
            }
          });
          await DataStore.save(
            Todo.copyOf(todoRecord, (updated) => {
              Object.assign(updated, modelFields);
            })
          );
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "TodoUpdateForm")}
      {...rest}
    >
      <TextField
        label="Task"
        isRequired={true}
        isReadOnly={false}
        value={task}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              task: value,
              isCompleted,
            };
            const result = onChange(modelFields);
            value = result?.task ?? value;
          }
          if (errors.task?.hasError) {
            runValidationTasks("task", value);
          }
          setTask(value);
        }}
        onBlur={() => runValidationTasks("task", task)}
        errorMessage={errors.task?.errorMessage}
        hasError={errors.task?.hasError}
        {...getOverrideProps(overrides, "task")}
      ></TextField>
      <SwitchField
        label="Is completed"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isCompleted}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              task,
              isCompleted: value,
            };
            const result = onChange(modelFields);
            value = result?.isCompleted ?? value;
          }
          if (errors.isCompleted?.hasError) {
            runValidationTasks("isCompleted", value);
          }
          setIsCompleted(value);
        }}
        onBlur={() => runValidationTasks("isCompleted", isCompleted)}
        errorMessage={errors.isCompleted?.errorMessage}
        hasError={errors.isCompleted?.hasError}
        {...getOverrideProps(overrides, "isCompleted")}
      ></SwitchField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || todoModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || todoModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
