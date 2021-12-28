import { Injectable, isDevMode } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiPrefixInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!/^(http|https):/i.test(request.url) && isDevMode()) {
      request = request.clone({ url: request.url });
    }
    return next.handle(request);
  }
}
