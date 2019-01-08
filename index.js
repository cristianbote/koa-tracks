/**
 * Dummy function to emulate the next function
 */
const emulateNext = () => Promise.resolve();

/**
 * Helper to run multiple middleware entries in parallel.
 * @param  {...any} entries List of middleware functions to be ran in parallel
 * @returns {Function}
 */
const tracks = (...entries) => async (ctx, next) => {
    const filteredEntries = entries.filter(track => typeof track === "function");

    // Wait for all promises
    await Promise.all(filteredEntries.map(track => track(ctx, emulateNext)));

    // Return next
    return next();
};

module.exports = tracks;