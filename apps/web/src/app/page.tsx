import { HomeRoot } from './components/root';
import { FirstVisitSplashGate } from '../components/system/FirstVisitSplashGate';

export default function HomePage() {
  return (
    <div>
      <FirstVisitSplashGate />
      <HomeRoot />
    </div>
  );
}
