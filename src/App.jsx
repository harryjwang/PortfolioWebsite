import Portfolio from './pages/Portfolio.jsx';
import Room from './pages/Room.jsx';

export default function App() {
  const path = window.location.pathname;
  if (path === '/room' || path === '/room/') return <Room />;
  return <Portfolio />;
}
