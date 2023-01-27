var tns = (function () {
    var win = window; var raf = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.msRequestAnimationFrame || function (cb) { return setTimeout(cb, 16); }; var win$1 = window; var caf = win$1.cancelAnimationFrame || win$1.mozCancelAnimationFrame || function (id) { clearTimeout(id); }; function extend() {
        var obj, name, copy, target = arguments[0] || {}, i = 1, length = arguments.length; for (; i < length; i++) { if ((obj = arguments[i]) !== null) { for (name in obj) { copy = obj[name]; if (target === copy) { continue; } else if (copy !== undefined) { target[name] = copy; } } } }
        return target;
    }
    function checkStorageValue(value) { return ['true', 'false'].indexOf(value) >= 0 ? JSON.parse(value) : value; }
    function setLocalStorage(storage, key, value, access) {
        if (access) { try { storage.setItem(key, value); } catch (e) { } }
        return value;
    }
    function getSlideId() { var id = window.tnsId; window.tnsId = !id ? 1 : id + 1; return 'tns' + window.tnsId; }
    function getBody() {
        var doc = document, body = doc.body; if (!body) { body = doc.createElement('body'); body.fake = true; }
        return body;
    }
    var docElement = document.documentElement; function setFakeBody(body) {
        var docOverflow = ''; if (body.fake) { docOverflow = docElement.style.overflow; body.style.background = ''; body.style.overflow = docElement.style.overflow = 'hidden'; docElement.appendChild(body); }
        return docOverflow;
    }
    function resetFakeBody(body, docOverflow) { if (body.fake) { body.remove(); docElement.style.overflow = docOverflow; docElement.offsetHeight; } }
    function calc() {
        var doc = document, body = getBody(), docOverflow = setFakeBody(body), div = doc.createElement('div'), result = false; body.appendChild(div); try { var str = '(10px * 10)', vals = ['calc' + str, '-moz-calc' + str, '-webkit-calc' + str], val; for (var i = 0; i < 3; i++) { val = vals[i]; div.style.width = val; if (div.offsetWidth === 100) { result = val.replace(str, ''); break; } } } catch (e) { }
        body.fake ? resetFakeBody(body, docOverflow) : div.remove(); return result;
    }
    function percentageLayout() {
        var doc = document, body = getBody(), docOverflow = setFakeBody(body), wrapper = doc.createElement('div'), outer = doc.createElement('div'), str = '', count = 70, perPage = 3, supported = false; wrapper.className = "tns-t-subp2"; outer.className = "tns-t-ct"; for (var i = 0; i < count; i++) { str += '<div></div>'; }
        outer.innerHTML = str; wrapper.appendChild(outer); body.appendChild(wrapper); supported = Math.abs(wrapper.getBoundingClientRect().left - outer.children[count - perPage].getBoundingClientRect().left) < 2; body.fake ? resetFakeBody(body, docOverflow) : wrapper.remove(); return supported;
    }
    function mediaquerySupport() {
        if (window.matchMedia || window.msMatchMedia) { return true; }
        var doc = document, body = getBody(), docOverflow = setFakeBody(body), div = doc.createElement('div'), style = doc.createElement('style'), rule = '@media all and (min-width:1px){.tns-mq-test{position:absolute}}', position; style.type = 'text/css'; div.className = 'tns-mq-test'; body.appendChild(style); body.appendChild(div); if (style.styleSheet) { style.styleSheet.cssText = rule; } else { style.appendChild(doc.createTextNode(rule)); }
        position = window.getComputedStyle ? window.getComputedStyle(div).position : div.currentStyle['position']; body.fake ? resetFakeBody(body, docOverflow) : div.remove(); return position === "absolute";
    }
    function createStyleSheet(media, nonce) {
        var style = document.createElement("style"); if (media) { style.setAttribute("media", media); }
        if (nonce) { style.setAttribute("nonce", nonce); }
        document.querySelector('head').appendChild(style); return style.sheet ? style.sheet : style.styleSheet;
    }
    function addCSSRule(sheet, selector, rules, index) { 'insertRule' in sheet ? sheet.insertRule(selector + '{' + rules + '}', index) : sheet.addRule(selector, rules, index); }
    function removeCSSRule(sheet, index) { 'deleteRule' in sheet ? sheet.deleteRule(index) : sheet.removeRule(index); }
    function getCssRulesLength(sheet) { var rule = ('insertRule' in sheet) ? sheet.cssRules : sheet.rules; return rule.length; }
    function toDegree(y, x) { return Math.atan2(y, x) * (180 / Math.PI); }
    function getTouchDirection(angle, range) {
        var direction = false, gap = Math.abs(90 - Math.abs(angle)); if (gap >= 90 - range) { direction = 'horizontal'; } else if (gap <= range) { direction = 'vertical'; }
        return direction;
    }
    function forEach(arr, callback, scope) { for (var i = 0, l = arr.length; i < l; i++) { callback.call(scope, arr[i], i); } }
    var classListSupport = 'classList' in document.createElement('_'); var hasClass = classListSupport ? function (el, str) { return el.classList.contains(str); } : function (el, str) { return el.className.indexOf(str) >= 0; }; var addClass = classListSupport ? function (el, str) { if (!hasClass(el, str)) { el.classList.add(str); } } : function (el, str) { if (!hasClass(el, str)) { el.className += ' ' + str; } }; var removeClass = classListSupport ? function (el, str) { if (hasClass(el, str)) { el.classList.remove(str); } } : function (el, str) { if (hasClass(el, str)) { el.className = el.className.replace(str, ''); } }; function hasAttr(el, attr) { return el.hasAttribute(attr); }
    function getAttr(el, attr) { return el.getAttribute(attr); }
    function isNodeList(el) { return typeof el.item !== "undefined"; }
    function setAttrs(els, attrs) {
        els = (isNodeList(els) || els instanceof Array) ? els : [els]; if (Object.prototype.toString.call(attrs) !== '[object Object]') { return; }
        for (var i = els.length; i--;) { for (var key in attrs) { els[i].setAttribute(key, attrs[key]); } }
    }
    function removeAttrs(els, attrs) { els = (isNodeList(els) || els instanceof Array) ? els : [els]; attrs = (attrs instanceof Array) ? attrs : [attrs]; var attrLength = attrs.length; for (var i = els.length; i--;) { for (var j = attrLength; j--;) { els[i].removeAttribute(attrs[j]); } } }
    function arrayFromNodeList(nl) {
        var arr = []; for (var i = 0, l = nl.length; i < l; i++) { arr.push(nl[i]); }
        return arr;
    }
    function hideElement(el, forceHide) { if (el.style.display !== 'none') { el.style.display = 'none'; } }
    function showElement(el, forceHide) { if (el.style.display === 'none') { el.style.display = ''; } }
    function isVisible(el) { return window.getComputedStyle(el).display !== 'none'; }
    function whichProperty(props) {
        if (typeof props === 'string') { var arr = [props], Props = props.charAt(0).toUpperCase() + props.substr(1), prefixes = ['Webkit', 'Moz', 'ms', 'O']; prefixes.forEach(function (prefix) { if (prefix !== 'ms' || props === 'transform') { arr.push(prefix + Props); } }); props = arr; }
        var el = document.createElement('fakeelement'), len = props.length; for (var i = 0; i < props.length; i++) { var prop = props[i]; if (el.style[prop] !== undefined) { return prop; } }
        return false;
    }
    function has3DTransforms(tf) {
        if (!tf) { return false; }
        if (!window.getComputedStyle) { return false; }
        var doc = document, body = getBody(), docOverflow = setFakeBody(body), el = doc.createElement('p'), has3d, cssTF = tf.length > 9 ? '-' + tf.slice(0, -9).toLowerCase() + '-' : ''; cssTF += 'transform'; body.insertBefore(el, null); el.style[tf] = 'translate3d(1px,1px,1px)'; has3d = window.getComputedStyle(el).getPropertyValue(cssTF); body.fake ? resetFakeBody(body, docOverflow) : el.remove(); return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
    }
    function getEndProperty(propIn, propOut) {
        var endProp = false; if (/^Webkit/.test(propIn)) { endProp = 'webkit' + propOut + 'End'; } else if (/^O/.test(propIn)) { endProp = 'o' + propOut + 'End'; } else if (propIn) { endProp = propOut.toLowerCase() + 'end'; }
        return endProp;
    }
    var supportsPassive = false; try { var opts = Object.defineProperty({}, 'passive', { get: function () { supportsPassive = true; } }); window.addEventListener("test", null, opts); } catch (e) { }
    var passiveOption = supportsPassive ? { passive: true } : false; function addEvents(el, obj, preventScrolling) { for (var prop in obj) { var option = ['touchstart', 'touchmove'].indexOf(prop) >= 0 && !preventScrolling ? passiveOption : false; el.addEventListener(prop, obj[prop], option); } }
    function removeEvents(el, obj) { for (var prop in obj) { var option = ['touchstart', 'touchmove'].indexOf(prop) >= 0 ? passiveOption : false; el.removeEventListener(prop, obj[prop], option); } }
    function Events() { return { topics: {}, on: function (eventName, fn) { this.topics[eventName] = this.topics[eventName] || []; this.topics[eventName].push(fn); }, off: function (eventName, fn) { if (this.topics[eventName]) { for (var i = 0; i < this.topics[eventName].length; i++) { if (this.topics[eventName][i] === fn) { this.topics[eventName].splice(i, 1); break; } } } }, emit: function (eventName, data) { data.type = eventName; if (this.topics[eventName]) { this.topics[eventName].forEach(function (fn) { fn(data, eventName); }); } } }; }
    function jsTransform(element, attr, prefix, postfix, to, duration, callback) { var tick = Math.min(duration, 10), unit = (to.indexOf('%') >= 0) ? '%' : 'px', to = to.replace(unit, ''), from = Number(element.style[attr].replace(prefix, '').replace(postfix, '').replace(unit, '')), positionTick = (to - from) / duration * tick, running; setTimeout(moveElement, tick); function moveElement() { duration -= tick; from += positionTick; element.style[attr] = prefix + from + unit + postfix; if (duration > 0) { setTimeout(moveElement, tick); } else { callback(); } } }
    if (!Object.keys) {
        Object.keys = function (object) {
            var keys = []; for (var name in object) { if (Object.prototype.hasOwnProperty.call(object, name)) { keys.push(name); } }
            return keys;
        };
    }
    if (!("remove" in Element.prototype)) { Element.prototype.remove = function () { if (this.parentNode) { this.parentNode.removeChild(this); } }; }
    var tns = function (options) {
        options = extend({ container: '.slider', mode: 'carousel', axis: 'horizontal', items: 1, gutter: 0, edgePadding: 0, fixedWidth: false, autoWidth: false, viewportMax: false, slideBy: 1, center: false, controls: true, controlsPosition: 'top', controlsText: ['prev', 'next'], controlsContainer: false, prevButton: false, nextButton: false, nav: true, navPosition: 'top', navContainer: false, navAsThumbnails: false, arrowKeys: false, speed: 300, autoplay: false, autoplayPosition: 'top', autoplayTimeout: 5000, autoplayDirection: 'forward', autoplayText: ['start', 'stop'], autoplayHoverPause: false, autoplayButton: false, autoplayButtonOutput: true, autoplayResetOnVisibility: true, animateIn: 'tns-fadeIn', animateOut: 'tns-fadeOut', animateNormal: 'tns-normal', animateDelay: false, loop: true, rewind: false, autoHeight: false, responsive: false, lazyload: false, lazyloadSelector: '.tns-lazy-img', touch: true, mouseDrag: false, swipeAngle: 15, nested: false, preventActionWhenRunning: false, preventScrollOnTouch: false, freezable: true, onInit: false, useLocalStorage: true, nonce: false }, options || {}); var doc = document, win = window, KEYS = { ENTER: 13, SPACE: 32, LEFT: 37, RIGHT: 39 }, tnsStorage = {}, localStorageAccess = options.useLocalStorage; if (localStorageAccess) {
            var browserInfo = navigator.userAgent; var uid = new Date; try {
                tnsStorage = win.localStorage; if (tnsStorage) { tnsStorage.setItem(uid, uid); localStorageAccess = tnsStorage.getItem(uid) == uid; tnsStorage.removeItem(uid); } else { localStorageAccess = false; }
                if (!localStorageAccess) { tnsStorage = {}; }
            } catch (e) { localStorageAccess = false; }
            if (localStorageAccess) {
                if (tnsStorage['tnsApp'] && tnsStorage['tnsApp'] !== browserInfo) { ['tC', 'tPL', 'tMQ', 'tTf', 't3D', 'tTDu', 'tTDe', 'tADu', 'tADe', 'tTE', 'tAE'].forEach(function (item) { tnsStorage.removeItem(item); }); }
                localStorage['tnsApp'] = browserInfo;
            }
        }
        var CALC = tnsStorage['tC'] ? checkStorageValue(tnsStorage['tC']) : setLocalStorage(tnsStorage, 'tC', calc(), localStorageAccess), PERCENTAGELAYOUT = tnsStorage['tPL'] ? checkStorageValue(tnsStorage['tPL']) : setLocalStorage(tnsStorage, 'tPL', percentageLayout(), localStorageAccess), CSSMQ = tnsStorage['tMQ'] ? checkStorageValue(tnsStorage['tMQ']) : setLocalStorage(tnsStorage, 'tMQ', mediaquerySupport(), localStorageAccess), TRANSFORM = tnsStorage['tTf'] ? checkStorageValue(tnsStorage['tTf']) : setLocalStorage(tnsStorage, 'tTf', whichProperty('transform'), localStorageAccess), HAS3DTRANSFORMS = tnsStorage['t3D'] ? checkStorageValue(tnsStorage['t3D']) : setLocalStorage(tnsStorage, 't3D', has3DTransforms(TRANSFORM), localStorageAccess), TRANSITIONDURATION = tnsStorage['tTDu'] ? checkStorageValue(tnsStorage['tTDu']) : setLocalStorage(tnsStorage, 'tTDu', whichProperty('transitionDuration'), localStorageAccess), TRANSITIONDELAY = tnsStorage['tTDe'] ? checkStorageValue(tnsStorage['tTDe']) : setLocalStorage(tnsStorage, 'tTDe', whichProperty('transitionDelay'), localStorageAccess), ANIMATIONDURATION = tnsStorage['tADu'] ? checkStorageValue(tnsStorage['tADu']) : setLocalStorage(tnsStorage, 'tADu', whichProperty('animationDuration'), localStorageAccess), ANIMATIONDELAY = tnsStorage['tADe'] ? checkStorageValue(tnsStorage['tADe']) : setLocalStorage(tnsStorage, 'tADe', whichProperty('animationDelay'), localStorageAccess), TRANSITIONEND = tnsStorage['tTE'] ? checkStorageValue(tnsStorage['tTE']) : setLocalStorage(tnsStorage, 'tTE', getEndProperty(TRANSITIONDURATION, 'Transition'), localStorageAccess), ANIMATIONEND = tnsStorage['tAE'] ? checkStorageValue(tnsStorage['tAE']) : setLocalStorage(tnsStorage, 'tAE', getEndProperty(ANIMATIONDURATION, 'Animation'), localStorageAccess); var supportConsoleWarn = win.console && typeof win.console.warn === "function", tnsList = ['container', 'controlsContainer', 'prevButton', 'nextButton', 'navContainer', 'autoplayButton'], optionsElements = {}; tnsList.forEach(function (item) {
            if (typeof options[item] === 'string') {
                var str = options[item], el = doc.querySelector(str); optionsElements[item] = str; if (el && el.nodeName) { options[item] = el; } else {
                    if (supportConsoleWarn) { console.warn('Can\'t find', options[item]); }
                    return;
                }
            }
        }); if (options.container.children.length < 1) {
            if (supportConsoleWarn) { console.warn('No slides found in', options.container); }
            return;
        }
        var responsive = options.responsive, nested = options.nested, carousel = options.mode === 'carousel' ? true : false; if (responsive) {
            if (0 in responsive) { options = extend(options, responsive[0]); delete responsive[0]; }
            var responsiveTem = {}; for (var key in responsive) { var val = responsive[key]; val = typeof val === 'number' ? { items: val } : val; responsiveTem[key] = val; }
            responsive = responsiveTem; responsiveTem = null;
        }
        function updateOptions(obj) {
            for (var key in obj) {
                if (!carousel) {
                    if (key === 'slideBy') { obj[key] = 'page'; }
                    if (key === 'edgePadding') { obj[key] = false; }
                    if (key === 'autoHeight') { obj[key] = false; }
                }
                if (key === 'responsive') { updateOptions(obj[key]); }
            }
        }
        if (!carousel) { updateOptions(options); }
        if (!carousel) { options.axis = 'horizontal'; options.slideBy = 'page'; options.edgePadding = false; var animateIn = options.animateIn, animateOut = options.animateOut, animateDelay = options.animateDelay, animateNormal = options.animateNormal; }
        var horizontal = options.axis === 'horizontal' ? true : false, outerWrapper = doc.createElement('div'), innerWrapper = doc.createElement('div'), middleWrapper, container = options.container, containerParent = container.parentNode, containerHTML = container.outerHTML, slideItems = container.children, slideCount = slideItems.length, breakpointZone, windowWidth = getWindowWidth(), isOn = false; if (responsive) { setBreakpointZone(); }
        if (carousel) { container.className += ' tns-vpfix'; }
        var autoWidth = options.autoWidth, fixedWidth = getOption('fixedWidth'), edgePadding = getOption('edgePadding'), gutter = getOption('gutter'), viewport = getViewportWidth(), center = getOption('center'), items = !autoWidth ? Math.floor(getOption('items')) : 1, slideBy = getOption('slideBy'), viewportMax = options.viewportMax || options.fixedWidthViewportWidth, arrowKeys = getOption('arrowKeys'), speed = getOption('speed'), rewind = options.rewind, loop = rewind ? false : options.loop, autoHeight = getOption('autoHeight'), controls = getOption('controls'), controlsText = getOption('controlsText'), nav = getOption('nav'), touch = getOption('touch'), mouseDrag = getOption('mouseDrag'), autoplay = getOption('autoplay'), autoplayTimeout = getOption('autoplayTimeout'), autoplayText = getOption('autoplayText'), autoplayHoverPause = getOption('autoplayHoverPause'), autoplayResetOnVisibility = getOption('autoplayResetOnVisibility'), sheet = createStyleSheet(null, getOption('nonce')), lazyload = options.lazyload, lazyloadSelector = options.lazyloadSelector, slidePositions, slideItemsOut = [], cloneCount = loop ? getCloneCountForLoop() : 0, slideCountNew = !carousel ? slideCount + cloneCount : slideCount + cloneCount * 2, hasRightDeadZone = (fixedWidth || autoWidth) && !loop ? true : false, rightBoundary = fixedWidth ? getRightBoundary() : null, updateIndexBeforeTransform = (!carousel || !loop) ? true : false, transformAttr = horizontal ? 'left' : 'top', transformPrefix = '', transformPostfix = '', getIndexMax = (function () { if (fixedWidth) { return function () { return center && !loop ? slideCount - 1 : Math.ceil(-rightBoundary / (fixedWidth + gutter)); }; } else if (autoWidth) { return function () { for (var i = 0; i < slideCountNew; i++) { if (slidePositions[i] >= -rightBoundary) { return i; } } }; } else { return function () { if (center && carousel && !loop) { return slideCount - 1; } else { return loop || carousel ? Math.max(0, slideCountNew - Math.ceil(items)) : slideCountNew - 1; } }; } })(), index = getStartIndex(getOption('startIndex')), indexCached = index, displayIndex = getCurrentSlide(), indexMin = 0, indexMax = !autoWidth ? getIndexMax() : null, resizeTimer, preventActionWhenRunning = options.preventActionWhenRunning, swipeAngle = options.swipeAngle, moveDirectionExpected = swipeAngle ? '?' : true, running = false, onInit = options.onInit, events = new Events(), newContainerClasses = ' tns-slider tns-' + options.mode, slideId = container.id || getSlideId(), disable = getOption('disable'), disabled = false, freezable = options.freezable, freeze = freezable && !autoWidth ? getFreeze() : false, frozen = false, controlsEvents = { 'click': onControlsClick, 'keydown': onControlsKeydown }, navEvents = { 'click': onNavClick, 'keydown': onNavKeydown }, hoverEvents = { 'mouseover': mouseoverPause, 'mouseout': mouseoutRestart }, visibilityEvent = { 'visibilitychange': onVisibilityChange }, docmentKeydownEvent = { 'keydown': onDocumentKeydown }, touchEvents = { 'touchstart': onPanStart, 'touchmove': onPanMove, 'touchend': onPanEnd, 'touchcancel': onPanEnd }, dragEvents = { 'mousedown': onPanStart, 'mousemove': onPanMove, 'mouseup': onPanEnd, 'mouseleave': onPanEnd }, hasControls = hasOption('controls'), hasNav = hasOption('nav'), navAsThumbnails = autoWidth ? true : options.navAsThumbnails, hasAutoplay = hasOption('autoplay'), hasTouch = hasOption('touch'), hasMouseDrag = hasOption('mouseDrag'), slideActiveClass = 'tns-slide-active', slideClonedClass = 'tns-slide-cloned', imgCompleteClass = 'tns-complete', imgEvents = { 'load': onImgLoaded, 'error': onImgFailed }, imgsComplete, liveregionCurrent, preventScroll = options.preventScrollOnTouch === 'force' ? true : false; if (hasControls) { var controlsContainer = options.controlsContainer, controlsContainerHTML = options.controlsContainer ? options.controlsContainer.outerHTML : '', prevButton = options.prevButton, nextButton = options.nextButton, prevButtonHTML = options.prevButton ? options.prevButton.outerHTML : '', nextButtonHTML = options.nextButton ? options.nextButton.outerHTML : '', prevIsButton, nextIsButton; }
        if (hasNav) { var navContainer = options.navContainer, navContainerHTML = options.navContainer ? options.navContainer.outerHTML : '', navItems, pages = autoWidth ? slideCount : getPages(), pagesCached = 0, navClicked = -1, navCurrentIndex = getCurrentNavIndex(), navCurrentIndexCached = navCurrentIndex, navActiveClass = 'tns-nav-active', navStr = 'Carousel Page ', navStrCurrent = ' (Current Slide)'; }
        if (hasAutoplay) { var autoplayDirection = options.autoplayDirection === 'forward' ? 1 : -1, autoplayButton = options.autoplayButton, autoplayButtonHTML = options.autoplayButton ? options.autoplayButton.outerHTML : '', autoplayHtmlStrings = ['<span class=\'tns-visually-hidden\'>', ' animation</span>'], autoplayTimer, animating, autoplayHoverPaused, autoplayUserPaused, autoplayVisibilityPaused; }
        if (hasTouch || hasMouseDrag) { var initPosition = {}, lastPosition = {}, translateInit, disX, disY, panStart = false, rafIndex, getDist = horizontal ? function (a, b) { return a.x - b.x; } : function (a, b) { return a.y - b.y; }; }
        if (!autoWidth) { resetVariblesWhenDisable(disable || freeze); }
        if (TRANSFORM) { transformAttr = TRANSFORM; transformPrefix = 'translate'; if (HAS3DTRANSFORMS) { transformPrefix += horizontal ? '3d(' : '3d(0px, '; transformPostfix = horizontal ? ', 0px, 0px)' : ', 0px)'; } else { transformPrefix += horizontal ? 'X(' : 'Y('; transformPostfix = ')'; } }
        if (carousel) { container.className = container.className.replace('tns-vpfix', ''); }
        initStructure(); initSheet(); initSliderTransform(); function resetVariblesWhenDisable(condition) { if (condition) { controls = nav = touch = mouseDrag = arrowKeys = autoplay = autoplayHoverPause = autoplayResetOnVisibility = false; } }
        function getCurrentSlide() {
            var tem = carousel ? index - cloneCount : index; while (tem < 0) { tem += slideCount; }
            return tem % slideCount + 1;
        }
        function getStartIndex(ind) { ind = ind ? Math.max(0, Math.min(loop ? slideCount - 1 : slideCount - items, ind)) : 0; return carousel ? ind + cloneCount : ind; }
        function getAbsIndex(i) {
            if (i == null) { i = index; }
            if (carousel) { i -= cloneCount; }
            while (i < 0) { i += slideCount; }
            return Math.floor(i % slideCount);
        }
        function getCurrentNavIndex() {
            var absIndex = getAbsIndex(), result; result = navAsThumbnails ? absIndex : fixedWidth || autoWidth ? Math.ceil((absIndex + 1) * pages / slideCount - 1) : Math.floor(absIndex / items); if (!loop && carousel && index === indexMax) { result = pages - 1; }
            return result;
        }
        function getItemsMax() {
            if (autoWidth || (fixedWidth && !viewportMax)) { return slideCount - 1; } else {
                var str = fixedWidth ? 'fixedWidth' : 'items', arr = []; if (fixedWidth || options[str] < slideCount) { arr.push(options[str]); }
                if (responsive) { for (var bp in responsive) { var tem = responsive[bp][str]; if (tem && (fixedWidth || tem < slideCount)) { arr.push(tem); } } }
                if (!arr.length) { arr.push(0); }
                return Math.ceil(fixedWidth ? viewportMax / Math.min.apply(null, arr) : Math.max.apply(null, arr));
            }
        }
        function getCloneCountForLoop() { var itemsMax = getItemsMax(), result = carousel ? Math.ceil((itemsMax * 5 - slideCount) / 2) : (itemsMax * 4 - slideCount); result = Math.max(itemsMax, result); return hasOption('edgePadding') ? result + 2 : result; }
        function getWindowWidth() { return win.innerWidth || doc.documentElement.clientWidth || doc.body.clientWidth; }
        function getInsertPosition(pos) { return pos === 'top' ? 'afterbegin' : 'beforeend'; }
        function getClientWidth(el) {
            if (el == null) { return; }
            var div = doc.createElement('div'), rect, width; el.appendChild(div); rect = div.getBoundingClientRect(); width = rect.right - rect.left; div.remove(); return width || getClientWidth(el.parentNode);
        }
        function getViewportWidth() { var gap = edgePadding ? edgePadding * 2 - gutter : 0; return getClientWidth(containerParent) - gap; }
        function hasOption(item) {
            if (options[item]) { return true; } else {
                if (responsive) { for (var bp in responsive) { if (responsive[bp][item]) { return true; } } }
                return false;
            }
        }
        function getOption(item, ww) {
            if (ww == null) { ww = windowWidth; }
            if (item === 'items' && fixedWidth) { return Math.floor((viewport + gutter) / (fixedWidth + gutter)) || 1; } else {
                var result = options[item]; if (responsive) { for (var bp in responsive) { if (ww >= parseInt(bp)) { if (item in responsive[bp]) { result = responsive[bp][item]; } } } }
                if (item === 'slideBy' && result === 'page') { result = getOption('items'); }
                if (!carousel && (item === 'slideBy' || item === 'items')) { result = Math.floor(result); }
                return result;
            }
        }
        function getSlideMarginLeft(i) { return CALC ? CALC + '(' + i * 100 + '% / ' + slideCountNew + ')' : i * 100 / slideCountNew + '%'; }
        function getInnerWrapperStyles(edgePaddingTem, gutterTem, fixedWidthTem, speedTem, autoHeightBP) {
            var str = ''; if (edgePaddingTem !== undefined) {
                var gap = edgePaddingTem; if (gutterTem) { gap -= gutterTem; }
                str = horizontal ? 'margin: 0 ' + gap + 'px 0 ' + edgePaddingTem + 'px;' : 'margin: ' + edgePaddingTem + 'px 0 ' + gap + 'px 0;';
            } else if (gutterTem && !fixedWidthTem) { var gutterTemUnit = '-' + gutterTem + 'px', dir = horizontal ? gutterTemUnit + ' 0 0' : '0 ' + gutterTemUnit + ' 0'; str = 'margin: 0 ' + dir + ';'; }
            if (!carousel && autoHeightBP && TRANSITIONDURATION && speedTem) { str += getTransitionDurationStyle(speedTem); }
            return str;
        }
        function getContainerWidth(fixedWidthTem, gutterTem, itemsTem) { if (fixedWidthTem) { return (fixedWidthTem + gutterTem) * slideCountNew + 'px'; } else { return CALC ? CALC + '(' + slideCountNew * 100 + '% / ' + itemsTem + ')' : slideCountNew * 100 / itemsTem + '%'; } }
        function getSlideWidthStyle(fixedWidthTem, gutterTem, itemsTem) {
            var width; if (fixedWidthTem) { width = (fixedWidthTem + gutterTem) + 'px'; } else {
                if (!carousel) { itemsTem = Math.floor(itemsTem); }
                var dividend = carousel ? slideCountNew : itemsTem; width = CALC ? CALC + '(100% / ' + dividend + ')' : 100 / dividend + '%';
            }
            width = 'width:' + width; return nested !== 'inner' ? width + ';' : width + ' !important;';
        }
        function getSlideGutterStyle(gutterTem) {
            var str = ''; if (gutterTem !== false) { var prop = horizontal ? 'padding-' : 'margin-', dir = horizontal ? 'right' : 'bottom'; str = prop + dir + ': ' + gutterTem + 'px;'; }
            return str;
        }
        function getCSSPrefix(name, num) {
            var prefix = name.substring(0, name.length - num).toLowerCase(); if (prefix) { prefix = '-' + prefix + '-'; }
            return prefix;
        }
        function getTransitionDurationStyle(speed) { return getCSSPrefix(TRANSITIONDURATION, 18) + 'transition-duration:' + speed / 1000 + 's;'; }
        function getAnimationDurationStyle(speed) { return getCSSPrefix(ANIMATIONDURATION, 17) + 'animation-duration:' + speed / 1000 + 's;'; }
        function initStructure() {
            var classOuter = 'tns-outer', classInner = 'tns-inner', hasGutter = hasOption('gutter'); outerWrapper.className = classOuter; innerWrapper.className = classInner; outerWrapper.id = slideId + '-ow'; innerWrapper.id = slideId + '-iw'; if (container.dataset.name) { innerWrapper.classList.add(container.dataset.name); }
            if (container.id === '') { container.id = slideId; }
            newContainerClasses += PERCENTAGELAYOUT || autoWidth ? ' tns-subpixel' : ' tns-no-subpixel'; newContainerClasses += CALC ? ' tns-calc' : ' tns-no-calc'; if (autoWidth) { newContainerClasses += ' tns-autowidth'; }
            newContainerClasses += ' tns-' + options.axis; container.className += newContainerClasses; if (carousel) { middleWrapper = doc.createElement('div'); middleWrapper.id = slideId + '-mw'; middleWrapper.className = 'tns-ovh'; outerWrapper.appendChild(middleWrapper); middleWrapper.appendChild(innerWrapper); } else { outerWrapper.appendChild(innerWrapper); }
            if (autoHeight) { var wp = middleWrapper ? middleWrapper : innerWrapper; wp.className += ' tns-ah'; }
            containerParent.insertBefore(outerWrapper, container); innerWrapper.appendChild(container); forEach(slideItems, function (item, i) {
                addClass(item, 'tns-item'); if (!item.id) { item.id = slideId + '-item' + i; }
                if (!carousel && animateNormal) { addClass(item, animateNormal); }
                setAttrs(item, { 'tabindex': '-1' });
            }); if (cloneCount) {
                var fragmentBefore = doc.createDocumentFragment(), fragmentAfter = doc.createDocumentFragment(); for (var j = cloneCount; j--;) { var num = j % slideCount, cloneFirst = slideItems[num].cloneNode(true); addClass(cloneFirst, slideClonedClass); removeAttrs(cloneFirst, 'id'); fragmentAfter.insertBefore(cloneFirst, fragmentAfter.firstChild); if (carousel) { var cloneLast = slideItems[slideCount - 1 - num].cloneNode(true); addClass(cloneLast, slideClonedClass); removeAttrs(cloneLast, 'id'); fragmentBefore.appendChild(cloneLast); } }
                container.insertBefore(fragmentBefore, container.firstChild); container.appendChild(fragmentAfter); slideItems = container.children;
            }
            container.classList.add("is-loaded");
        }
        function initSliderTransform() {
            if (hasOption('autoHeight') || autoWidth || !horizontal) {
                var imgs = container.querySelectorAll('img'); forEach(imgs, function (img) { var src = img.src; if (!lazyload) { if (src && src.indexOf('data:image') < 0) { img.src = ''; addEvents(img, imgEvents); addClass(img, 'loading'); img.src = src; } else { imgLoaded(img); } } }); raf(function () { imgsLoadedCheck(arrayFromNodeList(imgs), function () { imgsComplete = true; }); }); if (hasOption('autoHeight')) { imgs = getImageArray(index, Math.min(index + items - 1, slideCountNew - 1)); }
                lazyload ? initSliderTransformStyleCheck() : raf(function () { imgsLoadedCheck(arrayFromNodeList(imgs), initSliderTransformStyleCheck); });
            } else {
                if (carousel) { doContainerTransformSilent(); }
                initTools(); initEvents();
            }
        }
        function initSliderTransformStyleCheck() { if (autoWidth && slideCount > 1) { var num = loop ? index : slideCount - 1; (function stylesApplicationCheck() { var left = slideItems[num].getBoundingClientRect().left; var right = slideItems[num - 1].getBoundingClientRect().right; (Math.abs(left - right) <= 1) ? initSliderTransformCore() : setTimeout(function () { stylesApplicationCheck(); }, 16); })(); } else { initSliderTransformCore(); } }
        function initSliderTransformCore() {
            if (!horizontal || autoWidth) {
                setSlidePositions(); if (autoWidth) {
                    rightBoundary = getRightBoundary(); if (freezable) { freeze = getFreeze(); }
                    indexMax = getIndexMax(); resetVariblesWhenDisable(disable || freeze);
                } else { updateContentWrapperHeight(); }
            }
            if (carousel) { doContainerTransformSilent(); }
            initTools(); initEvents();
        }
        function initSheet() {
            if (!carousel) { for (var i = index, l = index + Math.min(slideCount, items); i < l; i++) { var item = slideItems[i]; item.style.left = (i - index) * 100 / items + '%'; addClass(item, animateIn); removeClass(item, animateNormal); } }
            if (horizontal) { if (PERCENTAGELAYOUT || autoWidth) { addCSSRule(sheet, '#' + slideId + ' > .tns-item', 'font-size:' + win.getComputedStyle(slideItems[0]).fontSize + ';', getCssRulesLength(sheet)); addCSSRule(sheet, '#' + slideId, 'font-size:0;', getCssRulesLength(sheet)); } else if (carousel) { forEach(slideItems, function (slide, i) { slide.style.marginLeft = getSlideMarginLeft(i); }); } }
            if (CSSMQ) {
                if (TRANSITIONDURATION) { var str = middleWrapper && options.autoHeight ? getTransitionDurationStyle(options.speed) : ''; addCSSRule(sheet, '#' + slideId + '-mw', str, getCssRulesLength(sheet)); }
                str = getInnerWrapperStyles(options.edgePadding, options.gutter, options.fixedWidth, options.speed, options.autoHeight); addCSSRule(sheet, '#' + slideId + '-iw', str, getCssRulesLength(sheet)); if (carousel) {
                    str = horizontal && !autoWidth ? 'width:' + getContainerWidth(options.fixedWidth, options.gutter, options.items) + ';' : ''; if (TRANSITIONDURATION) { str += getTransitionDurationStyle(speed); }
                    addCSSRule(sheet, '#' + slideId, str, getCssRulesLength(sheet));
                }
                str = horizontal && !autoWidth ? getSlideWidthStyle(options.fixedWidth, options.gutter, options.items) : ''; if (options.gutter) { str += getSlideGutterStyle(options.gutter); }
                if (!carousel) {
                    if (TRANSITIONDURATION) { str += getTransitionDurationStyle(speed); }
                    if (ANIMATIONDURATION) { str += getAnimationDurationStyle(speed); }
                }
                if (str) { addCSSRule(sheet, '#' + slideId + ' > .tns-item', str, getCssRulesLength(sheet)); }
            } else {
                update_carousel_transition_duration(); innerWrapper.style.cssText = getInnerWrapperStyles(edgePadding, gutter, fixedWidth, autoHeight); if (carousel && horizontal && !autoWidth) { container.style.width = getContainerWidth(fixedWidth, gutter, items); }
                var str = horizontal && !autoWidth ? getSlideWidthStyle(fixedWidth, gutter, items) : ''; if (gutter) { str += getSlideGutterStyle(gutter); }
                if (str) { addCSSRule(sheet, '#' + slideId + ' > .tns-item', str, getCssRulesLength(sheet)); }
            }
            if (responsive && CSSMQ) {
                for (var bp in responsive) {
                    bp = parseInt(bp); var opts = responsive[bp], str = '', middleWrapperStr = '', innerWrapperStr = '', containerStr = '', slideStr = '', itemsBP = !autoWidth ? getOption('items', bp) : null, fixedWidthBP = getOption('fixedWidth', bp), speedBP = getOption('speed', bp), edgePaddingBP = getOption('edgePadding', bp), autoHeightBP = getOption('autoHeight', bp), gutterBP = getOption('gutter', bp); if (TRANSITIONDURATION && middleWrapper && getOption('autoHeight', bp) && 'speed' in opts) { middleWrapperStr = '#' + slideId + '-mw{' + getTransitionDurationStyle(speedBP) + '}'; }
                    if ('edgePadding' in opts || 'gutter' in opts) { innerWrapperStr = '#' + slideId + '-iw{' + getInnerWrapperStyles(edgePaddingBP, gutterBP, fixedWidthBP, speedBP, autoHeightBP) + '}'; }
                    if (carousel && horizontal && !autoWidth && ('fixedWidth' in opts || 'items' in opts || (fixedWidth && 'gutter' in opts))) { containerStr = 'width:' + getContainerWidth(fixedWidthBP, gutterBP, itemsBP) + ';'; }
                    if (TRANSITIONDURATION && 'speed' in opts) { containerStr += getTransitionDurationStyle(speedBP); }
                    if (containerStr) { containerStr = '#' + slideId + '{' + containerStr + '}'; }
                    if ('fixedWidth' in opts || (fixedWidth && 'gutter' in opts) || !carousel && 'items' in opts) { slideStr += getSlideWidthStyle(fixedWidthBP, gutterBP, itemsBP); }
                    if ('gutter' in opts) { slideStr += getSlideGutterStyle(gutterBP); }
                    if (!carousel && 'speed' in opts) {
                        if (TRANSITIONDURATION) { slideStr += getTransitionDurationStyle(speedBP); }
                        if (ANIMATIONDURATION) { slideStr += getAnimationDurationStyle(speedBP); }
                    }
                    if (slideStr) { slideStr = '#' + slideId + ' > .tns-item{' + slideStr + '}'; }
                    str = middleWrapperStr + innerWrapperStr + containerStr + slideStr; if (str) { sheet.insertRule('@media (min-width: ' + bp / 16 + 'em) {' + str + '}', sheet.cssRules.length); }
                }
            }
        }
        function initTools() {
            updateSlideStatus(); outerWrapper.insertAdjacentHTML('afterbegin', '<div class="tns-liveregion tns-visually-hidden" aria-live="polite" aria-atomic="true">slide <span class="current">' + getLiveRegionStr() + '</span>  of ' + slideCount + '</div>'); liveregionCurrent = outerWrapper.querySelector('.tns-liveregion .current'); if (hasAutoplay) {
                var txt = autoplay ? 'stop' : 'start'; if (autoplayButton) { setAttrs(autoplayButton, { 'data-action': txt }); } else if (options.autoplayButtonOutput) { autoplayButton = outerWrapper.querySelector('[data-action]'); }
                if (autoplayButton) { addEvents(autoplayButton, { 'click': toggleAutoplay }); }
                if (autoplay) {
                    startAutoplay(); if (autoplayHoverPause) { addEvents(container, hoverEvents); }
                    if (autoplayResetOnVisibility) { addEvents(container, visibilityEvent); }
                }
            }
            if (hasNav) {
                var initIndex = !carousel ? 0 : cloneCount; if (navContainer) { setAttrs(navContainer, { 'aria-label': 'Carousel Pagination' }); navItems = navContainer.children; forEach(navItems, function (item, i) { setAttrs(item, { 'data-nav': i, 'tabindex': '-1', 'aria-label': navStr + (i + 1), 'aria-controls': slideId, }); }); } else {
                    var navHtml = '', hiddenStr = navAsThumbnails ? '' : 'style="display:none"'; for (var i = 0; i < slideCount; i++) { navHtml += '<button type="button" data-nav="' + i + '" tabindex="-1" aria-controls="' + slideId + '" ' + hiddenStr + ' aria-label="' + navStr + (i + 1) + '"></button>'; }
                    navHtml = '<div class="tns-nav" aria-label="Carousel Pagination">' + navHtml + '</div>'; outerWrapper.insertAdjacentHTML(getInsertPosition(options.navPosition), navHtml); navContainer = outerWrapper.querySelector('.tns-nav'); navItems = navContainer.children;
                }
                updateNavVisibility(); if (TRANSITIONDURATION) {
                    var prefix = TRANSITIONDURATION.substring(0, TRANSITIONDURATION.length - 18).toLowerCase(), str = 'transition: all ' + speed / 1000 + 's'; if (prefix) { str = '-' + prefix + '-' + str; }
                    addCSSRule(sheet, '[aria-controls^=' + slideId + '-item]', str, getCssRulesLength(sheet));
                }
                setAttrs(navItems[navCurrentIndex], { 'aria-label': navStr + (navCurrentIndex + 1) + navStrCurrent }); removeAttrs(navItems[navCurrentIndex], 'tabindex'); addClass(navItems[navCurrentIndex], navActiveClass); addEvents(navContainer, navEvents);
            }
            if (hasControls) {
                if (!controlsContainer && (!prevButton || !nextButton)) { outerWrapper.insertAdjacentHTML(getInsertPosition(options.controlsPosition), '<div class="tns-controls" aria-label="Carousel Navigation" tabindex="0"><button type="button" data-controls="prev" aria-label="Previous" tabindex="-1" aria-controls="' + slideId + '">' + controlsText[0] + '</button><button type="button" data-controls="next" aria-label="Next" tabindex="-1" aria-controls="' + slideId + '">' + controlsText[1] + '</button></div>'); controlsContainer = outerWrapper.querySelector('.tns-controls'); }
                if (!prevButton || !nextButton) { prevButton = controlsContainer.children[0]; nextButton = controlsContainer.children[1]; }
                if (options.controlsContainer) { setAttrs(controlsContainer, { 'tabindex': '0' }); }
                if (options.controlsContainer || (options.prevButton && options.nextButton)) { setAttrs([prevButton, nextButton], { 'aria-controls': slideId, 'tabindex': '-1', }); }
                if (options.controlsContainer || (options.prevButton && options.nextButton)) { setAttrs(prevButton, { 'data-controls': 'prev', 'aria-label': 'Previous' }); setAttrs(nextButton, { 'data-controls': 'next', 'aria-label': 'Next' }); }
                prevIsButton = isButton(prevButton); nextIsButton = isButton(nextButton); updateControlsStatus(); if (controlsContainer) { addEvents(controlsContainer, controlsEvents); } else { addEvents(prevButton, controlsEvents); addEvents(nextButton, controlsEvents); }
            }
            disableUI();
        }
        function initEvents() {
            if (carousel && TRANSITIONEND) { var eve = {}; eve[TRANSITIONEND] = onTransitionEnd; addEvents(container, eve); }
            if (touch) { addEvents(container, touchEvents, options.preventScrollOnTouch); }
            if (mouseDrag) { addEvents(container, dragEvents); }
            if (arrowKeys) { addEvents(doc, docmentKeydownEvent); }
            if (nested === 'inner') { events.on('outerResized', function () { resizeTasks(); events.emit('innerLoaded', info()); }); } else if (responsive || fixedWidth || autoWidth || autoHeight || !horizontal) { addEvents(win, { 'resize': onResize }); }
            if (autoHeight) { if (nested === 'outer') { events.on('innerLoaded', doAutoHeight); } else if (!disable) { doAutoHeight(); } }
            doLazyLoad(); if (disable) { disableSlider(); } else if (freeze) { freezeSlider(); }
            events.on('indexChanged', additionalUpdates); if (nested === 'inner') { events.emit('innerLoaded', info()); }
            if (typeof onInit === 'function') { onInit(info()); }
            isOn = true;
        }
        function destroy() {
            sheet.disabled = true; if (sheet.ownerNode) { sheet.ownerNode.remove(); }
            removeEvents(win, { 'resize': onResize }); if (arrowKeys) { removeEvents(doc, docmentKeydownEvent); }
            if (controlsContainer) { removeEvents(controlsContainer, controlsEvents); }
            if (navContainer) { removeEvents(navContainer, navEvents); }
            removeEvents(container, hoverEvents); removeEvents(container, visibilityEvent); if (autoplayButton) { removeEvents(autoplayButton, { 'click': toggleAutoplay }); }
            if (autoplay) { clearInterval(autoplayTimer); }
            if (carousel && TRANSITIONEND) { var eve = {}; eve[TRANSITIONEND] = onTransitionEnd; removeEvents(container, eve); }
            if (touch) { removeEvents(container, touchEvents); }
            if (mouseDrag) { removeEvents(container, dragEvents); }
            var htmlList = [containerHTML, controlsContainerHTML, prevButtonHTML, nextButtonHTML, navContainerHTML, autoplayButtonHTML]; tnsList.forEach(function (item, i) { var el = item === 'container' ? outerWrapper : options[item]; if (typeof el === 'object' && el) { var prevEl = el.previousElementSibling ? el.previousElementSibling : false, parentEl = el.parentNode; el.outerHTML = htmlList[i]; options[item] = prevEl ? prevEl.nextElementSibling : parentEl.firstElementChild; } }); tnsList = animateIn = animateOut = animateDelay = animateNormal = horizontal = outerWrapper = innerWrapper = container = containerParent = containerHTML = slideItems = slideCount = breakpointZone = windowWidth = autoWidth = fixedWidth = edgePadding = gutter = viewport = items = slideBy = viewportMax = arrowKeys = speed = rewind = loop = autoHeight = sheet = lazyload = slidePositions = slideItemsOut = cloneCount = slideCountNew = hasRightDeadZone = rightBoundary = updateIndexBeforeTransform = transformAttr = transformPrefix = transformPostfix = getIndexMax = index = indexCached = indexMin = indexMax = resizeTimer = swipeAngle = moveDirectionExpected = running = onInit = events = newContainerClasses = slideId = disable = disabled = freezable = freeze = frozen = controlsEvents = navEvents = hoverEvents = visibilityEvent = docmentKeydownEvent = touchEvents = dragEvents = hasControls = hasNav = navAsThumbnails = hasAutoplay = hasTouch = hasMouseDrag = slideActiveClass = imgCompleteClass = imgEvents = imgsComplete = controls = controlsText = controlsContainer = controlsContainerHTML = prevButton = nextButton = prevIsButton = nextIsButton = nav = navContainer = navContainerHTML = navItems = pages = pagesCached = navClicked = navCurrentIndex = navCurrentIndexCached = navActiveClass = navStr = navStrCurrent = autoplay = autoplayTimeout = autoplayDirection = autoplayText = autoplayHoverPause = autoplayButton = autoplayButtonHTML = autoplayResetOnVisibility = autoplayHtmlStrings = autoplayTimer = animating = autoplayHoverPaused = autoplayUserPaused = autoplayVisibilityPaused = initPosition = lastPosition = translateInit = disX = disY = panStart = rafIndex = getDist = touch = mouseDrag = null; for (var a in this) { if (a !== 'rebuild') { this[a] = null; } }
            isOn = false;
        }
        function onResize(e) { raf(function () { resizeTasks(getEvent(e)); }); }
        function resizeTasks(e) {
            if (!isOn) { return; }
            if (nested === 'outer') { events.emit('outerResized', info(e)); }
            windowWidth = getWindowWidth(); var bpChanged, breakpointZoneTem = breakpointZone, needContainerTransform = false; if (responsive) { setBreakpointZone(); bpChanged = breakpointZoneTem !== breakpointZone; if (bpChanged) { events.emit('newBreakpointStart', info(e)); } }
            var indChanged, itemsChanged, itemsTem = items, disableTem = disable, freezeTem = freeze, arrowKeysTem = arrowKeys, controlsTem = controls, navTem = nav, touchTem = touch, mouseDragTem = mouseDrag, autoplayTem = autoplay, autoplayHoverPauseTem = autoplayHoverPause, autoplayResetOnVisibilityTem = autoplayResetOnVisibility, indexTem = index; if (bpChanged) { var fixedWidthTem = fixedWidth, autoHeightTem = autoHeight, controlsTextTem = controlsText, centerTem = center, autoplayTextTem = autoplayText; if (!CSSMQ) { var gutterTem = gutter, edgePaddingTem = edgePadding; } }
            arrowKeys = getOption('arrowKeys'); controls = getOption('controls'); nav = getOption('nav'); touch = getOption('touch'); center = getOption('center'); mouseDrag = getOption('mouseDrag'); autoplay = getOption('autoplay'); autoplayHoverPause = getOption('autoplayHoverPause'); autoplayResetOnVisibility = getOption('autoplayResetOnVisibility'); if (bpChanged) { disable = getOption('disable'); fixedWidth = getOption('fixedWidth'); speed = getOption('speed'); autoHeight = getOption('autoHeight'); controlsText = getOption('controlsText'); autoplayText = getOption('autoplayText'); autoplayTimeout = getOption('autoplayTimeout'); if (!CSSMQ) { edgePadding = getOption('edgePadding'); gutter = getOption('gutter'); } }
            resetVariblesWhenDisable(disable); viewport = getViewportWidth(); if ((!horizontal || autoWidth) && !disable) { setSlidePositions(); if (!horizontal) { updateContentWrapperHeight(); needContainerTransform = true; } }
            if (fixedWidth || autoWidth) { rightBoundary = getRightBoundary(); indexMax = getIndexMax(); }
            if (bpChanged || fixedWidth) {
                items = getOption('items'); slideBy = getOption('slideBy'); itemsChanged = items !== itemsTem; if (itemsChanged) {
                    if (!fixedWidth && !autoWidth) { indexMax = getIndexMax(); }
                    updateIndex();
                }
            }
            if (bpChanged) { if (disable !== disableTem) { if (disable) { disableSlider(); } else { enableSlider(); } } }
            if (freezable && (bpChanged || fixedWidth || autoWidth)) { freeze = getFreeze(); if (freeze !== freezeTem) { if (freeze) { doContainerTransform(getContainerTransformValue(getStartIndex(0))); freezeSlider(); } else { unfreezeSlider(); needContainerTransform = true; } } }
            resetVariblesWhenDisable(disable || freeze); if (!autoplay) { autoplayHoverPause = autoplayResetOnVisibility = false; }
            if (arrowKeys !== arrowKeysTem) { arrowKeys ? addEvents(doc, docmentKeydownEvent) : removeEvents(doc, docmentKeydownEvent); }
            if (controls !== controlsTem) {
                if (controls) {
                    if (controlsContainer) { showElement(controlsContainer); } else {
                        if (prevButton) { showElement(prevButton); }
                        if (nextButton) { showElement(nextButton); }
                    }
                } else {
                    if (controlsContainer) { hideElement(controlsContainer); } else {
                        if (prevButton) { hideElement(prevButton); }
                        if (nextButton) { hideElement(nextButton); }
                    }
                }
            }
            if (nav !== navTem) { if (nav) { showElement(navContainer); updateNavVisibility(); } else { hideElement(navContainer); } }
            if (touch !== touchTem) { touch ? addEvents(container, touchEvents, options.preventScrollOnTouch) : removeEvents(container, touchEvents); }
            if (mouseDrag !== mouseDragTem) { mouseDrag ? addEvents(container, dragEvents) : removeEvents(container, dragEvents); }
            if (autoplay !== autoplayTem) {
                if (autoplay) {
                    if (autoplayButton) { showElement(autoplayButton); }
                    if (!animating && !autoplayUserPaused) { startAutoplay(); }
                } else {
                    if (autoplayButton) { hideElement(autoplayButton); }
                    if (animating) { stopAutoplay(); }
                }
            }
            if (autoplayHoverPause !== autoplayHoverPauseTem) { autoplayHoverPause ? addEvents(container, hoverEvents) : removeEvents(container, hoverEvents); }
            if (autoplayResetOnVisibility !== autoplayResetOnVisibilityTem) { autoplayResetOnVisibility ? addEvents(doc, visibilityEvent) : removeEvents(doc, visibilityEvent); }
            if (bpChanged) {
                if (fixedWidth !== fixedWidthTem || center !== centerTem) { needContainerTransform = true; }
                if (autoHeight !== autoHeightTem) { if (!autoHeight) { innerWrapper.style.height = ''; } }
                if (controls && controlsText !== controlsTextTem) { prevButton.innerHTML = controlsText[0]; nextButton.innerHTML = controlsText[1]; }
                if (autoplayButton && autoplayText !== autoplayTextTem) { var i = autoplay ? 1 : 0, html = autoplayButton.innerHTML, len = html.length - autoplayTextTem[i].length; if (html.substring(len) === autoplayTextTem[i]) { autoplayButton.innerHTML = html.substring(0, len) + autoplayText[i]; } }
            } else { if (center && (fixedWidth || autoWidth)) { needContainerTransform = true; } }
            if (itemsChanged || fixedWidth && !autoWidth) { pages = getPages(); updateNavVisibility(); }
            indChanged = index !== indexTem; if (indChanged) { events.emit('indexChanged', info()); needContainerTransform = true; } else if (itemsChanged) { if (!indChanged) { additionalUpdates(); } } else if (fixedWidth || autoWidth) { doLazyLoad(); updateSlideStatus(); updateLiveRegion(); }
            if (itemsChanged && !carousel) { updateGallerySlidePositions(); }
            if (!disable && !freeze) {
                if (bpChanged && !CSSMQ) {
                    if (edgePadding !== edgePaddingTem || gutter !== gutterTem) { innerWrapper.style.cssText = getInnerWrapperStyles(edgePadding, gutter, fixedWidth, speed, autoHeight); }
                    if (horizontal) {
                        if (carousel) { container.style.width = getContainerWidth(fixedWidth, gutter, items); }
                        var str = getSlideWidthStyle(fixedWidth, gutter, items) +
                            getSlideGutterStyle(gutter); removeCSSRule(sheet, getCssRulesLength(sheet) - 1); addCSSRule(sheet, '#' + slideId + ' > .tns-item', str, getCssRulesLength(sheet));
                    }
                }
                if (autoHeight) { doAutoHeight(); }
                if (needContainerTransform) { doContainerTransformSilent(); indexCached = index; }
            }
            if (bpChanged) { events.emit('newBreakpointEnd', info(e)); }
        }
        function getFreeze() {
            if (!fixedWidth && !autoWidth) { var a = center ? items - (items - 1) / 2 : items; return slideCount <= a; }
            var width = fixedWidth ? (fixedWidth + gutter) * slideCount : slidePositions[slideCount], vp = edgePadding ? viewport + edgePadding * 2 : viewport + gutter; if (center) { vp -= fixedWidth ? (viewport - fixedWidth) / 2 : (viewport - (slidePositions[index + 1] - slidePositions[index] - gutter)) / 2; }
            return width <= vp;
        }
        function setBreakpointZone() { breakpointZone = 0; for (var bp in responsive) { bp = parseInt(bp); if (windowWidth >= bp) { breakpointZone = bp; } } }
        var updateIndex = (function () {
            return loop ? carousel ? function () {
                var leftEdge = indexMin, rightEdge = indexMax; leftEdge += slideBy; rightEdge -= slideBy; if (edgePadding) { leftEdge += 1; rightEdge -= 1; } else if (fixedWidth) { if ((viewport + gutter) % (fixedWidth + gutter)) { rightEdge -= 1; } }
                if (cloneCount) { if (index > rightEdge) { index -= slideCount; } else if (index < leftEdge) { index += slideCount; } }
            } : function () { if (index > indexMax) { while (index >= indexMin + slideCount) { index -= slideCount; } } else if (index < indexMin) { while (index <= indexMax - slideCount) { index += slideCount; } } } : function () { index = Math.max(indexMin, Math.min(indexMax, index)); };
        })(); function disableUI() {
            if (!autoplay && autoplayButton) { hideElement(autoplayButton); }
            if (!nav && navContainer) { hideElement(navContainer); }
            if (!controls) {
                if (controlsContainer) { hideElement(controlsContainer); } else {
                    if (prevButton) { hideElement(prevButton); }
                    if (nextButton) { hideElement(nextButton); }
                }
            }
        }
        function enableUI() {
            if (autoplay && autoplayButton) { showElement(autoplayButton); }
            if (nav && navContainer) { showElement(navContainer); }
            if (controls) {
                if (controlsContainer) { showElement(controlsContainer); } else {
                    if (prevButton) { showElement(prevButton); }
                    if (nextButton) { showElement(nextButton); }
                }
            }
        }
        function freezeSlider() {
            if (frozen) { return; }
            if (edgePadding) { innerWrapper.style.margin = '0px'; }
            if (cloneCount) {
                var str = 'tns-transparent'; for (var i = cloneCount; i--;) {
                    if (carousel) { addClass(slideItems[i], str); }
                    addClass(slideItems[slideCountNew - i - 1], str);
                }
            }
            disableUI(); frozen = true;
        }
        function unfreezeSlider() {
            if (!frozen) { return; }
            if (edgePadding && CSSMQ) { innerWrapper.style.margin = ''; }
            if (cloneCount) {
                var str = 'tns-transparent'; for (var i = cloneCount; i--;) {
                    if (carousel) { removeClass(slideItems[i], str); }
                    removeClass(slideItems[slideCountNew - i - 1], str);
                }
            }
            enableUI(); frozen = false;
        }
        function disableSlider() {
            if (disabled) { return; }
            sheet.disabled = true; container.className = container.className.replace(newContainerClasses.substring(1), ''); removeAttrs(container, ['style']); if (loop) {
                for (var j = cloneCount; j--;) {
                    if (carousel) { hideElement(slideItems[j]); }
                    hideElement(slideItems[slideCountNew - j - 1]);
                }
            }
            if (!horizontal || !carousel) { removeAttrs(innerWrapper, ['style']); }
            if (!carousel) { for (var i = index, l = index + slideCount; i < l; i++) { var item = slideItems[i]; removeAttrs(item, ['style']); removeClass(item, animateIn); removeClass(item, animateNormal); } }
            disableUI(); disabled = true;
        }
        function enableSlider() {
            if (!disabled) { return; }
            sheet.disabled = false; container.className += newContainerClasses; doContainerTransformSilent(); if (loop) {
                for (var j = cloneCount; j--;) {
                    if (carousel) { showElement(slideItems[j]); }
                    showElement(slideItems[slideCountNew - j - 1]);
                }
            }
            if (!carousel) { for (var i = index, l = index + slideCount; i < l; i++) { var item = slideItems[i], classN = i < index + items ? animateIn : animateNormal; item.style.left = (i - index) * 100 / items + '%'; addClass(item, classN); } }
            enableUI(); disabled = false;
        }
        function updateLiveRegion() { var str = getLiveRegionStr(); if (liveregionCurrent.innerHTML !== str) { liveregionCurrent.innerHTML = str; } }
        function getLiveRegionStr() { var arr = getVisibleSlideRange(), start = arr[0] + 1, end = arr[1] + 1; return start === end ? start + '' : start + ' to ' + end; }
        function getVisibleSlideRange(val) {
            if (val == null) { val = getContainerTransformValue(); }
            var start = index, end, rangestart, rangeend; if (center || edgePadding) { if (autoWidth || fixedWidth) { rangestart = -(parseFloat(val) + edgePadding); rangeend = rangestart + viewport + edgePadding * 2; } } else { if (autoWidth) { rangestart = slidePositions[index]; rangeend = rangestart + viewport; } }
            if (autoWidth) {
                slidePositions.forEach(function (point, i) {
                    if (i < slideCountNew) {
                        if ((center || edgePadding) && point <= rangestart + 0.5) { start = i; }
                        if (rangeend - point >= 0.5) { end = i; }
                    }
                });
            } else {
                if (fixedWidth) { var cell = fixedWidth + gutter; if (center || edgePadding) { start = Math.floor(rangestart / cell); end = Math.ceil(rangeend / cell - 1); } else { end = start + Math.ceil(viewport / cell) - 1; } } else {
                    if (center || edgePadding) {
                        var a = items - 1; if (center) { start -= a / 2; end = index + a / 2; } else { end = index + a; }
                        if (edgePadding) { var b = edgePadding * items / viewport; start -= b; end += b; }
                        start = Math.floor(start); end = Math.ceil(end);
                    } else { end = start + items - 1; }
                }
                start = Math.max(start, 0); end = Math.min(end, slideCountNew - 1);
            }
            return [start, end];
        }
        function doLazyLoad() {
            if (lazyload && !disable) {
                var arg = getVisibleSlideRange(); arg.push(lazyloadSelector); getImageArray.apply(null, arg).forEach(function (img) {
                    if (!hasClass(img, imgCompleteClass)) {
                        var eve = {}; eve[TRANSITIONEND] = function (e) { e.stopPropagation(); }; addEvents(img, eve); addEvents(img, imgEvents); img.src = getAttr(img, 'data-src'); var srcset = getAttr(img, 'data-srcset'); if (srcset) { img.srcset = srcset; }
                        addClass(img, 'loading');
                    }
                });
            }
        }
        function onImgLoaded(e) { imgLoaded(getTarget(e)); }
        function onImgFailed(e) { imgFailed(getTarget(e)); }
        function imgLoaded(img) { addClass(img, 'loaded'); imgCompleted(img); }
        function imgFailed(img) { addClass(img, 'failed'); imgCompleted(img); }
        function imgCompleted(img) { addClass(img, imgCompleteClass); removeClass(img, 'loading'); removeEvents(img, imgEvents); }
        function getImageArray(start, end, imgSelector) {
            var imgs = []; if (!imgSelector) { imgSelector = 'img'; }
            while (start <= end) { forEach(slideItems[start].querySelectorAll(imgSelector), function (img) { imgs.push(img); }); start++; }
            return imgs;
        }
        function doAutoHeight() { var imgs = getImageArray.apply(null, getVisibleSlideRange()); raf(function () { imgsLoadedCheck(imgs, updateInnerWrapperHeight); }); }
        function imgsLoadedCheck(imgs, cb) {
            if (imgsComplete) { return cb(); }
            imgs.forEach(function (img, index) {
                if (!lazyload && img.complete) { imgCompleted(img); }
                if (hasClass(img, imgCompleteClass)) { imgs.splice(index, 1); }
            }); if (!imgs.length) { return cb(); }
            raf(function () { imgsLoadedCheck(imgs, cb); });
        }
        function additionalUpdates() { doLazyLoad(); updateSlideStatus(); updateLiveRegion(); updateControlsStatus(); updateNavStatus(); }
        function update_carousel_transition_duration() { if (carousel && autoHeight) { middleWrapper.style[TRANSITIONDURATION] = speed / 1000 + 's'; } }
        function getMaxSlideHeight(slideStart, slideRange) {
            var heights = []; for (var i = slideStart, l = Math.min(slideStart + slideRange, slideCountNew); i < l; i++) { heights.push(slideItems[i].offsetHeight); }
            return Math.max.apply(null, heights);
        }
        function updateInnerWrapperHeight() { var maxHeight = autoHeight ? getMaxSlideHeight(index, items) : getMaxSlideHeight(cloneCount, slideCount), wp = middleWrapper ? middleWrapper : innerWrapper; if (wp.style.height !== maxHeight) { wp.style.height = maxHeight + 'px'; } }
        function setSlidePositions() {
            slidePositions = [0]; var attr = horizontal ? 'left' : 'top', attr2 = horizontal ? 'right' : 'bottom', base = slideItems[0].getBoundingClientRect()[attr]; forEach(slideItems, function (item, i) {
                if (i) { slidePositions.push(item.getBoundingClientRect()[attr] - base); }
                if (i === slideCountNew - 1) { slidePositions.push(item.getBoundingClientRect()[attr2] - base); }
            });
        }
        function updateSlideStatus() { var range = getVisibleSlideRange(), start = range[0], end = range[1]; forEach(slideItems, function (item, i) { if (i >= start && i <= end) { if (hasAttr(item, 'aria-hidden')) { removeAttrs(item, ['aria-hidden', 'tabindex']); addClass(item, slideActiveClass); } } else { if (!hasAttr(item, 'aria-hidden')) { setAttrs(item, { 'tabindex': '-1' }); removeClass(item, slideActiveClass); } } }); }
        function updateGallerySlidePositions() {
            var l = index + Math.min(slideCount, items); for (var i = slideCountNew; i--;) {
                var item = slideItems[i]; if (i >= index && i < l) { addClass(item, 'tns-moving'); item.style.left = (i - index) * 100 / items + '%'; addClass(item, animateIn); removeClass(item, animateNormal); } else if (item.style.left) { item.style.left = ''; addClass(item, animateNormal); removeClass(item, animateIn); }
                removeClass(item, animateOut);
            }
            setTimeout(function () { forEach(slideItems, function (el) { removeClass(el, 'tns-moving'); }); }, 300);
        }
        function updateNavStatus() { if (nav) { navCurrentIndex = navClicked >= 0 ? navClicked : getCurrentNavIndex(); navClicked = -1; if (navCurrentIndex !== navCurrentIndexCached) { var navPrev = navItems[navCurrentIndexCached], navCurrent = navItems[navCurrentIndex]; setAttrs(navPrev, { 'tabindex': '-1', 'aria-label': navStr + (navCurrentIndexCached + 1) }); removeClass(navPrev, navActiveClass); setAttrs(navCurrent, { 'aria-label': navStr + (navCurrentIndex + 1) + navStrCurrent }); removeAttrs(navCurrent, 'tabindex'); addClass(navCurrent, navActiveClass); navCurrentIndexCached = navCurrentIndex; } } }
        function getLowerCaseNodeName(el) { return el.nodeName.toLowerCase(); }
        function isButton(el) { return getLowerCaseNodeName(el) === 'button'; }
        function isAriaDisabled(el) { return el.getAttribute('aria-disabled') === 'true'; }
        function disEnableElement(isButton, el, val) { if (isButton) { el.disabled = val; } else { el.setAttribute('aria-disabled', val.toString()); } }
        function updateControlsStatus() {
            if (!controls || rewind || loop) { return; }
            var prevDisabled = (prevIsButton) ? prevButton.disabled : isAriaDisabled(prevButton), nextDisabled = (nextIsButton) ? nextButton.disabled : isAriaDisabled(nextButton), disablePrev = (index <= indexMin) ? true : false, disableNext = (!rewind && index >= indexMax) ? true : false; if (disablePrev && !prevDisabled) { disEnableElement(prevIsButton, prevButton, true); }
            if (!disablePrev && prevDisabled) { disEnableElement(prevIsButton, prevButton, false); }
            if (disableNext && !nextDisabled) { disEnableElement(nextIsButton, nextButton, true); }
            if (!disableNext && nextDisabled) { disEnableElement(nextIsButton, nextButton, false); }
        }
        function resetDuration(el, str) { if (TRANSITIONDURATION) { el.style[TRANSITIONDURATION] = str; } }
        function getSliderWidth() { return fixedWidth ? (fixedWidth + gutter) * slideCountNew : slidePositions[slideCountNew]; }
        function getCenterGap(num) {
            if (num == null) { num = index; }
            var gap = edgePadding ? gutter : 0; return autoWidth ? ((viewport - gap) - (slidePositions[num + 1] - slidePositions[num] - gutter)) / 2 : fixedWidth ? (viewport - fixedWidth) / 2 : (items - 1) / 2;
        }
        function getRightBoundary() {
            var gap = edgePadding ? gutter : 0, result = (viewport + gap) - getSliderWidth(); if (center && !loop) { result = fixedWidth ? -(fixedWidth + gutter) * (slideCountNew - 1) - getCenterGap() : getCenterGap(slideCountNew - 1) - slidePositions[slideCountNew - 1]; }
            if (result > 0) { result = 0; }
            return result;
        }
        function getContainerTransformValue(num) {
            if (num == null) { num = index; }
            var val; if (horizontal && !autoWidth) {
                if (fixedWidth) { val = -(fixedWidth + gutter) * num; if (center) { val += getCenterGap(); } } else {
                    var denominator = TRANSFORM ? slideCountNew : items; if (center) { num -= getCenterGap(); }
                    val = -num * 100 / denominator;
                }
            } else { val = -slidePositions[num]; if (center && autoWidth) { val += getCenterGap(); } }
            if (hasRightDeadZone) { val = Math.max(val, rightBoundary); }
            val += (horizontal && !autoWidth && !fixedWidth) ? '%' : 'px'; return val;
        }
        function doContainerTransformSilent(val) { resetDuration(container, '0s'); doContainerTransform(val); }
        function doContainerTransform(val) {
            if (val == null) { val = getContainerTransformValue(); }
            container.style[transformAttr] = transformPrefix + val + transformPostfix;
        }
        function animateSlide(number, classOut, classIn, isOut) {
            var l = number + items; if (!loop) { l = Math.min(l, slideCountNew); }
            for (var i = number; i < l; i++) {
                var item = slideItems[i]; if (!isOut) { item.style.left = (i - index) * 100 / items + '%'; }
                if (animateDelay && TRANSITIONDELAY) { item.style[TRANSITIONDELAY] = item.style[ANIMATIONDELAY] = animateDelay * (i - number) / 1000 + 's'; }
                removeClass(item, classOut); addClass(item, classIn); if (isOut) { slideItemsOut.push(item); }
            }
        }
        var transformCore = (function () {
            return carousel ? function () {
                resetDuration(container, ''); if (TRANSITIONDURATION || !speed) { doContainerTransform(); if (!speed || !isVisible(container)) { onTransitionEnd(); } } else { jsTransform(container, transformAttr, transformPrefix, transformPostfix, getContainerTransformValue(), speed, onTransitionEnd); }
                if (!horizontal) { updateContentWrapperHeight(); }
            } : function () { slideItemsOut = []; var eve = {}; eve[TRANSITIONEND] = eve[ANIMATIONEND] = onTransitionEnd; removeEvents(slideItems[indexCached], eve); addEvents(slideItems[index], eve); animateSlide(indexCached, animateIn, animateOut, true); animateSlide(index, animateNormal, animateIn); if (!TRANSITIONEND || !ANIMATIONEND || !speed || !isVisible(container)) { onTransitionEnd(); } };
        })(); function render(e, sliderMoved) {
            if (updateIndexBeforeTransform) { updateIndex(); }
            if (index !== indexCached || sliderMoved) {
                events.emit('indexChanged', info()); events.emit('transitionStart', info()); if (autoHeight) { doAutoHeight(); }
                if (animating && e && ['click', 'keydown'].indexOf(e.type) >= 0) { stopAutoplay(); }
                running = true; transformCore();
            }
        }
        function strTrans(str) { return str.toLowerCase().replace(/-/g, ''); }
        function onTransitionEnd(event) {
            if (carousel || running) {
                events.emit('transitionEnd', info(event)); if (!carousel && slideItemsOut.length > 0) {
                    for (var i = 0; i < slideItemsOut.length; i++) {
                        var item = slideItemsOut[i]; item.style.left = ''; if (ANIMATIONDELAY && TRANSITIONDELAY) { item.style[ANIMATIONDELAY] = ''; item.style[TRANSITIONDELAY] = ''; }
                        removeClass(item, animateOut); addClass(item, animateNormal);
                    }
                }
                if (!event || !carousel && event.target.parentNode === container || event.target === container && strTrans(event.propertyName) === strTrans(transformAttr)) {
                    if (!updateIndexBeforeTransform) { var indexTem = index; updateIndex(); if (index !== indexTem) { events.emit('indexChanged', info()); doContainerTransformSilent(); } }
                    if (nested === 'inner') { events.emit('innerLoaded', info()); }
                    running = false; indexCached = index;
                }
            }
        }
        function goTo(targetIndex, e) {
            if (freeze) { return; }
            if (targetIndex === 'prev') { onControlsClick(e, -1); } else if (targetIndex === 'next') { onControlsClick(e, 1); } else {
                if (running) { if (preventActionWhenRunning) { return; } else { onTransitionEnd(); } }
                var absIndex = getAbsIndex(), indexGap = 0; if (targetIndex === 'first') { indexGap = -absIndex; } else if (targetIndex === 'last') { indexGap = carousel ? slideCount - items - absIndex : slideCount - 1 - absIndex; } else {
                    if (typeof targetIndex !== 'number') { targetIndex = parseInt(targetIndex); }
                    if (!isNaN(targetIndex)) {
                        if (!e) { targetIndex = Math.max(0, Math.min(slideCount - 1, targetIndex)); }
                        indexGap = targetIndex - absIndex;
                    }
                }
                if (!carousel && indexGap && Math.abs(indexGap) < items) { var factor = indexGap > 0 ? 1 : -1; indexGap += (index + indexGap - slideCount) >= indexMin ? slideCount * factor : slideCount * 2 * factor * -1; }
                index += indexGap; if (carousel && loop) {
                    if (index < indexMin) { index += slideCount; }
                    if (index > indexMax) { index -= slideCount; }
                }
                if (getAbsIndex(index) !== getAbsIndex(indexCached)) { render(e); }
            }
        }
        function onControlsClick(e, dir) {
            if (running) { if (preventActionWhenRunning) { return; } else { onTransitionEnd(); } }
            var passEventObject; if (!dir) {
                e = getEvent(e); var target = getTarget(e); while (target !== controlsContainer && [prevButton, nextButton].indexOf(target) < 0) { target = target.parentNode; }
                var targetIn = [prevButton, nextButton].indexOf(target); if (targetIn >= 0) { passEventObject = true; dir = targetIn === 0 ? -1 : 1; }
            }
            if (rewind) { if (index === indexMin && dir === -1) { goTo('last', e); return; } else if (index === indexMax && dir === 1) { goTo('first', e); return; } }
            if (dir) {
                index += slideBy * dir; if (autoWidth) { index = Math.floor(index); }
                render((passEventObject || (e && e.type === 'keydown')) ? e : null);
            }
        }
        function onNavClick(e) {
            if (running) { if (preventActionWhenRunning) { return; } else { onTransitionEnd(); } }
            e = getEvent(e); var target = getTarget(e), navIndex; while (target !== navContainer && !hasAttr(target, 'data-nav')) { target = target.parentNode; }
            if (hasAttr(target, 'data-nav')) {
                var navIndex = navClicked = Number(getAttr(target, 'data-nav')), targetIndexBase = fixedWidth || autoWidth ? navIndex * slideCount / pages : navIndex * items, targetIndex = navAsThumbnails ? navIndex : Math.min(Math.ceil(targetIndexBase), slideCount - 1); goTo(targetIndex, e); if (navCurrentIndex === navIndex) {
                    if (animating) { stopAutoplay(); }
                    navClicked = -1;
                }
            }
        }
        function setAutoplayTimer() { autoplayTimer = setInterval(function () { onControlsClick(null, autoplayDirection); }, autoplayTimeout); animating = true; }
        function stopAutoplayTimer() { clearInterval(autoplayTimer); animating = false; }
        function updateAutoplayButton(action, txt) { setAttrs(autoplayButton, { 'data-action': action }); autoplayButton.innerHTML = autoplayHtmlStrings[0] + action + autoplayHtmlStrings[1] + txt; }
        function startAutoplay() { setAutoplayTimer(); if (autoplayButton) { updateAutoplayButton('stop', autoplayText[1]); } }
        function stopAutoplay() { stopAutoplayTimer(); if (autoplayButton) { updateAutoplayButton('start', autoplayText[0]); } }
        function play() { if (autoplay && !animating) { startAutoplay(); autoplayUserPaused = false; } }
        function pause() { if (animating) { stopAutoplay(); autoplayUserPaused = true; } }
        function toggleAutoplay() { if (animating) { stopAutoplay(); autoplayUserPaused = true; } else { startAutoplay(); autoplayUserPaused = false; } }
        function onVisibilityChange() { if (doc.hidden) { if (animating) { stopAutoplayTimer(); autoplayVisibilityPaused = true; } } else if (autoplayVisibilityPaused) { setAutoplayTimer(); autoplayVisibilityPaused = false; } }
        function mouseoverPause() { if (animating) { stopAutoplayTimer(); autoplayHoverPaused = true; } }
        function mouseoutRestart() { if (autoplayHoverPaused) { setAutoplayTimer(); autoplayHoverPaused = false; } }
        function onDocumentKeydown(e) { e = getEvent(e); var keyIndex = [KEYS.LEFT, KEYS.RIGHT].indexOf(e.keyCode); if (keyIndex >= 0) { onControlsClick(e, keyIndex === 0 ? -1 : 1); } }
        function onControlsKeydown(e) { e = getEvent(e); var keyIndex = [KEYS.LEFT, KEYS.RIGHT].indexOf(e.keyCode); if (keyIndex >= 0) { if (keyIndex === 0) { if (!prevButton.disabled) { onControlsClick(e, -1); } } else if (!nextButton.disabled) { onControlsClick(e, 1); } } }
        function setFocus(el) { el.focus(); }
        function onNavKeydown(e) {
            e = getEvent(e); var curElement = doc.activeElement; if (!hasAttr(curElement, 'data-nav')) { return; }
            var keyIndex = [KEYS.LEFT, KEYS.RIGHT, KEYS.ENTER, KEYS.SPACE].indexOf(e.keyCode), navIndex = Number(getAttr(curElement, 'data-nav')); if (keyIndex >= 0) { if (keyIndex === 0) { if (navIndex > 0) { setFocus(navItems[navIndex - 1]); } } else if (keyIndex === 1) { if (navIndex < pages - 1) { setFocus(navItems[navIndex + 1]); } } else { navClicked = navIndex; goTo(navIndex, e); } }
        }
        function getEvent(e) { e = e || win.event; return isTouchEvent(e) ? e.changedTouches[0] : e; }
        function getTarget(e) { return e.target || win.event.srcElement; }
        function isTouchEvent(e) { return e.type.indexOf('touch') >= 0; }
        function preventDefaultBehavior(e) { e.preventDefault ? e.preventDefault() : e.returnValue = false; }
        function getMoveDirectionExpected() { return getTouchDirection(toDegree(lastPosition.y - initPosition.y, lastPosition.x - initPosition.x), swipeAngle) === options.axis; }
        function onPanStart(e) {
            if (running) { if (preventActionWhenRunning) { return; } else { onTransitionEnd(); } }
            if (autoplay && animating) { stopAutoplayTimer(); }
            panStart = true; if (rafIndex) { caf(rafIndex); rafIndex = null; }
            var $ = getEvent(e); events.emit(isTouchEvent(e) ? 'touchStart' : 'dragStart', info(e)); if (!isTouchEvent(e) && ['img', 'a'].indexOf(getLowerCaseNodeName(getTarget(e))) >= 0) { preventDefaultBehavior(e); }
            lastPosition.x = initPosition.x = $.clientX; lastPosition.y = initPosition.y = $.clientY; if (carousel) { translateInit = parseFloat(container.style[transformAttr].replace(transformPrefix, '')); resetDuration(container, '0s'); }
        }
        function onPanMove(e) {
            if (panStart) {
                var $ = getEvent(e); lastPosition.x = $.clientX; lastPosition.y = $.clientY; if (carousel) { if (!rafIndex) { rafIndex = raf(function () { panUpdate(e); }); } } else {
                    if (moveDirectionExpected === '?') { moveDirectionExpected = getMoveDirectionExpected(); }
                    if (moveDirectionExpected) { preventScroll = true; }
                }
                if ((typeof e.cancelable !== 'boolean' || e.cancelable) && preventScroll) { e.preventDefault(); }
            }
        }
        function panUpdate(e) {
            if (!moveDirectionExpected) { panStart = false; return; }
            caf(rafIndex); if (panStart) { rafIndex = raf(function () { panUpdate(e); }); }
            if (moveDirectionExpected === '?') { moveDirectionExpected = getMoveDirectionExpected(); }
            if (moveDirectionExpected) {
                if (!preventScroll && isTouchEvent(e)) { preventScroll = true; }
                try { if (e.type) { events.emit(isTouchEvent(e) ? 'touchMove' : 'dragMove', info(e)); } } catch (err) { }
                var x = translateInit, dist = getDist(lastPosition, initPosition); if (!horizontal || fixedWidth || autoWidth) { x += dist; x += 'px'; } else { var percentageX = TRANSFORM ? dist * items * 100 / ((viewport + gutter) * slideCountNew) : dist * 100 / (viewport + gutter); x += percentageX; x += '%'; }
                container.style[transformAttr] = transformPrefix + x + transformPostfix;
            }
        }
        function onPanEnd(e) {
            if (panStart) {
                if (rafIndex) { caf(rafIndex); rafIndex = null; }
                if (carousel) { resetDuration(container, ''); }
                panStart = false; var $ = getEvent(e); lastPosition.x = $.clientX; lastPosition.y = $.clientY; var dist = getDist(lastPosition, initPosition); if (Math.abs(dist)) {
                    if (!isTouchEvent(e)) { var target = getTarget(e); addEvents(target, { 'click': function preventClick(e) { preventDefaultBehavior(e); removeEvents(target, { 'click': preventClick }); } }); }
                    if (carousel) {
                        rafIndex = raf(function () {
                            if (horizontal && !autoWidth) { var indexMoved = -dist * items / (viewport + gutter); indexMoved = dist > 0 ? Math.floor(indexMoved) : Math.ceil(indexMoved); index += indexMoved; } else {
                                var moved = -(translateInit + dist); if (moved <= 0) { index = indexMin; } else if (moved >= slidePositions[slideCountNew - 1]) { index = indexMax; } else {
                                    var i = 0; while (i < slideCountNew && moved >= slidePositions[i]) {
                                        index = i; if (moved > slidePositions[i] && dist < 0) { index += 1; }
                                        i++;
                                    }
                                }
                            }
                            render(e, dist); events.emit(isTouchEvent(e) ? 'touchEnd' : 'dragEnd', info(e));
                        });
                    } else { if (moveDirectionExpected) { onControlsClick(e, dist > 0 ? -1 : 1); } }
                }
            }
            if (options.preventScrollOnTouch === 'auto') { preventScroll = false; }
            if (swipeAngle) { moveDirectionExpected = '?'; }
            if (autoplay && !animating) { setAutoplayTimer(); }
        }
        function updateContentWrapperHeight() { var wp = middleWrapper ? middleWrapper : innerWrapper; wp.style.height = slidePositions[index + items] - slidePositions[index] + 'px'; }
        function getPages() { var rough = fixedWidth ? (fixedWidth + gutter) * slideCount / viewport : slideCount / items; return Math.min(Math.ceil(rough), slideCount); }
        function updateNavVisibility() {
            if (!nav || navAsThumbnails) { return; }
            if (pages !== pagesCached) {
                var min = pagesCached, max = pages, fn = showElement; if (pagesCached > pages) { min = pages; max = pagesCached; fn = hideElement; }
                while (min < max) { fn(navItems[min]); min++; }
                pagesCached = pages;
            }
        }
        function info(e) { return { container: container, slideItems: slideItems, navContainer: navContainer, navItems: navItems, controlsContainer: controlsContainer, hasControls: hasControls, prevButton: prevButton, nextButton: nextButton, items: items, slideBy: slideBy, cloneCount: cloneCount, slideCount: slideCount, slideCountNew: slideCountNew, index: index, indexCached: indexCached, displayIndex: getCurrentSlide(), navCurrentIndex: navCurrentIndex, navCurrentIndexCached: navCurrentIndexCached, pages: pages, pagesCached: pagesCached, sheet: sheet, isOn: isOn, event: e || {}, }; }
        return { version: '2.9.3', getInfo: info, events: events, goTo: goTo, play: play, pause: pause, isOn: isOn, updateSliderHeight: updateInnerWrapperHeight, refresh: initSliderTransform, destroy: destroy, rebuild: function () { return tns(extend(options, optionsElements)); } };
    }; return tns;
})();


if (document.querySelector('.lang-icon-header') != null) { document.querySelector(".lang-icon-header").addEventListener("click", (e) => { const element = document.querySelector(".lang-icon-header"), isOpen = element.dataset.open; if (isOpen == 0) { element.querySelector('.lang-content').style.display = "block"; element.dataset.open = "1"; } else { element.querySelector('.lang-content').style.display = "none"; element.dataset.open = "0"; } }); document.addEventListener("mouseup", (e) => { const element = document.querySelector(".lang-icon-header"); if (!element.contains(e.target)) { element.querySelector('.lang-content').style.display = "none"; element.dataset.open = "0"; } }); }
document.addEventListener("scroll", (e) => { var pageOffset = window.pageYOffset, screenWidth = screen.width; setTimeout(function () { if (pageOffset == 0) { if (document.querySelector("header").classList.contains("full-width")) { document.querySelector("header").classList.remove("full-width"); } } else { if (!document.querySelector("header").classList.contains("full-width")) { document.querySelector("header").classList.add("full-width"); } } }, 100); }); if (document.querySelector('header.new') != null) { document.querySelectorAll("header .item.big-dropdown .big-menu-new").forEach(elem => elem.addEventListener("mouseleave", (e) => { e.target.style.display = "none"; e.target.parentElement.querySelector('.big-dropdown-label').classList.remove("active"); document.querySelector("header .outer").classList.remove("open"); })); document.querySelectorAll("header .item.big-dropdown").forEach(elem => elem.addEventListener("click", (e) => { if (e.target.classList.contains("big-dropdown-label")) { const isActive = e.target.classList.contains("active") ? true : false; document.querySelectorAll('header .item.big-dropdown .big-menu-new').forEach(function (e) { e.style.display = "none"; e.parentElement.querySelector('.big-dropdown-label').classList.remove("active"); }); if (!isActive) { document.querySelector("header .outer").classList.add("open"); e.target.classList.add("active"); var bigMenu = e.target.parentElement, holder = bigMenu.querySelector('.big-menu-new'); holder.style.display = (window.getComputedStyle(holder).display === 'block') ? 'none' : 'block'; } else { e.target.classList.remove("active"); document.querySelector("header .outer").classList.remove("open"); } } })); }
document.querySelector("header .mobile-menu").addEventListener("click", (e) => { const navigation = document.querySelector('header .navigation'), actBtn = document.querySelector('header .mobile-menu button'), isVisible = (window.getComputedStyle(navigation).display === 'block') ? true : false; navigation.style.display = (isVisible) ? 'none' : 'block'; if (!isVisible) { document.querySelector("body").classList.add("no-scroll"); actBtn.innerHTML = '<i class="far fa-times"></i>'; } else { document.querySelector("body").classList.remove("no-scroll"); actBtn.innerHTML = '<i class="fas fa-bars"></i>'; } }); document.querySelectorAll(".open-chat").forEach(elem => elem.addEventListener("click", (e) => { tidioChatApi.open(); e.preventDefault(); return false; })); if (window.location.hash) { var hash = window.location.hash.substring(1); if (document.querySelector('.kb-page .card[data-id=' + hash + ']') != null) { document.querySelectorAll('.kb-page .card').forEach(function (e) { e.classList.remove("active"); }); document.querySelector('.kb-page .card[data-id=' + hash + ']').classList.add("active"); document.querySelector('.kb-view').style.display = "none"; document.querySelector('.kb-view[data-id="' + hash + '"]').style.display = "block"; } }
document.querySelectorAll('.vector svg image').forEach(function (e) { if (e.dataset.href) { e.setAttribute("href", e.dataset.href); e.removeAttribute("data-href"); } }); document.querySelectorAll(".kb-view .item .question").forEach(kb => kb.addEventListener("click", (e) => {
    const item = e.target.closest('.item'), parentHolder = item.parentElement; if (!parentHolder.classList.contains("visible-all")) { parentHolder.querySelectorAll('.item .toggle i').forEach(function (e) { e.className = "far fa-plus"; }); }
    if (!item.classList.contains("active")) {
        if (!parentHolder.classList.contains("visible-all")) { parentHolder.querySelectorAll('.item').forEach(function (e) { e.classList.remove("active"); }); }
        item.classList.add("active"); item.querySelector(".toggle i").className = "far fa-minus"; scrollToElem(item);
    } else { item.classList.remove("active"); item.querySelector(".toggle i").className = "far fa-plus"; }
})); document.querySelectorAll(".kb-page .card").forEach(kb => kb.addEventListener("click", (e) => { const item = e.target.closest('.card'); document.querySelectorAll('.kb-page .card').forEach(function (e) { e.classList.remove("active"); }); document.querySelectorAll('.kb-page .kb-view').forEach(function (e) { e.style.display = "none"; }); item.classList.add("active"); document.querySelector('.kb-page .kb-view[data-id="' + item.getAttribute("data-id") + '"]').style.display = "block"; window.location.hash = item.getAttribute("data-id"); const element = item.closest('.kb-page').querySelector('.illustration'); scrollToElem(element); })); document.querySelectorAll(".scrollTo").forEach(el => el.addEventListener("click", (e) => {
    const target = e.target.closest('.scrollTo'); if (target.hasAttribute("data-id")) { const element = document.getElementById(target.dataset.id); scrollToElem(element); }
    e.preventDefault();
})); function scrollToElem(element) { const headerOffset = 90, offsetPosition = element.offsetTop - headerOffset; window.scrollTo({ top: offsetPosition, behavior: "smooth" }); }
document.querySelectorAll(".scrollTop").forEach(el => el.addEventListener("click", (e) => { const element = document.querySelector('body'), headerOffset = 90, offsetPosition = element.offsetTop - headerOffset; window.scrollTo({ top: offsetPosition, behavior: "smooth" }); document.querySelector('.sh-area .scrollTop').style.display = "none"; e.preventDefault(); })); if (document.querySelector('.reviews-area .btn-holder button') != null) { document.querySelector(".reviews-area .btn-holder button").addEventListener("click", (e) => { const element = document.querySelector('.reviews-area'); element.querySelector('.cr-outer').style.cssText = "max-height:none;overflow:inherit;"; element.querySelector('.fade-holder').style.display = "none"; element.querySelector('.btn-holder').style.display = "none"; }); }
document.querySelectorAll('.reviews-area .stars i').forEach(elem => elem.addEventListener("click", (e) => { const rating = e.target.dataset.score, element = document.querySelector('.reviews-area'); element.querySelector('.stars').classList.add("selected"); element.querySelectorAll('.stars i').forEach(function (e) { e.classList.remove("active"); }); e.target.classList.add("active"); element.querySelector('.value span').innerText = rating; element.querySelector('input[name="rating"]').value = rating; element.querySelector('button[type="submit"]').removeAttribute("disabled"); })); document.querySelectorAll("form:not(.non-ajax):not(.preload-area)").forEach(elem => elem.addEventListener("submit", (e) => {
    const target = e.target, formData = new FormData(target), handler = target.dataset.handler, holder = target, actBtn = target.querySelector('button[type="submit"]'), placeholder = actBtn.innerHTML; actBtn.setAttribute("disabled", "disabled"); actBtn.innerHTML = '<i class="fad fa-spinner-third fa-spin"></i>' + actBtn.dataset.preload; if (handler && formData) {
        fetch("https://socialplus.net/" + handler + ".php", { method: 'POST', body: formData }).then(response => response.json()).then(data => {
            actBtn.removeAttribute("disabled"); actBtn.innerHTML = placeholder; if (data.status == "ok") {
                if (data.next_action.next == "review") {
                    if (formData.has("area")) { const element = document.querySelector('.write-review'); element.querySelector('form').reset(); } else { const element = document.querySelector('.reviews-area .item.write'); element.querySelector('form').reset(); }
                    alert(data.next_action.options.message);
                }
            } else if (data.status == "error") {
                if (!data.swal_config) { alert(data.message); return false; }
                Swal.fire(data.swal_config);
            }
        }).catch(error => { actBtn.removeAttribute("disabled"); actBtn.innerHTML = placeholder; Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong with the request. Please a) try again, b) refresh the page, or c) contact support if this issue persists. Thank you!' }); console.log(error); });
    } else { actBtn.removeAttribute("disabled"); actBtn.innerHTML = placeholder; alert("Request error (2). Please try again or contact support."); console.log("Missing expected parameters."); }
    e.preventDefault(); return false;
})); if (document.querySelector('.carousel.packages') != null) { document.querySelectorAll('.carousel.packages').forEach(function (e) { const sliderTag = e.dataset.name; var slider = tns({ container: '.carousel.packages[data-name="' + sliderTag + '"]', items: 3, mouseDrag: true, navPosition: 'bottom', controlsText: ['', ''], freezable: false, responsive: { 0: { items: 1, edgePadding: 20, nav: true }, 640: { items: 2, edgePadding: 70, nav: false }, 1024: { items: 3, edgePadding: 80, nav: false }, 1250: { items: 3, edgePadding: 130, nav: false } } }); }); }
var deferred = []; function wait(milisec) { return new Promise(resolve => { setTimeout(() => { resolve('') }, milisec); }) }
function freshFetch() { deferred = []; fetch("https://socialplus.net/assets/ajax/live.sales.php").then(response => response.json()).then(data => { data.forEach(obj => { deferred.push(obj); }); handleFetch(); }).catch(error => { }); }
freshFetch(); async function handleFetch() {
    var elem = document.querySelector('.ls-widget'); for (let i = 0; i < deferred.length; ++i) { var obj = deferred[i], rnd = Math.floor(15000 * Math.random()) + 12000; await wait(rnd); elem.querySelector('.region').innerText = obj.geo; elem.querySelector('.time').innerText = obj.time; elem.querySelector('.package').innerHTML = '<a href="https://socialplus.net/' + obj.uri + '">' + obj.name + '</a>'; elem.style.opacity = 1; elem.style.left = "15px"; setTimeout(function () { elem.style.opacity = 0; elem.style.left = "-500px"; }, 4000); }
    freshFetch();
}
document.querySelector(".ls-widget .close button").addEventListener("click", (e) => { var elem = document.querySelector('.ls-widget'); elem.style.opacity = 0; elem.style.left = "-500px"; });


window.FontAwesomeKitConfig = { "asyncLoading": { "enabled": false }, "autoA11y": { "enabled": true }, "baseUrl": "https://ka-p.fontawesome.com", "baseUrlKit": "https://kit.fontawesome.com", "detectConflictsUntil": null, "iconUploads": {}, "id": 38038164, "license": "pro", "method": "css", "minify": { "enabled": true }, "token": "85fe8b7ff6", "uploadsUrl": "https://kit-uploads.fontawesome.com", "v4FontFaceShim": { "enabled": true }, "v4shim": { "enabled": true }, "v5FontFaceShim": { "enabled": false }, "version": "5.15.4" };
!function (t) { "function" == typeof define && define.amd ? define("kit-loader", t) : t() }((function () { "use strict"; function t(e) { return (t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(e) } function e(t, e, n) { return e in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t } function n(t, e) { var n = Object.keys(t); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(t); e && (o = o.filter((function (e) { return Object.getOwnPropertyDescriptor(t, e).enumerable }))), n.push.apply(n, o) } return n } function o(t) { for (var o = 1; o < arguments.length; o++) { var r = null != arguments[o] ? arguments[o] : {}; o % 2 ? n(Object(r), !0).forEach((function (n) { e(t, n, r[n]) })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : n(Object(r)).forEach((function (e) { Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(r, e)) })) } return t } function r(t, e) { return function (t) { if (Array.isArray(t)) return t }(t) || function (t, e) { if ("undefined" == typeof Symbol || !(Symbol.iterator in Object(t))) return; var n = [], o = !0, r = !1, i = void 0; try { for (var c, a = t[Symbol.iterator](); !(o = (c = a.next()).done) && (n.push(c.value), !e || n.length !== e); o = !0); } catch (t) { r = !0, i = t } finally { try { o || null == a.return || a.return() } finally { if (r) throw i } } return n }(t, e) || function (t, e) { if (!t) return; if ("string" == typeof t) return i(t, e); var n = Object.prototype.toString.call(t).slice(8, -1); "Object" === n && t.constructor && (n = t.constructor.name); if ("Map" === n || "Set" === n) return Array.from(t); if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return i(t, e) }(t, e) || function () { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.") }() } function i(t, e) { (null == e || e > t.length) && (e = t.length); for (var n = 0, o = new Array(e); n < e; n++)o[n] = t[n]; return o } function c(t, e) { var n = e && e.addOn || "", o = e && e.baseFilename || t.license + n, r = e && e.minify ? ".min" : "", i = e && e.fileSuffix || t.method, c = e && e.subdir || t.method; return t.baseUrl + "/releases/" + ("latest" === t.version ? "latest" : "v".concat(t.version)) + "/" + c + "/" + o + r + "." + i } function a(t) { return t.baseUrlKit + "/" + t.token + "/" + t.id + "/kit-upload.css" } function u(t, e) { var n = e || ["fa"], o = "." + Array.prototype.join.call(n, ",."), r = t.querySelectorAll(o); Array.prototype.forEach.call(r, (function (e) { var n = e.getAttribute("title"); e.setAttribute("aria-hidden", "true"); var o = !e.nextElementSibling || !e.nextElementSibling.classList.contains("sr-only"); if (n && o) { var r = t.createElement("span"); r.innerHTML = n, r.classList.add("sr-only"), e.parentNode.insertBefore(r, e.nextSibling) } })) } var f, s = function () { }, d = "undefined" != typeof global && void 0 !== global.process && "function" == typeof global.process.emit, l = "undefined" == typeof setImmediate ? setTimeout : setImmediate, h = []; function m() { for (var t = 0; t < h.length; t++)h[t][0](h[t][1]); h = [], f = !1 } function p(t, e) { h.push([t, e]), f || (f = !0, l(m, 0)) } function v(t) { var e = t.owner, n = e._state, o = e._data, r = t[n], i = t.then; if ("function" == typeof r) { n = "fulfilled"; try { o = r(o) } catch (t) { w(i, t) } } y(i, o) || ("fulfilled" === n && b(i, o), "rejected" === n && w(i, o)) } function y(e, n) { var o; try { if (e === n) throw new TypeError("A promises callback cannot return that same promise."); if (n && ("function" == typeof n || "object" === t(n))) { var r = n.then; if ("function" == typeof r) return r.call(n, (function (t) { o || (o = !0, n === t ? g(e, t) : b(e, t)) }), (function (t) { o || (o = !0, w(e, t)) })), !0 } } catch (t) { return o || w(e, t), !0 } return !1 } function b(t, e) { t !== e && y(t, e) || g(t, e) } function g(t, e) { "pending" === t._state && (t._state = "settled", t._data = e, p(S, t)) } function w(t, e) { "pending" === t._state && (t._state = "settled", t._data = e, p(O, t)) } function A(t) { t._then = t._then.forEach(v) } function S(t) { t._state = "fulfilled", A(t) } function O(t) { t._state = "rejected", A(t), !t._handled && d && global.process.emit("unhandledRejection", t._data, t) } function j(t) { global.process.emit("rejectionHandled", t) } function E(t) { if ("function" != typeof t) throw new TypeError("Promise resolver " + t + " is not a function"); if (this instanceof E == !1) throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function."); this._then = [], function (t, e) { function n(t) { w(e, t) } try { t((function (t) { b(e, t) }), n) } catch (t) { n(t) } }(t, this) } E.prototype = { constructor: E, _state: "pending", _then: null, _data: void 0, _handled: !1, then: function (t, e) { var n = { owner: this, then: new this.constructor(s), fulfilled: t, rejected: e }; return !e && !t || this._handled || (this._handled = !0, "rejected" === this._state && d && p(j, this)), "fulfilled" === this._state || "rejected" === this._state ? p(v, n) : this._then.push(n), n.then }, catch: function (t) { return this.then(null, t) } }, E.all = function (t) { if (!Array.isArray(t)) throw new TypeError("You must pass an array to Promise.all()."); return new E((function (e, n) { var o = [], r = 0; function i(t) { return r++, function (n) { o[t] = n, --r || e(o) } } for (var c, a = 0; a < t.length; a++)(c = t[a]) && "function" == typeof c.then ? c.then(i(a), n) : o[a] = c; r || e(o) })) }, E.race = function (t) { if (!Array.isArray(t)) throw new TypeError("You must pass an array to Promise.race()."); return new E((function (e, n) { for (var o, r = 0; r < t.length; r++)(o = t[r]) && "function" == typeof o.then ? o.then(e, n) : e(o) })) }, E.resolve = function (e) { return e && "object" === t(e) && e.constructor === E ? e : new E((function (t) { t(e) })) }, E.reject = function (t) { return new E((function (e, n) { n(t) })) }; var _ = "function" == typeof Promise ? Promise : E; function F(t, e) { var n = e.fetch, o = e.XMLHttpRequest, r = e.token, i = t; return "URLSearchParams" in window ? (i = new URL(t)).searchParams.set("token", r) : i = i + "?token=" + encodeURIComponent(r), i = i.toString(), new _((function (t, e) { if ("function" == typeof n) n(i, { mode: "cors", cache: "default" }).then((function (t) { if (t.ok) return t.text(); throw new Error("") })).then((function (e) { t(e) })).catch(e); else if ("function" == typeof o) { var r = new o; r.addEventListener("loadend", (function () { this.responseText ? t(this.responseText) : e(new Error("")) }));["abort", "error", "timeout"].map((function (t) { r.addEventListener(t, (function () { e(new Error("")) })) })), r.open("GET", i), r.send() } else { e(new Error("")) } })) } function P(t, e, n) { var o = t; return [[/(url\("?)\.\.\/\.\.\/\.\./g, function (t, n) { return "".concat(n).concat(e) }], [/(url\("?)\.\.\/webfonts/g, function (t, o) { return "".concat(o).concat(e, "/releases/v").concat(n, "/webfonts") }], [/(url\("?)https:\/\/kit-free([^.])*\.fontawesome\.com/g, function (t, n) { return "".concat(n).concat(e) }]].forEach((function (t) { var e = r(t, 2), n = e[0], i = e[1]; o = o.replace(n, i) })), o } function C(t, e) { var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function () { }, r = e.document || r, i = u.bind(u, r, ["fa", "fab", "fas", "far", "fal", "fad", "fak"]), f = Object.keys(t.iconUploads || {}).length > 0; t.autoA11y.enabled && n(i); var s = [{ id: "fa-main", addOn: void 0 }]; t.v4shim && t.v4shim.enabled && s.push({ id: "fa-v4-shims", addOn: "-v4-shims" }), t.v5FontFaceShim && t.v5FontFaceShim.enabled && s.push({ id: "fa-v5-font-face", addOn: "-v5-font-face" }), t.v4FontFaceShim && t.v4FontFaceShim.enabled && s.push({ id: "fa-v4-font-face", addOn: "-v4-font-face" }), f && s.push({ id: "fa-kit-upload", customCss: !0 }); var d = s.map((function (n) { return new _((function (r, i) { F(n.customCss ? a(t) : c(t, { addOn: n.addOn, minify: t.minify.enabled }), e).then((function (i) { r(U(i, o(o({}, e), {}, { baseUrl: t.baseUrl, version: t.version, id: n.id, contentFilter: function (t, e) { return P(t, e.baseUrl, e.version) } }))) })).catch(i) })) })); return _.all(d) } function U(t, e) { var n = e.contentFilter || function (t, e) { return t }, o = document.createElement("style"), r = document.createTextNode(n(t, e)); return o.appendChild(r), o.media = "all", e.id && o.setAttribute("id", e.id), e && e.detectingConflicts && e.detectionIgnoreAttr && o.setAttributeNode(document.createAttribute(e.detectionIgnoreAttr)), o } function k(t, e) { e.autoA11y = t.autoA11y.enabled, "pro" === t.license && (e.autoFetchSvg = !0, e.fetchSvgFrom = t.baseUrl + "/releases/" + ("latest" === t.version ? "latest" : "v".concat(t.version)) + "/svgs", e.fetchUploadedSvgFrom = t.uploadsUrl); var n = []; return t.v4shim.enabled && n.push(new _((function (n, r) { F(c(t, { addOn: "-v4-shims", minify: t.minify.enabled }), e).then((function (t) { n(I(t, o(o({}, e), {}, { id: "fa-v4-shims" }))) })).catch(r) }))), n.push(new _((function (n, r) { F(c(t, { minify: t.minify.enabled }), e).then((function (t) { var r = I(t, o(o({}, e), {}, { id: "fa-main" })); n(function (t, e) { var n = e && void 0 !== e.autoFetchSvg ? e.autoFetchSvg : void 0, o = e && void 0 !== e.autoA11y ? e.autoA11y : void 0; void 0 !== o && t.setAttribute("data-auto-a11y", o ? "true" : "false"); n && (t.setAttributeNode(document.createAttribute("data-auto-fetch-svg")), t.setAttribute("data-fetch-svg-from", e.fetchSvgFrom), t.setAttribute("data-fetch-uploaded-svg-from", e.fetchUploadedSvgFrom)); return t }(r, e)) })).catch(r) }))), _.all(n) } function I(t, e) { var n = document.createElement("SCRIPT"), o = document.createTextNode(t); return n.appendChild(o), n.referrerPolicy = "strict-origin", e.id && n.setAttribute("id", e.id), e && e.detectingConflicts && e.detectionIgnoreAttr && n.setAttributeNode(document.createAttribute(e.detectionIgnoreAttr)), n } function L(t) { var e, n = [], o = document, r = o.documentElement.doScroll, i = (r ? /^loaded|^c/ : /^loaded|^i|^c/).test(o.readyState); i || o.addEventListener("DOMContentLoaded", e = function () { for (o.removeEventListener("DOMContentLoaded", e), i = 1; e = n.shift();)e() }), i ? setTimeout(t, 0) : n.push(t) } function T(t) { "undefined" != typeof MutationObserver && new MutationObserver(t).observe(document, { childList: !0, subtree: !0 }) } try { if (window.FontAwesomeKitConfig) { var x = window.FontAwesomeKitConfig, M = { detectingConflicts: x.detectConflictsUntil && new Date <= new Date(x.detectConflictsUntil), detectionIgnoreAttr: "data-fa-detection-ignore", fetch: window.fetch, token: x.token, XMLHttpRequest: window.XMLHttpRequest, document: document }, D = document.currentScript, N = D ? D.parentElement : document.head; (function () { var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; return "js" === t.method ? k(t, e) : "css" === t.method ? C(t, e, (function (t) { L(t), T(t) })) : void 0 })(x, M).then((function (t) { t.map((function (t) { try { N.insertBefore(t, D ? D.nextSibling : null) } catch (e) { N.appendChild(t) } })), M.detectingConflicts && D && L((function () { D.setAttributeNode(document.createAttribute(M.detectionIgnoreAttr)); var t = function (t, e) { var n = document.createElement("script"); return e && e.detectionIgnoreAttr && n.setAttributeNode(document.createAttribute(e.detectionIgnoreAttr)), n.src = c(t, { baseFilename: "conflict-detection", fileSuffix: "js", subdir: "js", minify: t.minify.enabled }), n }(x, M); document.body.appendChild(t) })) })).catch((function (t) { console.error("".concat("Font Awesome Kit:", " ").concat(t)) })) } } catch (t) { console.error("".concat("Font Awesome Kit:", " ").concat(t)) } }));


!function (t) { var e = {}; function n(r) { if (e[r]) return e[r].exports; var o = e[r] = { i: r, l: !1, exports: {} }; return t[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports } n.m = t, n.c = e, n.d = function (t, e, r) { n.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: r }) }, n.r = function (t) { "undefined" !== typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t, "__esModule", { value: !0 }) }, n.t = function (t, e) { if (1 & e && (t = n(t)), 8 & e) return t; if (4 & e && "object" === typeof t && t && t.__esModule) return t; var r = Object.create(null); if (n.r(r), Object.defineProperty(r, "default", { enumerable: !0, value: t }), 2 & e && "string" != typeof t) for (var o in t) n.d(r, o, function (e) { return t[e] }.bind(null, o)); return r }, n.n = function (t) { var e = t && t.__esModule ? function () { return t.default } : function () { return t }; return n.d(e, "a", e), e }, n.o = function (t, e) { return Object.prototype.hasOwnProperty.call(t, e) }, n.p = "https://widget-v4.tidiochat.com/", n.h = "16de068977d2192a3378", n.cn = "render", n(n.s = 220) }([, , , , , , , , function (t, e, n) { (function (e) { var n = function (t) { return t && t.Math == Math && t }; t.exports = n("object" == typeof globalThis && globalThis) || n("object" == typeof window && window) || n("object" == typeof self && self) || n("object" == typeof e && e) || function () { return this }() || Function("return this")() }).call(this, n(13)) }, function (t, e, n) { var r = n(8), o = n(58).f, i = n(24), c = n(31), u = n(60), a = n(131), f = n(87); t.exports = function (t, e) { var n, s, l, d, p, v = t.target, h = t.global, y = t.stat; if (n = h ? r : y ? r[v] || u(v, {}) : (r[v] || {}).prototype) for (s in e) { if (d = e[s], l = t.noTargetGet ? (p = o(n, s)) && p.value : n[s], !f(h ? s : v + (y ? "." : "#") + s, t.forced) && void 0 !== l) { if (typeof d === typeof l) continue; a(d, l) } (t.sham || l && l.sham) && i(d, "sham", !0), c(n, s, d, t) } } }, function (t, e) { t.exports = function (t) { try { return !!t() } catch (e) { return !0 } } }, , function (t, e, n) { var r = n(8), o = n(95), i = n(18), c = n(96), u = n(100), a = n(135), f = o("wks"), s = r.Symbol, l = a ? s : s && s.withoutSetter || c; t.exports = function (t) { return i(f, t) || (u && i(s, t) ? f[t] = s[t] : f[t] = l("Symbol." + t)), f[t] } }, function (t, e) { var n; n = function () { return this }(); try { n = n || new Function("return this")() } catch (r) { "object" === typeof window && (n = window) } t.exports = n }, function (t, e, n) { var r = n(15); t.exports = function (t) { if (!r(t)) throw TypeError(String(t) + " is not an object"); return t } }, function (t, e) { t.exports = function (t) { return "object" === typeof t ? null !== t : "function" === typeof t } }, , , function (t, e) { var n = {}.hasOwnProperty; t.exports = function (t, e) { return n.call(t, e) } }, , , function (t, e, n) { var r = n(10); t.exports = !r((function () { return 7 != Object.defineProperty({}, 1, { get: function () { return 7 } })[1] })) }, function (t, e) { t.exports = function (t) { if (void 0 == t) throw TypeError("Can't call method on " + t); return t } }, function (t, e, n) { var r = n(40), o = Math.min; t.exports = function (t) { return t > 0 ? o(r(t), 9007199254740991) : 0 } }, function (t, e, n) { var r = n(21), o = n(29), i = n(47); t.exports = r ? function (t, e, n) { return o.f(t, e, i(1, n)) } : function (t, e, n) { return t[e] = n, t } }, , function (t, e) { t.exports = function (t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") } }, function (t, e) { function n(t, e) { for (var n = 0; n < e.length; n++) { var r = e[n]; r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r) } } t.exports = function (t, e, r) { return e && n(t.prototype, e), r && n(t, r), t } }, function (t, e, n) { var r = n(9), o = n(8), i = n(67), c = [].slice, u = function (t) { return function (e, n) { var r = arguments.length > 2, o = r ? c.call(arguments, 2) : void 0; return t(r ? function () { ("function" == typeof e ? e : Function(e)).apply(this, o) } : e, n) } }; r({ global: !0, bind: !0, forced: /MSIE .\./.test(i) }, { setTimeout: u(o.setTimeout), setInterval: u(o.setInterval) }) }, function (t, e, n) { var r = n(21), o = n(92), i = n(14), c = n(59), u = Object.defineProperty; e.f = r ? u : function (t, e, n) { if (i(t), e = c(e, !0), i(n), o) try { return u(t, e, n) } catch (r) { } if ("get" in n || "set" in n) throw TypeError("Accessors not supported"); return "value" in n && (t[e] = n.value), t } }, , function (t, e, n) { var r = n(8), o = n(24), i = n(18), c = n(60), u = n(75), a = n(62), f = a.get, s = a.enforce, l = String(String).split("String"); (t.exports = function (t, e, n, u) { var a, f = !!u && !!u.unsafe, d = !!u && !!u.enumerable, p = !!u && !!u.noTargetGet; "function" == typeof n && ("string" != typeof e || i(n, "name") || o(n, "name", e), (a = s(n)).source || (a.source = l.join("string" == typeof e ? e : ""))), t !== r ? (f ? !p && t[e] && (d = !0) : delete t[e], d ? t[e] = n : o(t, e, n)) : d ? t[e] = n : c(e, n) })(Function.prototype, "toString", (function () { return "function" == typeof this && f(this).source || u(this) })) }, function (t, e, n) { "use strict"; var r = n(9), o = n(49); r({ target: "RegExp", proto: !0, forced: /./.exec !== o }, { exec: o }) }, function (t, e, n) { var r = n(22); t.exports = function (t) { return Object(r(t)) } }, function (t, e, n) { var r = n(74), o = n(22); t.exports = function (t) { return r(o(t)) } }, , , , function (t, e) { var n = {}.toString; t.exports = function (t) { return n.call(t).slice(8, -1) } }, , function (t, e) { var n = Math.ceil, r = Math.floor; t.exports = function (t) { return isNaN(t = +t) ? 0 : (t > 0 ? r : n)(t) } }, , , function (t, e, n) { "use strict"; var r = n(9), o = n(10), i = n(64), c = n(15), u = n(33), a = n(23), f = n(88), s = n(99), l = n(65), d = n(12), p = n(66), v = d("isConcatSpreadable"), h = p >= 51 || !o((function () { var t = []; return t[v] = !1, t.concat()[0] !== t })), y = l("concat"), g = function (t) { if (!c(t)) return !1; var e = t[v]; return void 0 !== e ? !!e : i(t) }; r({ target: "Array", proto: !0, forced: !h || !y }, { concat: function (t) { var e, n, r, o, i, c = u(this), l = s(c, 0), d = 0; for (e = -1, r = arguments.length; e < r; e++)if (g(i = -1 === e ? c : arguments[e])) { if (d + (o = a(i.length)) > 9007199254740991) throw TypeError("Maximum allowed index exceeded"); for (n = 0; n < o; n++, d++)n in i && f(l, d, i[n]) } else { if (d >= 9007199254740991) throw TypeError("Maximum allowed index exceeded"); f(l, d++, i) } return l.length = d, l } }) }, , , , function (t, e) { t.exports = function (t, e) { return { enumerable: !(1 & t), configurable: !(2 & t), writable: !(4 & t), value: e } } }, function (t, e, n) { var r = n(133), o = n(8), i = function (t) { return "function" == typeof t ? t : void 0 }; t.exports = function (t, e) { return arguments.length < 2 ? i(r[t]) || i(o[t]) : r[t] && r[t][e] || o[t] && o[t][e] } }, function (t, e, n) { "use strict"; var r = n(101), o = n(113), i = RegExp.prototype.exec, c = String.prototype.replace, u = i, a = function () { var t = /a/, e = /b*/g; return i.call(t, "a"), i.call(e, "a"), 0 !== t.lastIndex || 0 !== e.lastIndex }(), f = o.UNSUPPORTED_Y || o.BROKEN_CARET, s = void 0 !== /()??/.exec("")[1]; (a || s || f) && (u = function (t) { var e, n, o, u, l = this, d = f && l.sticky, p = r.call(l), v = l.source, h = 0, y = t; return d && (-1 === (p = p.replace("y", "")).indexOf("g") && (p += "g"), y = String(t).slice(l.lastIndex), l.lastIndex > 0 && (!l.multiline || l.multiline && "\n" !== t[l.lastIndex - 1]) && (v = "(?: " + v + ")", y = " " + y, h++), n = new RegExp("^(?:" + v + ")", p)), s && (n = new RegExp("^" + v + "$(?!\\s)", p)), a && (e = l.lastIndex), o = i.call(d ? n : l, y), d ? o ? (o.input = o.input.slice(h), o[0] = o[0].slice(h), o.index = l.lastIndex, l.lastIndex += o[0].length) : l.lastIndex = 0 : a && o && (l.lastIndex = l.global ? o.index + o[0].length : e), s && o && o.length > 1 && c.call(o[0], n, (function () { for (u = 1; u < arguments.length - 2; u++)void 0 === arguments[u] && (o[u] = void 0) })), o }), t.exports = u }, , , , , , , , , function (t, e, n) { var r = n(21), o = n(111), i = n(47), c = n(34), u = n(59), a = n(18), f = n(92), s = Object.getOwnPropertyDescriptor; e.f = r ? s : function (t, e) { if (t = c(t), e = u(e, !0), f) try { return s(t, e) } catch (n) { } if (a(t, e)) return i(!o.f.call(t, e), t[e]) } }, function (t, e, n) { var r = n(15); t.exports = function (t, e) { if (!r(t)) return t; var n, o; if (e && "function" == typeof (n = t.toString) && !r(o = n.call(t))) return o; if ("function" == typeof (n = t.valueOf) && !r(o = n.call(t))) return o; if (!e && "function" == typeof (n = t.toString) && !r(o = n.call(t))) return o; throw TypeError("Can't convert object to primitive value") } }, function (t, e, n) { var r = n(8), o = n(24); t.exports = function (t, e) { try { o(r, t, e) } catch (n) { r[t] = e } return e } }, function (t, e, n) { var r = n(8), o = n(60), i = r["__core-js_shared__"] || o("__core-js_shared__", {}); t.exports = i }, function (t, e, n) { var r, o, i, c = n(130), u = n(8), a = n(15), f = n(24), s = n(18), l = n(61), d = n(94), p = n(76), v = u.WeakMap; if (c) { var h = l.state || (l.state = new v), y = h.get, g = h.has, x = h.set; r = function (t, e) { return e.facade = t, x.call(h, t, e), e }, o = function (t) { return y.call(h, t) || {} }, i = function (t) { return g.call(h, t) } } else { var m = d("state"); p[m] = !0, r = function (t, e) { return e.facade = t, f(t, m, e), e }, o = function (t) { return s(t, m) ? t[m] : {} }, i = function (t) { return s(t, m) } } t.exports = { set: r, get: o, has: i, enforce: function (t) { return i(t) ? o(t) : r(t, {}) }, getterFor: function (t) { return function (e) { var n; if (!a(e) || (n = o(e)).type !== t) throw TypeError("Incompatible receiver, " + t + " required"); return n } } } }, function (t, e) { t.exports = !1 }, function (t, e, n) { var r = n(38); t.exports = Array.isArray || function (t) { return "Array" == r(t) } }, function (t, e, n) { var r = n(10), o = n(12), i = n(66), c = o("species"); t.exports = function (t) { return i >= 51 || !r((function () { var e = []; return (e.constructor = {})[c] = function () { return { foo: 1 } }, 1 !== e[t](Boolean).foo })) } }, function (t, e, n) { var r, o, i = n(8), c = n(67), u = i.process, a = u && u.versions, f = a && a.v8; f ? o = (r = f.split("."))[0] + r[1] : c && (!(r = c.match(/Edge\/(\d+)/)) || r[1] >= 74) && (r = c.match(/Chrome\/(\d+)/)) && (o = r[1]), t.exports = o && +o }, function (t, e, n) { var r = n(48); t.exports = r("navigator", "userAgent") || "" }, , , , , , , function (t, e, n) { var r = n(10), o = n(38), i = "".split; t.exports = r((function () { return !Object("z").propertyIsEnumerable(0) })) ? function (t) { return "String" == o(t) ? i.call(t, "") : Object(t) } : Object }, function (t, e, n) { var r = n(61), o = Function.toString; "function" != typeof r.inspectSource && (r.inspectSource = function (t) { return o.call(t) }), t.exports = r.inspectSource }, function (t, e) { t.exports = {} }, function (t, e, n) { "use strict"; n(32); var r = n(31), o = n(10), i = n(12), c = n(49), u = n(24), a = i("species"), f = !o((function () { var t = /./; return t.exec = function () { var t = []; return t.groups = { a: "7" }, t }, "7" !== "".replace(t, "$<a>") })), s = "$0" === "a".replace(/./, "$0"), l = i("replace"), d = !!/./[l] && "" === /./[l]("a", "$0"), p = !o((function () { var t = /(?:)/, e = t.exec; t.exec = function () { return e.apply(this, arguments) }; var n = "ab".split(t); return 2 !== n.length || "a" !== n[0] || "b" !== n[1] })); t.exports = function (t, e, n, l) { var v = i(t), h = !o((function () { var e = {}; return e[v] = function () { return 7 }, 7 != ""[t](e) })), y = h && !o((function () { var e = !1, n = /a/; return "split" === t && ((n = {}).constructor = {}, n.constructor[a] = function () { return n }, n.flags = "", n[v] = /./[v]), n.exec = function () { return e = !0, null }, n[v](""), !e })); if (!h || !y || "replace" === t && (!f || !s || d) || "split" === t && !p) { var g = /./[v], x = n(v, ""[t], (function (t, e, n, r, o) { return e.exec === c ? h && !o ? { done: !0, value: g.call(e, n, r) } : { done: !0, value: t.call(n, e, r) } : { done: !1 } }), { REPLACE_KEEPS_$0: s, REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: d }), m = x[0], E = x[1]; r(String.prototype, t, m), r(RegExp.prototype, v, 2 == e ? function (t, e) { return E.call(t, this, e) } : function (t) { return E.call(t, this) }) } l && u(RegExp.prototype[v], "sham", !0) } }, function (t, e, n) { var r = n(38), o = n(49); t.exports = function (t, e) { var n = t.exec; if ("function" === typeof n) { var i = n.call(t, e); if ("object" !== typeof i) throw TypeError("RegExp exec method returned something other than an Object or null"); return i } if ("RegExp" !== r(t)) throw TypeError("RegExp#exec called on incompatible receiver"); return o.call(t, e) } }, , , , , , , , function (t, e, n) { var r = n(40), o = Math.max, i = Math.min; t.exports = function (t, e) { var n = r(t); return n < 0 ? o(n + e, 0) : i(n, e) } }, function (t, e, n) { var r = n(10), o = /#|\.prototype\./, i = function (t, e) { var n = u[c(t)]; return n == f || n != a && ("function" == typeof e ? r(e) : !!e) }, c = i.normalize = function (t) { return String(t).replace(o, ".").toLowerCase() }, u = i.data = {}, a = i.NATIVE = "N", f = i.POLYFILL = "P"; t.exports = i }, function (t, e, n) { "use strict"; var r = n(59), o = n(29), i = n(47); t.exports = function (t, e, n) { var c = r(e); c in t ? o.f(t, c, i(0, n)) : t[c] = n } }, function (t, e, n) { "use strict"; var r = n(77), o = n(14), i = n(23), c = n(40), u = n(22), a = n(102), f = n(136), s = n(78), l = Math.max, d = Math.min; r("replace", 2, (function (t, e, n, r) { var p = r.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE, v = r.REPLACE_KEEPS_$0, h = p ? "$" : "$0"; return [function (n, r) { var o = u(this), i = void 0 == n ? void 0 : n[t]; return void 0 !== i ? i.call(n, o, r) : e.call(String(o), n, r) }, function (t, r) { if (!p && v || "string" === typeof r && -1 === r.indexOf(h)) { var u = n(e, t, this, r); if (u.done) return u.value } var y = o(t), g = String(this), x = "function" === typeof r; x || (r = String(r)); var m = y.global; if (m) { var E = y.unicode; y.lastIndex = 0 } for (var w = []; ;) { var _ = s(y, g); if (null === _) break; if (w.push(_), !m) break; "" === String(_[0]) && (y.lastIndex = a(g, i(y.lastIndex), E)) } for (var b, S = "", O = 0, T = 0; T < w.length; T++) { _ = w[T]; for (var P = String(_[0]), k = l(d(c(_.index), g.length), 0), C = [], I = 1; I < _.length; I++)C.push(void 0 === (b = _[I]) ? b : String(b)); var j = _.groups; if (x) { var R = [P].concat(C, k, g); void 0 !== j && R.push(j); var A = String(r.apply(void 0, R)) } else A = f(P, g, k, C, j, r); k >= O && (S += g.slice(O, k) + A, O = k + P.length) } return S + g.slice(O) }] })) }, , , function (t, e, n) { var r = n(21), o = n(10), i = n(93); t.exports = !r && !o((function () { return 7 != Object.defineProperty(i("div"), "a", { get: function () { return 7 } }).a })) }, function (t, e, n) { var r = n(8), o = n(15), i = r.document, c = o(i) && o(i.createElement); t.exports = function (t) { return c ? i.createElement(t) : {} } }, function (t, e, n) { var r = n(95), o = n(96), i = r("keys"); t.exports = function (t) { return i[t] || (i[t] = o(t)) } }, function (t, e, n) { var r = n(63), o = n(61); (t.exports = function (t, e) { return o[t] || (o[t] = void 0 !== e ? e : {}) })("versions", []).push({ version: "3.8.3", mode: r ? "pure" : "global", copyright: "\xa9 2021 Denis Pushkarev (zloirock.ru)" }) }, function (t, e) { var n = 0, r = Math.random(); t.exports = function (t) { return "Symbol(" + String(void 0 === t ? "" : t) + ")_" + (++n + r).toString(36) } }, function (t, e, n) { var r = n(34), o = n(23), i = n(86), c = function (t) { return function (e, n, c) { var u, a = r(e), f = o(a.length), s = i(c, f); if (t && n != n) { for (; f > s;)if ((u = a[s++]) != u) return !0 } else for (; f > s; s++)if ((t || s in a) && a[s] === n) return t || s || 0; return !t && -1 } }; t.exports = { includes: c(!0), indexOf: c(!1) } }, function (t, e) { t.exports = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"] }, function (t, e, n) { var r = n(15), o = n(64), i = n(12)("species"); t.exports = function (t, e) { var n; return o(t) && ("function" != typeof (n = t.constructor) || n !== Array && !o(n.prototype) ? r(n) && null === (n = n[i]) && (n = void 0) : n = void 0), new (void 0 === n ? Array : n)(0 === e ? 0 : e) } }, function (t, e, n) { var r = n(10); t.exports = !!Object.getOwnPropertySymbols && !r((function () { return !String(Symbol()) })) }, function (t, e, n) { "use strict"; var r = n(14); t.exports = function () { var t = r(this), e = ""; return t.global && (e += "g"), t.ignoreCase && (e += "i"), t.multiline && (e += "m"), t.dotAll && (e += "s"), t.unicode && (e += "u"), t.sticky && (e += "y"), e } }, function (t, e, n) { "use strict"; var r = n(114).charAt; t.exports = function (t, e, n) { return e + (n ? r(t, e).length : 1) } }, , , , function (t, e, n) { var r = n(112), o = n(98).concat("length", "prototype"); e.f = Object.getOwnPropertyNames || function (t) { return r(t, o) } }, , , , , function (t, e, n) { "use strict"; var r = {}.propertyIsEnumerable, o = Object.getOwnPropertyDescriptor, i = o && !r.call({ 1: 2 }, 1); e.f = i ? function (t) { var e = o(this, t); return !!e && e.enumerable } : r }, function (t, e, n) { var r = n(18), o = n(34), i = n(97).indexOf, c = n(76); t.exports = function (t, e) { var n, u = o(t), a = 0, f = []; for (n in u) !r(c, n) && r(u, n) && f.push(n); for (; e.length > a;)r(u, n = e[a++]) && (~i(f, n) || f.push(n)); return f } }, function (t, e, n) { "use strict"; var r = n(10); function o(t, e) { return RegExp(t, e) } e.UNSUPPORTED_Y = r((function () { var t = o("a", "y"); return t.lastIndex = 2, null != t.exec("abcd") })), e.BROKEN_CARET = r((function () { var t = o("^r", "gy"); return t.lastIndex = 2, null != t.exec("str") })) }, function (t, e, n) { var r = n(40), o = n(22), i = function (t) { return function (e, n) { var i, c, u = String(o(e)), a = r(n), f = u.length; return a < 0 || a >= f ? t ? "" : void 0 : (i = u.charCodeAt(a)) < 55296 || i > 56319 || a + 1 === f || (c = u.charCodeAt(a + 1)) < 56320 || c > 57343 ? t ? u.charAt(a) : i : t ? u.slice(a, a + 2) : c - 56320 + (i - 55296 << 10) + 65536 } }; t.exports = { codeAt: i(!1), charAt: i(!0) } }, , , , , , , , , , , , , , , function (t, e, n) { (function (t) { ("undefined" !== typeof window ? window : "undefined" !== typeof t ? t : "undefined" !== typeof self ? self : {}).SENTRY_RELEASE = { id: "1.135.0" } }).call(this, n(13)) }, function (t, e, n) { var r = n(8), o = n(75), i = r.WeakMap; t.exports = "function" === typeof i && /native code/.test(o(i)) }, function (t, e, n) { var r = n(18), o = n(132), i = n(58), c = n(29); t.exports = function (t, e) { for (var n = o(e), u = c.f, a = i.f, f = 0; f < n.length; f++) { var s = n[f]; r(t, s) || u(t, s, a(e, s)) } } }, function (t, e, n) { var r = n(48), o = n(106), i = n(134), c = n(14); t.exports = r("Reflect", "ownKeys") || function (t) { var e = o.f(c(t)), n = i.f; return n ? e.concat(n(t)) : e } }, function (t, e, n) { var r = n(8); t.exports = r }, function (t, e) { e.f = Object.getOwnPropertySymbols }, function (t, e, n) { var r = n(100); t.exports = r && !Symbol.sham && "symbol" == typeof Symbol.iterator }, function (t, e, n) { var r = n(33), o = Math.floor, i = "".replace, c = /\$([$&'`]|\d\d?|<[^>]*>)/g, u = /\$([$&'`]|\d\d?)/g; t.exports = function (t, e, n, a, f, s) { var l = n + t.length, d = a.length, p = u; return void 0 !== f && (f = r(f), p = c), i.call(s, p, (function (r, i) { var c; switch (i.charAt(0)) { case "$": return "$"; case "&": return t; case "`": return e.slice(0, n); case "'": return e.slice(l); case "<": c = f[i.slice(1, -1)]; break; default: var u = +i; if (0 === u) return r; if (u > d) { var s = o(u / 10); return 0 === s ? r : s <= d ? void 0 === a[s - 1] ? i.charAt(1) : a[s - 1] + i.charAt(1) : r } c = a[u - 1] }return void 0 === c ? "" : c })) } }, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , function (t, e, n) { n(129), t.exports = n(221) }, function (t, e, n) { "use strict"; n.r(e); n(43), n(32), n(89), n(28); !function () { var t = "boolean" === typeof PRODUCTION_DEVELOPMENT_BUILD && !0 === PRODUCTION_DEVELOPMENT_BUILD, e = t ? "".concat("https://widget-v4.tidiochat.com/", "/dist/") : "https://widget-v4.tidiochat.com/"; var r = function () { var t = [], e = !1, n = !1; function r() { if (!e) { e = !0; for (var n = 0; n < t.length; n += 1)t[n].fn.call(window, t[n].ctx); t = [] } } function o() { "complete" === document.readyState && r() } return function (i, c) { if ("function" !== typeof i) throw new TypeError("callback for docReady(fn) must be a function"); return e ? (setTimeout((function () { i(c) }), 1), !1) : (t.push({ fn: i, ctx: c }), "complete" === document.readyState || !document.attachEvent && "interactive" === document.readyState ? setTimeout(r, 1) : n || (document.addEventListener ? (document.addEventListener("DOMContentLoaded", r, !1), window.addEventListener("load", r, !1)) : (document.attachEvent("onreadystatechange", o), window.attachEvent("onload", r)), n = !0), !0) } }(); function o(t) { !function (t, e) { var n = t.contentWindow.document, r = n.createElement("script"); r.src = e, r.async = !0, n.body.appendChild(r) }(t, "".concat(e.replace(/\/$/, ""), "/").concat("1_135_0", "/static/js/widget.").concat(n.h, ".js")) } var i = n(222).default; window.tidioChatApi = new i, r((function () { return setTimeout((function () { var r = window.document.getElementById("tidio-chat-code"), i = window.Shopify && !0 === window.Shopify.designMode, c = /MSIE|Trident/.test(window.navigator.userAgent); if (r || i || c) return !1; !function (t, e, n) { var r = e.createElement("iframe"), o = !1; r.onload = function () { o || (n(r), o = !0) }, r.id = t, r.style.display = "none", r.title = "Tidio Chat code", e.body.appendChild(r), setTimeout((function () { o || (n(r), o = !0) }), 1e3) }("tidio-chat-code", window.document, (function (r) { t && window.__REDUX_DEVTOOLS_EXTENSION__ && (r.contentWindow.__REDUX_DEVTOOLS_EXTENSION__ = window.__REDUX_DEVTOOLS_EXTENSION__, r.contentWindow.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__), function (t) { var r = "//localhost:3000/static/js/WidgetIframe.js"; r = "".concat(e).concat("1_135_0", "/static/js/chunk-WidgetIframe-").concat(n.h, ".js"); var o = t.createElement("link"); o.rel = "preload", o.as = "script", o.href = r, t.head.appendChild(o) }(r.contentWindow.document), function (t) { var n = "".concat(e, "/tururu.mp3"), r = t.createElement("audio"); r.preload = "metadata", r.src = n, t.head.appendChild(r) }(r.contentWindow.document), function (t) { var e = t.createElement("link"); e.rel = "preconnect", e.href = "https://socket.tidio.co:443", t.head.appendChild(e) }(r.contentWindow.document), function (t) { var e = t.createElement("link"); e.rel = "preconnect", e.href = "https://fonts.gstatic.com", e.crossOrigin = "", t.head.appendChild(e); var n = t.createElement("link"); n.rel = "preconnect", n.href = "https://fonts.googleapis.com", t.head.appendChild(n); var r = t.createElement("link"); r.rel = "preconnect", r.href = "https://cdnjs.cloudflare.com", t.head.appendChild(r) }(r.contentWindow.document), r.contentWindow.tidioChatApi = window.tidioChatApi, "requestIdleCallback" in window ? window.requestIdleCallback((function () { o(r) }), { timeout: 5e3 }) : setTimeout((function () { o(r) }), 0) })) }), 0) })) }() }, function (t, e, n) { "use strict"; n.r(e), n.d(e, "default", (function () { return u })); n(43); var r = n(26), o = n.n(r), i = n(27), c = n.n(i), u = function () { function t() { o()(this, t), this.eventPrefix = "tidioChat-", this.readyEventWasFired = !1, this.queue = [], this.popUpOpen = this.open, this.popUpHide = this.close, this.chatDisplay = this.display, this.setColorPallete = this.setColorPalette } return c()(t, [{ key: "on", value: function (t, e) { "ready" === t && this.readyEventWasFired ? e() : document.addEventListener("".concat(this.eventPrefix).concat(t), (function (t) { e(t.data) }), !1) } }, { key: "trigger", value: function (t, e) { if ("ready" === t && this.readyEventWasFired) return !1; try { var n = document.createEvent("Event"); if (n.initEvent("".concat(this.eventPrefix).concat(t), !0, !0), n.data = e, document.dispatchEvent(n), "ready" === t) { if (this.readyEventWasFired) return !1; this._flushAllFromQueue(), this.readyEventWasFired = !0 } } catch (r) { return !1 } return !0 } }, { key: "method", value: function (t, e) { return "ready" === t && "function" === typeof e ? (this.on("ready", e), !0) : (this[t] && this[t](e), !0) } }, { key: "_addToQueue", value: function (t) { var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null; this.queue.push({ method: t, args: e }) } }, { key: "_flushAllFromQueue", value: function () { for (; 0 !== this.queue.length;) { var t = this.queue.shift(), e = t.method, n = t.args; this[e].apply(null, n) } } }, { key: "open", value: function () { this._addToQueue("open") } }, { key: "close", value: function () { this._addToQueue("close") } }, { key: "display", value: function () { var t = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0]; this._addToQueue("display", [t]) } }, { key: "show", value: function () { this._addToQueue("show") } }, { key: "hide", value: function () { this._addToQueue("hide") } }, { key: "setColorPalette", value: function (t) { this._addToQueue("setColorPalette", [t]) } }, { key: "track", value: function () { var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "track", e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function () { }; this._addToQueue("track", [t, e, n]) } }, { key: "messageFromVisitor", value: function (t) { this._addToQueue("messageFromVisitor", [t]) } }, { key: "messageFromOperator", value: function (t) { var e = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1]; this._addToQueue("messageFromOperator", [t, e]) } }, { key: "setVisitorData", value: function (t, e) { this._addToQueue("setVisitorData", [t, e]) } }, { key: "setContactProperties", value: function (t, e) { this._addToQueue("setContactProperties", [t, e]) } }, { key: "addVisitorTags", value: function (t, e) { this._addToQueue("addVisitorTags", [t, e]) } }, { key: "setFeatures", value: function () { var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}; this._addToQueue("setFeatures", [t]) } }]), t }() }]);



if (document.querySelector('.lang-icon-header') != null) { document.querySelector(".lang-icon-header").addEventListener("click", (e) => { const element = document.querySelector(".lang-icon-header"), isOpen = element.dataset.open; if (isOpen == 0) { element.querySelector('.lang-content').style.display = "block"; element.dataset.open = "1"; } else { element.querySelector('.lang-content').style.display = "none"; element.dataset.open = "0"; } }); document.addEventListener("mouseup", (e) => { const element = document.querySelector(".lang-icon-header"); if (!element.contains(e.target)) { element.querySelector('.lang-content').style.display = "none"; element.dataset.open = "0"; } }); }
document.addEventListener("scroll", (e) => { var pageOffset = window.pageYOffset, screenWidth = screen.width; setTimeout(function () { if (pageOffset == 0) { if (document.querySelector("header").classList.contains("full-width")) { document.querySelector("header").classList.remove("full-width"); } } else { if (!document.querySelector("header").classList.contains("full-width")) { document.querySelector("header").classList.add("full-width"); } } }, 100); }); if (document.querySelector('header.new') != null) { document.querySelectorAll("header .item.big-dropdown .big-menu-new").forEach(elem => elem.addEventListener("mouseleave", (e) => { e.target.style.display = "none"; e.target.parentElement.querySelector('.big-dropdown-label').classList.remove("active"); document.querySelector("header .outer").classList.remove("open"); })); document.querySelectorAll("header .item.big-dropdown").forEach(elem => elem.addEventListener("click", (e) => { if (e.target.classList.contains("big-dropdown-label")) { const isActive = e.target.classList.contains("active") ? true : false; document.querySelectorAll('header .item.big-dropdown .big-menu-new').forEach(function (e) { e.style.display = "none"; e.parentElement.querySelector('.big-dropdown-label').classList.remove("active"); }); if (!isActive) { document.querySelector("header .outer").classList.add("open"); e.target.classList.add("active"); var bigMenu = e.target.parentElement, holder = bigMenu.querySelector('.big-menu-new'); holder.style.display = (window.getComputedStyle(holder).display === 'block') ? 'none' : 'block'; } else { e.target.classList.remove("active"); document.querySelector("header .outer").classList.remove("open"); } } })); }
document.querySelector("header .mobile-menu").addEventListener("click", (e) => { const navigation = document.querySelector('header .navigation'), actBtn = document.querySelector('header .mobile-menu button'), isVisible = (window.getComputedStyle(navigation).display === 'block') ? true : false; navigation.style.display = (isVisible) ? 'none' : 'block'; if (!isVisible) { document.querySelector("body").classList.add("no-scroll"); actBtn.innerHTML = '<i class="far fa-times"></i>'; } else { document.querySelector("body").classList.remove("no-scroll"); actBtn.innerHTML = '<i class="fas fa-bars"></i>'; } }); document.querySelectorAll(".open-chat").forEach(elem => elem.addEventListener("click", (e) => { tidioChatApi.open(); e.preventDefault(); return false; })); if (window.location.hash) { var hash = window.location.hash.substring(1); if (document.querySelector('.kb-page .card[data-id=' + hash + ']') != null) { document.querySelectorAll('.kb-page .card').forEach(function (e) { e.classList.remove("active"); }); document.querySelector('.kb-page .card[data-id=' + hash + ']').classList.add("active"); document.querySelector('.kb-view').style.display = "none"; document.querySelector('.kb-view[data-id="' + hash + '"]').style.display = "block"; } }
document.querySelectorAll('.vector svg image').forEach(function (e) { if (e.dataset.href) { e.setAttribute("href", e.dataset.href); e.removeAttribute("data-href"); } }); document.querySelectorAll(".kb-view .item .question").forEach(kb => kb.addEventListener("click", (e) => {
    const item = e.target.closest('.item'), parentHolder = item.parentElement; if (!parentHolder.classList.contains("visible-all")) { parentHolder.querySelectorAll('.item .toggle i').forEach(function (e) { e.className = "far fa-plus"; }); }
    if (!item.classList.contains("active")) {
        if (!parentHolder.classList.contains("visible-all")) { parentHolder.querySelectorAll('.item').forEach(function (e) { e.classList.remove("active"); }); }
        item.classList.add("active"); item.querySelector(".toggle i").className = "far fa-minus"; scrollToElem(item);
    } else { item.classList.remove("active"); item.querySelector(".toggle i").className = "far fa-plus"; }
})); document.querySelectorAll(".kb-page .card").forEach(kb => kb.addEventListener("click", (e) => { const item = e.target.closest('.card'); document.querySelectorAll('.kb-page .card').forEach(function (e) { e.classList.remove("active"); }); document.querySelectorAll('.kb-page .kb-view').forEach(function (e) { e.style.display = "none"; }); item.classList.add("active"); document.querySelector('.kb-page .kb-view[data-id="' + item.getAttribute("data-id") + '"]').style.display = "block"; window.location.hash = item.getAttribute("data-id"); const element = item.closest('.kb-page').querySelector('.illustration'); scrollToElem(element); })); document.querySelectorAll(".scrollTo").forEach(el => el.addEventListener("click", (e) => {
    const target = e.target.closest('.scrollTo'); if (target.hasAttribute("data-id")) { const element = document.getElementById(target.dataset.id); scrollToElem(element); }
    e.preventDefault();
})); function scrollToElem(element) { const headerOffset = 90, offsetPosition = element.offsetTop - headerOffset; window.scrollTo({ top: offsetPosition, behavior: "smooth" }); }
document.querySelectorAll(".scrollTop").forEach(el => el.addEventListener("click", (e) => { const element = document.querySelector('body'), headerOffset = 90, offsetPosition = element.offsetTop - headerOffset; window.scrollTo({ top: offsetPosition, behavior: "smooth" }); document.querySelector('.sh-area .scrollTop').style.display = "none"; e.preventDefault(); })); if (document.querySelector('.reviews-area .btn-holder button') != null) { document.querySelector(".reviews-area .btn-holder button").addEventListener("click", (e) => { const element = document.querySelector('.reviews-area'); element.querySelector('.cr-outer').style.cssText = "max-height:none;overflow:inherit;"; element.querySelector('.fade-holder').style.display = "none"; element.querySelector('.btn-holder').style.display = "none"; }); }
document.querySelectorAll('.reviews-area .stars i').forEach(elem => elem.addEventListener("click", (e) => { const rating = e.target.dataset.score, element = document.querySelector('.reviews-area'); element.querySelector('.stars').classList.add("selected"); element.querySelectorAll('.stars i').forEach(function (e) { e.classList.remove("active"); }); e.target.classList.add("active"); element.querySelector('.value span').innerText = rating; element.querySelector('input[name="rating"]').value = rating; element.querySelector('button[type="submit"]').removeAttribute("disabled"); })); document.querySelectorAll("form:not(.non-ajax):not(.preload-area)").forEach(elem => elem.addEventListener("submit", (e) => {
    const target = e.target, formData = new FormData(target), handler = target.dataset.handler, holder = target, actBtn = target.querySelector('button[type="submit"]'), placeholder = actBtn.innerHTML; actBtn.setAttribute("disabled", "disabled"); actBtn.innerHTML = '<i class="fad fa-spinner-third fa-spin"></i>' + actBtn.dataset.preload; if (handler && formData) {
        fetch("https://socialplus.net/" + handler + ".php", { method: 'POST', body: formData }).then(response => response.json()).then(data => {
            actBtn.removeAttribute("disabled"); actBtn.innerHTML = placeholder; if (data.status == "ok") {
                if (data.next_action.next == "review") {
                    if (formData.has("area")) { const element = document.querySelector('.write-review'); element.querySelector('form').reset(); } else { const element = document.querySelector('.reviews-area .item.write'); element.querySelector('form').reset(); }
                    alert(data.next_action.options.message);
                }
            } else if (data.status == "error") {
                if (!data.swal_config) { alert(data.message); return false; }
                Swal.fire(data.swal_config);
            }
        }).catch(error => { actBtn.removeAttribute("disabled"); actBtn.innerHTML = placeholder; Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong with the request. Please a) try again, b) refresh the page, or c) contact support if this issue persists. Thank you!' }); console.log(error); });
    } else { actBtn.removeAttribute("disabled"); actBtn.innerHTML = placeholder; alert("Request error (2). Please try again or contact support."); console.log("Missing expected parameters."); }
    e.preventDefault(); return false;
})); if (document.querySelector('.carousel.packages') != null) { document.querySelectorAll('.carousel.packages').forEach(function (e) { const sliderTag = e.dataset.name; var slider = tns({ container: '.carousel.packages[data-name="' + sliderTag + '"]', items: 3, mouseDrag: true, navPosition: 'bottom', controlsText: ['', ''], freezable: false, responsive: { 0: { items: 1, edgePadding: 20, nav: true }, 640: { items: 2, edgePadding: 70, nav: false }, 1024: { items: 3, edgePadding: 80, nav: false }, 1250: { items: 3, edgePadding: 130, nav: false } } }); }); }
var deferred = []; function wait(milisec) { return new Promise(resolve => { setTimeout(() => { resolve('') }, milisec); }) }
function freshFetch() { deferred = []; fetch("https://socialplus.net/assets/ajax/live.sales.php").then(response => response.json()).then(data => { data.forEach(obj => { deferred.push(obj); }); handleFetch(); }).catch(error => { }); }
freshFetch(); async function handleFetch() {
    var elem = document.querySelector('.ls-widget'); for (let i = 0; i < deferred.length; ++i) { var obj = deferred[i], rnd = Math.floor(15000 * Math.random()) + 12000; await wait(rnd); elem.querySelector('.region').innerText = obj.geo; elem.querySelector('.time').innerText = obj.time; elem.querySelector('.package').innerHTML = '<a href="https://socialplus.net/' + obj.uri + '">' + obj.name + '</a>'; elem.style.opacity = 1; elem.style.left = "15px"; setTimeout(function () { elem.style.opacity = 0; elem.style.left = "-500px"; }, 4000); }
    freshFetch();
}
document.querySelector(".ls-widget .close button").addEventListener("click", (e) => { var elem = document.querySelector('.ls-widget'); elem.style.opacity = 0; elem.style.left = "-500px"; });



window.FontAwesomeKitConfig = { "asyncLoading": { "enabled": false }, "autoA11y": { "enabled": true }, "baseUrl": "https://ka-p.fontawesome.com", "baseUrlKit": "https://kit.fontawesome.com", "detectConflictsUntil": null, "iconUploads": {}, "id": 38038164, "license": "pro", "method": "css", "minify": { "enabled": true }, "token": "85fe8b7ff6", "uploadsUrl": "https://kit-uploads.fontawesome.com", "v4FontFaceShim": { "enabled": true }, "v4shim": { "enabled": true }, "v5FontFaceShim": { "enabled": false }, "version": "5.15.4" };
!function (t) { "function" == typeof define && define.amd ? define("kit-loader", t) : t() }((function () { "use strict"; function t(e) { return (t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(e) } function e(t, e, n) { return e in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t } function n(t, e) { var n = Object.keys(t); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(t); e && (o = o.filter((function (e) { return Object.getOwnPropertyDescriptor(t, e).enumerable }))), n.push.apply(n, o) } return n } function o(t) { for (var o = 1; o < arguments.length; o++) { var r = null != arguments[o] ? arguments[o] : {}; o % 2 ? n(Object(r), !0).forEach((function (n) { e(t, n, r[n]) })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : n(Object(r)).forEach((function (e) { Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(r, e)) })) } return t } function r(t, e) { return function (t) { if (Array.isArray(t)) return t }(t) || function (t, e) { if ("undefined" == typeof Symbol || !(Symbol.iterator in Object(t))) return; var n = [], o = !0, r = !1, i = void 0; try { for (var c, a = t[Symbol.iterator](); !(o = (c = a.next()).done) && (n.push(c.value), !e || n.length !== e); o = !0); } catch (t) { r = !0, i = t } finally { try { o || null == a.return || a.return() } finally { if (r) throw i } } return n }(t, e) || function (t, e) { if (!t) return; if ("string" == typeof t) return i(t, e); var n = Object.prototype.toString.call(t).slice(8, -1); "Object" === n && t.constructor && (n = t.constructor.name); if ("Map" === n || "Set" === n) return Array.from(t); if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return i(t, e) }(t, e) || function () { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.") }() } function i(t, e) { (null == e || e > t.length) && (e = t.length); for (var n = 0, o = new Array(e); n < e; n++)o[n] = t[n]; return o } function c(t, e) { var n = e && e.addOn || "", o = e && e.baseFilename || t.license + n, r = e && e.minify ? ".min" : "", i = e && e.fileSuffix || t.method, c = e && e.subdir || t.method; return t.baseUrl + "/releases/" + ("latest" === t.version ? "latest" : "v".concat(t.version)) + "/" + c + "/" + o + r + "." + i } function a(t) { return t.baseUrlKit + "/" + t.token + "/" + t.id + "/kit-upload.css" } function u(t, e) { var n = e || ["fa"], o = "." + Array.prototype.join.call(n, ",."), r = t.querySelectorAll(o); Array.prototype.forEach.call(r, (function (e) { var n = e.getAttribute("title"); e.setAttribute("aria-hidden", "true"); var o = !e.nextElementSibling || !e.nextElementSibling.classList.contains("sr-only"); if (n && o) { var r = t.createElement("span"); r.innerHTML = n, r.classList.add("sr-only"), e.parentNode.insertBefore(r, e.nextSibling) } })) } var f, s = function () { }, d = "undefined" != typeof global && void 0 !== global.process && "function" == typeof global.process.emit, l = "undefined" == typeof setImmediate ? setTimeout : setImmediate, h = []; function m() { for (var t = 0; t < h.length; t++)h[t][0](h[t][1]); h = [], f = !1 } function p(t, e) { h.push([t, e]), f || (f = !0, l(m, 0)) } function v(t) { var e = t.owner, n = e._state, o = e._data, r = t[n], i = t.then; if ("function" == typeof r) { n = "fulfilled"; try { o = r(o) } catch (t) { w(i, t) } } y(i, o) || ("fulfilled" === n && b(i, o), "rejected" === n && w(i, o)) } function y(e, n) { var o; try { if (e === n) throw new TypeError("A promises callback cannot return that same promise."); if (n && ("function" == typeof n || "object" === t(n))) { var r = n.then; if ("function" == typeof r) return r.call(n, (function (t) { o || (o = !0, n === t ? g(e, t) : b(e, t)) }), (function (t) { o || (o = !0, w(e, t)) })), !0 } } catch (t) { return o || w(e, t), !0 } return !1 } function b(t, e) { t !== e && y(t, e) || g(t, e) } function g(t, e) { "pending" === t._state && (t._state = "settled", t._data = e, p(S, t)) } function w(t, e) { "pending" === t._state && (t._state = "settled", t._data = e, p(O, t)) } function A(t) { t._then = t._then.forEach(v) } function S(t) { t._state = "fulfilled", A(t) } function O(t) { t._state = "rejected", A(t), !t._handled && d && global.process.emit("unhandledRejection", t._data, t) } function j(t) { global.process.emit("rejectionHandled", t) } function E(t) { if ("function" != typeof t) throw new TypeError("Promise resolver " + t + " is not a function"); if (this instanceof E == !1) throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function."); this._then = [], function (t, e) { function n(t) { w(e, t) } try { t((function (t) { b(e, t) }), n) } catch (t) { n(t) } }(t, this) } E.prototype = { constructor: E, _state: "pending", _then: null, _data: void 0, _handled: !1, then: function (t, e) { var n = { owner: this, then: new this.constructor(s), fulfilled: t, rejected: e }; return !e && !t || this._handled || (this._handled = !0, "rejected" === this._state && d && p(j, this)), "fulfilled" === this._state || "rejected" === this._state ? p(v, n) : this._then.push(n), n.then }, catch: function (t) { return this.then(null, t) } }, E.all = function (t) { if (!Array.isArray(t)) throw new TypeError("You must pass an array to Promise.all()."); return new E((function (e, n) { var o = [], r = 0; function i(t) { return r++, function (n) { o[t] = n, --r || e(o) } } for (var c, a = 0; a < t.length; a++)(c = t[a]) && "function" == typeof c.then ? c.then(i(a), n) : o[a] = c; r || e(o) })) }, E.race = function (t) { if (!Array.isArray(t)) throw new TypeError("You must pass an array to Promise.race()."); return new E((function (e, n) { for (var o, r = 0; r < t.length; r++)(o = t[r]) && "function" == typeof o.then ? o.then(e, n) : e(o) })) }, E.resolve = function (e) { return e && "object" === t(e) && e.constructor === E ? e : new E((function (t) { t(e) })) }, E.reject = function (t) { return new E((function (e, n) { n(t) })) }; var _ = "function" == typeof Promise ? Promise : E; function F(t, e) { var n = e.fetch, o = e.XMLHttpRequest, r = e.token, i = t; return "URLSearchParams" in window ? (i = new URL(t)).searchParams.set("token", r) : i = i + "?token=" + encodeURIComponent(r), i = i.toString(), new _((function (t, e) { if ("function" == typeof n) n(i, { mode: "cors", cache: "default" }).then((function (t) { if (t.ok) return t.text(); throw new Error("") })).then((function (e) { t(e) })).catch(e); else if ("function" == typeof o) { var r = new o; r.addEventListener("loadend", (function () { this.responseText ? t(this.responseText) : e(new Error("")) }));["abort", "error", "timeout"].map((function (t) { r.addEventListener(t, (function () { e(new Error("")) })) })), r.open("GET", i), r.send() } else { e(new Error("")) } })) } function P(t, e, n) { var o = t; return [[/(url\("?)\.\.\/\.\.\/\.\./g, function (t, n) { return "".concat(n).concat(e) }], [/(url\("?)\.\.\/webfonts/g, function (t, o) { return "".concat(o).concat(e, "/releases/v").concat(n, "/webfonts") }], [/(url\("?)https:\/\/kit-free([^.])*\.fontawesome\.com/g, function (t, n) { return "".concat(n).concat(e) }]].forEach((function (t) { var e = r(t, 2), n = e[0], i = e[1]; o = o.replace(n, i) })), o } function C(t, e) { var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function () { }, r = e.document || r, i = u.bind(u, r, ["fa", "fab", "fas", "far", "fal", "fad", "fak"]), f = Object.keys(t.iconUploads || {}).length > 0; t.autoA11y.enabled && n(i); var s = [{ id: "fa-main", addOn: void 0 }]; t.v4shim && t.v4shim.enabled && s.push({ id: "fa-v4-shims", addOn: "-v4-shims" }), t.v5FontFaceShim && t.v5FontFaceShim.enabled && s.push({ id: "fa-v5-font-face", addOn: "-v5-font-face" }), t.v4FontFaceShim && t.v4FontFaceShim.enabled && s.push({ id: "fa-v4-font-face", addOn: "-v4-font-face" }), f && s.push({ id: "fa-kit-upload", customCss: !0 }); var d = s.map((function (n) { return new _((function (r, i) { F(n.customCss ? a(t) : c(t, { addOn: n.addOn, minify: t.minify.enabled }), e).then((function (i) { r(U(i, o(o({}, e), {}, { baseUrl: t.baseUrl, version: t.version, id: n.id, contentFilter: function (t, e) { return P(t, e.baseUrl, e.version) } }))) })).catch(i) })) })); return _.all(d) } function U(t, e) { var n = e.contentFilter || function (t, e) { return t }, o = document.createElement("style"), r = document.createTextNode(n(t, e)); return o.appendChild(r), o.media = "all", e.id && o.setAttribute("id", e.id), e && e.detectingConflicts && e.detectionIgnoreAttr && o.setAttributeNode(document.createAttribute(e.detectionIgnoreAttr)), o } function k(t, e) { e.autoA11y = t.autoA11y.enabled, "pro" === t.license && (e.autoFetchSvg = !0, e.fetchSvgFrom = t.baseUrl + "/releases/" + ("latest" === t.version ? "latest" : "v".concat(t.version)) + "/svgs", e.fetchUploadedSvgFrom = t.uploadsUrl); var n = []; return t.v4shim.enabled && n.push(new _((function (n, r) { F(c(t, { addOn: "-v4-shims", minify: t.minify.enabled }), e).then((function (t) { n(I(t, o(o({}, e), {}, { id: "fa-v4-shims" }))) })).catch(r) }))), n.push(new _((function (n, r) { F(c(t, { minify: t.minify.enabled }), e).then((function (t) { var r = I(t, o(o({}, e), {}, { id: "fa-main" })); n(function (t, e) { var n = e && void 0 !== e.autoFetchSvg ? e.autoFetchSvg : void 0, o = e && void 0 !== e.autoA11y ? e.autoA11y : void 0; void 0 !== o && t.setAttribute("data-auto-a11y", o ? "true" : "false"); n && (t.setAttributeNode(document.createAttribute("data-auto-fetch-svg")), t.setAttribute("data-fetch-svg-from", e.fetchSvgFrom), t.setAttribute("data-fetch-uploaded-svg-from", e.fetchUploadedSvgFrom)); return t }(r, e)) })).catch(r) }))), _.all(n) } function I(t, e) { var n = document.createElement("SCRIPT"), o = document.createTextNode(t); return n.appendChild(o), n.referrerPolicy = "strict-origin", e.id && n.setAttribute("id", e.id), e && e.detectingConflicts && e.detectionIgnoreAttr && n.setAttributeNode(document.createAttribute(e.detectionIgnoreAttr)), n } function L(t) { var e, n = [], o = document, r = o.documentElement.doScroll, i = (r ? /^loaded|^c/ : /^loaded|^i|^c/).test(o.readyState); i || o.addEventListener("DOMContentLoaded", e = function () { for (o.removeEventListener("DOMContentLoaded", e), i = 1; e = n.shift();)e() }), i ? setTimeout(t, 0) : n.push(t) } function T(t) { "undefined" != typeof MutationObserver && new MutationObserver(t).observe(document, { childList: !0, subtree: !0 }) } try { if (window.FontAwesomeKitConfig) { var x = window.FontAwesomeKitConfig, M = { detectingConflicts: x.detectConflictsUntil && new Date <= new Date(x.detectConflictsUntil), detectionIgnoreAttr: "data-fa-detection-ignore", fetch: window.fetch, token: x.token, XMLHttpRequest: window.XMLHttpRequest, document: document }, D = document.currentScript, N = D ? D.parentElement : document.head; (function () { var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}; return "js" === t.method ? k(t, e) : "css" === t.method ? C(t, e, (function (t) { L(t), T(t) })) : void 0 })(x, M).then((function (t) { t.map((function (t) { try { N.insertBefore(t, D ? D.nextSibling : null) } catch (e) { N.appendChild(t) } })), M.detectingConflicts && D && L((function () { D.setAttributeNode(document.createAttribute(M.detectionIgnoreAttr)); var t = function (t, e) { var n = document.createElement("script"); return e && e.detectionIgnoreAttr && n.setAttributeNode(document.createAttribute(e.detectionIgnoreAttr)), n.src = c(t, { baseFilename: "conflict-detection", fileSuffix: "js", subdir: "js", minify: t.minify.enabled }), n }(x, M); document.body.appendChild(t) })) })).catch((function (t) { console.error("".concat("Font Awesome Kit:", " ").concat(t)) })) } } catch (t) { console.error("".concat("Font Awesome Kit:", " ").concat(t)) } }));