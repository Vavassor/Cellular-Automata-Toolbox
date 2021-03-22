import "normalize.css";
import { Rgb, unpackUByte3 } from "./Color";
import { createColorButtonComponent } from "./Components/ColorButtonComponent";
import { createCyclicCaSettingsComponent } from "./Components/CyclicCaSettingsComponent";
import { createGenerationCaSettingsComponent } from "./Components/GenerationCaSettingsComponent";
import { createLifelikeCaSettingsComponent } from "./Components/LifelikeCaSettingsComponent";
import {
  createSelectFieldComponent,
  OptionSpec,
} from "./Components/SelectFieldComponent";
import {
  createColorButtonController,
  HandleChange as HandleChangeColorButton,
} from "./Controllers/ColorButtonController";
import {
  createCyclicCaSettingsController,
  CyclicCaSettingsController,
  setRule as setRuleCyclicCaSettings,
} from "./Controllers/CyclicaCaSettingsController";
import {
  createFormController,
  FormController,
} from "./Controllers/FormController";
import {
  createGenerationCaSettingsController,
  GenerationCaSettingsController,
  setRule as setRuleGenerationCaSettings,
} from "./Controllers/GenerationCaSettingsController";
import {
  createLifelikeCaSettingsController,
  LifelikeCaSettingsController,
  setRule as setRuleLifelikeCaSettings,
} from "./Controllers/LifelikeCaSettingsController";
import {
  createRadioButtonController,
  RadioButtonController,
} from "./Controllers/RadioButtonController";
import {
  createSelectFieldController,
  SelectFieldController,
  setValue as setValueSelectField,
} from "./Controllers/SelectFieldController";
import {
  copyCyclicCaRule,
  CyclicCaRule,
  emptyRule as emptyRuleCyclic,
  namedRules as namedCyclicRules,
  updateCyclicCa,
} from "./CyclicCa";
import { parseRulestring as parseRulestringCyclic } from "./CyclicCaRulestring";
import { removeAllChildNodes } from "./Element";
import {
  copyGenerationCaRule,
  emptyRule as emptyRuleGeneration,
  GenerationCaRule,
  namedRules as namedGenerationRules,
  updateGenerationCa,
} from "./GenerationCa";
import { parseRulestring as parseRulestringGeneration } from "./GenerationCaRulestring";
import {
  BoundaryRule,
  createGrid,
  FillType,
  Grid,
  SimulationOptions,
} from "./Grid";
import {
  copyLifelikeCaRule,
  emptyRule as emptyRuleLifelike,
  LifelikeCaRule,
  namedRules as namedLifelikeRules,
  updateLifelikeCa,
} from "./LifelikeCa";
import { parseRulestring as parseRulestringLifelike } from "./LifelikeCaRulestring";
import "./Stylesheets/index.css";
import {
  clearCanvas,
  drawGrid,
  updateCanvas,
  VideoContext,
} from "./VideoContext";

enum CaFamily {
  Cyclic = "Cyclic",
  Generation = "Generation",
  Lifelike = "Lifelike",
}

interface TaggedCyclicCaRule {
  rule: CyclicCaRule;
  type: "Cyclic";
}

interface TaggedGenerationCaRule {
  rule: GenerationCaRule;
  type: "Generation";
}

interface TaggedLifelikeCaRule {
  rule: LifelikeCaRule;
  type: "Lifelike";
}

type CaRule =
  | TaggedCyclicCaRule
  | TaggedGenerationCaRule
  | TaggedLifelikeCaRule;

interface FormControllers {
  cyclicFamilyRadioButton?: RadioButtonController;
  generationFamilyRadioButton?: RadioButtonController;
  lifelikeFamilyRadioButton?: RadioButtonController;
  presetField?: SelectFieldController;
  presetForm?: FormController;
}

interface SimulationSettingsForm {
  cyclicCaSettings?: CyclicCaSettingsController;
  family: CaFamily;
  familyController: SelectFieldController;
  formController: FormController;
  generationCaSettings?: GenerationCaSettingsController;
  lifelikeCaSettings?: LifelikeCaSettingsController;
  rule: CaRule;
}

interface App {
  family: CaFamily;
  formControllers: FormControllers;
  grid: Grid;
  rule: CaRule;
  simulationOptions: SimulationOptions;
  simulationSettingsForm?: SimulationSettingsForm;
  videoContext: VideoContext;
}

const getStateCount = (caRule: CaRule) => {
  switch (caRule.type) {
    case "Cyclic":
      return caRule.rule.stateCount;
    case "Generation":
      return caRule.rule.stateCount;
    case "Lifelike":
      return 2;
  }
};

const createGridByRule = (
  videoContext: VideoContext,
  rule: CaRule,
  fillType: FillType
) => {
  const grid = createGrid({
    dimension: {
      height: videoContext.canvas.height,
      width: videoContext.canvas.width,
    },
    fillType,
    stateCount: getStateCount(rule),
  });
  return grid;
};

const copyCaRule = (rule: CaRule) => {
  let copy: CaRule;

  switch (rule.type) {
    case "Cyclic":
      copy = {
        rule: copyCyclicCaRule(rule.rule),
        type: "Cyclic",
      };
      break;

    case "Generation":
      copy = {
        rule: copyGenerationCaRule(rule.rule),
        type: "Generation",
      };
      break;

    case "Lifelike":
      copy = {
        rule: copyLifelikeCaRule(rule.rule),
        type: "Lifelike",
      };
      break;
  }

  return copy;
};

const setRule = (
  app: App,
  rule: CaRule,
  fillType: FillType,
  boundaryRule: BoundaryRule
) => {
  app.grid = createGridByRule(app.videoContext, rule, fillType);
  app.rule = copyCaRule(rule);
  app.simulationOptions.boundaryRule = boundaryRule;
};

const getNamedRulesByFamily = (family: CaFamily) => {
  switch (family) {
    case CaFamily.Cyclic:
      return namedCyclicRules;
    case CaFamily.Generation:
      return namedGenerationRules;
    case CaFamily.Lifelike:
      return namedLifelikeRules;
  }
};

const getNamedRule = (family: CaFamily, name: string) => {
  switch (family) {
    case CaFamily.Cyclic:
      return { rule: namedCyclicRules[name], type: family };
    case CaFamily.Generation:
      return { rule: namedGenerationRules[name], type: family };
    case CaFamily.Lifelike:
      return { rule: namedLifelikeRules[name], type: family };
  }
};

const createPresetField = (app: App, selectId: string) => {
  const controller = createSelectFieldController({
    id: selectId,
  });

  return controller;
};

const updateCa = (
  grid: Grid,
  caRule: CaRule,
  simulationOptions: SimulationOptions
) => {
  switch (caRule.type) {
    case "Cyclic":
      updateCyclicCa(grid, caRule.rule, simulationOptions);
      break;
    case "Generation":
      updateGenerationCa(grid, caRule.rule, simulationOptions);
      break;
    case "Lifelike":
      updateLifelikeCa(grid, caRule.rule, simulationOptions);
      break;
  }
};

const createOptionsByFamily = (family: CaFamily) => {
  const namedRules = getNamedRulesByFamily(family);
  return Object.entries(namedRules).map(([key, rule]) => {
    const optionSpec: OptionSpec = {
      label: rule.name,
      value: key,
    };
    return optionSpec;
  });
};

const setFamily = (app: App, family: CaFamily) => {
  app.family = family;

  const presetId = "preset-select-field";

  const { selectField } = createSelectFieldComponent({
    label: "Preset",
    id: presetId,
    name: "preset",
    options: createOptionsByFamily(family),
    selectId: "preset",
  });
  const presets = document.getElementById(presetId)!;
  presets.replaceWith(selectField);

  app.formControllers.presetField = createPresetField(app, presetId);
};

const createFamilyRadioButton = (
  app: App,
  inputId: string,
  isChecked?: boolean
) => {
  const handleChange = (event: Event) => {
    const radioButton = event.target as HTMLInputElement;
    const family = radioButton.value as CaFamily;
    setFamily(app, family);
  };

  const controller = createRadioButtonController({
    handleChange,
    id: inputId,
    isChecked,
  });

  return controller;
};

const createPresetForm = (app: App, formId: string) => {
  const handleSubmit = (event: Event) => {
    event.preventDefault();

    const simulationSettingsForm = app.simulationSettingsForm!;

    const form = event.target as HTMLFormElement;
    const inputs = form.elements;
    const preset = inputs.namedItem("preset") as RadioNodeList;
    const presetName = preset.value;
    const rule = getNamedRule(app.family, presetName);
    setRule(app, rule, rule.rule.fillType, rule.rule.boundaryRule);
    setFamilySimulationSettings(simulationSettingsForm, rule.type, rule);
    setValueSelectField(
      app.simulationSettingsForm!.familyController,
      rule.type
    );

    switch (rule.type) {
      case CaFamily.Cyclic:
        setRuleCyclicCaSettings(
          simulationSettingsForm.cyclicCaSettings!,
          rule.rule
        );
        break;

      case CaFamily.Generation:
        setRuleGenerationCaSettings(
          simulationSettingsForm.generationCaSettings!,
          rule.rule
        );
        break;

      case CaFamily.Lifelike:
        setRuleLifelikeCaSettings(
          simulationSettingsForm.lifelikeCaSettings!,
          rule.rule
        );
        break;
    }
  };

  const form = createFormController({
    handleSubmit,
    id: formId,
  });

  return form;
};

const createGenerationCaSettings = (mount: Element, rule: GenerationCaRule) => {
  const settingsId = "generation-ca-settings";

  const component = createGenerationCaSettingsComponent({
    id: settingsId,
  });

  mount.appendChild(component.settings);

  const controller = createGenerationCaSettingsController({
    id: settingsId,
    rule,
  });

  return controller;
};

const createLifelikeCaSettings = (mount: Element, rule: LifelikeCaRule) => {
  const settingsId = "lifelike-ca-settings";

  const component = createLifelikeCaSettingsComponent({
    id: settingsId,
  });

  mount.appendChild(component.settings);

  const controller = createLifelikeCaSettingsController({
    id: settingsId,
    rule,
  });

  return controller;
};

const createCyclicCaSettings = (mount: Element, rule: CyclicCaRule) => {
  const settingsId = "cyclic-ca-settings";

  const component = createCyclicCaSettingsComponent({
    id: settingsId,
  });

  mount.appendChild(component.settings);

  const controller = createCyclicCaSettingsController({
    id: settingsId,
    rule,
  });

  return controller;
};

interface ColorButtonSpec {
  color: Rgb;
  handleChange: HandleChangeColorButton;
  id: string;
  label: string;
}

const createColorButton = (mount: Element, spec: ColorButtonSpec) => {
  const { color, handleChange, id, label } = spec;
  const colorButton = createColorButtonComponent({ id, label });
  mount.appendChild(colorButton.button.button);
  createColorButtonController({ color, handleChange, id });
};

const setFamilySimulationSettings = (
  form: SimulationSettingsForm,
  family: CaFamily,
  initialRule?: CaRule
) => {
  const simulationSettings = document.getElementById("simulation-settings")!;

  removeAllChildNodes(simulationSettings);

  switch (family) {
    case CaFamily.Cyclic: {
      const initialRuleCyclic =
        initialRule && initialRule.type === CaFamily.Cyclic
          ? initialRule.rule
          : emptyRuleCyclic;
      form.cyclicCaSettings = createCyclicCaSettings(
        simulationSettings,
        initialRuleCyclic
      );
      break;
    }

    case CaFamily.Lifelike: {
      const initialRuleLifelike =
        initialRule && initialRule.type === CaFamily.Lifelike
          ? initialRule.rule
          : emptyRuleLifelike;
      form.lifelikeCaSettings = createLifelikeCaSettings(
        simulationSettings,
        initialRuleLifelike
      );
      break;
    }

    case CaFamily.Generation: {
      const initialRuleGeneration =
        initialRule && initialRule.type === CaFamily.Generation
          ? initialRule.rule
          : emptyRuleGeneration;
      form.generationCaSettings = createGenerationCaSettings(
        simulationSettings,
        initialRuleGeneration
      );
      break;
    }
  }

  form.family = family;
};

const createSimulationSettingsForm = (app: App) => {
  let form: SimulationSettingsForm;

  const { rule } = app;
  const family = rule.type as CaFamily;

  const familyController = createSelectFieldController({
    handleChange: (event) => {
      const { controller } = event;
      const { select } = controller.targets;
      const family = select.value as CaFamily;
      setFamilySimulationSettings(app.simulationSettingsForm!, family);
    },
    id: "family-select-field",
    value: family,
  });

  const handleSubmit = (event: Event) => {
    event.preventDefault();

    const formElement = event.target as HTMLFormElement;
    const { elements } = formElement;

    switch (form.family) {
      case CaFamily.Cyclic: {
        const rulestringInput = elements.namedItem(
          "rulestring"
        ) as HTMLInputElement;
        const rulestring = rulestringInput.value;
        const rule: CaRule = {
          rule: parseRulestringCyclic(rulestring)!,
          type: form.family,
        };
        setRule(app, rule, FillType.UniformRandom, BoundaryRule.Wrap);
        break;
      }

      case CaFamily.Generation: {
        const rulestringInput = elements.namedItem(
          "rulestring"
        ) as HTMLInputElement;
        const rulestring = rulestringInput.value;
        const rule: CaRule = {
          rule: parseRulestringGeneration(rulestring)!,
          type: form.family,
        };
        setRule(app, rule, FillType.Splats, BoundaryRule.Wrap);
        break;
      }

      case CaFamily.Lifelike: {
        const rulestringInput = elements.namedItem(
          "rulestring"
        ) as HTMLInputElement;
        const rulestring = rulestringInput.value;
        const rule: CaRule = {
          rule: parseRulestringLifelike(rulestring)!,
          type: form.family,
        };
        setRule(app, rule, FillType.SplatsBinary, BoundaryRule.Wrap);
        break;
      }
    }
  };

  const formController = createFormController({
    handleSubmit,
    id: "simulation-settings-form",
  });

  form = {
    family,
    familyController,
    formController,
    rule,
  };

  setFamilySimulationSettings(form, family, rule);

  return form;
};

const setUpApp = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d")!;

  const videoContext: VideoContext = {
    canvas,
    gradient: { stopA: unpackUByte3(0x540622), stopB: unpackUByte3(0x69ffd2) },
    pixelImageData: context.createImageData(canvas.width, canvas.height),
    renderingContext: context,
  };

  const family = CaFamily.Generation;
  const defaultPreset = namedGenerationRules.faders;
  const defaultRule: CaRule = {
    rule: defaultPreset,
    type: family,
  };

  const grid = createGridByRule(
    videoContext,
    defaultRule,
    defaultPreset.fillType
  );

  const app: App = {
    family,
    formControllers: {},
    grid,
    rule: defaultRule,
    simulationOptions: {
      boundaryRule: defaultPreset.boundaryRule,
    },
    videoContext,
  };

  setFamily(app, family);

  let priorTime: number;
  const framesPerSecond = 10;
  const millisecondsPerFrame = 1000 / framesPerSecond;

  const animationFrameCallback = (time: number) => {
    const elapsed = time - priorTime;
    if (elapsed > millisecondsPerFrame) {
      priorTime = time - (elapsed % millisecondsPerFrame);
      updateCa(app.grid, app.rule, app.simulationOptions);
      clearCanvas(videoContext);
      drawGrid(videoContext, app.grid);
      updateCanvas(videoContext);
    }
    window.requestAnimationFrame(animationFrameCallback);
  };

  const startAnimation = () => {
    priorTime = window.performance.now();
    window.requestAnimationFrame(animationFrameCallback);
  };

  startAnimation();

  app.formControllers.presetForm = createPresetForm(app, "preset-form");
  app.formControllers.presetField = createPresetField(app, "preset");
  app.formControllers.cyclicFamilyRadioButton = createFamilyRadioButton(
    app,
    "family-cyclic"
  );
  app.formControllers.generationFamilyRadioButton = createFamilyRadioButton(
    app,
    "family-generation",
    true
  );
  app.formControllers.lifelikeFamilyRadioButton = createFamilyRadioButton(
    app,
    "family-lifelike"
  );

  const palette = document.getElementById("palette")!;
  createColorButton(palette, {
    color: videoContext.gradient.stopA,
    handleChange: (event) => {
      videoContext.gradient.stopA = event.controller.color;
    },
    id: "color-a",
    label: "Color A",
  });
  createColorButton(palette, {
    color: videoContext.gradient.stopB,
    handleChange: (event) => {
      videoContext.gradient.stopB = event.controller.color;
    },
    id: "color-b",
    label: "Color B",
  });

  app.simulationSettingsForm = createSimulationSettingsForm(app);
};

setUpApp();
