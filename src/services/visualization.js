// Service de visualisation
export function setupVisualization(canvas, optimizer) {
    const ctx = canvas.getContext('2d');
    
    function render() {
        // TODO: Implémenter le rendu des configurations
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Événements et interactions
    canvas.addEventListener('resize', render);
    render();
}
