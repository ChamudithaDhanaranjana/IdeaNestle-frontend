"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flowbite_1 = require("flowbite");
// set the target element that will be collapsed or expanded (eg. navbar menu)
var $targetEl = document.getElementById('targetEl');
// optionally set a trigger element (eg. a button, hamburger icon)
var $triggerEl = document.getElementById('triggerEl');
// optional options with default values and callback functions
var options = {
    onCollapse: function () {
        console.log('element has been collapsed');
    },
    onExpand: function () {
        console.log('element has been expanded');
    },
    onToggle: function () {
        console.log('element has been toggled');
    }
};
/*
* $targetEl: required
* $triggerEl: optional
* options: optional
*/
var collapse = new flowbite_1.Collapse($targetEl, $triggerEl, options);
// show the target element
collapse.expand();
//# sourceMappingURL=flowbite.js.map