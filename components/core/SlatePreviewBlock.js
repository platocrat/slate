import * as React from "react";
import * as Constants from "~/common/constants";
import * as SVG from "~/common/svg";
import * as Strings from "~/common/strings";
import * as Window from "~/common/window";

import { css } from "@emotion/react";
import { Boundary } from "~/components/system/components/fragments/Boundary";
import { PopoverNavigation } from "~/components/system/components/PopoverNavigation";

import ProcessedText from "~/components/core/ProcessedText";
import SlateMediaObjectPreview from "~/components/core/SlateMediaObjectPreview";

const MARGIN = 12;
const MIN_WIDTH = 144;
const placeholder =
  "https://slate.textile.io/ipfs/bafkreidq27ycqubd4pxbo76n3rv5eefgxl3a2lh3wfvdgtil4u47so3nqe";

const STYLES_MOBILE_HIDDEN = css`
  @media (max-width: ${Constants.sizes.mobile}px) {
    display: none;
  }
`;

const STYLES_MOBILE_ONLY = css`
  @media (min-width: ${Constants.sizes.mobile}px) {
    display: none;
  }
`;

const STYLES_CREATE_NEW = css`
  color: ${Constants.system.darkGray};
  box-shadow: 0px 0px 0px 1px rgba(229, 229, 229, 0.5) inset;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  @media (max-width: ${Constants.sizes.mobile}px) {
    margin: 0;
    border-radius: 8;
    width: 100%;
    height: 100%;
  }
`;

const STYLES_BLOCK = css`
  box-shadow: 0 0 0 0.5px ${Constants.system.lightBorder} inset,
    0 0 40px 0 ${Constants.system.shadow};
  padding: 24px;
  font-size: 12px;
  text-align: left;
  cursor: pointer;
  height: 440px;
  width: 100%;

  @media (max-width: ${Constants.sizes.mobile}px) {
    margin: 24px auto;
    height: auto;
  }
`;

const STYLES_TITLE_LINE = css`
  width: 100%;
  display: flex;
  align-items: center;
  font-size: ${Constants.typescale.lvl1};
  margin-bottom: 8px;
  overflow-wrap: break-word;

  @media (max-width: ${Constants.sizes.mobile}px) {
    display: none;
  }
`;

const STYLES_COPY_INPUT = css`
  pointer-events: none;
  position: absolute;
  opacity: 0;
`;

const STYLES_TAG = css`
  margin-right: 16px;
  padding: 4px 8px;
  border-radius: 2px;
  border: 1px solid ${Constants.system.black};
  color: ${Constants.system.black};
  font-family: ${Constants.font.semiBold};
  font-size: 0.9rem;
`;

const STYLES_BODY = css`
  font-family: ${Constants.font.text};
  font-size: ${Constants.typescale.lvl0};
  color: ${Constants.system.darkGray};
  margin-bottom: 24px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: ${Constants.sizes.mobile}px) {
    display: none;
  }
`;

const STYLES_ICON_BOX = css`
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: ${Constants.system.darkGray};

  :hover {
    color: ${Constants.system.brand};
  }
`;

const STYLES_CONTEXT_MENU = css`
  position: absolute;
`;

const STYLES_TITLE = css`
  font-size: ${Constants.typescale.lvl2};
  font-family: ${Constants.font.semiBold};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 16px;
`;

const STYLES_PLACEHOLDER = css`
  width: 100%;
  height: 300px;
  background-size: cover;
  background-position: 50% 50%;
  margin-bottom: 4px;
  @media (max-width: ${Constants.sizes.mobile}px) {
    height: 100%;
  }
`;

export class SlatePreviewBlock extends React.Component {
  _ref;
  _test;

  state = {
    showMenu: false,
    copyValue: "",
    windowWidth: 360,
  };

  componentDidMount = () => {
    this.calculateWidth();
    window.addEventListener("resize", this.calculateWidth);
  };

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.calculateWidth);
  };

  calculateWidth = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  _handleCopy = (e, value) => {
    e.stopPropagation();
    this.setState({ copyValue: value }, () => {
      this._ref.select();
      document.execCommand("copy");
      this._handleHide();
    });
  };

  _handleClick = (e) => {
    e.stopPropagation();
    if (this.state.showMenu) {
      this._handleHide();
      return;
    }
    this.setState({ showMenu: true });
  };

  _handleHide = (e) => {
    this.setState({ showMenu: false });
  };

  render() {
    let first = this.props.slate.data.objects ? this.props.slate.data.objects[0] : null;
    let contextMenu = (
      <React.Fragment>
        <Boundary
          captureResize={true}
          captureScroll={false}
          enabled
          onOutsideRectEvent={this._handleHide}
        >
          <PopoverNavigation
            style={{
              top: "16px",
              right: "-12px",
            }}
            navigation={
              this.props.isOwner
                ? [
                    {
                      text: "Copy URL",
                      onClick: (e) =>
                        this._handleCopy(
                          e,
                          Strings.getURLFromPath(
                            `/${this.props.username}/${this.props.slate.slatename}`
                          )
                        ),
                    },
                    {
                      text: "Copy slate ID",
                      onClick: (e) => this._handleCopy(e, this.props.slate.id),
                    },
                  ]
                : [
                    {
                      text: "Copy URL",
                      onClick: (e) =>
                        this._handleCopy(
                          e,
                          Strings.getURLFromPath(
                            `/${this.props.username}/${this.props.slate.slatename}`
                          )
                        ),
                    },
                  ]
            }
          />
        </Boundary>
        <input
          readOnly
          ref={(c) => {
            this._ref = c;
          }}
          value={this.state.copyValue}
          css={STYLES_COPY_INPUT}
        />
      </React.Fragment>
    );

    return (
      <div css={STYLES_BLOCK}>
        <div css={STYLES_TITLE_LINE}>
          <div css={STYLES_TITLE}>{this.props.slate.data.name}</div>
          {this.props.isOwner ? (
            this.props.slate.data.public ? (
              <div
                css={STYLES_TAG}
                style={{
                  borderColor: Constants.system.brand,
                  color: Constants.system.brand,
                }}
              >
                Public
              </div>
            ) : (
              <div
                css={STYLES_TAG}
                style={{
                  color: Constants.system.darkGray,
                  borderColor: Constants.system.darkGray,
                }}
              >
                Private
              </div>
            )
          ) : (
            <div />
          )}
          {this.props.username ? (
            <div
              style={{ marginLeft: "auto" }}
              ref={(c) => {
                this._test = c;
              }}
            >
              {/* <TooltipWrapper
                id={`slate-tooltip-${this.props.slate.id}`}
                type="body"
                content={contextMenu}
                horizontal="left"
                vertical="below"
              > */}
              <div css={STYLES_ICON_BOX} onClick={this._handleClick}>
                <SVG.MoreHorizontal height="24px" />
                {this.state.showMenu ? <div css={STYLES_CONTEXT_MENU}>{contextMenu}</div> : null}
              </div>
              {/* </TooltipWrapper> */}
            </div>
          ) : null}
        </div>
        {this.props.slate.data.body ? (
          <div css={STYLES_BODY}>{this.props.slate.data.body}</div>
        ) : this.props.isOwner ? (
          <div style={{ height: "44px" }} />
        ) : (
          <div style={{ height: "40px" }} />
        )}
        <span css={STYLES_MOBILE_ONLY}>
          <div css={STYLES_TITLE} style={{ marginBottom: 8, fontSize: Constants.typescale.lvl1 }}>
            {this.props.slate.data.name}
          </div>
          <div style={{ marginBottom: 16, fontSize: 12 }}>
            {this.props.slate.data.objects.length} Object
            {this.props.slate.data.objects.length === 1 ? "" : "s"}
          </div>
          <div
            style={{
              width: "100%",
              height: `${this.state.windowWidth - 80}px`,
            }}
          >
            {first ? (
              <SlateMediaObjectPreview
                blurhash={first.blurhash}
                centeredImage
                charCap={30}
                type={first.type}
                url={first.url}
                style={{ borderRadius: 8 }}
                imageStyle={{ borderRadius: 8 }}
                title={first.title || first.name}
                coverImage={first.coverImage}
              />
            ) : this.props.isOwner ? (
              <div css={STYLES_CREATE_NEW} key="add-files">
                <SVG.Plus height="24px" />
                <div>Add Files</div>
              </div>
            ) : (
              <div
                css={STYLES_PLACEHOLDER}
                style={{
                  backgroundImage: `url(${placeholder})`,
                  ...this.props.imageStyle,
                }}
              />
            )}
          </div>
        </span>
        <span css={STYLES_MOBILE_HIDDEN}>
          <div
            style={{
              width: "100%",
              height: `304px`,
            }}
          >
            {first ? (
              <SlateMediaObjectPreview
                blurhash={first.blurhash}
                centeredImage
                charCap={30}
                type={first.type}
                url={first.url}
                title={first.title || first.name}
                coverImage={first.coverImage}
              />
            ) : this.props.isOwner ? (
              <div css={STYLES_CREATE_NEW} key="add-files">
                <SVG.Plus height="24px" />
                <div>Add Files</div>
              </div>
            ) : (
              <div
                css={STYLES_PLACEHOLDER}
                style={{
                  backgroundImage: `url(${placeholder})`,
                  ...this.props.imageStyle,
                }}
              />
            )}
          </div>
        </span>
      </div>
    );
  }
}

const STYLES_LINK = css`
  color: ${Constants.system.grayBlack};
  text-decoration: none;
  width: calc(33.33% - 16px);
  margin-bottom: 16px;
  margin-right: 16px;
  @media (max-width: ${Constants.sizes.tablet}px) {
    width: 50%;
  }
  @media (max-width: ${Constants.sizes.mobile}px) {
    width: 100%;
  }
`;

const STYLES_SLATES = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow: hidden;
  padding-bottom: 48px;
  @media (max-width: ${Constants.sizes.mobile}px) {
    display: block;
  }
`;

export default class SlatePreviewBlocks extends React.Component {
  state = {
    imageSize: 56,
  };

  componentDidMount = () => {
    this.calculateWidth();
    this.debounceInstance = Window.debounce(this.calculateWidth, 350);
    window.addEventListener("resize", this.debounceInstance);
  };

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.debounceInstance);
  };

  calculateWidth = () => {
    let windowWidth = window.innerWidth;
    if (windowWidth > Constants.sizes.mobile) {
      if (this.props.external) {
        windowWidth -= 48;
      } else {
        windowWidth -= 96;
      }
      windowWidth = Math.min(windowWidth, Constants.sizes.desktop);
      windowWidth -= 80; //NOTE(martina): 48px padding on scene page, 40px padding on block
      for (let i = this.props.numItems || 5; i > 0; i--) {
        let width = (windowWidth - MARGIN * 2 * (i - 1)) / i;
        if (width < MIN_WIDTH) {
          continue;
        }
        this.setState({ imageSize: width });
        return;
      }
    }
    this.setState({ imageSize: windowWidth - 48 - 32 }); //NOTE(martina): 24px padding on scene page, 16px padding on block on mobile
  };

  render() {
    return (
      <div css={STYLES_SLATES}>
        {this.props.slates.map((slate) => (
          <div
            css={STYLES_LINK}
            key={slate.id}
            onClick={() =>
              this.props.onAction({
                type: "NAVIGATE",
                value: "V1_NAVIGATION_SLATE",
                data: { decorator: "SLATE", ...slate },
              })
            }
          >
            <SlatePreviewBlock
              isOwner={this.props.isOwner}
              username={this.props.username}
              imageSize={this.state.imageSize}
              slate={slate}
            />
          </div>
        ))}
      </div>
    );
  }
}
