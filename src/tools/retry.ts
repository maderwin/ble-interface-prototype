import { delay } from 'tools/delay';

export const retry = async <T>(
    action: () => Promise<T>,
    wait: number,
    options: { maxTries?: number; multiplier?: number } = {},
): Promise<T> => {
    const { maxTries = Number.MAX_SAFE_INTEGER, multiplier = 2 } = options;

    try {
        return action();
    } catch (error) {
        console.warn(`Retrying in ${wait}ms... ${maxTries} tries left.`, error);

        if (maxTries === 0) {
            throw error;
        }

        await delay(wait);

        return retry(action, wait * multiplier, {
            maxTries: maxTries - 1,
            multiplier,
        });
    }
};
