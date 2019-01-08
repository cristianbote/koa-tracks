import test from "ava";
import tracks from "../index";

const sleep = ms => new Promise(r => setTimeout(r, ms));

test("tracks", async t => {
    const state = {};

    // Create the middleware entry
    const tracksMiddleware = tracks(
        ctx => ctx.foo = true,
        async ctx => {
            await sleep(20);
            ctx.baz = true;
        },
        null
    );

    // Execute the middleware
    await tracksMiddleware(state, () => {});

    t.deepEqual(state, {
        foo: true,
        baz: true
    });
});

test("tracks: timing", async t => {
    const maxTime = 200;

    // Generate 10 middleware with random timings
    const entries = Array.from(Array(10)).map(() => async () => {
        await sleep(10 + Math.floor(Math.random() * maxTime));
    });

    const tracksMiddleware = tracks(
        ...entries
    );

    const stamp = Date.now();
    await tracksMiddleware({}, () => {});
    const end = Date.now() - stamp;

    // Let's assume env overhead, nonetheless shouldn't take much more than 20ms for execution
    const executionOverhead = 20;

    t.true(end < (maxTime + executionOverhead));
});

test("tracks: next() call", async t => {
    await t.notThrowsAsync(async () => {
        await tracks(
            async (ctx, next) => {
                next();
            }
        )({}, () => {});
    });
});

test("tracks: empty entries", t => {
    t.notThrows(() => {
        tracks();
    });
});