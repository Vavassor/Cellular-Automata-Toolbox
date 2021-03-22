import { concatTruthyItems } from "../Array";
import { addClasses } from "../Css";

export interface FieldsetComponentClassSpec {
  fieldset: string | string[];
  legend: string | string[];
}

export interface FieldsetComponentSpec {
  classSpec?: FieldsetComponentClassSpec;
  extraClass?: string | string[];
  legend: string;
  id: string;
  isDisabled?: string;
}

export interface FieldsetComponent {
  fieldset: HTMLFieldSetElement;
  legend: HTMLLegendElement;
}

export const defaultClassSpec: FieldsetComponentClassSpec = {
  fieldset: "fieldset",
  legend: "fieldset__legend",
};

const createFieldset = (
  spec: FieldsetComponentSpec,
  classSpec: FieldsetComponentClassSpec
) => {
  const { extraClass, id, isDisabled } = spec;

  const fieldset = document.createElement("fieldset");
  addClasses(fieldset, concatTruthyItems(classSpec.fieldset, extraClass));
  fieldset.id = id;

  if (isDisabled) {
    fieldset.disabled = true;
  }

  return fieldset;
};

const createLegend = (
  spec: FieldsetComponentSpec,
  classSpec: FieldsetComponentClassSpec
) => {
  const { legend } = spec;

  const legendElement = document.createElement("legend");
  addClasses(legendElement, classSpec.legend);
  legendElement.textContent = legend;

  return legendElement;
};

export const createFieldSetComponent = (spec: FieldsetComponentSpec) => {
  const classSpec = spec.classSpec || defaultClassSpec;

  const fieldset = createFieldset(spec, classSpec);
  const legend = createLegend(spec, classSpec);
  fieldset.appendChild(legend);

  const component: FieldsetComponent = {
    fieldset,
    legend,
  };

  return component;
};
