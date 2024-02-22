function throttleFunctionCall(fn, num_concurrent) {
    let queue = [];
    let running = 0;

    function try_run_queue() {
        if (queue.length > 0) {
            (queue.pop())();
        }
    }
    
    return async (...args) => {
        if (running >= num_concurrent) {
            await new Promise((resolve) => {
                queue.push(resolve);
            });
        }
        running++;
        return async () => {
            let value;
            try {
                value = await fn(...args);
            } catch (e) {
                running--;
                try_run_queue();
                throw e;
            }
            running--;
            try_run_queue();
            return value;
        };
    };
}


export { throttleFunctionCall };