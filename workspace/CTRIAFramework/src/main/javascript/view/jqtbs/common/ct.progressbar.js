cbx.lib.progressBar = Class(cbx.core.Component, {
    constructor: function(config) {

    },
    initializeProgressBar: function() {

    },
    stopProgressBar: function() {

    },
    updateProgress: function(fileCounter) {},
    calcPercent: function(x, y) {}
});
CLCR.registerCmp({
    "COMP_TYPE": "PROGRESS_BAR",
    "LAYOUT": "CIRCULAR"
}, cbx.lib.progressBar);