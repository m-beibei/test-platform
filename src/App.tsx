import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { DataContextProvider } from './context/DataContext';
import NavButton from './components/NavButton';
import Analysis from './pages/Analysis';
import Monitor from './pages/Monitor';

import './App.css';

export const routes = {
  test1: 'test1',
  test2: 'test2',
};

export const Root = () => (
  <>
    <Routes>
      <Route path={routes.test1} element={<Monitor />} />
      <Route path={routes.test2} element={<Analysis />} />
      <Route path="/" element={<Navigate to={routes.test1} />} />
    </Routes>
  </>
);

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <DataContextProvider>
          <NavButton />
          <Root />
        </DataContextProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
