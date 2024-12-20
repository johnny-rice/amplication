import {
  Form,
  TextField,
  ToggleField,
  TabContentTitle,
} from "@amplication/ui/design-system";
import { Formik } from "formik";
import { omit } from "lodash";
import { useMemo } from "react";
import { DisplayNameField } from "../Components/DisplayNameField";
import * as models from "../models";
import { validate } from "../util/formikValidateJsonSchema";

import FormikAutoSave from "../util/formikAutoSave";
import CustomPropertyTypeSelectField from "./CustomPropertyTypeSelectField";
import OptionalDescriptionField from "../Components/OptionalDescriptionField";

type Props = {
  onSubmit: (values: models.CustomProperty) => void;
  defaultValues?: models.CustomProperty;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "__typename",
  "options",
  "validation",
  "validationMessage",
  "required",
];

const NON_VALIDATED_TYPES = [
  models.EnumCustomPropertyType.Select,
  models.EnumCustomPropertyType.MultiSelect,
];

export const INITIAL_VALUES: Partial<models.CustomProperty> = {
  name: "",
  description: "",
  required: false,
};

const FORM_SCHEMA = {
  required: ["name", "key"],

  errorMessage: {},
};

const CustomPropertyForm = ({ onSubmit, defaultValues }: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omit(
      defaultValues,
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return {
      ...INITIAL_VALUES,
      ...sanitizedDefaultValues,
    } as models.CustomProperty;
  }, [defaultValues]);

  return (
    <>
      <Formik
        initialValues={initialValues}
        validate={(values: models.CustomProperty) =>
          validate(values, FORM_SCHEMA)
        }
        enableReinitialize
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form childrenAsBlocks>
            <FormikAutoSave debounceMS={1000} />

            <DisplayNameField name="name" label="Name" minLength={1} />
            <TextField name="key" label="Key" />

            <OptionalDescriptionField name="description" label="Description" />
            <div>
              <ToggleField name="required" label="Required" />
            </div>
            <CustomPropertyTypeSelectField name="type" label="Type" />

            {!NON_VALIDATED_TYPES.includes(formik.values.type) && (
              <>
                <TabContentTitle
                  title="Validation"
                  subTitle="Use regex to validate the property value"
                />
                <TextField name="validationRule" label="Validation (Regex)" />
                <TextField
                  name="validationMessage"
                  label="Validation Message"
                />
              </>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CustomPropertyForm;
