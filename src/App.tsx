/**
 * Root application component
 *
 * Sets up routing and an initial data load.
 * The Explore page manages its own 60-second auto-refresh;
 * the Story page triggers refreshes via scrollama step callbacks.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Story } from './pages/Story';
import { Explore } from './pages/Explore';
import { About } from './pages/About';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Story />} />
          <Route path="explore" element={<Explore />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
