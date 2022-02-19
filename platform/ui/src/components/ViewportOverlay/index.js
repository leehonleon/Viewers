import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import listComponentGenerator from './listComponentGenerator';
import ConfigPoint from 'config-point'

/**
 *
 * @param {*} config is a configuration object that defines four lists of elements,
 * one topLeft, topRight, bottomLeft, bottomRight contents.
 * @param {*} extensionManager is used to load the image data.
 * @returns
 */
const generateFromConfig = (config) => {
  const { topLeft, topRight, bottomLeft, bottomRight, itemGenerator } = config;
  console.log('generateFromConfig', config)
  console.log('topLeft length', topLeft.length);

  return (props) => {
    const {
      imageId,
      imageIndex,
      stackSize,
    } = props
    const topLeftClass = 'top-viewport left-viewport';
    const topRightClass = 'top-viewport right-viewport-scrollbar';
    const bottomRightClass = 'bottom-viewport right-viewport-scrollbar';
    const bottomLeftClass = 'bottom-viewport left-viewport';
    const overlay = 'absolute pointer-events-none';


    if (!imageId) {
      return null;
    }

    return (
      <div className="text-primary-light">
        <div
          data-cy={'viewport-overlay-top-left'}
          className={classnames(overlay, topLeftClass)}
        >
          {listComponentGenerator({ ...props, list: topLeft, itemGenerator })}
        </div>
        <div
          data-cy={'viewport-overlay-top-right'}
          className={classnames(overlay, topRightClass)}
        >
          {listComponentGenerator({ ...props, list: topRight, itemGenerator })}
        </div>
        <div
          data-cy={'viewport-overlay-bottom-right'}
          className={classnames(overlay, bottomRightClass)}
        >
          {listComponentGenerator({ ...props, list: bottomRight, itemGenerator })}
        </div>
        <div
          data-cy={'viewport-overlay-bottom-left'}
          className={classnames(overlay, bottomLeftClass)}
        >
          {listComponentGenerator({ ...props, list: bottomLeft, itemGenerator })}
        </div>
      </div>
    );
  };
};

const { ViewportOverlay } = ConfigPoint.register({
  ViewportOverlay: {
    configBase: {
      topLeft: [
        {
          id: 'hello',
        },
      ],
      topRight: [
        {
          id: 'goodbye',
        },
      ],
      bottomLeft: [
        {
          id: 'Salut left',
        },
      ],
      bottomRight: [
        {
          id: 'Adieu Right',
        },
      ],
      itemGenerator: props => {
        const { item } = props;
        return (
          <div className="flex flex-row">
            <span className="mr-1">Overlay {item.id}</span>
          </div>
        );
      },
      generateFromConfig,
    },
  }
});

export default ViewportOverlay;
