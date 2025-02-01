export class PerformanceTracker {
    constructor() {
        this.startTime = null;
        this.endTime = null;
        this.measurements = [];
    }

    start() {
        this.startTime = performance.now();
        return this;
    }

    stop() {
        this.endTime = performance.now();
        const duration = this.endTime - this.startTime;
        this.measurements.push(duration);
        return duration;
    }

    getAverageTime() {
        if (this.measurements.length === 0) return 0;
        return this.measurements.reduce((a, b) => a + b, 0) / this.measurements.length;
    }

    logPerformance(algorithmName) {
        console.log(`Performance for ${algorithmName}:`, {
            lastRunTime: this.measurements[this.measurements.length - 1],
            averageTime: this.getAverageTime(),
            totalMeasurements: this.measurements.length
        });
    }
}
