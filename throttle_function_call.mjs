function throttleFunctionCall(fn, num_concurrent) {
    let queue = [];
    let running = 0;
    
    return async (...args) => {
        if (running < num_concurrent) {
            running++;
            let value = await fn(...args);
            running--;
            if(queue.length > 0) {
                let next = queue.pop();
                next();
            }
            return value;
        } else {
            await new Promise((resolve, reject) => {
                queue.push(resolve);
            });
            running++;
            let value = await fn(...args);
            running--;
            if(queue.length > 0) {
                let next = queue.pop();
                next();
            }
            return value;
        }
    };
}


export { throttleFunctionCall };