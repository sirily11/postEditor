/** @format */

import React from "react";
import PropTypes from "prop-types";
import Tooltip from "@material-ui/core/Tooltip";
import { Theme, Typography, withStyles } from "@material-ui/core";
import { LinkProps } from "../../utils/interfaces";
import { defaultTheme } from "../../theme";
import { DetailSettings } from "../../../../../model/interfaces";
import { PostSettingContext } from "../../../../../model/postSettingsContext";

const propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  entityKey: PropTypes.string,
  getEditorState: PropTypes.func.isRequired,
};

const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    width: 300,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}))(Tooltip);

//@ts-ignore
const SettingsText = ({
  //@ts-ignore
  children,
  //@ts-ignore
  className,
  //@ts-ignore
  entityKey,
  //@ts-ignore
  getEditorState,
  //@ts-ignore
  // eslint-disable-next-line react/prop-types
  target,
}) => {
  const { postSettings } = React.useContext(PostSettingContext);
  const [detail, setDetail] = React.useState<DetailSettings>();
  const entity = getEditorState().getCurrentContent().getEntity(entityKey);
  const entityData: DetailSettings | undefined = entity
    ? entity.get("data")
    : undefined;

  React.useEffect(() => {
    if (postSettings?.settings) {
      for (const settings of postSettings?.settings) {
        for (const d of settings.detailSettings) {
          if (d.id === entityData?.id) {
            setDetail(d);
          }
        }
      }
    }
  }, [postSettings]);
  return (
    <HtmlTooltip
      title={
        <div>
          <Typography variant="h6">{detail?.name}</Typography>
          <Typography>{detail?.description}</Typography>
        </div>
      }>
      <span style={{ cursor: "pointer", color: "yellow" }}>{children}</span>
    </HtmlTooltip>
  );
};

SettingsText.propTypes = propTypes;
export default SettingsText;
