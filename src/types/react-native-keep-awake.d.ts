declare module 'react-native-keep-awake' {
  export function useKeepAwake(): void;
  export function activateKeepAwake(): void;
  export function deactivateKeepAwake(): void;
  
  interface KeepAwakeProps {
    children?: React.ReactNode;
  }
  
  export const KeepAwake: React.FC<KeepAwakeProps>;
}
