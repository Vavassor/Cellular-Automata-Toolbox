import { addClasses } from "../Css";
import { createSubId } from "../Id";
import {
  createNumberFieldComponent,
  NumberFieldComponent,
} from "./NumberFieldComponent";
import {
  createSelectFieldComponent,
  SelectFieldComponent,
} from "./SelectFieldComponent";
import {
  createTextFieldComponent,
  TextFieldComponent,
} from "./TextFieldComponent";

export interface CyclicCaSettingsComponentClassSpec {
  settings: string | string[];
}

export interface CyclicCaSettingsComponentSpec {
  classSpec?: CyclicCaSettingsComponentClassSpec;
  id: string;
}

export interface CyclicCaSettingsComponent {
  advanceThreshold: NumberFieldComponent;
  neighborhood: SelectFieldComponent;
  neighborhoodRange: NumberFieldComponent;
  rulestring: TextFieldComponent;
  settings: HTMLDivElement;
  stateCount: NumberFieldComponent;
}

const createSettings = (
  spec: CyclicCaSettingsComponentSpec,
  classSpec: CyclicCaSettingsComponentClassSpec
) => {
  const { id } = spec;

  const settings = document.createElement("div");
  addClasses(settings, classSpec.settings);
  settings.id = id;

  return settings;
};

const createRow = () => {
  const row = document.createElement("div");
  row.classList.add("form-row");

  return row;
};

const defaultClassSpec: CyclicCaSettingsComponentClassSpec = {
  settings: "cyclic-ca-settings",
};

export const createCyclicCaSettingsComponent = (
  spec: CyclicCaSettingsComponentSpec
) => {
  const { id } = spec;
  const classSpec = spec.classSpec || defaultClassSpec;

  const advanceThresholdId = createSubId(id, "advance-threshold-number-field");
  const neighborhoodId = createSubId(id, "neighborhood-select-field");
  const neighborhoodRangeId = createSubId(
    id,
    "neighborhood-range-number-field"
  );
  const rulestringId = createSubId(id, "rulestring-text-field");
  const stateCountId = createSubId(id, "state-count-number-field");

  const advanceThreshold = createNumberFieldComponent({
    extraClass: ["margin-block-end-8", "form-row-item"],
    label: "Advance Threshold",
    id: advanceThresholdId,
    inputId: createSubId(id, "advance-threshold"),
    max: 8,
    min: 1,
    name: "advanceThreshold",
  });

  const stateCount = createNumberFieldComponent({
    extraClass: ["margin-block-end-8", "form-row-item"],
    id: stateCountId,
    inputId: createSubId(id, "state-count"),
    label: "State Count",
    max: 256,
    min: 2,
    name: "stateCount",
  });

  const stateRow = createRow();
  stateRow.appendChild(advanceThreshold.numberField);
  stateRow.appendChild(stateCount.numberField);

  const neighborhood = createSelectFieldComponent({
    extraClass: ["margin-block-end-8", "form-row-item"],
    id: neighborhoodId,
    label: "Neighborhood",
    options: [
      {
        label: "Moore",
        value: "Moore",
      },
      {
        label: "Von Neumann",
        value: "VonNeumann",
      },
    ],
    selectId: createSubId(id, "neighborhood"),
  });

  const neighborhoodRange = createNumberFieldComponent({
    extraClass: ["margin-block-end-8", "form-row-item"],
    id: neighborhoodRangeId,
    inputId: createSubId(id, "neighborhood-range"),
    label: "Neighborhood Range",
    max: 10,
    min: 1,
    name: "neighborhoodRange",
  });

  const neighborhoodRow = createRow();
  neighborhoodRow.appendChild(neighborhood.selectField);
  neighborhoodRow.appendChild(neighborhoodRange.numberField);

  const rulestring = createTextFieldComponent({
    extraClass: "margin-block-end-8",
    label: "Rulestring",
    id: rulestringId,
    inputId: createSubId(id, "rulestring"),
    name: "rulestring",
  });

  const settings = createSettings(spec, classSpec);

  settings.appendChild(stateRow);
  settings.appendChild(neighborhoodRow);
  settings.appendChild(rulestring.textField);

  const component: CyclicCaSettingsComponent = {
    advanceThreshold,
    neighborhood,
    neighborhoodRange,
    rulestring,
    settings,
    stateCount,
  };

  return component;
};
