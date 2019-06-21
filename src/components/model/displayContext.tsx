import React, { Component } from "react";

interface Tab {
  name: string;
}

interface DisplayState {
  value: number;
  tabs: Tab[];
  onChange: any;
}

interface DisplayProps {}

export class DisplayProvider extends Component<DisplayProps, DisplayState> {
  constructor(props: DisplayProps) {
    super(props);
    this.state = {
      value: 0,
      onChange: this.onChange,
      tabs: [
        {
          name: "Online Post"
        },
        {
          name: "Local Post"
        }
      ]
    };
  }

  onChange = (e: React.ChangeEvent<{}>, newValue: number) => {
    this.setState({ value: newValue });
  };

  render() {
    return (
      <DisplayContext.Provider value={this.state}>
        {this.props.children}
      </DisplayContext.Provider>
    );
  }
}

const context: DisplayState = {
  value: 0,
  onChange: (e: React.ChangeEvent<{}>, newValue: number) => {},
  tabs: []
};

export const DisplayContext = React.createContext(context);
