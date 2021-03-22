import { concatTruthyItems } from "../Array";
import { addClasses } from "../Css";
import { createSubId } from "../Id";
import { CountComponent, createCountComponent } from "./CountComponent";
import {
  createNumberFieldComponent,
  NumberFieldComponent,
} from "./NumberFieldComponent";
import {
  createTextFieldComponent,
  TextFieldComponent,
} from "./TextFieldComponent";

export interface GenerationCaSettingsComponentClassSpec {
  settings: string;
}

export interface GenerationCaSettingsComponentSpec {
  classSpec?: GenerationCaSettingsComponentClassSpec;
  extraClass?: string | string[];
  id: string;
}

export interface GenerationCaSettingsComponent {
  birthCountFieldset: CountComponent;
  rulestring: TextFieldComponent;
  settings: HTMLDivElement;
  stateCount: NumberFieldComponent;
  survivalCountFieldset: CountComponent;
}

export const defaultClassSpec: GenerationCaSettingsComponentClassSpec = {
  settings: "generation-ca-settings",
};

const createSettings = (
  spec: GenerationCaSettingsComponentSpec,
  classSpec: GenerationCaSettingsComponentClassSpec
) => {
  const { extraClass, id } = spec;

  const settings = document.createElement("div");
  addClasses(settings, concatTruthyItems(classSpec.settings, extraClass));
  settings.id = id;

  return settings;
};

export const createGenerationCaSettingsComponent = (
  spec: GenerationCaSettingsComponentSpec
) => {
  const { id } = spec;
  const classSpec = spec.classSpec || defaultClassSpec;

  const birthCountFieldset = createCountComponent({
    checkboxIdPrefix: createSubId(id, "birth-count"),
    id: createSubId(id, "birth-count-fieldset"),
    legend: "Birth Counts",
  });

  const survivalCountFieldset = createCountComponent({
    checkboxIdPrefix: createSubId(id, "survival-count"),
    id: createSubId(id, "survival-count-fieldset"),
    legend: "Survival Counts",
  });

  const stateCount = createNumberFieldComponent({
    extraClass: "margin-block-end-8",
    label: "State Count",
    id: createSubId(id, "state-count-number-field"),
    inputId: createSubId(id, "state-count"),
    max: 256,
    min: 3,
    name: "stateCount",
  });

  const rulestring = createTextFieldComponent({
    extraClass: "margin-block-end-8",
    label: "Rulestring",
    id: createSubId(id, "rulestring-text-field"),
    inputId: createSubId(id, "rulestring"),
    name: "rulestring",
  });

  const settings = createSettings(spec, classSpec);
  settings.appendChild(birthCountFieldset.fieldset.fieldset);
  settings.appendChild(survivalCountFieldset.fieldset.fieldset);
  settings.appendChild(stateCount.numberField);
  settings.appendChild(rulestring.textField);

  const component: GenerationCaSettingsComponent = {
    birthCountFieldset,
    rulestring,
    settings,
    stateCount,
    survivalCountFieldset,
  };

  return component;
};
