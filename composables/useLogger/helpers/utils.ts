import { LogMessage } from '../types';

export const getMessage = (message: LogMessage): string | undefined => {
  if (Array.isArray(message)) return message.join(' | ');
  if (message instanceof Error) return message.message;
  if (typeof message === 'object') return JSON.stringify(message, null, 1);

  const returnMessage = (message as string) || '';

  return `${returnMessage}`;
};

export const detectNode: boolean =
  Object.prototype.toString.call(
    typeof process !== 'undefined' ? process : 0
  ) === '[object process]' || process.env.APPLICATION_ENV === 'production';

export const mountLog = (name: string, style: string) => {
  if (detectNode) {
    return [`${name}: `];
  }

  return [`%c${name}%c:`, style, 'background: transparent;'];
};

export const LogLevelStyle = {
  Log: 'background:#5ece7b; padding: 2px; border-radius: 0 2px 2px 0;  color: #fff;',
  Info: 'background:#0468DB; padding: 2px; border-radius: 0 2px 2px 0;  color: #fff;',
  Warn: 'background:#ecc713; padding: 2px; border-radius: 0 2px 2px 0;  color: #000;',
  Error:
    'background:#d12727; padding: 2px; border-radius: 0 2px 2px 0;  color: #fff'
};
