import React, { Component } from "react";
import { InteractionManager } from "react-native";
import { EventEmitter } from "events";
import { TooltipProps } from "react-native-walkthrough-tooltip";

const WAIT_NO_MORE_TIMEOUT = 1000 * 60 * 10; // 10 minutes
const HOT_SEC = 350;

const nullElement = {
  id: undefined,
  content: undefined,
  placement: undefined,
};

export type ElementType = {
  id?: string;
  content: TooltipProps["content"];
  placement: TooltipProps["placement"];
  triggerEvent?: string | number;
  tooltipProps?: TooltipProps;
};
export type GuideType = ElementType[];

const safeSetGuide = (element: GuideType): GuideState => ({ currentGuide: element });
const safeSetElement = (element: ElementType): ElementState => ({ currentElement: element });

type ElementState = { currentElement: ElementType };
type GuideState = { currentGuide: GuideType };
type State = ElementState & GuideState;

export type ContextValue = ElementState & { goToNext: () => void };
export const WalkthroughContext = React.createContext<ContextValue>({
  currentElement: nullElement,
  goToNext: () => {
    // default dummy method
  },
});

interface Props {
  eventEmitter: EventEmitter;
}

class ContextWrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { currentElement: nullElement, currentGuide: [] };
  }

  getCurrentElementIndex = () =>
    this.state.currentGuide.findIndex(element => element.id === this.state.currentElement.id);

  setElement = (element: ElementType) => {
    if (element.id !== this.state.currentElement.id) {
      // clear previous element
      this.setState(safeSetElement(nullElement));

      // after interactions and a hot sec, set current element
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          this.setState(safeSetElement(element));
        }, HOT_SEC);
      });
    }
  };

  setGuide = (guide: GuideType, callback?: () => void) => this.setState(safeSetGuide(guide), callback);

  setNull = () => this.setState(safeSetElement(nullElement));

  clearGuide = () => this.setState(safeSetGuide([]));

  waitForTrigger = (element: ElementType, triggerEvent: string | number) => {
    const { eventEmitter } = this.props;

    const waitStart = Date.now();
    const triggerGuide = JSON.stringify(this.state.currentGuide);

    this.setNull();

    eventEmitter.once(triggerEvent, () => {
      const waitEnd = Date.now();
      const currentGuide = JSON.stringify(this.state.currentGuide);

      if (waitEnd - waitStart >= WAIT_NO_MORE_TIMEOUT) {
        this.clearGuide();
      } else if (triggerGuide === currentGuide) {
        // only do action if we are still in the same guide that requested the element
        this.setElement(element);
      }
    });
  };

  goToElement = (element: ElementType) => {
    if (element.triggerEvent) {
      this.waitForTrigger(element, element.triggerEvent);
    } else {
      this.setElement(element);
    }
  };

  goToNext = () => {
    const nextIndex = this.getCurrentElementIndex() + 1;

    if (nextIndex < this.state.currentGuide.length) {
      this.goToElement(this.state.currentGuide[nextIndex]);
    } else {
      this.setNull();
      this.clearGuide();
    }
  };

  render() {
    return (
      <WalkthroughContext.Provider
        value={{
          ...this.state,
          goToNext: this.goToNext,
        }}
      >
        {this.props.children}
      </WalkthroughContext.Provider>
    );
  }
}

export default ContextWrapper;
