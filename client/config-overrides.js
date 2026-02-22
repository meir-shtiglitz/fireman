module.exports = function override(config, env) {
    config.module.rules.forEach(rule => {
        (rule.oneOf || []).forEach(oneOf => {
            if (oneOf.test && oneOf.test.toString().includes('js')) {
                oneOf.resolve = oneOf.resolve || {};
                oneOf.resolve.fullySpecified = false;
            }
        });
    });

    // Also for the top level js rules
    config.module.rules.forEach(rule => {
        if (rule.test && rule.test.toString().includes('js')) {
            rule.resolve = rule.resolve || {};
            rule.resolve.fullySpecified = false;
        }
    });

    return config;
};
