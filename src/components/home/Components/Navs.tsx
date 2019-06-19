import React from "react";
import { Breadcrumbs, Link } from "@material-ui/core";

export default function Navs() {
  return (
    <div className="pl-4">
      <Breadcrumbs>
        <Link href="/home">Home</Link>
      </Breadcrumbs>
    </div>
  );
}
