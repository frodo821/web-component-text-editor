import './types';
import { Component } from './component';

type PropType<K> = { [P in JSX.GlobalAttributes | keyof K]: any };

export function createElement<K, E extends JSX.JSXElement<K>>(
  element: E | string,
  props: PropType<K>,
  ...children: any[]
): Element {
  let elem: Element;
  if (typeof element === 'string') {
    elem = document.createElement(element);
  } else {
    elem = document.createElement(
      (element as any).name.replace(/(?!^)([A-Z0-9])/g, '-$1').toLowerCase()
    );
  }
  Object.keys(props || {})
    .filter(it => props.hasOwnProperty(it))
    .forEach(it =>
      elem.setAttribute(convertPropName(it), props[it as keyof PropType<K>])
    );
  children
    .flat()
    .forEach(it =>
      !(it instanceof Element)
        ? it.hasOwnProperty('render') && typeof it.render === 'function'
          ? elem.appendChild(it.render())
          : elem.append(it.toString())
        : elem.appendChild(it)
    );
  return elem;
}

function convertPropName(name: string): string {
  switch (name) {
    case 'className':
      return 'class';
    case 'htmlFor':
      return 'for';
    default:
      return name;
  }
}

export default { createElement, Component };
