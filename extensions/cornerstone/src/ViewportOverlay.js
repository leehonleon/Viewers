import React from 'react';
import PropTypes from 'prop-types';
import cornerstone from 'cornerstone-core';
import classnames from 'classnames'
import ConfigPoint from 'config-point'
import ViewportOverlay from '@ohif/ui'

const { CornerstoneViewportOverlay } = ConfigPoint.register({
  CornerstoneViewportOverlay: {
    configBase: 'ViewportOverlay',
  }
});

export default CornerstoneViewportOverlay.generateFromConfig(CornerstoneViewportOverlay);
