export class Canvas {
    constructor(options) {
        this.element = options.element || document.createElement('canvas');
        this.ctx = this.element.getContext('2d');
        this.width = options.width || this.element.width;
        this.height = options.height || this.element.height;
        this.onResize = options.onResize;

        this.element.width = this.width;
        this.element.height = this.height;

        this.setupResizeObserver();
    }

    setupResizeObserver() {
        const container = this.element.parentElement;
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                this.resize(width, height);
            }
        });
        resizeObserver.observe(container);
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.element.width = width;
        this.element.height = height;
        if (this.onResize) {
            this.onResize(width, height);
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    drawRect(x, y, width, height, style = {}) {
        this.ctx.save();
        if (style.fillStyle) this.ctx.fillStyle = style.fillStyle;
        if (style.strokeStyle) this.ctx.strokeStyle = style.strokeStyle;
        if (style.lineWidth) this.ctx.lineWidth = style.lineWidth;

        if (style.fillStyle) this.ctx.fillRect(x, y, width, height);
        if (style.strokeStyle) this.ctx.strokeRect(x, y, width, height);
        this.ctx.restore();
    }

    mount(parent) {
        parent.appendChild(this.element);
    }
}
