import { createSubId } from "../Id";
import { createCheckboxComponent } from "./CheckboxComponent";
import {
  createFieldSetComponent,
  FieldsetComponent,
} from "./FieldsetComponent";

export interface CountComponentSpec {
  checkboxIdPrefix: string;
  id: string;
  legend: string;
}

export interface CountComponent {
  fieldset: FieldsetComponent;
}

export const createCountComponent = (spec: CountComponentSpec) => {
  const { checkboxIdPrefix, id, legend } = spec;

  const fieldsetComponent = createFieldSetComponent({
    extraClass: "margin-block-end-16",
    id,
    legend,
  });

  for (let count = 0; count < 9; count++) {
    const countString = count.toString();
    const id = createSubId(checkboxIdPrefix, countString);
    const component = createCheckboxComponent({
      extraClass: "count-checkbox",
      id,
      inputId: createSubId(id, "input"),
      label: countString,
      value: countString,
    });
    fieldsetComponent.fieldset.appendChild(component.checkbox);
  }

  const component: CountComponent = {
    fieldset: fieldsetComponent,
  };

  return component;
};
