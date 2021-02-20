import {
  createSelectFieldComponent,
  OptionSpec
} from "./Components/SelectComponent";
import { createFormController, FormController } from "./Controllers/FormController";
import {
  createRadioButtonController,
  RadioButtonController
} from "./Controllers/RadioButtonController";
import {
  createSelectFieldController,
  SelectFieldController
} from "./Controllers/SelectFieldController";
import {
  CyclicCaRule,
  namedRules as namedCyclicRules,
  updateCyclicCa
} from "./CyclicCa";
import {
  GenerationCaRule,
  namedRules as namedGenerationRules,
  updateGenerationCa
} from "./GenerationCa";
import { createGrid, FillType, Grid } from "./Grid";
import {
  LifelikeCaRule,
  namedRules as namedLifelikeRules,
  updateLifelikeCa
} from "./LifelikeCa";
import "./Stylesheets/index.css";
import {
  clearCanvas,
  drawGrid,
  updateCanvas,
  VideoContext
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

interface App {
  family: CaFamily;
  formControllers: FormControllers;
  grid: Grid;
  rule: CaRule;
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

const getFillType = (caRule: CaRule) => {
  switch (caRule.type) {
    case "Cyclic":
      return FillType.UniformRandom;
    case "Generation":
      return FillType.UniformRandomBinary;
    case "Lifelike":
      return FillType.UniformRandomBinary;
  }
};

const createGridByRule = (videoContext: VideoContext, rule: CaRule) => {
  const grid = createGrid({
    dimension: {
      height: videoContext.canvas.height,
      width: videoContext.canvas.width,
    },
    fillType: getFillType(rule),
    stateCount: getStateCount(rule),
  });
  return grid;
};

const setRule = (app: App, rule: CaRule) => {
  app.grid = createGridByRule(app.videoContext, rule);
  app.rule = rule;
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

const updateCa = (grid: Grid, caRule: CaRule) => {
  switch (caRule.type) {
    case "Cyclic":
      updateCyclicCa(grid, caRule.rule);
      break;
    case "Generation":
      updateGenerationCa(grid, caRule.rule);
      break;
    case "Lifelike":
      updateLifelikeCa(grid, caRule.rule);
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

  const presetsId = "presets";

  const { select } = createSelectFieldComponent({
    ariaLabelledBy: "presets-label",
    id: presetsId,
    name: "preset",
    options: createOptionsByFamily(family),
  });
  const presets = document.getElementById(presetsId)!;
  presets.replaceWith(select);

  app.formControllers.presetField = createPresetField(app, presetsId);
};

const createFamilyRadioButton = (app: App, inputId: string) => {
  const handleChange = (event: Event) => {
    const radioButton = event.target as HTMLInputElement;
    const family = radioButton.value as CaFamily;
    setFamily(app, family);
  };

  const controller = createRadioButtonController({
    handleChange,
    id: inputId,
  });

  return controller;
};

const createPresetForm = (app: App, formId: string) => {
  const handleSubmit = (event: Event) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const inputs = form.elements;
    const preset = inputs.namedItem("preset") as RadioNodeList;
    const presetName = preset.value;
    const rule = getNamedRule(app.family, presetName);
    setRule(app, rule);
  };

  const form = createFormController({
    handleSubmit,
    id: formId,
  });

  return form;
};

const setUpApp = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d")!;

  const videoContext: VideoContext = {
    canvas,
    pixelImageData: context.createImageData(canvas.width, canvas.height),
    renderingContext: context,
  };

  const family = CaFamily.Generation;

  const defaultRule: CaRule = {
    rule: namedGenerationRules.faders,
    type: family,
  };

  const grid = createGridByRule(videoContext, defaultRule);

  const app: App = {
    family,
    formControllers: {},
    grid,
    rule: defaultRule,
    videoContext,
  };

  let priorTime: number;
  const framesPerSecond = 10;
  const millisecondsPerFrame = 1000 / framesPerSecond;

  const animationFrameCallback = (time: number) => {
    const elapsed = time - priorTime;
    if (elapsed > millisecondsPerFrame) {
      priorTime = time - (elapsed % millisecondsPerFrame);
      updateCa(app.grid, app.rule);
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
  app.formControllers.presetField = createPresetField(app, "presets");
  app.formControllers.cyclicFamilyRadioButton = createFamilyRadioButton(
    app,
    "family-cyclic"
  );
  app.formControllers.generationFamilyRadioButton = createFamilyRadioButton(
    app,
    "family-generation"
  );
  app.formControllers.lifelikeFamilyRadioButton = createFamilyRadioButton(
    app,
    "family-lifelike"
  );
};

setUpApp();
