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
export declare type CreateRestaurantInputValues = {
    Name?: string;
    adminSub?: string;
    contactNumber?: string;
};
export declare type CreateRestaurantValidationValues = {
    Name?: ValidationFunction<string>;
    adminSub?: ValidationFunction<string>;
    contactNumber?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CreateRestaurantOverridesProps = {
    CreateRestaurantGrid?: PrimitiveOverrideProps<GridProps>;
    Name?: PrimitiveOverrideProps<TextFieldProps>;
    adminSub?: PrimitiveOverrideProps<TextFieldProps>;
    contactNumber?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type CreateRestaurantProps = React.PropsWithChildren<{
    overrides?: CreateRestaurantOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: CreateRestaurantInputValues) => CreateRestaurantInputValues;
    onSuccess?: (fields: CreateRestaurantInputValues) => void;
    onError?: (fields: CreateRestaurantInputValues, errorMessage: string) => void;
    onChange?: (fields: CreateRestaurantInputValues) => CreateRestaurantInputValues;
    onValidate?: CreateRestaurantValidationValues;
} & React.CSSProperties>;
export default function CreateRestaurant(props: CreateRestaurantProps): React.ReactElement;
