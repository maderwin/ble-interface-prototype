export const createLogger = (namespace?: string) => {
    const getPrefix = () => [`[${new Date().toISOString()}]`, namespace].filter(Boolean).join(': ');

    const log = (...args: unknown[]) => console.log(getPrefix(), ...args);
    const warn = (...args: unknown[]) => console.warn(getPrefix(), ...args);
    const error = (...args: unknown[]) => console.error(getPrefix(), ...args);

    return { log, warn, error };
};
