export class Button {
    constructor(options) {
        this.text = options.text;
        this.onClick = options.onClick;
        this.type = options.type || 'primary';
        this.disabled = options.disabled || false;
        this.element = this.createElement();
    }

    createElement() {
        const button = document.createElement('button');
        button.textContent = this.text;
        button.className = `btn btn-${this.type}`;
        button.disabled = this.disabled;

        button.addEventListener('click', (e) => {
            if (this.onClick) {
                this.onClick(e);
            }
        });

        return button;
    }

    setDisabled(disabled) {
        this.disabled = disabled;
        this.element.disabled = disabled;
    }

    setText(text) {
        this.text = text;
        this.element.textContent = text;
    }

    mount(parent) {
        parent.appendChild(this.element);
    }
}
