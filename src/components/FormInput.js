export class FormInput {
    constructor(options) {
        this.id = options.id;
        this.label = options.label;
        this.type = options.type || 'text';
        this.value = options.value || '';
        this.min = options.min;
        this.max = options.max;
        this.step = options.step;
        this.onChange = options.onChange;
        this.element = this.createElement();
    }

    createElement() {
        const container = document.createElement('div');
        container.className = 'form-group';

        const label = document.createElement('label');
        label.htmlFor = this.id;
        label.textContent = this.label;

        const input = document.createElement('input');
        input.type = this.type;
        input.id = this.id;
        input.value = this.value;
        if (this.min !== undefined) input.min = this.min;
        if (this.max !== undefined) input.max = this.max;
        if (this.step !== undefined) input.step = this.step;

        input.addEventListener('input', (e) => {
            if (this.onChange) {
                this.onChange(e.target.value);
            }
        });

        container.appendChild(label);
        container.appendChild(input);

        return container;
    }

    getValue() {
        return this.element.querySelector('input').value;
    }

    setValue(value) {
        this.element.querySelector('input').value = value;
    }

    mount(parent) {
        parent.appendChild(this.element);
    }
}
