enum Phase {
  Active = "active",
  Base = "base",
  Done = "done",
}

enum Type {
  Appear = "appear",
  Enter = "enter",
  Exit = "exit",
}

interface PhaseClasses {
  [phase: string]: string;
  active: string;
  base: string;
  done: string;
}

interface PhaseClassesByType {
  [type: string]: PhaseClasses;
  appear: PhaseClasses;
  enter: PhaseClasses;
  exit: PhaseClasses;
}

interface AppliedPhaseClasses {
  [phase: string]: string[];
}

interface AppliedClasses {
  [type: string]: AppliedPhaseClasses;
  appear: AppliedPhaseClasses;
  enter: AppliedPhaseClasses;
  exit: AppliedPhaseClasses;
}

type HandleDone = (event: Event) => void;

interface CancelableCallback {
  (event: TransitionEvent): void;
  cancel: () => void;
}

interface Transition {
  appliedClasses: AppliedClasses;
  element: Element;
  isActive: boolean;
  isAppearing: boolean;
  nextCallback: CancelableCallback | null;
  phaseClassesByType: PhaseClassesByType;
}

interface TransitionSpec {
  element: Element;
  isAppearing: boolean;
  phaseClassesByType: PhaseClassesByType;
}

const forceRepaint = (element: Element) => {
  /* eslint-disable no-unused-expressions */
  element && element.scrollTop;
};

const addClasses = (element: Element, classes: string[]) => {
  classes.forEach((className) => element.classList.add(className));
};

const removeClasses = (element: Element, classes: string[]) => {
  classes.forEach((className) => element.classList.remove(className));
};

const addClass = (transition: Transition, type: Type, phase: Phase) => {
  const { appliedClasses, element, phaseClassesByType } = transition;
  const phaseClasses = phaseClassesByType[type];
  const phaseClass = phaseClasses[phase];
  const classes = phaseClass ? [phaseClass] : [];

  if (type === "appear" && phase === "done") {
    const { done } = phaseClassesByType["enter"];
    if (done) {
      classes.push(done);
    }
  }

  if (phase === "active") {
    forceRepaint(element);
  }

  if (classes) {
    appliedClasses[type][phase] = classes;
    addClasses(element, classes);
  }
};

const removeTypeClasses = (transition: Transition, type: string) => {
  const { appliedClasses, element } = transition;
  const {
    base: baseClasses,
    active: activeClasses,
    done: doneClasses,
  } = appliedClasses[type];

  appliedClasses[type] = {};

  if (baseClasses) {
    removeClasses(element, baseClasses);
  }
  if (activeClasses) {
    removeClasses(element, activeClasses);
  }
  if (doneClasses) {
    removeClasses(element, doneClasses);
  }
};

const createTransition = (spec: TransitionSpec) => {
  const { element, isAppearing, phaseClassesByType } = spec;

  const transition: Transition = {
    appliedClasses: {
      appear: {},
      enter: {},
      exit: {},
    },
    element,
    isActive: false,
    isAppearing,
    nextCallback: null,
    phaseClassesByType,
  };

  const setNextCallback = (
    transition: Transition,
    callback: (event: TransitionEvent) => void
  ) => {
    transition.isActive = true;

    const nextCallback: CancelableCallback = (event) => {
      if (transition.isActive) {
        transition.isActive = false;
        transition.nextCallback = null;
        callback(event);
      }
    };

    nextCallback.cancel = () => {
      transition.isActive = false;
    };

    transition.nextCallback = nextCallback;
  };

  const setHandleTransitionEnd = (handleTransitionEnd: HandleDone) => {
    setNextCallback(transition, handleTransitionEnd);
    element.addEventListener("transitionend", handleTransitionEnd, false);
  };

  const handleEnterBegun = () => {
    const { isAppearing } = transition;
    const type = isAppearing ? Type.Appear : Type.Enter;
    removeTypeClasses(transition, Type.Exit);
    addClass(transition, type, Phase.Base);
  };

  const handleEnterOngoing = () => {
    const { isAppearing } = transition;
    const type = isAppearing ? Type.Appear : Type.Enter;
    addClass(transition, type, Phase.Active);
  };

  const handleEnterComplete = () => {
    const { isAppearing } = transition;
    const type = isAppearing ? Type.Appear : Type.Enter;
    removeTypeClasses(transition, type);
    addClass(transition, type, Phase.Done);
  };

  const handleExitBegin = () => {
    removeTypeClasses(transition, Type.Appear);
    removeTypeClasses(transition, Type.Enter);
    addClass(transition, Type.Exit, Phase.Base);
  };

  const handleExitOngoing = () => {
    addClass(transition, Type.Exit, Phase.Active);
  };

  const handleExitComplete = () => {
    removeTypeClasses(transition, "exit");
    addClass(transition, Type.Exit, Phase.Done);
  };

  return transition;
};
