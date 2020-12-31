/** @format */

import { css } from "linaria";

const buttonStyles = {
  buttonWrapper: css`
    display: inline-block;
  `,

  button: css`
    background: black;
    color: #888;
    font-size: 18px;
    border: 0;
    padding-top: 5px;
    vertical-align: bottom;
    height: 34px;
    width: 36px;
    &:hover,
    &:focus {
      background: #f3f3f3;
      outline: 0; /* reset for :focus */
    }
    svg {
      fill: #888;
    }
  `,

  active: css`
    background: black;
    color: #444;
    svg {
      fill: #444;
    }
  `,
};

const toolbarStyles = {
  toolbar: css`
    position: absolute;
    background: #303030;
    border-radius: 2px;
    z-index: 5000;
    box-sizing: border-box;
  `,
};

export const defaultTheme = {
  buttonStyles,
  toolbarStyles,
};
