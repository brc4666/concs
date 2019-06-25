import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export function handleHttpError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
        logClientSideError(error);
    } else {
        logServerSideError(error);
    }
    return throwError(error);
}

function logClientSideError(error: HttpErrorResponse) {
    console.error('An error ccurred: ', error.error.message);
}

function logServerSideError(error: HttpErrorResponse) {
    console.error(`Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
}
