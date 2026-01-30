import { useSearchParams } from 'react-router-dom';
import { ScenarioPlayer } from '@/components/scenario/ScenarioPlayer';

const StructuredScenario = () => {
  const [searchParams] = useSearchParams();
  const environmentSlug = searchParams.get('env') || 'local-coffee-shop';

  return <ScenarioPlayer environmentSlug={environmentSlug} />;
};

export default StructuredScenario;
