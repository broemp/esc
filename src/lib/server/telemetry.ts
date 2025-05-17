import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { metrics, trace } from '@opentelemetry/api';

// Create a resource that identifies your service
const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'esc-app',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
    'service.instance.id': process.env.HOSTNAME || 'default'
});

// Create the OpenTelemetry SDK
const sdk = new NodeSDK({
    resource,
    traceExporter: new OTLPTraceExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
        headers: process.env.OTEL_EXPORTER_OTLP_HEADERS ? JSON.parse(process.env.OTEL_EXPORTER_OTLP_HEADERS) : {}
    }),
    instrumentations: [getNodeAutoInstrumentations()]
});

// Initialize the SDK
try {
    sdk.start();
    console.log('OpenTelemetry SDK started');
} catch (error: unknown) {
    console.error('Error starting OpenTelemetry SDK:', error);
}

// Graceful shutdown
process.on('SIGTERM', () => {
    try {
        sdk.shutdown();
        console.log('OpenTelemetry SDK terminated');
    } catch (error: unknown) {
        console.error('Error terminating OpenTelemetry SDK:', error);
    } finally {
        process.exit(0);
    }
});

// Export the trace and metrics APIs
export { trace, metrics }; 