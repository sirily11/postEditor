import React, { Component } from "react";

interface Tab {
  name: string;
}

interface DisplayState {
  value: number;
  onChange: any;
}

interface DisplayProps {}

export class DisplayProvider extends Component<DisplayProps, DisplayState> {
  constructor(props: DisplayProps) {
    super(props);
    this.state = {
      value: -1,
      onChange: this.onChange
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
  onChange: (e: React.ChangeEvent<{}>, newValue: number) => {}
};

export const DisplayContext = React.createContext(context);
