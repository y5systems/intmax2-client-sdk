declare module '*.wasm?url' {
  const url: string;
  export default url;
}

declare module '*.wasm' {
  const wasm: ArrayBuffer;
  const content: string;
  export default wasm;
}

interface Window {
  ethereum?: any;
}
