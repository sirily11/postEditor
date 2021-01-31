import React from "react";
import Drawer from "@material-ui/core/Drawer";
import {Divider, List, ListItem, ListItemIcon, Tooltip,} from "@material-ui/core";
import {EditorContext} from "../../model/editorContext";
import UploadAudioDialog from "./dialogs/UploadAudioDialog";

export default function SideController() {
    const {actions, selected} = React.useContext(EditorContext)
    return (
        <div>
            <Drawer variant="permanent" open={true} style={{zIndex: 0}}>
                <List id="sidebar" style={{overflow: "hidden", zIndex: 0}}>
                    {actions.map((action) => {
                        if (action.text.includes("Divider")) {
                            return <Divider key={action.text}/>;
                        } else {
                            return (
                                <Tooltip
                                    title={action.text}
                                    placement="right"
                                    key={action.text}>
                                    <ListItem
                                        button={true}
                                        onClick={action.action}
                                        selected={selected.includes(action.text)}>
                                        <ListItemIcon className="item-icon">
                                            {action.icon}
                                        </ListItemIcon>
                                    </ListItem>
                                </Tooltip>
                            );
                        }
                    })
                    }

                </List>
            </Drawer>
            <UploadAudioDialog/>
        </div>
    );
}
