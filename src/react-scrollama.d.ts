/**
 * Type definitions for react-scrollama
 * Reference: https://github.com/jsonkao/react-scrollama
 */

declare module 'react-scrollama' {
  import { ReactNode } from 'react';

  export interface StepData {
    data: any;
    index: number;
    direction: 'up' | 'down';
  }

  export interface ScrollamaProps {
    onStepEnter?: (response: StepData) => void;
    onStepExit?: (response: StepData) => void;
    onStepProgress?: (response: StepData & { progress: number }) => void;
    offset?: number;
    debug?: boolean;
    children?: ReactNode;
  }

  export interface StepProps {
    data: any;
    children?: ReactNode;
  }

  export const Scrollama: React.FC<ScrollamaProps>;
  export const Step: React.FC<StepProps>;
}
