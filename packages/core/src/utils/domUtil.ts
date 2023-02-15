/**
 * Go through the array of elements, and remove any element detected to be descendant of one of the
 * elements of the array.
 * @param elements
 * @returns  A new array of elements which don't have any ascendant/descendant relationships.
 */
export function removeAllChildren(elements: Element[]): Element[] {
  if (elements.length <= 1) {
    return elements;
  }

  for (let i = 0; i < elements.length - 1; i++) {
    const eli: Element = elements[i];
    for (let j = i; j < elements.length; j++) {
      const elj: Element = elements[j];
      let foundChildIndex = -1;
      if (isParent(eli, elj)) {
        foundChildIndex = j;
      } else if (isParent(elj, eli)) {
        foundChildIndex = i;
      }

      if (foundChildIndex >= 0) {
        // We have found a child, remove it
        const listWithChildRemoved: Element[] = elements.concat().splice(foundChildIndex, 1);
        return removeAllChildren(listWithChildRemoved); // Recursively remove any children found
      }
    }
  }

  return elements;
}

/**
 * Return whether assumptiveParent is indeed parent of el
 * @param assumptiveParent
 * @param el
 */
export function isParent(assumptiveParent: Element, el: Element): boolean {
  let check: Element | null = el.parentElement;
  while (check) {
    if (check === assumptiveParent) {
      return true;
    }
    check = check.parentElement;
  }
  return false;
}
