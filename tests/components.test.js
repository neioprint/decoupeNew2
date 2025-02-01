import { FormInput } from '../src/components/FormInput.js';
import { Button } from '../src/components/Button.js';
import { StatsDisplay } from '../src/components/StatsDisplay.js';

describe('UI Components', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="test-container"></div>';
    });

    test('FormInput creates input correctly', () => {
        const formInput = new FormInput({
            id: 'test-input',
            label: 'Test Label',
            type: 'number',
            value: '10'
        });

        const container = document.getElementById('test-container');
        formInput.mount(container);

        const input = container.querySelector('input');
        expect(input).not.toBeNull();
        expect(input.id).toBe('test-input');
        expect(input.value).toBe('10');
    });

    test('Button creates button with correct properties', () => {
        const button = new Button({
            text: 'Click Me',
            type: 'primary',
            onClick: jest.fn()
        });

        const container = document.getElementById('test-container');
        button.mount(container);

        const buttonElement = container.querySelector('button');
        expect(buttonElement).not.toBeNull();
        expect(buttonElement.textContent).toBe('Click Me');
        expect(buttonElement.className).toContain('btn-primary');
    });

    test('StatsDisplay initializes with default stats', () => {
        const statsDisplay = new StatsDisplay({
            stats: {}
        });

        const container = document.getElementById('test-container');
        statsDisplay.mount(container);

        const statsElement = container.querySelector('#optimization-stats');
        expect(statsElement).not.toBeNull();
        expect(statsElement.textContent).toContain('Taux d\'utilisation');
        expect(statsElement.textContent).toContain('Nombre de poses');
        expect(statsElement.textContent).toContain('Espace résiduel');
    });
});
