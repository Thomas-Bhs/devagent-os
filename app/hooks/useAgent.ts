import { useState } from 'react'
import { getAgentById, getAgentRoute, getAgentChipColor } from '@/app/config/agents'

export function useAgent(defaultAgentId = 'dev') {
  const [selectedAgentId, setSelectedAgentId] = useState(defaultAgentId)

  const selectedAgent = getAgentById(selectedAgentId)
  const agentRoute = getAgentRoute(selectedAgentId)
  const agentChipColor = getAgentChipColor(selectedAgentId)

  return {
    selectedAgentId,
    setSelectedAgentId,
    selectedAgent,
    agentRoute,
    agentChipColor,
  }
}