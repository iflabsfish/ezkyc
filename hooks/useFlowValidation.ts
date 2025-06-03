import { useState, useEffect, useMemo } from 'react';
import { KycObject } from '@/types';

interface UseFlowValidationResult {
  flowData: KycObject | null;
  isValidatingFlow: boolean;
  flowExists: boolean | null;
  isFlowActive: boolean | null;
  flowValidationStatus: 'idle' | 'loading' | 'valid' | 'invalid' | 'inactive' | 'error';
}

export function useFlowValidation(flowId: string | null): UseFlowValidationResult {
  const [flowData, setFlowData] = useState<KycObject | null>(null);
  const [isValidatingFlow, setIsValidatingFlow] = useState(false);
  const [flowExists, setFlowExists] = useState<boolean | null>(null);

  const isFlowActive = useMemo(() => {
    if (!flowData) return null;
    
    const now = Date.now();
    const startDate = flowData.startDate;
    const endDate = flowData.endDate;
    
    return now >= startDate && (!endDate || now <= endDate);
  }, [flowData]);

  const flowValidationStatus = useMemo(() => {
    if (!flowId) return 'idle';
    if (isValidatingFlow) return 'loading';
    if (flowExists === null) return 'loading';
    if (flowExists === false) return 'invalid';
    if (flowExists === true && isFlowActive === false) return 'inactive';
    if (flowExists === true && isFlowActive === true) return 'valid';
    return 'error';
  }, [flowId, isValidatingFlow, flowExists, isFlowActive]);

  useEffect(() => {
    const validateFlow = async () => {
      if (!flowId) {
        setFlowExists(null);
        setFlowData(null);
        return;
      }

      try {
        setIsValidatingFlow(true);
        const response = await fetch(`/api/kyc/get-flow?id=${encodeURIComponent(flowId)}`);
        const data = await response.json();
        
        if (response.ok && data.flow && !data.flow.isDeleted) {
          setFlowExists(true);
          setFlowData(data.flow);
        } else {
          setFlowExists(false);
          setFlowData(null);
        }
      } catch (error) {
        console.error('Error validating flow:', error);
        setFlowExists(false);
        setFlowData(null);
      } finally {
        setIsValidatingFlow(false);
      }
    };

    validateFlow();
  }, [flowId]);

  return {
    flowData,
    isValidatingFlow,
    flowExists,
    isFlowActive,
    flowValidationStatus,
  };
} 