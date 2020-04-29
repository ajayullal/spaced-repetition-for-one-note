import React from 'react';
import './App.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import Screens from './screens';
import { routeConfig } from './services/config';
import './shared/global.scss';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path={routeConfig.notebooks.path} exact component={Screens.Notebooks} />
        <Route path={routeConfig.login.path} exact component={Screens.Login} />
        <Route path={routeConfig.sections.path} exact component={Screens.Sections} />
        <Route path={routeConfig.pages.path} exact component={Screens.Pages} />
        <Route path={routeConfig.timer.path} exact component={Screens.Timer} />
        <Route path={routeConfig.recentlyRevisedPages.path} exact component={Screens.RecentlyRevisedPages} />
        <Route path={routeConfig.recentlyCreatedPages.path} exact component={Screens.RecentlyEditedPages} />
        <Route path='/auth' exact component={Screens.Timer} />
        <Redirect to={routeConfig.notebooks.path} />
      </Switch>
    </HashRouter>
  );
}

export default App;
