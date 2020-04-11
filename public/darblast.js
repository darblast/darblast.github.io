;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Darblast = factory();
  }
}(this, function() {
var Darblast;
(function (Darblast) {
    class Frame {
        constructor(source, width, height) {
            this.source = source;
            this.width = width;
            this.height = height;
        }
        static fromImage(image) {
            return new Frame(image, image.width, image.height);
        }
        static fromVideo(video) {
            return new Frame(video, video.videoWidth, video.videoHeight);
        }
        draw(context) {
            context.drawImage(this.source, 0, 0, this.width, this.height);
        }
    }
    Darblast.Frame = Frame;
    class Canvas {
        constructor(canvasElement) {
            this.element = canvasElement;
            const context = canvasElement.getContext('2d');
            if (context) {
                this.context = context;
            }
            else {
                throw new Error('failed to initialize the HTML5 canvas');
            }
        }
        get width() {
            return this.element.width;
        }
        get height() {
            return this.element.height;
        }
    }
    Darblast.Canvas = Canvas;
})(Darblast || (Darblast = {})); // namespace Darblast
const Frame = Darblast.Frame;
const Canvas = Darblast.Canvas;
/// <reference path="Graphics.ts" />
var Darblast;
(function (Darblast) {
    class Animation {
        constructor(frames, frameDuration, x0, y0) {
            if (frames.length < 1) {
                throw new Error('there must be at least one frame');
            }
            if (frameDuration < 1) {
                throw new Error(`invalid frame duration: ${frameDuration} -- must be a whole positive number`);
            }
            this.frames = frames;
            this.frameDuration = frameDuration;
            this.x0 = x0;
            this.y0 = y0;
            this.width = this.frames[0].width;
            this.height = this.frames[0].height;
            if (this.frames.some(frame => frame.width !== this.width || frame.height !== this.height, this)) {
                throw new Error('inconsistent frame sizes');
            }
        }
        getFrame(t0, t) {
            const i = Math.floor((t - t0) / this.frameDuration);
            return this.frames[i % this.frames.length];
        }
    }
    Darblast.Animation = Animation;
    class Character {
        constructor(name, animations, defaultState = 'default') {
            this.animations = Object.create(null);
            if (!(defaultState in animations)) {
                throw new Error(`invalid state: ${JSON.stringify(defaultState)}`);
            }
            this.name = name;
            this.defaultState = defaultState;
            for (var state in animations) {
                if (animations.hasOwnProperty(state)) {
                    this.animations[state] = animations[state];
                }
            }
        }
        static createStatic(name, source, x0 = 0, y0 = 0) {
            return new Character(name, {
                'default': new Darblast.Animation([source], 1, 0, 0),
            }, 'default');
        }
        get states() {
            return Object.keys(this.animations);
        }
        isValidState(state) {
            return state in this.animations;
        }
    }
    Darblast.Character = Character;
})(Darblast || (Darblast = {})); // namespace Darblast
const Character = Darblast.Character;
var Darblast;
(function (Darblast) {
    class View {
        constructor(matrix) {
            this.x = 0;
            this.y = 0;
            if (matrix.length !== 3 || matrix.some(row => row.length !== 3)) {
                throw Error('invalid matrix size, must be 3x3');
            }
            this.matrix = matrix;
        }
    }
    Darblast.View = View;
})(Darblast || (Darblast = {})); // namespace Darblast
const View = Darblast.View;
class IdGenerator {
    constructor() {
        this._nextId = 0;
        this._stash = [];
    }
    claim() {
        if (this._stash.length > 0) {
            return this._stash.pop();
        }
        else {
            return this._nextId++;
        }
    }
    release(id) {
        this._stash.push(id);
    }
}
var Darblast;
(function (Darblast) {
    class Heap {
        constructor(compare) {
            this._data = [];
            this._compare = compare;
        }
        get size() {
            return this._data.length;
        }
        get isEmpty() {
            return !this._data.length;
        }
        get height() {
            return Math.ceil(Math.log2(this._data.length + 1));
        }
        get top() {
            if (this._data.length) {
                return this._data[0];
            }
            else {
                throw new Error('empty heap');
            }
        }
        _compareElements(i, j) {
            return this._compare(this._data[i], this._data[j]);
        }
        _swap(i, j) {
            const temp = this._data[i];
            this._data[i] = this._data[j];
            this._data[j] = temp;
        }
        push(element) {
            var i = this._data.length;
            this._data.push(element);
            var j = Math.floor((i - 1) / 2);
            while (i > 0 && this._compareElements(i, j)) {
                this._swap(i, j);
                i = j;
                j = Math.floor((i - 1) / 2);
            }
        }
        _siftDown(i) {
            const j = i * 2 + 1;
            const k = i * 2 + 2;
            if (j < this._data.length) {
                if (k >= this._data.length || this._compareElements(j, k)) {
                    if (this._compareElements(j, i)) {
                        this._swap(i, j);
                        return j;
                    }
                }
                else if (k < this._data.length && this._compareElements(k, i)) {
                    this._swap(i, k);
                    return k;
                }
            }
            return -1;
        }
        pop() {
            if (this._data.length) {
                const element = this._data[0];
                this._data[0] = this._data[this._data.length - 1];
                this._data.length--;
                for (var i = 0; i >= 0; i = this._siftDown(i)) { }
                return element;
            }
            else {
                throw new Error('empty heap');
            }
        }
        clear() {
            this._data.length = 0;
        }
    }
    Darblast.Heap = Heap;
})(Darblast || (Darblast = {})); // namespace Darblast
const Heap = Darblast.Heap;
/// <reference path="IdGenerator.ts" />
/// <reference path="View.ts" />
/// <reference path="Character.ts" />
/// <reference path="Heap.ts" />
class ElementImpl {
    constructor(tree, character, state, i, j, k) {
        this._timestamp = Date.now();
        this.visible = true;
        this.opacity = 1;
        // transformation matrix
        this._m00 = 1;
        this._m01 = 0;
        this._m02 = 0;
        this._m10 = 0;
        this._m11 = 1;
        this._m12 = 0;
        this.treeHeight = 1;
        this.leftChild = null;
        this.rightChild = null;
        this._tree = tree;
        this.id = ElementImpl._idGenerator.claim();
        this.character = character;
        this._state = state;
        this._i = i;
        this._j = j;
        this._k = k;
        this._project();
    }
    get state() {
        return this._state;
    }
    set state(value) {
        if (value in this.character.animations) {
            const currentAnimation = this.animation;
            this._state = value;
            const nextAnimation = this.animation;
            if (nextAnimation.width !== currentAnimation.width ||
                nextAnimation.height !== currentAnimation.height) {
                this._project();
            }
        }
        else {
            throw new Error(`invalid state: ${JSON.stringify(value)}`);
        }
    }
    get animation() {
        return this.character.animations[this._state];
    }
    _project() {
        this._tree.remove(this);
        const animation = this.animation;
        var m = this._tree.view.matrix;
        this._x = animation.x0 + this._i * m[0][0] + this._j * m[0][1] + this._k * m[0][2];
        this._y = animation.y0 + this._i * m[1][0] + this._j * m[1][1] + this._k * m[1][2];
        const width = animation.width;
        const height = animation.height;
        const x0 = this._x;
        const x1 = this._x + width;
        const y0 = this._y;
        const y1 = this._y + height;
        const x00 = Math.round(this._m00 * x0 + this._m01 * y0 + this._m02);
        const y00 = Math.round(this._m00 * x0 + this._m01 * y0 + this._m02);
        const x01 = Math.round(this._m00 * x1 + this._m01 * y0 + this._m02);
        const y01 = Math.round(this._m00 * x1 + this._m01 * y0 + this._m02);
        const x10 = Math.round(this._m00 * x0 + this._m01 * y1 + this._m02);
        const y10 = Math.round(this._m00 * x0 + this._m01 * y1 + this._m02);
        const x11 = Math.round(this._m00 * x1 + this._m01 * y1 + this._m02);
        const y11 = Math.round(this._m00 * x1 + this._m01 * y1 + this._m02);
        this._x0 = Math.min(x00, x01, x10, x11);
        this._y0 = Math.min(y00, y01, y10, y11);
        this._x1 = Math.max(x00, x01, x10, x11);
        this._y1 = Math.max(y00, y01, y10, y11);
        this._z = this._i * m[2][0] + this._j * m[2][1] + this._k * m[2][2];
        this._tree.insert(this);
    }
    get i() {
        return this._i;
    }
    set i(value) {
        this._i = value;
        this._project();
    }
    get j() {
        return this._j;
    }
    set j(value) {
        this._j = value;
        this._project();
    }
    get k() {
        return this._k;
    }
    set k(value) {
        this._k = value;
        this._project();
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get width() {
        return this.animation.width;
    }
    get height() {
        return this.animation.height;
    }
    moveTo(i, j, k) {
        this._i = i;
        this._j = j;
        this._k = k;
        this._project();
    }
    moveBy(di, dj, dk) {
        this._i += di;
        this._j += dj;
        this._k += dk;
        this._project();
    }
    get x0() {
        return this._x0;
    }
    get y0() {
        return this._y0;
    }
    get x1() {
        return this._x1;
    }
    get y1() {
        return this._y1;
    }
    get z() {
        return this._z;
    }
    setTransform(m00, m01, m02, m10, m11, m12) {
        this._m00 = m00;
        this._m01 = m01;
        this._m02 = m02;
        this._m10 = m10;
        this._m11 = m11;
        this._m12 = m12;
    }
    transform(m00, m01, m02, m10, m11, m12) {
        this._m00 = this._m00 * m00 + this._m01 * m10;
        this._m01 = this._m00 * m01 + this._m01 * m11;
        this._m02 = this._m00 * m02 + this._m01 * m12 + this._m02;
        this._m10 = this._m10 * m00 + this._m11 * m10;
        this._m11 = this._m10 * m01 + this._m11 * m11;
        this._m12 = this._m10 * m02 + this._m11 * m12 + this._m12;
    }
    resetTransform() {
        this._m00 = 1;
        this._m01 = 0;
        this._m02 = 0;
        this._m10 = 0;
        this._m11 = 1;
        this._m12 = 0;
    }
    getFrame(t) {
        return this.animation.getFrame(this._timestamp, t);
    }
    draw(context, t) {
        if (this.visible) {
            context.globalAlpha = this.opacity;
            context.setTransform(this._m00, this._m10, this._m01, this._m11, this._m02, this._m12);
            this.getFrame(t).draw(context);
        }
    }
    remove() {
        this._tree.remove(this);
    }
}
ElementImpl._idGenerator = new IdGenerator();
class RenderContext {
    constructor() {
        this._heap = new Heap(function (first, second) {
            if (first.z < second.z) {
                return true;
            }
            else if (first.z > second.z) {
                return false;
            }
            else {
                return first.id < second.id;
            }
        });
    }
    _queueLeft(parent) {
        const element = parent.leftChild;
        if (element) {
            if (element.x1 < this._x0) {
                if (parent.x1 >= this._x0) {
                    this._queueRight(element);
                }
            }
            else if (element.x1 >= this._x1) {
                this._queueLeft(element);
            }
            else if (element.y1 < this._y0) {
                this._queueLeft(element);
                if (parent.x1 > element.x1 || parent.y1 >= this._y0) {
                    this._queueRight(element);
                }
            }
            else if (element.y1 >= this._y1) {
                this._queueLeft(element);
                if (parent.x1 > element.x1) {
                    this._queueRight(element);
                }
            }
            else {
                this._queueLeft(element);
                this._heap.push(element);
                this._queueRight(element);
            }
        }
    }
    _queueRight(parent) {
        const element = parent.rightChild;
        if (element) {
            if (element.x1 < this._x0) {
                this._queueRight(element);
            }
            else if (element.x1 >= this._x1) {
                if (parent.x1 < this._x1) {
                    this._queueLeft(element);
                }
            }
            else if (element.y1 < this._y0) {
                if (parent.x1 < element.x1) {
                    this._queueLeft(element);
                }
                this._queueRight(element);
            }
            else if (element.y1 >= this._y1) {
                if (parent.x1 < element.x1 || parent.y1 < this._y1) {
                    this._queueLeft(element);
                }
                this._queueRight(element);
            }
            else {
                this._queueLeft(element);
                this._heap.push(element);
                this._queueRight(element);
            }
        }
    }
    _queue(element) {
        if (element) {
            if (element.x1 < this._x0) {
                this._queueRight(element);
            }
            else if (element.x1 >= this._x1) {
                this._queueLeft(element);
            }
            else {
                this._queueLeft(element);
                if (element.y1 >= this._y0 && element.y1 < this._y1) {
                    this._heap.push(element);
                }
                this._queueRight(element);
            }
        }
    }
    _render() {
        while (!this._heap.isEmpty) {
            this._heap.pop().draw(this._context, this._timestamp);
        }
    }
    render(context, x0, y0, x1, y1, root, timestamp) {
        this._context = context;
        this._x0 = x0;
        this._y0 = y0;
        this._x1 = x1;
        this._y1 = y1;
        this._timestamp = timestamp;
        this._heap.clear();
        this._queue(root);
        this._render();
    }
}
class ElementTree {
    constructor(view) {
        this._root = null;
        this._renderContext = new RenderContext();
        this.view = view;
    }
    _compare(first, second) {
        if (first.x0 < second.x0) {
            return -1;
        }
        else if (first.x0 > second.x0) {
            return 1;
        }
        else if (first.y0 < second.y0) {
            return -1;
        }
        else if (first.y0 > second.y0) {
            return 1;
        }
        else if (first.id < second.id) {
            return -1;
        }
        else if (first.id > second.id) {
            return 1;
        }
        else {
            return 0;
        }
    }
    _getHeight(element) {
        if (element) {
            return element.treeHeight;
        }
        else {
            return 0;
        }
    }
    _updateHeight(element) {
        element.treeHeight = 1 + Math.max(this._getHeight(element.leftChild), this._getHeight(element.rightChild));
    }
    _rebalanceHeavyLeft(root) {
        if (this._getHeight(root.leftChild) > this._getHeight(root.rightChild) + 1) {
            const left = root.leftChild;
            root.leftChild = left.rightChild;
            left.rightChild = root;
            this._updateHeight(root);
            this._updateHeight(left);
            return left;
        }
        else {
            this._updateHeight(root);
            return root;
        }
    }
    _rebalanceHeavyRight(root) {
        if (this._getHeight(root.rightChild) > this._getHeight(root.leftChild) + 1) {
            const right = root.rightChild;
            root.rightChild = right.leftChild;
            right.leftChild = root;
            this._updateHeight(root);
            this._updateHeight(right);
            return right;
        }
        else {
            this._updateHeight(root);
            return root;
        }
    }
    _insert(root, element) {
        if (root) {
            const cmp = this._compare(root, element);
            if (cmp < 0) {
                root.leftChild = this._insert(root.leftChild, element);
                return this._rebalanceHeavyLeft(root);
            }
            else if (cmp > 0) {
                root.rightChild = this._insert(root.rightChild, element);
                return this._rebalanceHeavyRight(root);
            }
            else {
                return element;
            }
        }
        else {
            element.treeHeight = 1;
            element.leftChild = null;
            element.rightChild = null;
            return element;
        }
    }
    insert(element) {
        this._root = this._insert(this._root, element);
    }
    _remove(root, element) {
        if (root) {
            const cmp = this._compare(root, element);
            if (cmp < 0) {
                root.leftChild = this._remove(root.leftChild, element);
                return this._rebalanceHeavyRight(root);
            }
            else if (cmp > 0) {
                root.rightChild = this._remove(root.rightChild, element);
                return this._rebalanceHeavyLeft(root);
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
    remove(element) {
        this._root = this._remove(this._root, element);
        element.treeHeight = 1;
        element.leftChild = null;
        element.rightChild = null;
    }
    render(context, x0, y0, x1, y1, timestamp) {
        this._renderContext.render(context, x0, y0, x1, y1, this._root, timestamp);
    }
}
/// <reference path="Character.ts" />
/// <reference path="View.ts" />
/// <reference path="Elements.ts" />
var Darblast;
(function (Darblast) {
    class ElementManager {
        constructor(view) {
            this._characters = [];
            this._view = view;
            this._elements = new ElementTree(view);
        }
        render(canvas, t, parallax) {
            // TODO
        }
    }
    Darblast.ElementManager = ElementManager;
})(Darblast || (Darblast = {})); // namespace Darblast
const ElementManager = Darblast.ElementManager;
var Darblast;
(function (Darblast) {
    class Keyboard {
        constructor(element) {
            this._state = Object.create(null);
            this._handlers = Object.create(null);
            this._element = element;
            this._element.addEventListener('keydown', this._onKeyDown.bind(this), false);
            this._element.addEventListener('keyup', this._onKeyUp.bind(this), false);
        }
        _onKeyDown(event) {
            const key = event.charCode || event.keyCode;
            if (!this._state[key]) {
                this._state[key] = true;
                if (this._handlers[key]) {
                    this._handlers[key](key);
                }
            }
        }
        _onKeyUp(event) {
            this._state[event.charCode || event.keyCode] = false;
        }
        isPressed(key) {
            return !!this._state[key];
        }
        on(key, handler) {
            this._handlers[key] = handler;
            return this;
        }
        off(key) {
            delete this._handlers[key];
            return this;
        }
    }
    Darblast.Keyboard = Keyboard;
})(Darblast || (Darblast = {})); // namespace Darblast
/// <reference path="View.ts" />
/// <reference path="ElementManager.ts" />
/// <reference path="Graphics.ts" />
var Darblast;
(function (Darblast) {
    class DefaultLayer {
        constructor(view) {
            this.enabled = true;
            this.parallax = {
                x: 1,
                y: 1,
            };
            this._view = view;
            this._elements = new Darblast.ElementManager(view);
        }
        render(canvas, t) {
            if (this.enabled) {
                this._elements.render(canvas, t, this.parallax);
            }
        }
    }
    Darblast.DefaultLayer = DefaultLayer;
})(Darblast || (Darblast = {})); // namespace Darblast
var Darblast;
(function (Darblast) {
    class Loader {
        static loadImage(url) {
            return new Promise((resolve, reject) => {
                const image = new Image();
                image.onload = () => {
                    image.onload = null;
                    image.onerror = null;
                    resolve(image);
                };
                image.onerror = () => {
                    image.onload = null;
                    image.onerror = null;
                    reject(`error loading ${url}`);
                };
                image.src = url;
            });
        }
        static loadImages(urls) {
            return Promise.all(urls.map(url => Loader.loadImage(url)));
        }
        static loadSound(url) {
            return new Promise((resolve, reject) => {
                const audio = new Audio(url);
                audio.oncanplaythrough = () => {
                    audio.oncanplaythrough = null;
                    audio.onerror = null;
                    resolve(audio);
                };
                audio.onerror = () => {
                    audio.oncanplaythrough = null;
                    audio.onerror = null;
                    reject(`error loading ${url}`);
                };
                audio.load();
            });
        }
        static loadSounds(urls) {
            return Promise.all(urls.map(url => Loader.loadSound(url)));
        }
    }
    Darblast.Loader = Loader;
})(Darblast || (Darblast = {})); // namespace Darblast
/// <reference path="Loader.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Darblast;
(function (Darblast) {
    class Pool {
        constructor(audio) {
            audio.addEventListener('ended', Pool._resetElement);
            this._elements = [audio];
        }
        static _resetElement(event) {
            if (event.target) {
                (event.target).currentTime = 0;
            }
        }
        play() {
            return __awaiter(this, void 0, void 0, function* () {
                for (var i = 0; i < this._elements.length; i++) {
                    if (!this._elements[i].currentTime) {
                        yield this._elements[i].play();
                        return;
                    }
                }
                const newElement = (this._elements[0].cloneNode(false));
                newElement.addEventListener('ended', Pool._resetElement);
                this._elements.push(newElement);
                yield newElement.play();
            });
        }
    }
    class Sound {
        constructor(basePath, names) {
            this._pools = Object.create(null);
            this._initialize(basePath, names);
        }
        _initialize(basePath, names) {
            return __awaiter(this, void 0, void 0, function* () {
                basePath = basePath.replace(/\/$/, '');
                const elements = yield Darblast.Loader.loadSounds(names.map(name => `${basePath}/${name}`));
                names.forEach((name, index) => {
                    const strippedName = name.replace(/\.[^.\/]+$/, '');
                    if (strippedName in this._pools) {
                        throw new Error(`duplicate sound entry: ${strippedName}`);
                    }
                    else {
                        this._pools[strippedName] = new Pool(elements[index]);
                    }
                }, this);
            });
        }
        play(name) {
            return __awaiter(this, void 0, void 0, function* () {
                if (name in this._pools) {
                    yield this._pools[name].play();
                    return true;
                }
                else {
                    return false;
                }
            });
        }
    }
    Darblast.Sound = Sound;
})(Darblast || (Darblast = {})); // namespace Darblast

return Darblast;
}));
