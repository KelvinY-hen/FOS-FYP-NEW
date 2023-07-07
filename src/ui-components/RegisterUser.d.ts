/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type RegisterUserInputValues = {
    name?: string;
    contactNumber?: string;
    sub?: string;
};
export declare type RegisterUserValidationValues = {
    name?: ValidationFunction<string>;
    contactNumber?: ValidationFunction<string>;
    sub?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type RegisterUserOverridesProps = {
    RegisterUserGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    contactNumber?: PrimitiveOverrideProps<TextFieldProps>;
    sub?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type RegisterUserProps = React.PropsWithChildren<{
    overrides?: RegisterUserOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: RegisterUserInputValues) => RegisterUserInputValues;
    onSuccess?: (fields: RegisterUserInputValues) => void;
    onError?: (fields: RegisterUserInputValues, errorMessage: string) => void;
    onChange?: (fields: RegisterUserInputValues) => RegisterUserInputValues;
    onValidate?: RegisterUserValidationValues;
} & React.CSSProperties>;
export default function RegisterUser(props: RegisterUserProps): React.ReactElement;
