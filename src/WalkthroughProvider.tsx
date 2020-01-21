import React, {FunctionComponent} from 'react';
import PropTypes from 'prop-types';
import {EventEmitter} from 'events';

import ContextWrapper, {ElementType, GuideType} from './ContextWrapper';

const wrapperRef = React.createRef<ContextWrapper>();
const ee = new EventEmitter();

const WalkthroughProvider: FunctionComponent = ({children}) => (
  <ContextWrapper ref={wrapperRef} eventEmitter={ee}>
    {children}
  </ContextWrapper>
);

const goToWalkthroughElement = (element: ElementType) => {
  const {current: wrapper} = wrapperRef;
  wrapper?.goToElement(element);
};

const setWalkthroughGuide = (guide: GuideType, onFinish?: () => void) => {
  const {current: wrapper} = wrapperRef;
  return wrapper?.setGuideAsync(guide, onFinish);
};

const startWalkthrough = (walkthrough: GuideType, onFinish?: () => void) => {
  if (Array.isArray(walkthrough)) {
    setWalkthroughGuide(walkthrough, onFinish)?.then(() =>
      goToWalkthroughElement(walkthrough[0])
    );
  } else {
    console.warn(
      '[react-native-walkthrough] non-Array argument provided to startWalkthrough'
    );
  }
};

const dispatchWalkthroughEvent = (event: string | symbol) => ee.emit(event);

WalkthroughProvider.propTypes = {
  children: PropTypes.element,
};

export {dispatchWalkthroughEvent, startWalkthrough};
export default WalkthroughProvider;
