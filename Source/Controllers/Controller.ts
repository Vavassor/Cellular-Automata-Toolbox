export type TargetMap = Record<string, Element>;

const getTargetFromSelf = (element: HTMLElement, targetName: string) => {
  return element.dataset.target === targetName ? element : undefined;
};

const getTarget = (element: HTMLElement, targetName: string) => {
  return (
    getTargetFromSelf(element, targetName) ||
    element.querySelector(`[data-target="${targetName}"]`)
  );
};

export function getTargets<T extends TargetMap>(
  id: string,
  targetNames: string[]
): T {
  const rootElement = document.getElementById(id)!;
  return Object.fromEntries(
    targetNames.map((targetName) => {
      const target = getTarget(rootElement, targetName);
      return [targetName, target!];
    })
  ) as T;
}
