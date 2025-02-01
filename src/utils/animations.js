export class Animator {
    static async fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        
        // Force reflow
        element.offsetHeight;
        
        element.style.opacity = '1';
        
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }

    static async fadeOut(element, duration = 300) {
        element.style.opacity = '1';
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        
        // Force reflow
        element.offsetHeight;
        
        element.style.opacity = '0';
        
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }

    static async slideIn(element, direction = 'right', duration = 300) {
        const start = direction === 'right' ? 'translateX(100%)' : 'translateX(-100%)';
        element.style.transform = start;
        element.style.transition = `transform ${duration}ms ease-in-out`;
        
        // Force reflow
        element.offsetHeight;
        
        element.style.transform = 'translateX(0)';
        
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }

    static async pulse(element, scale = 1.1, duration = 300) {
        element.style.transform = 'scale(1)';
        element.style.transition = `transform ${duration/2}ms ease-in-out`;
        
        // Force reflow
        element.offsetHeight;
        
        element.style.transform = `scale(${scale})`;
        
        await new Promise(resolve => setTimeout(resolve, duration/2));
        
        element.style.transform = 'scale(1)';
        
        return new Promise(resolve => {
            setTimeout(resolve, duration/2);
        });
    }

    static async shake(element, intensity = 5, duration = 500) {
        const originalTransform = element.style.transform || '';
        const steps = 6;
        const stepDuration = duration / steps;

        for (let i = 0; i < steps; i++) {
            const direction = i % 2 === 0 ? 1 : -1;
            element.style.transform = `${originalTransform} translateX(${direction * intensity}px)`;
            await new Promise(resolve => setTimeout(resolve, stepDuration));
        }

        element.style.transform = originalTransform;
    }
}
