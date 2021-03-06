import * as React from "react";
import { Redirect } from "react-router";

export default (redirectPath: string) => {
  return (componentType: React.ComponentType) => {
    const originalRender = componentType.prototype.render;
    componentType.prototype.render = function() {
      console.log(this.props);
      if (this.props.auth === undefined) {
        throw new Error("'auth' prop of decorated component must not be " +
        "undefined. Explicitly use null instead for a missing authentication.");
      }
      if (!this.props.auth) {
        return (<Redirect to={redirectPath}/>);
      } else {
        return originalRender.call(this);
      }
    };
  };
};
