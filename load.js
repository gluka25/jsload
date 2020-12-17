import http from 'k6/http';
import { Trend, Counter } from 'k6/metrics';
let firstTrendCounter = new Counter('CUSTOM_root_count');
let secondTrendCounter = new Counter('CUSTOM_contacts_count');
let firstTrend = new Trend('CUSTOM_root_duration');
let secondTrend = new Trend('CUSTOM_contacts_duration');



export let options = {
    scenarios: {
        my_web_test: {
            executor: 'constant-arrival-rate',
            rate: 60,
            timeUnit: '1m', // 90 iterations per minute, i.e. 1.5 RPS
            duration: '11s',
            preAllocatedVUs: 10, // the size of the VU (i.e. worker) pool for this scenario
            exec: 'contacts', // this scenario is executing different code than the one above!
        },
        my_api_test_1: {
            executor: 'constant-arrival-rate',
            rate: 120,
            timeUnit: '1m', // 90 iterations per minute, i.e. 1.5 RPS
            duration: '10s',
            preAllocatedVUs: 10, 
            exec: 'root', 
        },
    },
    discardResponseBodies: true,
    thresholds: {
        'http_req_duration': ['p(95)<2500', 'p(99)<3500'],

    },
    
};

export function contacts() {
    let res =  http.get('https://test.k6.io/contacts.php');
    secondTrend.add(res.timings.duration);
    secondTrendCounter.add(1);
 }

export function root() {
   let res =  http.get('https://test.k6.io/');
   firstTrend.add(res.timings.duration);
   firstTrendCounter.add(1);
}
