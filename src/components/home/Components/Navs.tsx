import React from "react";
import { Breadcrumbs, Link } from "@material-ui/core";
import { Trans } from "@lingui/macro";

export default function Navs() {
  return (
    <div className="pl-4">
      <Breadcrumbs>
        <Link>
          <Trans>Home</Trans>
        </Link>
      </Breadcrumbs>
    </div>
  );
}
