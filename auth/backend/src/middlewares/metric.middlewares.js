import client from "prom-client"

// Create metrics
export const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000]
})

export const requestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
})

export const activeRequestsGauge = new client.Gauge({
    name: 'active_requests',
    help: 'Number of active requests'
})

export const errorCounter = new client.Counter({
    name: 'http_errors_total',
    help: 'Total number of HTTP errors',
    labelNames: ['method', 'route', 'status_code']
})

export const metricsMiddleware = (req, res, next) => {
    const startTime = Date.now()
    activeRequestsGauge.inc()

    res.on('finish', function() {
        const duration = Date.now() - startTime
        const route = req.route ? req.route.path : req.path

        // Increment request counter
        requestCounter.inc({
            method: req.method,
            route: route,
            status_code: res.statusCode
        })

        // Record request duration
        httpRequestDurationMicroseconds.observe({
            method: req.method,
            route: route,
            code: res.statusCode
        }, duration)

        // Increment error counter for 4xx and 5xx status codes
        if (res.statusCode >= 400) {
            errorCounter.inc({
                method: req.method,
                route: route,
                status_code: res.statusCode
            })
        }

        activeRequestsGauge.dec()
    })

    next()
}