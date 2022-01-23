import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
    concat,
    fromEvent,
    interval,
    noop,
    observable,
    Observable,
    of,
    timer,
    merge,
    Subject,
    BehaviorSubject,
    AsyncSubject,
    ReplaySubject
} from 'rxjs';
import {delayWhen, filter, map, take, timeout} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    ngOnInit() {
        // * ASYNC SUBJECT -> Long running calculation
        const subject = new AsyncSubject()

        const series$ = subject.asObservable()

        series$.subscribe(val => console.log("first sub: " + val))

        subject.next(1)
        subject.next(2)
        subject.next(3)

        subject.complete()

        setTimeout(() => {
            series$.subscribe(val => console.log("second sub: " + val))
        }, 3000)
        // * ===

        // * REPLAY SUBJECT
        const subject2 = new ReplaySubject()

        const series2$ = subject2.asObservable()

        series2$.subscribe(val => console.log("first sub: " + val))

        subject2.next(1)
        subject2.next(2)
        subject2.next(3)

        // subject2.complete()

        setTimeout(() => {
            series2$.subscribe(val => console.log("second sub: " + val))

            subject2.next(4)
        }, 3000)
        // * ===


    }


}






