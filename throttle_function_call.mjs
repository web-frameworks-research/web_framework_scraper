function throttleFunctionCall(fn, num_concurrent) {
    let queue = [];
    let running = 0;

    function try_run_queue() {
        if (queue.length > 0) {
            (queue.pop())();
        }
    }
    
    return async (...args) => {
        if (running < num_concurrent) {
            running++;
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
        } else {
            await new Promise((resolve, reject) => {
                queue.push(resolve);
            });
            running++;
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
        }
    };
}


export { throttleFunctionCall };