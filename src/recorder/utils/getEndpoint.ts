declare const PARTYKIT_HOST: string;

export const getEndpoint = () => {
  return PARTYKIT_HOST.startsWith("127.0.0.1")
    ? `http://localhost:1999`
    : `https://${PARTYKIT_HOST}`;
};
