// See the [example config] for help in configuring StatsD.
// [example config]: https://github.com/etsy/statsd/blob/master/exampleConfig.js

// WARNING: This file is auto-generated from the provisioning
//          scripts. Do not edit by hand because your changes
//          will likely be overwritten.

{

// Process
// -------
// Allows for overriding the process title. If set to false, will not
// override the process title and let the OS set it. The length of the
// title has to be less than or equal to the binary name + cli arguments.
// NOTE: This does not work on Mac's with node versions prior to v0.10
title: '{{statsd_title}}',

// Default health status to be returned and statsd process starts.
healthStatus: '{{statsd_health_status}}',

// Set debug flag and leave these unset to run in 'dry' debug mode -
// useful for testing statsd clients without a Graphite server.
debug: {{'true' if statsd_debug else 'false'}},


// Server
// ------
// The server to load. The server must exist by name in the directory
// `servers/`. If not specified, the default udp server will be loaded.
//
// Example for tcp server:
//     "./servers/tcp"
server: {% if statsd_server %}'{{statsd_server}}'{% else %}undefined{% endif %},
// Address to listen on
address: '{{statsd_address}}',
// Defines if the address is an IPv4 or IPv6 address
address_ipv6: {{'true' if statsd_address_ipv6 else 'false'}},
// Port to listen for messages on
port: {{statsd_port}},
// Address to run the management TCP interface on
mgmt_address: '{{statsd_mgmt_address}}',
// Port to run the management TCP interface on
mgmt_port: {{statsd_mgmt_port}},


// Flush and counts
// ----------------
// Interval to flush metrics to each backend (ms)
flushInterval: {{statsd_flush_interval}},
// For time information, calculate the Nth percentile(s) (can be a single
// value or list of floating-point values). Negative values mean to use
// "top" Nth percentile(s) values. (%)
percentThreshold: {{statsd_percent_threshold}},
// Send stats_counts metrics
flush_counts: {{'true' if statsd_flush_counts else 'false'}},


// Backends
// --------
// // An array of backends to load. Each backend must exist by name in the
// directory backends/. If not specified, the default graphite backend
// will be loaded.
//
// Example for console and graphite:
//     [ "./backends/console", "./backends/graphite" ]
backends: [
{% for backend in statsd_backends %}
	'{{backend}}',
{% endfor %}
],


// Graphite
// --------
// Leave these unset to avoid sending stats to Graphite.
// Hostname or IP of Graphite server
graphiteHost: {% if statsd_graphite_host %}'{{statsd_graphite_host}}'{% else %}undefined{% endif %},
// Port of Graphite server
graphitePort: {% if statsd_graphite_host %}'{{statsd_graphite_port}}'{% else %}undefined{% endif %},

graphite: {
	// Use the legacy namespace
	legacyNamespace: {{'true' if statsd_graphite_legacy_namespace else 'false'}},
	// Global prefix to use for sending stats to graphite
	globalPrefix: '{{statsd_graphite_global_prefix}}',
	// Graphite prefix for counter metrics
	prefixCounter: '{{statsd_graphite_prefix_counter}}',
	// Graphite prefix for timer metrics
	prefixTimer: '{{statsd_graphite_prefix_timer}}',
	// Graphite prefix for gauge metrics
	prefixGauge: '{{statsd_graphite_prefix_gauge}}',
	// Graphite prefix for set metrics
	prefixSet: '{{statsd_graphite_prefix_set}}',
	// Global suffix to use for sending stats to graphite This is
	// particularly useful for sending per host stats by Settings this value
	// to: `require('os').hostname().split('.')[0]`
	globalSuffix: '{{statsd_graphite_global_suffix}}',
},


// Log the most frequently sent keys
// ---------------------------------
keyFlush: {
	// How often to log frequent keys (ms)
	interval: {{statsd_key_flush_interval}},
	// Percentage of frequent keys to log (%)
	percent: {{statsd_key_flush_percent}},
	// Location of log file for frequent keys
	log: '{{statsd_key_flush_log}}',
	// Don't send values to graphite for inactive counters, sets, gauges, or
	// timers As opposed to sending 0.  For gauges, this unsets the gauge
	// (instead of sending The previous value). Can be individually
	// overriden.
	deleteIdleStats: {{'true' if statsd_key_flush_delete_idle_stats else 'false'}},
},


// Inactive values
// ---------------
// Don't send values to graphite for inactive gauges, as opposed to
// sending the previous value
deleteGauges: {{'true' if statsd_delete_gauges else 'false'}},
// Don't send values to graphite for inactive timers, as opposed to
// sending `0`
deleteTimers: {{'true' if statsd_delete_timers else 'false'}},
// Don't send values to graphite for inactive sets, as opposed to sending
// `0`
deleteSets: {{'true' if statsd_delete_sets else 'false'}},
// Don't send values to graphite for inactive counters, as opposed to
// sending `0`
deleteCounters: {{'true' if statsd_delete_counters else 'false'}},
// Prefix to use for the statsd statistics data for this running instance
// of statsd applies to both legacy and new namespacing
prefixStats: {{'true' if statsd_prefix_stats else 'false'}},


// Console settings
// ----------------
console: {
	// Whether to prettyprint the console backend
	prettyprint: {{'true' if statsd_console_prettyprint else 'false'}},
},


// Log settings
// ------------
// Log all incoming messages
dumpMessages: {{'true' if statsd_dump_messages else 'false'}},

log: {
	// Where to log: stdout or syslog
	backend: '{{statsd_log_backend}}',
	// Name of the application for syslog
	application: '{{statsd_log_application}}',
	// Log level for [node-]syslog
	level: '{{statsd_log_level}}',
},


// Repeaters
// ---------
// An array of hashes of the for `host:` and `port:` that details other
// statsd servers to which the received packets should be "repeated"
// (duplicated to).
//
// Example:
//     [ { host: '10.10.10.10', port: 8125 },
//       { host: 'observer', port: 88125 } ]
repeater: [
{% for repeater in statsd_repeater %}
	{ host:'{{repeater.host}}', port:{{repeater.port}} },
{% endfor %}
],
// Whether to use udp4 or udp6 for repeaters.
repeaterProtocol: '{{statsd_repeater_protocol}}',


// Histograms
// ----------
// For timers, an array of mappings of strings (to match metrics) and
// corresponding ordered non-inclusive upper limits of bins. For all
// matching metrics, histograms are maintained over time by writing the
// frequencies for all bins.
//
// 'inf' means infinity. A lower limit of 0 is assumed.
//
// Default: [], meaning no histograms for any timer.
//
// First match wins. Examples:
//
// * histogram to only track render durations, with unequal
//   class intervals and catchall for outliers:
//     [ { metric: 'render', bins: [ 0.01, 0.1, 1, 10, 'inf'] } ]
//
// * histogram for all timers except 'foo' related,
//   equal class interval and catchall for outliers:
//     [ { metric: 'foo', bins: [] },
//       { metric: '', bins: [ 50, 100, 150, 200, 'inf'] } ]
histogram: [
{% for histogram in statsd_histogram %}
	{ metric:'{{histogram.metric}}', bins:[
		{%- for bin in histogram.bins %}{{bin}}, {% endfor -%}
	] },
{% endfor %}
],


// Auto-reload
// -----------
// Whether to watch the config file and reload it when it changes.
automaticConfigReload: {{'true' if statsd_automatic_config_reload else 'false'}}

}