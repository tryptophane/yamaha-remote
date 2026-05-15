import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BasicStatusStore } from '../store/basic-status.store';
import { postYamahaCommand } from './xml/http';
import { buildCommand, HttpMethod, XmlValue } from './xml/xml-builder';
import { parseResponse } from './xml/xml-picker';

export { HttpMethod };

export abstract class AbstractService {
  protected readonly httpClient = inject(HttpClient);
  protected readonly basicStatusStore = inject(BasicStatusStore);

  get zone(): string {
    return 'Main_Zone';
  }

  /** PUT/GET a YAMAHA_AV command built from a path and a value. */
  protected send(
    method: HttpMethod,
    path: ReadonlyArray<string>,
    body: XmlValue,
    returnNullOnError = false
  ): Observable<string> {
    return postYamahaCommand(
      this.httpClient,
      buildCommand(method, path, body),
      returnNullOnError
    );
  }

  /** Send a command, then refresh the cached basic-status (used after writes). */
  protected sendAndRefresh(
    method: HttpMethod,
    path: ReadonlyArray<string>,
    body: XmlValue
  ): void {
    this.send(method, path, body).subscribe(() =>
      this.basicStatusStore.refresh().subscribe()
    );
  }

  /** Like `send`, but automatically prepends the active zone to the path. */
  protected sendZone(
    method: HttpMethod,
    path: ReadonlyArray<string>,
    body: XmlValue,
    returnNullOnError = false
  ): Observable<string> {
    return this.send(method, [this.zone, ...path], body, returnNullOnError);
  }

  /** Like `sendAndRefresh`, but automatically prepends the active zone to the path. */
  protected sendAndRefreshZone(
    method: HttpMethod,
    path: ReadonlyArray<string>,
    body: XmlValue
  ): void {
    this.sendZone(method, path, body).subscribe(() =>
      this.basicStatusStore.refresh().subscribe()
    );
  }

  /** Parse a raw XML response into a JS object tree. */
  protected parse(xml: string): unknown {
    return parseResponse(xml);
  }
}
