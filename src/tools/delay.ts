export const delay = async (wait: number) =>
    new Promise((resolve) => {
        setTimeout(resolve, wait);
    });
