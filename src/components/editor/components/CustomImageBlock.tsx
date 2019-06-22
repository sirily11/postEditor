import React from "react";
import { ContentState, ContentBlock } from "draft-js";

interface Props {
  block: ContentBlock;
  contentState: ContentState;
}

export default class CustomImageBlock extends React.Component<Props, any> {
  render() {
    const data = this.props.contentState
      .getEntity(this.props.block.getEntityAt(0))
      .getData();
    return (
      <div style={{ alignItems: "center" }}>
        <div
          style={{
            width: "100%",
            height: "300px",
            backgroundImage: `url(${data.src})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center"
          }}
        />
      </div>
    );
  }
}
