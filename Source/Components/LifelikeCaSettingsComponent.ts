import { concatTruthyItems } from "../Array";
import { addClasses } from "../Css";
import { createSubId } from "../Id";
import { CountComponent, createCountComponent } from "./CountComponent";
import {
  createTextFieldComponent,
  TextFieldComponent,
} from "./TextFieldComponent";

export interface LifelikeCaSettingsComponentClassSpec {
  settings: string | string[];
}

export interface LifelikeCaSettingsComponentSpec {
  classSpec?: LifelikeCaSettingsComponentClassSpec;
  extraClass?: string | string[];
  id: string;
}

export interface LifelikeCaSettingsComponent {
  birthCountFieldset: CountComponent;
  rulestring: TextFieldComponent;
  settings: HTMLDivElement;
  survivalCountFieldset: CountComponent;
}

export const defaultClassSpec: LifelikeCaSettingsComponentClassSpec = {
  settings: "lifelike-ca-settings",
};

const createSettings = (
  spec: LifelikeCaSettingsComponentSpec,
  classSpec: LifelikeCaSettingsComponentClassSpec
) => {
  const { extraClass, id } = spec;

  const settings = document.createElement("div");
  addClasses(settings, concatTruthyItems(classSpec.settings, extraClass));
  settings.id = id;

  return settings;
};

export const createLifelikeCaSettingsComponent = (
  spec: LifelikeCaSettingsComponentSpec
) => {
  const { id } = spec;
  const classSpec = defaultClassSpec;

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
  settings.appendChild(rulestring.textField);

  const component: LifelikeCaSettingsComponent = {
    birthCountFieldset,
    rulestring,
    settings,
    survivalCountFieldset,
  };

  return component;
};
