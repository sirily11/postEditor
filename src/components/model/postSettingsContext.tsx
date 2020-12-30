/** @format */

import React, { Component } from "react";
import {
  PostContentSettings,
  DetailSettings,
  ContentSettings,
  Post,
} from "./interfaces";
import axios from "axios";
import { getURL } from "./utils/settings";
import { v4 as uuidv4, v4 } from "uuid";
const { ipcRenderer } = (window as any).require("electron");

interface PostSettingState {
  selectedSettings?: ContentSettings;
  selectedDetailSettings?: DetailSettings;
  postSettings?: PostContentSettings;
  postId?: number | string;
  isLoading: boolean;
  showAddSettingsDialog: boolean;
  showAddDetailSettingsDialog: boolean;
  openSettingsDialog(selectedSettings?: ContentSettings): void;
  closeSettingsDialog(): void;
  openDetailSettingsDialog(
    selectedSettings?: ContentSettings,
    selectedDetailSettings?: DetailSettings
  ): void;
  closeDetailSettingsDialog(): void;
  addSettings(settings: ContentSettings): Promise<void>;
  addDetailSettingsTo(
    settingsIndex: number,
    detailSettings: DetailSettings
  ): Promise<void>;
  updateSettings(
    settingsIndex: number,
    newSettings: ContentSettings
  ): Promise<void>;
  updateDetailSettings(
    settingsIndex: number,
    detailSettingsIndex: number,
    detailSettings: DetailSettings
  ): Promise<void>;
  deleteSettings(settingsIndex: number): Promise<void>;
  deleteDetailSettings(
    settingsIndex: number,
    detailSettingsIndex: number
  ): Promise<void>;
}

interface PostSettingProps {}

const settings: PostContentSettings = {
  settings: [
    {
      id: v4(),
      name: "Hello",
      description: "Hello",
      detailSettings: [
        {
          id: v4(),
          name: "Abc",
          description: "abcde",
        },
      ],
    },
  ],
};
export class PostSettingProvider extends Component<
  PostSettingProps,
  PostSettingState
> {
  constructor(props: PostSettingProps) {
    super(props);
    this.state = {
      postSettings: settings,
      isLoading: false,
      showAddDetailSettingsDialog: false,
      showAddSettingsDialog: false,
      openDetailSettingsDialog: this.openDetailSettingsDialog,
      openSettingsDialog: this.openSettingsDialog,
      closeDetailSettingsDialog: this.closeDetailSettingsDialog,
      closeSettingsDialog: this.closeSettingsDialog,
      addSettings: this.addSettings,
      updateSettings: this.updateSettings,
      deleteSettings: this.deleteSettings,
      addDetailSettingsTo: this.addDetailSettingsTo,
      updateDetailSettings: this.updateDetailSettings,
      deleteDetailSettings: this.deleteDetailSettings,
    };
  }

  componentDidMount() {
    ipcRenderer.on(
      "update-post-settings",
      (e: any, arg: PostContentSettings) => {
        console.log(arg);
      }
    );

    ipcRenderer.on("load-post", (e: any, arg: Post) => {
      if (arg.id) {
        this.setState({ postId: arg.id, postSettings: arg.settings });
      }
    });
  }

  openSettingsDialog = (selectedSettings?: ContentSettings): void => {
    this.setState({
      selectedSettings: selectedSettings,
      showAddSettingsDialog: true,
    });
  };
  closeSettingsDialog = (): void => {
    this.setState({
      selectedSettings: undefined,
      showAddSettingsDialog: false,
    });
  };
  openDetailSettingsDialog = (
    selectedSettings?: ContentSettings,
    selectedDetailSettings?: DetailSettings
  ): void => {
    this.setState({
      selectedDetailSettings: selectedDetailSettings,
      selectedSettings: selectedSettings,
      showAddDetailSettingsDialog: true,
    });
  };
  closeDetailSettingsDialog = (): void => {
    this.setState({
      selectedDetailSettings: undefined,
      selectedSettings: undefined,
      showAddDetailSettingsDialog: false,
    });
  };

  /**
   * Will upload the settings to the server. Will send latest settings to main window.
   * @param settings Post Content settings
   */
  updateToServer = async (settings: PostContentSettings) => {
    this.setState({ isLoading: true });
    const { postId } = this.state;
    try {
      if (postId) {
        let token = localStorage.getItem("access");
        let url = getURL(`blog/post/${postId}/`);
        let response = await axios.patch(
          url,
          { settings: JSON.stringify(settings) },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.setState({
          postSettings: JSON.parse(response.data.settings),
        });
        ipcRenderer.send(
          "update-post-settings",
          JSON.parse(response.data.settings)
        );
      }
    } catch (err) {
      alert(err);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  /**
   * Add settings
   */
  addSettings = async (settings: ContentSettings): Promise<void> => {
    const { postSettings } = this.state;
    if (postSettings) {
      if (postSettings.settings) {
        postSettings.settings.push(settings);
      } else {
        postSettings.settings = [settings];
      }

      await this.updateToServer(postSettings);
    }
  };

  /**
   * Add detail settings
   * @param settingsIndex The index of the settings you want to update
   * @param detailSettings The detail settings's index you want to update
   */
  addDetailSettingsTo = async (
    settingsIndex: number,
    detailSettings: DetailSettings
  ): Promise<void> => {
    const { postSettings } = this.state;
    if (postSettings && postSettings.settings) {
      postSettings.settings[settingsIndex].detailSettings.push(detailSettings);
      await this.updateToServer(postSettings);
    }
  };

  /**
   * Update settings by index
   * @param settingsIndex
   * @param newSettings
   */
  updateSettings = async (
    settingsIndex: number,
    newSettings: ContentSettings
  ): Promise<void> => {
    const { postSettings } = this.state;
    if (postSettings && postSettings.settings) {
      postSettings.settings[settingsIndex] = newSettings;
      await this.updateToServer(postSettings);
    }
  };

  /**
   * Update Detail settings
   * @param settingsIndex Settings' index
   * @param detailSettingsIndex Detail settings' index
   * @param detailSettings New Detail settings
   */
  updateDetailSettings = async (
    settingsIndex: number,
    detailSettingsIndex: number,
    detailSettings: DetailSettings
  ): Promise<void> => {
    const { postSettings } = this.state;
    if (postSettings && postSettings.settings) {
      postSettings.settings[settingsIndex].detailSettings[
        detailSettingsIndex
      ] = detailSettings;
      await this.updateToServer(postSettings);
    }
  };
  /**
   * Delete settings by index
   * @param settingsIndex Settings index
   */
  deleteSettings = async (settingsIndex: number): Promise<void> => {
    const { postSettings } = this.state;
    if (postSettings && postSettings.settings) {
      postSettings.settings.splice(settingsIndex, 1);
      await this.updateToServer(postSettings);
    }
  };

  /**
   * Delete detail settings' index
   * @param settingsIndex Settings index
   * @param detailSettingsIndex Detail settings's index
   */
  deleteDetailSettings = async (
    settingsIndex: number,
    detailSettingsIndex: number
  ): Promise<void> => {
    const { postSettings } = this.state;
    if (postSettings && postSettings.settings) {
      postSettings.settings[settingsIndex].detailSettings.splice(
        detailSettingsIndex,
        1
      );
      await this.updateToServer(postSettings);
    }
  };

  render() {
    return (
      <PostSettingContext.Provider value={this.state}>
        {this.props.children}
      </PostSettingContext.Provider>
    );
  }
}

//@ts-ignore
const context: PostSettingState = {};

export const PostSettingContext = React.createContext(context);
