const PropTypes = require('prop-types');
const React = require('react');

import { withTheme } from './Theme';
const Button = require('./Button');
const Icon = require('./Icon');
const MXFocusTrap = require('../components/MXFocusTrap');

const _merge = require('lodash/merge');

const { themeShape } = require('../constants/App');

const StyleUtils = require('../utils/Style');

class Modal extends React.Component {
  static propTypes = {
    'aria-describedby': PropTypes.string,
    'aria-label': PropTypes.string,
    'aria-labelledby': PropTypes.string,
    buttons: PropTypes.arrayOf(PropTypes.shape({
      actionText: PropTypes.string,
      className: PropTypes.string,
      isActive: PropTypes.bool,
      icon: PropTypes.string,
      label: PropTypes.string,
      onClick: PropTypes.func,
      style: PropTypes.object,
      type: PropTypes.oneOf(['primary', 'secondary'])
    })),
    contentHasTabIndex: PropTypes.bool,
    contentStyle: PropTypes.object,
    focusOnLoad: PropTypes.bool,
    focusTrapProps: PropTypes.object,
    footerContent: PropTypes.node,
    footerStyle: PropTypes.object,
    isRelative: PropTypes.bool,
    onRequestClose: PropTypes.func,
    portalTo: PropTypes.string,
    role: PropTypes.string,
    showCloseIcon: PropTypes.bool,
    showFooter: PropTypes.bool,
    showScrim: PropTypes.bool,
    showTitleBar: PropTypes.bool,
    style: PropTypes.object,
    styles: PropTypes.object,
    theme: themeShape,
    title: PropTypes.string,
    tooltip: PropTypes.string,
    tooltipLabel: PropTypes.string,
    tooltipTitle: PropTypes.string
  };

  static defaultProps = {
    buttons: [],
    contentHasTabIndex: true,
    focusOnLoad: true,
    focusTrapProps: {},
    isRelative: false,
    showCloseIcon: true,
    showFooter: false,
    showScrim: true,
    showTitleBar: false,
    title: '',
    tooltip: null,
    tooltipLabel: '',
    tooltipTitle: null
  };

  state = {
    showTooltip: false
  };

  componentDidMount () {
    if (this.props.focusOnLoad) this._modalContent.focus();
  }

  _handleTooltipToggle = (show) => {
    this.setState({
      showTooltip: show
    });
  };

  _renderTitleBar = (styles) => {
    if (this.props.showTitleBar) {
      return (
        <div className='mx-modal-title-bar' style={styles.titleBar}>
          {this.props.title}
        </div>
      );
    } else {
      return null;
    }
  };

  _renderFooter = (styles, theme) => {
    if (this.props.showFooter) {
      return (
        <div className='mx-modal-footer' style={Object.assign({}, styles.footer, this.props.footerStyle)}>
          {this._renderTooltipIconAndLabel(styles, theme)}
          {this._renderFooterContent(styles)}
          <div className='mx-modal-buttons'>
            {this.props.buttons.map((button, i) => {
              return (
                <Button
                  actionText={button.actionText}
                  className={'mx-modal-button ' + button.className}
                  icon={button.icon}
                  isActive={button.isActive}
                  key={button.type + i}
                  onClick={button.onClick}
                  style={Object.assign({}, styles.button, button.style)}
                  theme={theme}
                  type={button.type}
                >
                  {button.label}
                </Button>
              );
            })}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  _renderFooterContent = (styles) => {
    return (
      <div className='mx-modal-footer-content' style={styles.footerContent}>
        {this.props.footerContent}
      </div>
    );
  };

  _renderTooltip = (styles, theme) => {
    if (this.state.showTooltip) {
      return (
        <div style={styles.tooltip}>
          <div className='mx-modal-tooltip-title' style={Object.assign({}, styles.tooltipTitle, { color: theme.Colors.PRIMARY })}>
            {this.props.tooltipTitle}
          </div>
          <div className='mx-modal-tooltip-content' style={styles.tooltipContent}>
            {this.props.tooltip}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  _renderTooltipIconAndLabel = (styles, theme) => {
    if (this.props.tooltip) {
      return (
        <div className='mx-modal-tooltip-label' style={styles.tooltipLabel}>
          <Icon
            className='mx-modal-tooltip-label-icon'
            elementProps={{
              onMouseOut: this._handleTooltipToggle.bind(null, false),
              onMouseOver: this._handleTooltipToggle.bind(null, true)
            }}
            size={18}
            style={{ color: theme.Colors.PRIMARY }}
            type='info'
          />
          <span
            className='mx-modal-tooltip-label-text'
            onMouseOut={this._handleTooltipToggle.bind(null, false)}
            onMouseOver={this._handleTooltipToggle.bind(null, true)}
            style={Object.assign({}, styles.tooltipLabelText, { color: theme.Colors.PRIMARY })}
          >
            {this.props.tooltipLabel}
          </span>
        </div>
      );
    } else {
      return null;
    }
  };

  render () {
    const theme = StyleUtils.mergeTheme(this.props.theme);
    const styles = this.styles(theme);
    const mergedFocusTrapProps = {
      focusTrapOptions: {
        clickOutsideDeactivates: true,
        portalTo: this.props.portalTo
      },
      ...this.props.focusTrapProps
    };

    return (
      <MXFocusTrap {...mergedFocusTrapProps}>
        <div className='mx-modal' style={Object.assign({}, styles.scrim, this.props.isRelative && styles.relative)}>
          <div className='mx-modal-scrim' onClick={this.props.onRequestClose} style={Object.assign({}, styles.scrim, styles.overlay, this.props.isRelative && styles.relative)} />
          <div
            style={Object.assign({}, styles.container, this.props.style)}
          >
            {this._renderTitleBar(styles)}
            <div
              aria-describedby={this.props['aria-describedby']}
              aria-label={this.props['aria-label']}
              aria-labelledby={this.props['aria-labelledby']}
              className='mx-modal-content'
              ref={ref => this._modalContent = ref}
              role={this.props.role}
              style={Object.assign({}, styles.content, this.props.contentStyle)}
              tabIndex={this.props.contentHasTabIndex ? 0 : null}
            >
              {this.props.children}
              {this._renderTooltip(styles, theme)}
            </div>
            {this._renderFooter(styles, theme)}
            {this.props.showCloseIcon && (
              <button
                aria-label='Close Modal'
                className='mx-modal-close'
                onClick={this.props.onRequestClose}
                style={styles.close}
              >
                <Icon
                  size={24}
                  style={styles.closeIcon}
                  type='close-solid'
                />
              </button>
            )}
          </div>
        </div>
      </MXFocusTrap>
    );
  }

  styles = theme => {
    return _merge({}, {
      scrim: {
        zIndex: 1000,
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        textAlign: 'center'
      },
      relative: {
        position: 'absolute'
      },
      overlay: {
        backgroundColor: this.props.showScrim ? theme.Colors.SCRIM : 'transparent'
      },
      close: {
        position: 'absolute',
        top: 0,
        right: 0,
        margin: '-12px -12px 0 0',
        cursor: 'pointer',
        border: 'none',
        backgroundColor: 'transparent'
      },
      closeIcon: {
        color: theme.Colors.GRAY_700
      },
      container: {
        fontFamily: theme.FontFamily,
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 1001,
        backgroundColor: theme.Colors.WHITE,
        boxShadow: theme.ShadowHigh,
        borderRadius: 2,
        top: 20,
        maxWidth: 'calc(100% - 40px)',
        display: 'inline-block',
        textAlign: 'left'
      },
      titleBar: {
        backgroundColor: theme.Colors.GRAY_100,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
        padding: '15px 20px',
        color: theme.Colors.GRAY_500,
        fontSize: theme.FontSizes.SMALL,
        textTransform: 'uppercase',
        letterSpacing: 1
      },
      content: {
        position: 'relative',
        maxHeight: 'calc(100% - 140px)',
        overflow: 'auto'
      },
      footer: {
        backgroundColor: theme.Colors.GRAY_100,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between'
      },
      footerContent: {
        padding: '5px 0',
        textAlign: 'left'
      },
      tooltipLabel: {
        padding: '5px 0'
      },
      tooltipLabelText: {
        fontSize: theme.FontSizes.SMALL
      },
      tooltip: {
        backgroundColor: theme.Colors.GRAY_100,
        borderColor: theme.Colors.GRAY_300,
        borderStyle: 'solid',
        borderWidth: 1,
        boxSizing: 'border-box',
        bottom: 10,
        left: 10,
        position: 'absolute',
        width: 250,
        maxWidth: '100%',
        padding: 10
      },
      tooltipTitle: {
        fontSize: theme.FontSizes.MEDIUM,
        marginBottom: 5
      },
      tooltipContent: {
        color: theme.Colors.GRAY_500,
        fontSize: theme.FontSizes.SMALL,
        lineHeight: '1.5em',
        textAlign: 'left'
      },
      buttons: {
        textAlign: 'right'
      },
      button: {
        marginLeft: 5
      },
      small: {
        width: 400,
        textAlign: 'center'
      }
    }, this.props.styles);
  };
}

module.exports = withTheme(Modal);
