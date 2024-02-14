import React, {Component, useContext} from "react";
import {Redirect, Route} from "react-router-dom";
import {AuthenticationContext, AuthState} from "../../components/auth/context/AuthProvider";


export interface PrivateRouteProps{
    component: any,
    path: string,
    exact?: boolean
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({component: Component, ...rest}) => {
    const {isAuthenticated} = useContext<AuthState>(AuthenticationContext)

    return (
      <Route {...rest} render={props => {
          if( isAuthenticated  ){
              return <Component {...props} />
          }
          return <Redirect to={{ pathname: '/login'}}/>
      }}  />
    );
}