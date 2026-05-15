/* eslint-disable no-console */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

const CONTROL_URL = '/YamahaRemoteControl/ctrl';
const XML_CONTENT_TYPE = 'application/xml';

/**
 * POST a YAMAHA_AV command to the receiver and return the raw text response.
 *
 * On network/HTTP error: logs the cause and either completes silently (EMPTY)
 * or emits an empty string, depending on `returnNullOnError`.
 */
export const postYamahaCommand = (
  httpClient: HttpClient,
  xml: string,
  returnNullOnError = false
): Observable<string> => {
  const headers = new HttpHeaders().set('Content-Type', XML_CONTENT_TYPE);
  console.debug('Sending XML: ', xml);
  return httpClient
    .post(CONTROL_URL, xml, { headers, responseType: 'text' as const })
    .pipe(
      take(1),
      catchError(err => {
        if (err.error instanceof Error) {
          console.error(
            'Error while sending XML to receiver:',
            err.error.message
          );
        } else {
          console.error(
            `Receiver returned code ${err.status}, body was: ${err.error}`
          );
        }
        return returnNullOnError ? of('ERROR') : EMPTY;
      }),
      map(response => (response !== 'ERROR' ? response : ''))
    );
};
