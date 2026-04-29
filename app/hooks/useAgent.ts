import { useState } from 'react';
import { getAgentById, getAgentRoute } from '@/app/config/agents';

export function useAgent(defaultAgentId = 'dev') {
  const [selectedAgentId, setSelectedAgentId] = useState(defaultAgentId);

  const selectedAgent = getAgentById(selectedAgentId);
  const agentRoute = getAgentRoute(selectedAgentId);

  return {
    selectedAgentId,
    setSelectedAgentId,
    selectedAgent,
    agentRoute,
  };
}
