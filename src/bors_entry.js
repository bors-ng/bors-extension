(function() {
    var prButtonTemplate = document.createElement("div");
    prButtonTemplate.className = "diffbar-item";
    function update() {
        var pr = $(".pr-review-tools");
        if (pr) {
            var b = prButtonTemplate.cloneNode();
            b.innerHTML = `
                <button id=bors-button class="btn btn-sm">bors r+</button>
            `;
            b.firstElementChild.onclick = run;
            pr.appendChild(b);
        }
    }
    function getCommand() {
        const p = window.location.pathname;
        if (p.startsWith('/servo/')) {
            return "@bors-servo r+";
        }
        if (p.startsWith('/rust-lang/')) {
            return "@bors r+";
        }
        if (p.startsWith('/bundler/') || p.startsWith('/rubygems/')) {
            return "@bundlerbot r+";
        }
        return "bors r+";
    }
    function run() {
        fireEvent($(".js-reviews-toggle"), "click");
        $("#pull_request_review_body").value = getCommand();
        fireEvent($(`[name="pull_request_review[event]"][value="approve"]`), "click");
        setTimeout(function() {
            $("#submit-review form").submit();
        }, 100);
    }
    function $(str, el) {
        return (el || document).querySelector(str);
    }
    function $$(str, el) {
        return Array.from((el || document).querySelectorAll(str));
    }
    function fireEvent(node, eventName) {
        // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
        var doc;
        if (node.ownerDocument) {
            doc = node.ownerDocument;
        } else if (node.nodeType == 9){
            // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
            doc = node;
        } else {
            throw new Error("Invalid node passed to fireEvent: " + node.id);
        }

        if (node.dispatchEvent) {
            // Gecko-style approach (now the standard) takes more work
            var eventClass = "";

            // Different events have different event classes.
            // If this switch statement can't map an eventName to an eventClass,
            // the event firing is going to fail.
            switch (eventName) {
                case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
                case "mousedown":
                case "mouseup":
                    eventClass = "MouseEvents";
                    break;

                case "focus":
                case "change":
                case "blur":
                case "select":
                    eventClass = "HTMLEvents";
                    break;

                default:
                    throw "fireEvent: Couldn't find an event class for event '" + eventName + "'.";
                    break;
            }
            var event = doc.createEvent(eventClass);
            event.initEvent(eventName, true, true); // All events created as bubbling and cancelable.

            event.synthetic = true; // allow detection of synthetic events
            // The second parameter says go ahead with the default action
            node.dispatchEvent(event, true);
        } else  if (node.fireEvent) {
            // IE-old school style, you can drop this if you don't need to support IE8 and lower
            var event = doc.createEventObject();
            event.synthetic = true; // allow detection of synthetic events
            node.fireEvent("on" + eventName, event);
        }
    }
    document.addEventListener("pjax:end", update);
    document.addEventListener("load", update);
    update();
})();
