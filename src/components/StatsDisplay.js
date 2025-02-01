export class StatsDisplay {
    constructor(options) {
        this.stats = options.stats || {
            utilizationRate: '-',
            pieceCount: '-',
            residualSpace: '-'
        };
        this.element = this.createElement();
    }

    createElement() {
        const container = document.createElement('div');
        container.className = 'stats-container';

        const title = document.createElement('h3');
        title.textContent = 'Résultats';
        container.appendChild(title);

        const statsDiv = document.createElement('div');
        statsDiv.id = 'optimization-stats';
        container.appendChild(statsDiv);

        // Correction : Utiliser directement l'élément créé
        this.statsDiv = statsDiv;
        this.updateStats(this.stats);

        return container;
    }

    updateStats(stats) {
        if (!this.statsDiv) return;

        this.statsDiv.innerHTML = `
            <p>Taux d'utilisation : <span id="utilization-rate">${stats.utilizationRate || '-'}</span>%</p>
            <p>Nombre de poses : <span id="piece-count">${stats.pieceCount || '-'}</span></p>
            <p>Espace résiduel : <span id="residual-space">${stats.residualSpace || '-'}</span> cm²</p>
        `;
    }

    mount(parent) {
        parent.appendChild(this.element);
    }
}
