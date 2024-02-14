import React from "react";
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';
/* Core CSS required for Ionic components to work properly */

import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';

import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';


import '@ionic/react/css/display.css';
/* Theme variables */

import './theme/variables.css';
/* Components and others */
import LoginScreen from "./components/auth/LoginScreen";
import Gallery from "./components/home/Gallery";
import RegisterScreen from "./components/auth/RegisterScreen";
import {HomeStateProvider} from "./components/home/contexts/HomeStateProvider";
import {Config} from "./utils";
import {PrivateRoute} from "./utils/api/PrivateRoute";
import {AuthenticationContext, AuthenticationProvider} from "./components/auth/context/AuthProvider";
import {NotesProvider} from "./components/home/contexts/NotesProvider";

setupIonicReact();
const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <AuthenticationProvider>
          <Route exact={true} component={LoginScreen} path={"/login"}/>
          <Route exact={true} component={RegisterScreen} path={"/register"}/>
          <NotesProvider>
            <HomeStateProvider>
              <PrivateRoute path="/home" component={Gallery} exact={true}/>
            </HomeStateProvider>
          </NotesProvider>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>

        </AuthenticationProvider>

      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
)

export default App;
