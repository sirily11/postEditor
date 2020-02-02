import React, { useContext } from "react";
import { Breadcrumbs, Link } from "@material-ui/core";
import { Trans } from "@lingui/macro";
import { Menu } from "semantic-ui-react";
import { DisplayContext } from "../../model/displayContext";

export default function Navs() {
  const displayContext = useContext(DisplayContext);
  return (
    <div className="pl-4">
      <Menu secondary>
        <Menu.Item
          name="home"
          active={displayContext.currentPage === 0}
          onClick={() => displayContext.setCurrentPage(0)}
        />
        <Menu.Item
          name="video"
          active={displayContext.currentPage === 1}
          onClick={() => displayContext.setCurrentPage(1)}
        />
      </Menu>
    </div>
  );
}
