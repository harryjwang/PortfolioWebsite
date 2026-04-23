import Portfolio from './pages/Portfolio.jsx';
import Room from './pages/Room.jsx';

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('redirect');
  if (redirect) {
    window.history.replaceState(null, '', redirect);
  }

  const path = window.location.pathname;
  if (path === '/room' || path === '/room/') return <Room />;
  return <Portfolio />;
}