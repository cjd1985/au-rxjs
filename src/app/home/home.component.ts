import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    beginnerCourses$: Observable<Course[]>;

    advancedCourses$: Observable<Course[]>;

    ngOnInit() {

        const http$ = createHttpObservable('/api/courses');

        // * CATCH & RETHROW
/*         const courses$: Observable<Course[]> = http$
        .pipe(
            catchError(err => {
                console.log("Error occurred", err)
                return throwError(err)
            }),
            finalize(() => {
                console.log("Finalize executed..")
            }),
            tap(() => console.log("HTTP request executed")),
            map(res => Object.values(res["payload"]) ),
            shareReplay()
        ); */
        // * ===

        // * RETRY
        const courses$: Observable<Course[]> = http$
            .pipe(
                tap(() => console.log("HTTP request executed")),
                map(res => Object.values(res["payload"]) ),
                shareReplay(),
                retryWhen(errors =>
                    errors.pipe(
                    delayWhen(() => timer(2000) // ? not same with delay
                    )
                ) )
            );
        // * ===

        this.beginnerCourses$ = courses$
            .pipe(
                map(courses => courses
                    .filter(course => course.category == 'BEGINNER'))
            );

        this.advancedCourses$ = courses$
            .pipe(
                map(courses => courses
                    .filter(course => course.category == 'ADVANCED'))
            );

    }

}
